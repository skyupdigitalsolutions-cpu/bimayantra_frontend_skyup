// Batch 12 · Documents library (frame 15) on the live API: GET /documents (B-03) — the newest version of every customer
// and family document in the account. Vehicle RC and photos are not in this list (they live on each vehicle).
// Click a card: unconfirmed Aadhaar / PAN / old policy → check the values (PD1); otherwise open the file.
import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { cx } from '../components/ui'
import { Header, HeadButton, SegTabs } from '../screens/catalogue/_parts'
import { useHeaderSearch, NoMatches } from '../screens/tasks/_filter'
import { SH8 } from '../screens/states-records/_parts'
import { api, useDebounced, useQuery } from '../api'
import { fmtDate } from '../api/format'
import { ActionDialog, ErrorNote, Field, label } from './kit'
import { AddDocumentDialog, VerifyDialog, needsCheck } from './FamilyDocs'
import { peopleOf } from './CustomerTabs'

const CATEGORY = {
  identity: { title: 'Identity', types: ['Aadhaar', 'PAN', 'Address proof', 'Photo'], bg: 'bg-[#fde4e8]', icon: 'lock' },
  policies: { title: 'Policies', types: ['Old policy'], bg: 'bg-[#fdecd2]', icon: 'shield' },
  medical: { title: 'Medical', types: ['Medical report'], bg: 'bg-[#d4f1e7]', icon: 'heart' },
  other: { title: 'Other', types: null, bg: 'bg-[#eef1f6]', icon: 'folder' },
}
const categoryOf = (type) => Object.entries(CATEGORY).find(([, c]) => c.types?.includes(type))?.[0] ?? 'other'
const STATUS = { UNCONFIRMED: ['bg-[#fbf1e1] text-[#8a5a12]', 'alert', 'Unconfirmed'], CONFIRMED: ['bg-[#e7f4ee] text-[#127650]', 'check', 'Confirmed'] }

export default function LiveDocumentsLibrary() {
  const [tab, setTab] = useState('all')
  const [q, clearQ] = useHeaderSearch()
  const search = useDebounced(q.trim(), 300)
  const [dlg, setDlg] = useState(null)
  // One page of up to 100 newest documents, filtered on the server by the header search.
  const list = useQuery(['documents', 'library', search], () => api.documents.list({ limit: 100, search: search || undefined }))
  const all = list.data ?? []
  const counts = Object.fromEntries(Object.keys(CATEGORY).map((k) => [k, all.filter((d) => categoryOf(d.type) === k).length]))
  const rows = tab === 'all' ? all : all.filter((d) => categoryOf(d.type) === tab)
  const tabs = [{ key: 'all', label: 'All', count: all.length }, ...Object.entries(CATEGORY).filter(([k]) => counts[k] || k === tab).map(([key, c]) => ({ key, label: c.title, count: counts[key] }))]
  const open = (d) => (needsCheck(d) ? setDlg({ kind: 'verify', doc: d }) : d.file && window.open(api.files.url(d.file.id), '_blank', 'noopener'))
  return (
    <AppLayout active="customers">
      <Header breadcrumb="POLICY HOLDERS  /  DOCUMENTS" title="Documents" subtitle="Every upload is kept as a version. Nothing is ever deleted."
        actions={<HeadButton icon="upload" onClick={() => setDlg({ kind: 'pick' })}>Document</HeadButton>} />
      <div className="mt-[13px]"><SegTabs items={tabs} value={tab} onChange={setTab} /></div>
      <ErrorNote error={list.error} />
      <div className="mt-7 grid grid-cols-4 gap-5">
        {rows.map((d) => {
          const c = CATEGORY[categoryOf(d.type)]
          const [tone, icon, txt] = STATUS[d.status] ?? ['bg-chip text-muted', null, 'Saved']
          return (
            <button key={d.id} type="button" onClick={() => open(d)} className={cx('flex flex-col overflow-hidden rounded-[28px] bg-white text-left transition hover:-translate-y-0.5', SH8)}>
              <div className={cx('flex h-[130px] items-end justify-center', c.bg)}>
                <div className="mb-[-14px] flex h-[84px] w-[112px] rotate-[3deg] flex-col gap-2 rounded-[14px] bg-white p-4 shadow-[0px_10px_24px_-12px_rgba(19,41,75,0.35)]">
                  <Icon name={c.icon} size={16} className="text-ink" />
                  <span className="h-1.5 w-full rounded bg-line" /><span className="h-1.5 w-3/4 rounded bg-line" />
                </div>
              </div>
              <div className="flex flex-col gap-1 px-[18px] pt-6 pb-[18px]">
                <p className="truncate text-[15px] font-bold text-ink">{d.type === 'Other' ? d.name : label(d.type)}</p>
                <p className="truncate text-[13px] font-medium text-ink-2">{d.personName}{d.customer && d.personName !== d.customer.name ? ` · ${d.customer.name}` : ''}</p>
                <p className="text-[12px] font-medium text-muted">v{d.version} · {fmtDate(d.uploadedAt, { year: false })}{d.versions > 1 ? ` · ${d.versions} versions` : ''}</p>
                <span className={cx('mt-1.5 flex w-fit items-center gap-1 rounded-[12px] px-2.5 py-1 text-[12px] font-semibold', tone)}>{icon && <Icon name={icon} size={12} />}{needsCheck(d) ? 'Check values' : txt}</span>
              </div>
            </button>
          )
        })}
      </div>
      {!rows.length && (
        <NoMatches className={cx('rounded-[24px] bg-white', SH8)} text={list.loading ? 'Loading…' : q.trim() ? 'No matches' : 'No documents yet'}
          sub={q.trim() ? `No documents match “${q.trim()}”.` : 'Add a document for a policy holder or a family member.'} onClear={q.trim() ? clearQ : undefined} />
      )}
      {dlg?.kind === 'verify' && <VerifyDialog documentId={dlg.doc.id} customerId={dlg.doc.customerId} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'pick' && <PickHolder onPick={(c) => setDlg({ kind: 'add', customer: c })} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'add' && <AddDocumentDialog customer={dlg.customer} people={peopleOf(dlg.customer)} onClose={() => setDlg(null)} />}
    </AppLayout>
  )
}

/** Choose whose document it is (a policy holder), then the usual Add document dialog. */
function PickHolder({ onPick, onClose }) {
  const [text, setText] = useState('')
  const s = useDebounced(text, 300)
  const found = useQuery(['customers', 'doc-pick', s], () => api.customers.list({ search: s || undefined, status: 'ACTIVE', limit: 8 }))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const pick = async (id) => {
    setBusy(true); setErr(null)
    try { onPick((await api.customers.get(id)).data) } catch (e) { setErr(e) } finally { setBusy(false) }
  }
  return (
    <ActionDialog title="Add document" icon="upload" body="Whose document is it? Choose the policy holder; you can pick a family member next." onClose={onClose} error={err}>
      <Field label="Search by name, mobile or number" value={text} onChange={setText} autoFocus />
      <div className="flex max-h-[300px] flex-col gap-2 overflow-auto">
        {(found.data ?? []).map((c) => (
          <button key={c.id} type="button" disabled={busy} onClick={() => pick(c.id)} className="flex items-center justify-between rounded-[16px] border border-line px-4 py-3 text-left hover:bg-tile">
            <span className="flex flex-col"><span className="text-[14px] font-bold text-ink">{c.name}</span><span className="text-[12px] font-medium text-muted">{c.number}{c.city ? ` · ${c.city}` : ''}</span></span>
            <Icon name="chev-right" size={16} className="text-muted" />
          </button>
        ))}
        {found.data && !found.data.length && <p className="text-[13px] font-medium text-muted">No active policy holder matches.</p>}
      </div>
    </ActionDialog>
  )
}
