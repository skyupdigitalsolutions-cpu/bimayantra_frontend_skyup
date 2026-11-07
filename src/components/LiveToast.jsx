// App-wide toasts for API results: success messages (meta.message) and errors (error.message).
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Icon from './Icon'
import { cx } from './ui'

const ToastCtx = createContext({ toast: () => {}, toastError: () => {} })
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const seq = useRef(0)
  const remove = (id) => setItems((xs) => xs.filter((x) => x.id !== id))
  const toast = useCallback((text, tone = 'ok', ms = 4500) => {
    if (!text) return
    const id = ++seq.current
    setItems((xs) => [...xs.slice(-3), { id, text, tone }])
    setTimeout(() => remove(id), ms)
  }, [])
  const toastError = useCallback((err) => toast(err?.message || 'Something went wrong.', 'error', 7000), [toast])
  const value = useMemo(() => ({ toast, toastError }), [toast, toastError])
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-6 bottom-6 z-[100] flex w-[420px] max-w-[calc(100vw-48px)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className={cx(
              'pointer-events-auto flex items-start gap-2.5 rounded-[18px] px-4 py-3 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]',
              t.tone === 'error' ? 'border border-[#f2c4c8] bg-[#fff7f7] text-[#b4323c]' : 'bg-navy text-white',
            )}
          >
            <span className={cx('mt-px flex size-6 shrink-0 items-center justify-center rounded-full', t.tone === 'error' ? 'bg-[#fbebec]' : 'bg-[#16845b] text-white')}>
              <Icon name={t.tone === 'error' ? 'alert' : 'check'} size={13} />
            </span>
            <p className="min-w-0 flex-1 text-[13px] leading-5 font-semibold">{t.text}</p>
            <button type="button" aria-label="Dismiss" onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}