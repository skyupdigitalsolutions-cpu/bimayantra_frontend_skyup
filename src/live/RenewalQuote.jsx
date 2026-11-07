// Batch 8 · Renewal quotation on the live API: POST /renewals/:id/renewal-quotation { mode, … } starts a draft quotation
// filled from the policy; the advisor finishes it in the quotation wizard (/quotations/:id/edit), which shows it as a renewal.
//   RN0  How do you want to renew? (same policy · new quotation · compare)
//   N1b  Same policy: the renewal premium from the insurer's notice, and the notice itself (both optional)
//   RNB1 New quotation: insurer and product to renew into; moving insurer can be a portability request (QT-50)
//   RNB2–RNB4 / N1c are the wizard's Details → Review → Generated steps.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { api, invalidate, useQuery } from '../api'
import { fmtDate, fmtMoney } from '../api/format'
import { ActionDialog, Field } from './kit'

const MODES = [
  ['SAME_POLICY', 'refresh', 'bg-[#fdecd2]', 'Renew the same policy', 'Same product, people and sum insured. Enter the premium from the renewal notice. Waiting periods already served continue.'],
  ['NEW_QUOTATION', 'quote', 'bg-[#e9e3fc]', 'Create a new quotation', 'Change product, insurer, people or sum insured. Moving insurer can be a portability request.'],
  ['COMPARISON', 'compare', 'bg-[#d4f1e7]', 'Compare options', 'Show 2 to 3 options side by side before the customer decides.'],
]

export default function RenewalQuoteDialog({ r, onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState('how')
  const [mode, setMode] = useState('SAME_POLICY')
  const [f, setF] = useState({ typedRenewalPremium: '', renewalNoticeFileId: null, noticeName: '', insurerId: r.policy?.insurerId ?? '', productId: '', portabilityRequested: false })
  const set = (patch) => setF((s) => ({ ...s, ...patch }))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const choices = useQuery(['quotation-choices', r.policy?.typeId ?? '', f.insurerId ?? ''], () => api.quotations.choices({ typeId: r.policy?.typeId, insurerId: f.insurerId || undefined }), { enabled: step === 'new' })
  const moving = !!f.insurerId && f.insurerId !== r.policy?.insurerId
  const who = r.customer?.name?.split(' ')[0] ?? 'the customer'
  const sub = [r.customer?.name, [r.policy?.insurer, r.policy?.product].filter(Boolean).join(' '), r.policy?.endDate ? `ends ${fmtDate(r.policy.endDate)}` : null].filter(Boolean).join(' · ')

  const start = async (body) => {
    setBusy(true); setError(null)
    try {
      const res = await api.renewals.renewalQuotation(r.id, body)
      invalidate('renewals', 'quotations')
      const qid = res.data?.quotation?.id
      onClose()
      if (qid) navigate(`/quotations/${qid}/edit`)
      else if (res.data?.comparison?.id) navigate(`/comparisons/${res.data.comparison.id}`)
    } catch (e) { setError(e) } finally { setBusy(false) }
  }

  if (step === 'how') {
    return (
      <ActionDialog title="How do you want to renew?" body={sub} confirm="Continue" onClose={onClose} width={680} error={error} busy={busy}
        onConfirm={() => (mode === 'SAME_POLICY' ? setStep('same') : mode === 'NEW_QUOTATION' ? setStep('new') : start({ mode: 'COMPARISON' }))}>
        <div className="flex flex-col gap-3">
          {MODES.map(([m, icon, bg, title, text]) => (
            // Comparisons (batch 9) are not on the live API screens yet: the option is shown but cannot be chosen.
            <button key={m} type="button" disabled={m === 'COMPARISON'} onClick={() => setMode(m)} className={cx('flex items-start gap-4 rounded-[20px] border p-4 text-left disabled:cursor-not-allowed disabled:opacity-60', mode === m ? 'border-2 border-blue bg-[#f5f8fe]' : 'border-line bg-white hover:bg-tile')}>
              <span className={cx('mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2', mode === m ? 'border-navy' : 'border-line')}>{mode === m && <span className="size-2.5 rounded-full bg-navy" />}</span>
              <span className={cx('flex size-11 shrink-0 items-center justify-center rounded-full', bg)}><Icon name={icon} size={18} className="text-ink" /></span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-[15px] font-bold text-ink">{title}{m === 'SAME_POLICY' && <span className="flex items-center gap-1 rounded-[10px] bg-[#e7f4ee] px-2 py-0.5 text-[11px] font-semibold text-[#127650]"><Icon name="star" size={11} />Recommended</span>}</span>
                <span className="text-[12px] leading-[18px] font-medium text-muted">{m === 'COMPARISON' ? `Show ${who} 2 to 3 options side by side before deciding. Coming soon on this screen.` : text}</span>
              </span>
            </button>
          ))}
        </div>
      </ActionDialog>
    )
  }

  if (step === 'same') {
    return (
      <ActionDialog title="Renew the same policy" icon="refresh" body={`${sub}. The premium and the notice can also be added later in the quotation.`} confirm="Start renewal quotation" busy={busy} error={error} onClose={onClose} width={600}
        onConfirm={() => start({ mode: 'SAME_POLICY', typedRenewalPremium: f.typedRenewalPremium === '' ? undefined : Number(f.typedRenewalPremium), renewalNoticeFileId: f.renewalNoticeFileId || undefined })}>
        <Field label="Premium from the renewal notice (₹)" type="number" value={f.typedRenewalPremium} onChange={(v) => set({ typedRenewalPremium: v })} error={error?.fieldErrors?.typedRenewalPremium}
          hint={`Base premium before GST, as on ${r.policy?.insurer ?? 'the insurer'}’s notice.${r.policy?.premium ? ` Last year: ${fmtMoney(r.policy.premium, { decimals: 2 })}.` : ''}`} />
        <NoticeUpload fileId={f.renewalNoticeFileId} name={f.noticeName} onChange={(id, n) => set({ renewalNoticeFileId: id, noticeName: n })} error={error?.fieldErrors?.renewalNoticeFileId} />
        <button type="button" onClick={() => { setError(null); setStep('how') }} className="self-start text-[13px] font-semibold text-blue underline">Change how to renew</button>
      </ActionDialog>
    )
  }

  const insurers = choices.data?.insurers ?? []
  const products = choices.data?.products ?? []
  return (
    <ActionDialog title="New quotation for renewal" icon="quote" body={`Replaces ${[r.policy?.insurer, r.policy?.product].filter(Boolean).join(' ')}${r.policy?.endDate ? ` (ends ${fmtDate(r.policy.endDate)})` : ''}. People and sum insured can be changed in the next step.`}
      confirm="Next: details and premium" busy={busy} error={error} onClose={onClose} width={640} disabled={!f.insurerId || !f.productId}
      onConfirm={() => start({ mode: 'NEW_QUOTATION', insurerId: f.insurerId, productId: f.productId, portabilityRequested: moving ? f.portabilityRequested : undefined })}>
      <Field label="Insurer *" type="select" value={f.insurerId} onChange={(v) => set({ insurerId: v, productId: '', portabilityRequested: false })} error={error?.fieldErrors?.insurerId}
        options={[{ value: '', label: choices.loading && !insurers.length ? 'Loading…' : 'Choose an insurer' }, ...insurers.map((i) => ({ value: i.id, label: `${i.name}${i.id === r.policy?.insurerId ? ' (current)' : ''}` }))]} />
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">Product *</span>
        {products.map((p) => (
          <button key={p.id} type="button" onClick={() => set({ productId: p.id })} className={cx('flex items-center gap-3 rounded-[18px] border px-4 py-3 text-left', f.productId === p.id ? 'border-navy bg-[#f1f4fa]' : 'border-line bg-white hover:bg-tile')}>
            <span className={cx('flex size-5 items-center justify-center rounded-full border', f.productId === p.id ? 'border-navy bg-navy text-white' : 'border-line')}>{f.productId === p.id && <Icon name="check" size={12} />}</span>
            <span className="flex-1 text-[14px] font-bold text-ink">{p.name}{p.name === r.policy?.product && !moving ? ' (current)' : ''}</span>
          </button>
        ))}
        {f.insurerId && !choices.loading && !products.length && <p className="text-[13px] font-medium text-muted">No product of this insurer can be quoted today.</p>}
      </div>
      {moving && (
        <label className="flex cursor-pointer items-start gap-3 rounded-[18px] bg-[#efeafd] p-4">
          <input type="checkbox" checked={f.portabilityRequested} onChange={(e) => set({ portabilityRequested: e.target.checked })} className="mt-0.5 size-[18px] accent-[#13294b]" />
          <span className="flex flex-col gap-1"><span className="text-[14px] font-bold text-ink">Request portability from {r.policy?.insurer}</span>
            <span className="text-[12px] font-medium text-[#5b3fc4]">Waiting periods {who} has already served carry over. Submit the portability form well before {r.policy?.endDate ? fmtDate(r.policy.endDate) : 'the policy ends'}.</span></span>
        </label>
      )}
      <button type="button" onClick={() => { setError(null); setStep('how') }} className="self-start text-[13px] font-semibold text-blue underline">Change how to renew</button>
    </ActionDialog>
  )
}

function NoticeUpload({ fileId, name, onChange, error }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink">Renewal notice (optional)</span>
      <span className="flex h-[50px] cursor-pointer items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink">
        <Icon name={fileId ? 'check' : 'upload'} size={16} className={fileId ? 'text-[#127650]' : 'text-muted'} />
        <span className="flex-1 truncate">{busy ? 'Uploading…' : fileId ? name || 'Notice attached' : 'Upload the insurer’s renewal notice'}</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
          const file = e.target.files?.[0]; if (!file) return
          setBusy(true); setErr(null)
          try { onChange((await api.files.upload(file, 'CUSTOMER_DOCUMENT')).data.id, file.name) } catch (x) { setErr(x.message) } finally { setBusy(false) }
        }} />
      </span>
      {(err || error) && <span className="text-[12px] font-semibold text-[#b4323c]">{err || error}</span>}
    </label>
  )
}
