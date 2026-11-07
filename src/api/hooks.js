// Small data hooks (no extra dependency): useQuery for reads, useMutation for writes, invalidate() to refresh.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ApiError, newIdempotencyKey } from './client'

/* ───────── cache + invalidation bus ───────── */
const cache = new Map() // key → { data, meta, at }
const inflight = new Map() // key → promise: identical requests made at the same time share one call
const listeners = new Set()
let version = 0
const bump = () => { version++; listeners.forEach((l) => l()) }

/** Refetch every query whose key starts with one of the prefixes (no prefix = everything). */
export function invalidate(...prefixes) {
  for (const k of [...cache.keys()]) {
    if (!prefixes.length || prefixes.some((p) => k === p || k.startsWith(`${p}:`) || k.startsWith(`${p}/`))) { cache.delete(k); inflight.delete(k) }
  }
  bump()
}
const useBusVersion = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => version)

/**
 * useQuery(key, fetcher, { enabled = true, keepPrevious = true })
 * key: string or array (joined with ':'); the fetcher returns a client promise resolving to { data, meta }.
 * → { data, meta, error, loading, refetch }
 */
export function useQuery(key, fetcher, { enabled = true, keepPrevious = true } = {}) {
  const k = Array.isArray(key) ? key.filter((x) => x !== undefined && x !== null).join(':') : key
  const v = useBusVersion()
  const hit = cache.get(k)
  const [state, setState] = useState(() => ({ data: hit?.data, meta: hit?.meta ?? {}, error: null, loading: enabled && !hit }))
  const fetchRef = useRef(fetcher)
  fetchRef.current = fetcher

  const run = useCallback(async () => {
    if (!enabled) return
    setState((s) => ({ ...s, loading: true, error: null, ...(keepPrevious ? {} : { data: undefined }) }))
    try {
      let p = inflight.get(k)
      if (!p) {
        p = Promise.resolve().then(() => fetchRef.current()).finally(() => inflight.delete(k))
        inflight.set(k, p)
      }
      const res = await p
      cache.set(k, { data: res?.data, meta: res?.meta ?? {}, at: Date.now() })
      setState({ data: res?.data, meta: res?.meta ?? {}, error: null, loading: false })
    } catch (e) {
      if (e?.name === 'AbortError') return
      setState((s) => ({ ...s, loading: false, error: e instanceof ApiError ? e : new ApiError({ message: String(e?.message || e) }) }))
    }
  }, [k, enabled, keepPrevious])

  useEffect(() => {
    const cached = cache.get(k)
    if (cached) setState({ data: cached.data, meta: cached.meta, error: null, loading: false })
    else run()
  }, [k, v, run])

  return { ...state, refetch: run }
}

/**
 * useMutation(fn, { invalidates = [], onSuccess, onError })
 * fn(vars, { idempotencyKey }) must return a client promise.
 * The Idempotency-Key is made when the component mounts (the form opens) and kept across Retry;
 * after a success a new one is made, so the next submission is a new request (GR-10).
 * → { mutate, busy, error, fieldErrors, reset }
 */
export function useMutation(fn, { invalidates = [], onSuccess, onError } = {}) {
  const keyRef = useRef(newIdempotencyKey())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const fnRef = useRef(fn)
  fnRef.current = fn

  const mutate = useCallback(async (vars) => {
    if (busy) return undefined // double-click guard
    setBusy(true)
    setError(null)
    try {
      const res = await fnRef.current(vars, { idempotencyKey: keyRef.current })
      keyRef.current = newIdempotencyKey()
      if (invalidates.length) invalidate(...invalidates)
      await onSuccess?.(res, vars)
      return res
    } catch (e) {
      // GEN-06 ALREADY_SUBMITTED: the saved result is in details.result — treat as success
      if (e instanceof ApiError && e.code === 'ALREADY_SUBMITTED' && e.details?.result) {
        keyRef.current = newIdempotencyKey()
        const res = { data: e.details.result?.data ?? e.details.result, meta: { message: e.message } }
        if (invalidates.length) invalidate(...invalidates)
        await onSuccess?.(res, vars)
        return res
      }
      setError(e)
      onError?.(e, vars)
      throw e
    } finally {
      setBusy(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, invalidates.join('|')])

  return {
    mutate,
    /** Like mutate but never throws (errors land in `error`). */
    run: (vars) => mutate(vars).catch(() => undefined),
    busy,
    error,
    fieldErrors: error instanceof ApiError ? error.fieldErrors : {},
    reset: () => setError(null),
  }
}

/** Debounced value (search boxes). */
export function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}