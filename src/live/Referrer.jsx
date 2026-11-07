// 21 · Referrer dashboard (role REF) on the live API:
//   GET /referral/me (advisor, link, validity) · GET /referral/me/referrals (people referred, masked) · POST /referral/me/refer
import { useState } from 'react'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { api, useQuery, invalidate } from '../api'
import { cleanMobile, fmtDate } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { Field, ErrorNote, useAct } from './kit'

const TONE = { New: 'bg-blue-50 text-blue', Contacted: 'bg-[#f0ecfb] text-[#5b3fb8]', 'In progress': 'bg-[#fbf1e1] text-[#8a5a12]', 'Policy taken': 'bg-[#e7f4ee] text-[#127650]', Closed: 'bg-[#eef1f5] text-ink-2' }

export default function LiveReferrerDashboard() {
  const { user, logout } = useAuth()
  const me = useQuery('referral:me', () => api.referral.me())
  const list = useQuery('referral:list', () => api.referral.myReferrals())
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const M = me.data
  const rows = list.data || []
  const copy = () => { navigator.clipboard?.writeText(M.link); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div className="min-h-screen bg-[#f4f6fb] px-6 py-10">
      <div className="mx-auto flex max-w-[960px] flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-navy text-white"><Icon name="plus" size={22} /></span>
          <div className="flex-1"><p className="text-[13px] font-semibold text-muted">Referrer</p><p className="text-[24px] font-bold text-ink">Hello, {user?.name?.split(' ')[0]}</p></div>
          <button type="button" onClick={logout} className="flex h-10 items-center gap-2 rounded-[20px] border border-line bg-white px-4 text-[13px] font-semibold text-ink"><Icon name="logout" size={16} />Log out</button>
        </div>
        <ErrorNote error={me.error} />
        {M && (
          <div className="flex flex-col gap-3 rounded-[28px] bg-rail p-7 text-white">
            <p className="text-[13px] font-semibold text-[#c9d6ea]">You refer people to</p>
            <p className="text-[22px] font-bold">{M.businessName || M.advisorName}</p>
            {M.link ? (
              <>
                <div className="flex items-center gap-3 rounded-[18px] bg-white/10 px-4 py-3">
                  <Icon name="link" size={16} className="text-[#f7b9c4]" />
                  <span className="flex-1 truncate text-[14px] font-semibold">{M.link}</span>
                  <button type="button" onClick={copy} className="rounded-[14px] bg-white px-3 py-1.5 text-[12px] font-bold text-navy">{copied ? 'Copied' : 'Copy link'}</button>
                </div>
                <p className="text-[12px] font-medium text-[#c9d6ea]">Valid until {M.validUntil}. Share it on WhatsApp; people fill in their own details and agree to be contacted.</p>
              </>
            ) : <p className="rounded-[16px] bg-white/10 px-4 py-3 text-[13px] font-semibold">{M.message}</p>}
          </div>
        )}
        <div className="flex flex-col gap-3 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <div className="flex items-center gap-3">
            <div className="flex-1"><p className="text-[17px] font-bold text-ink">People you referred</p><p className="text-[12px] font-medium text-muted">{rows.length} so far · mobile numbers are masked</p></div>
            <button type="button" onClick={() => setOpen(true)} className="flex h-10 items-center gap-2 rounded-[20px] bg-navy px-4 text-[13px] font-semibold text-white"><Icon name="plus" size={16} />Refer someone</button>
          </div>
          {list.loading && !list.data && <p className="text-[13px] font-medium text-muted">Loading…</p>}
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-3 border-t border-line pt-3 text-[13px]">
              <span className="flex-1 font-bold text-ink">{r.name}</span>
              <span className="w-[140px] font-medium text-muted">{r.mobile}</span>
              <span className="w-[110px] font-medium text-muted">{fmtDate(r.date, { year: false })}</span>
              <span className={cx('rounded-[12px] px-2.5 py-1 text-[11px] font-bold', TONE[r.status] ?? TONE.New)}>{r.status}</span>
            </div>
          ))}
          {list.data && !rows.length && <p className="text-[13px] font-medium text-muted">Nobody yet. Share your link or use Refer someone.</p>}
        </div>
      </div>
      {open && <ReferDialog onClose={() => setOpen(false)} />}
    </div>
  )
}

function ReferDialog({ onClose }) {
  const [f, setF] = useState({ name: '', mobile: '', email: '', relation: '', interest: 'Health', city: '', message: '', permission: false })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors: fe } = useAct()
  const save = () => act(() => api.referral.refer({ ...f, mobile: cleanMobile(f.mobile), email: f.email || undefined, city: f.city || undefined, message: f.message || undefined }), {
    quiet: true, onDone: () => { invalidate('referral'); onClose() },
  })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e1f3b]/40 p-4">
      <div className="flex w-[560px] flex-col gap-4 rounded-[28px] bg-white p-7">
        <p className="text-[21px] font-bold text-ink">Refer someone</p>
        <div className="flex gap-3"><Field label="Their name *" value={f.name} onChange={set('name')} error={fe.name} /><Field label="Mobile *" value={f.mobile} onChange={set('mobile')} error={fe.mobile} /></div>
        <div className="flex gap-3"><Field label="How you know them *" value={f.relation} onChange={set('relation')} error={fe.relation} /><Field label="Insurance they need *" type="select" value={f.interest} onChange={set('interest')} options={['Health', 'Motor', 'Life', 'Term', 'Travel', 'Other']} /></div>
        <div className="flex gap-3"><Field label="Email" value={f.email} onChange={set('email')} error={fe.email} /><Field label="City" value={f.city} onChange={set('city')} /></div>
        <Field label="Message" type="textarea" value={f.message} onChange={set('message')} />
        <Field type="checkbox" label="They agreed to be contacted about insurance. *" value={f.permission} onChange={set('permission')} />
        {fe.permission && <span className="text-[12px] font-medium text-[#b4323c]">{fe.permission}</span>}
        <ErrorNote error={error && !Object.keys(fe).length ? error : null} />
        <div className="flex gap-2.5">
          <button type="button" onClick={onClose} className="h-[46px] flex-1 rounded-[24px] border border-line text-[14px] font-semibold text-ink">Cancel</button>
          <button type="button" disabled={busy} onClick={save} className="h-[46px] flex-1 rounded-[24px] bg-navy text-[14px] font-semibold text-white disabled:opacity-60">{busy ? 'Sending…' : 'Send referral'}</button>
        </div>
      </div>
    </div>
  )
}