// Small building blocks shared by the connected pages: a confirm/form dialog, form fields, an action runner,
// and list helpers. They use the same tokens as the Figma screens (navy buttons, panel inputs, r24 corners).
import { useState } from 'react'
import Icon from '../components/Icon'
import { Modal, cx } from '../components/ui'
import { invalidate, useQuery } from '../api'
import { useToast } from '../components/LiveToast'
import { titleCase } from '../api/format'

export const inputCls = 'h-[50px] w-full rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-faint focus:ring-2 focus:ring-blue/25'

/** Label + control + error. type: text | number | date | select | textarea | checkbox */
export function Field({ label, type = 'text', value, onChange, options = [], error, hint, placeholder, className = '', ...rest }) {
  const id = rest.id || label
  let control
  if (type === 'select') {
    control = (
      <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={cx(inputCls, 'appearance-none')} {...rest}>
        {options.map((o) => (typeof o === 'object' ? <option key={o.value} value={o.value}>{o.label}</option> : <option key={o} value={o}>{o}</option>))}
      </select>
    )
  } else if (type === 'textarea') {
    control = <textarea id={id} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cx(inputCls, 'h-24 resize-none pt-3')} {...rest} />
  } else if (type === 'checkbox') {
    return (
      <label className={cx('flex items-center gap-2.5 text-[13px] font-semibold text-ink', className)}>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="size-[18px] accent-[#13294b]" {...rest} />
        {label}
      </label>
    )
  } else {
    control = <input id={id} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)} className={cx(inputCls, error && 'ring-2 ring-[#b4323c]')} {...rest} />
  }
  return (
    <label className={cx('flex min-w-0 flex-1 flex-col gap-2', className)}>
      {label && <span className={cx('text-[13px] font-semibold', error ? 'text-[#b4323c]' : 'text-ink')}>{label}</span>}
      {control}
      {hint && !error && <span className="text-[12px] font-medium text-muted">{hint}</span>}
      {error && <span className="text-[12px] font-medium text-[#b4323c]">{error}</span>}
    </label>
  )
}

export function ErrorNote({ error }) {
  if (!error) return null
  return (
    <div className="flex items-start gap-2.5 rounded-[14px] border border-[#f2c4c8] bg-[#fff7f7] px-3.5 py-3 text-[13px] font-semibold text-[#b4323c]">
      <Icon name="alert" size={16} className="mt-px shrink-0" />
      <span>{error.message ?? String(error)}</span>
    </div>
  )
}

/**
 * Dialog with a title, optional text, fields (children) and Cancel / Confirm.
 * onConfirm returns a promise; errors are shown inside the dialog, field errors go to `fieldErrors` for the caller.
 */
export function ActionDialog({ title, body, icon, tone = 'navy', confirm = 'Save', busy, error, onConfirm, onClose, width = 540, children, disabled }) {
  const TONE = { navy: 'bg-navy text-white hover:bg-navy-700', danger: 'border border-[#f2c4c8] bg-white text-[#b4323c] hover:bg-[#fdf6f7]' }
  return (
    <Modal onClose={onClose} width={width}>
      <div className="flex flex-col gap-4">
        {icon && <span className="flex size-[56px] items-center justify-center rounded-[28px] bg-panel"><Icon name={icon} size={24} className="text-ink" /></span>}
        <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">{title}</p>
        {body && <p className="text-[13px] leading-5 font-medium text-muted">{body}</p>}
        {children}
        {/* Always shown: with field errors it is the API's summary ("Please correct the 2 highlighted fields." or the one
            field's message), so a refusal on a field this dialog does not show is never silent. */}
        <ErrorNote error={error} />
        <div className="flex gap-2.5">
          <button type="button" onClick={onClose} className="flex h-[46px] flex-1 items-center justify-center rounded-[24px] border border-line bg-white text-[14px] font-semibold text-ink hover:bg-tile">{onConfirm ? 'Cancel' : 'Close'}</button>
          {onConfirm && (
            <button type="button" disabled={busy || disabled} onClick={onConfirm} className={cx('flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[24px] text-[14px] font-semibold disabled:opacity-60', TONE[tone])}>
              {busy ? 'Saving…' : confirm}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

/**
 * useAct(): run one API call from a button or dialog.
 * act(fn, { invalidates, success, onDone }) → toasts the API message, refreshes the lists, returns the result.
 */
export function useAct() {
  const { toast, toastError } = useToast()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const act = async (fn, { invalidates = [], success, onDone, quiet = false } = {}) => {
    setBusy(true)
    setError(null)
    try {
      const r = await fn()
      if (invalidates.length) invalidate(...invalidates)
      // success: false (or a blank string) saves without a toast; otherwise the given text, the API's message, or 'Saved.'
      if (success !== false && !(typeof success === 'string' && !success.trim())) toast(success || r?.meta?.message || 'Saved.')
      await onDone?.(r)
      return r
    } catch (e) {
      setError(e)
      if (!quiet) toastError(e)
      return undefined
    } finally {
      setBusy(false)
    }
  }
  return { act, busy, error, fieldErrors: error?.fieldErrors ?? {}, reset: () => setError(null) }
}

/** Loading / empty / error line inside a card or list. */
export function ListState({ q, empty = 'Nothing here yet.', className = '' }) {
  if (q.error) return <p className={cx('px-6 py-5 text-[13px] font-semibold text-[#b4323c]', className)}>{q.error.message}</p>
  if (q.loading && !q.data) return <p className={cx('px-6 py-5 text-[13px] font-medium text-muted', className)}>Loading…</p>
  if (Array.isArray(q.data) ? q.data.length === 0 : !q.data) return <p className={cx('px-6 py-5 text-[13px] font-medium text-muted', className)}>{empty}</p>
  return null
}

/** Enum label: AWAITING_ISSUANCE → Awaiting issuance */
// Words that stay in capitals when an API code is turned into a label (PAN, not "Pan").
const ACRONYMS = new Set(['PAN', 'SMS', 'OTP', 'KYC', 'RC', 'GST', 'UIN', 'PDF', 'ID', 'UPI', 'NEFT', 'RTGS', 'IMPS', 'OPD', 'PUC', 'NCB', 'IDV', 'EMI', 'CKYC'])
export const label = (s) => titleCase(String(s ?? '').replace(/_/g, ' ')).replace(/[A-Za-z]+/g, (w) => (ACRONYMS.has(w.toUpperCase()) ? w.toUpperCase() : w))

/** Reference lists (lead sources, lost reasons, relationships…) — loaded once. */
export function useReference() {
  return useQuery('reference', () => import('../api').then(({ api }) => api.reference.get())).data ?? {}
}

/** IST "DD-MM-YYYY" from an <input type=date> value. */
export const dmy = (iso) => (iso ? iso.split('-').reverse().join('-') : '')
/** <input type=date> value from an ISO date or "DD-MM-YYYY". */
export const isoDay = (v) => {
  if (!v) return ''
  if (/^\d{2}-\d{2}-\d{4}$/.test(v)) return v.split('-').reverse().join('-')
  return String(v).slice(0, 10)
}