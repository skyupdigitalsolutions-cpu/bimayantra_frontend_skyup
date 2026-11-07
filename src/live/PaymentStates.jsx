// F-02 · Payment states on a quotation (PY1–PY5): mark failed, link expired, reverse (undo). Dialogs on the quotation detail.
import { useState } from 'react'
import { api } from '../api'
import { ActionDialog, Field, useAct } from './kit'

const REVERSE = ['Recorded by mistake', 'Cheque returned', 'Refunded by insurer']
const AFTER = ['quotation', 'quotations', 'payments', 'activity']

export function PaymentActions({ payment, onOpen }) {
  const open = payment.status === 'AWAITING_PAYMENT'
  if (!open && payment.status !== 'PAID') return null
  return (
    <span className="flex gap-3 text-[12px] font-semibold">
      {open && <button type="button" className="text-ink underline" onClick={() => onOpen({ kind: 'fail', payment })}>Mark failed</button>}
      {open && <button type="button" className="text-ink underline" onClick={() => onOpen({ kind: 'expire', payment })}>Link expired</button>}
      {payment.status === 'PAID' && <button type="button" className="text-[#b4323c] underline" onClick={() => onOpen({ kind: 'reverse', payment })}>Reverse</button>}
    </span>
  )
}

export function PaymentStateDialog({ kind, payment, onClose }) {
  const [reason, setReason] = useState(kind === 'reverse' ? REVERSE[0] : '')
  const { act, busy, error, fieldErrors } = useAct()
  const run = () => act(() => (kind === 'fail' ? api.payments.markFailed(payment.id, { reason: reason.trim() })
    : kind === 'expire' ? api.payments.markExpired(payment.id, {})
      : api.payments.undo(payment.id, { reason })), { invalidates: AFTER, quiet: true, onDone: onClose })
  const T = {
    fail: ['Mark payment as failed', 'The customer’s payment did not go through. You can add a new payment link afterwards.'],
    expire: ['Payment link expired', 'The insurer’s link is no longer valid. You can add or replace the link afterwards.'],
    reverse: ['Reverse this payment', 'Use this if the payment was recorded by mistake, a cheque bounced, or the insurer refunded it. It is not possible once the proposal is submitted, unless the insurer declined it.'],
  }[kind]
  return (
    <ActionDialog title={T[0]} body={T[1]} icon={kind === 'reverse' ? 'refresh' : 'alert'} tone={kind === 'reverse' ? 'danger' : 'navy'} confirm={kind === 'reverse' ? 'Reverse payment' : 'Confirm'} busy={busy} error={error} onConfirm={run} onClose={onClose} disabled={kind === 'fail' && !reason.trim()}>
      {kind === 'fail' && <Field label="Reason *" value={reason} onChange={setReason} error={fieldErrors.reason} />}
      {kind === 'reverse' && <Field label="Reason *" type="select" value={reason} onChange={setReason} options={REVERSE} error={fieldErrors.reason} />}
    </ActionDialog>
  )
}
