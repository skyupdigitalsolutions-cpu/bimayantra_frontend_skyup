// Public website lead form (CN8 "our form"): /forms/:key — no sign-in.
//   GET /public/forms/:key → { valid, name, advisorName, fields } · POST /public/forms/:key → the lead arrives in the advisor's pipeline
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { api, useQuery } from '../api'
import { ErrorNote, Field } from './kit'

export default function PublicWebsiteForm() {
  const { key } = useParams()
  const q = useQuery(['public-form', key], () => api.public.form(key))
  const [v, setV] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(null)
  const f = q.data
  const send = async () => {
    setBusy(true); setError(null)
    try { const r = await api.public.submitForm(key, v); setDone(r.meta?.message || 'Thank you. You will hear from us soon.') } catch (e) { setError(e) } finally { setBusy(false) }
  }
  const fe = error?.fieldErrors ?? {}
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-10">
      <div className="flex w-full max-w-[520px] flex-col gap-4 rounded-[28px] bg-white p-7 shadow-[0px_18px_40px_-14px_rgba(19,41,75,0.15)]">
        {q.loading && !f && <p className="text-[14px] font-medium text-muted">Loading…</p>}
        {(q.error || (f && !f.valid)) && (
          <div className="flex flex-col items-center gap-2 py-6 text-center"><Icon name="alert" size={26} className="text-[#8a5a12]" /><p className="text-[18px] font-bold text-ink">This form is not available</p><p className="text-[13px] font-medium text-muted">It may have been turned off. Please contact the advisor directly.</p></div>
        )}
        {f?.valid && !done && (
          <>
            <div><p className="text-[22px] font-bold text-ink">{f.name}</p>{f.advisorName && <p className="text-[13px] font-medium text-muted">{f.advisorName} will get back to you.</p>}</div>
            {(f.fields || []).map((x) => (x.type === 'checkbox'
              ? <Field key={x.key} type="checkbox" label={`${x.label}${x.required ? ' *' : ''}`} value={!!v[x.key]} onChange={(c) => setV({ ...v, [x.key]: c ? 'yes' : '' })} />
              : <Field key={x.key} label={`${x.label}${x.required ? ' *' : ''}`} type={x.type === 'email' ? 'email' : x.type === 'tel' ? 'tel' : 'text'} value={v[x.key] ?? ''} onChange={(t) => setV({ ...v, [x.key]: t })} error={fe[x.key]} />))}
            {/* honeypot: people never fill it, bots do */}
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={v.website ?? ''} onChange={(e) => setV({ ...v, website: e.target.value })} />
            <ErrorNote error={error && !Object.keys(fe).length ? error : null} />
            <button type="button" disabled={busy} onClick={send} className="flex h-[50px] items-center justify-center rounded-[25px] bg-navy text-[15px] font-semibold text-white disabled:opacity-60">{busy ? 'Sending…' : 'Send'}</button>
          </>
        )}
        {done && <div className="flex flex-col items-center gap-2 py-6 text-center"><span className="flex size-12 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]"><Icon name="check" size={22} /></span><p className="text-[18px] font-bold text-ink">{done}</p></div>}
      </div>
    </div>
  )
}