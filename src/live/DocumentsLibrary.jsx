// Batch 12 · Documents library (frame 15) on the live API: GET /documents (B-03) — the newest version of every customer
// and family document in the account.
// NOTE (live Figma 15 adds Policies + Vehicle categories): policy-document PDFs and vehicle RC/photos are NOT returned by
// GET /documents today (they live on each policy / vehicle). The tabs and per-type styling are in place, so those cards
// appear automatically once the endpoint includes them; until then those tabs show an empty state.
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
  identity: { title: 'Identity', types: ['Aadhaar', 'PAN', 'Address proof', 'Photo'] },
  policies: { title: 'Policies', types: ['Old policy', 'Policy', 'Policy document'] },
  medical: { title: 'Medical', types: ['Medical report'] },
  vehicle: { title: 'Vehicle', types: ['Vehicle RC', 'RC', 'Vehicle photo', 'PUC'] },
  other: { title: 'Other', types: null },
}
const FIXED = ['identity', 'policies', 'medical', 'vehicle']
const categoryOf = (type) => Object.entries(CATEGORY).find(([, c]) => c.types?.includes(type))?.[0] ?? 'other'
// Thumbnail colour + icon per document type (Figma 15), falling back to the category default.
const TYPE_STYLE = {
  Aadhaar: ['bg-[#fde8ec]', 'lock'], PAN: ['bg-[#e9e3fc]', 'lock'], 'Address proof': ['bg-[#fde8ec]', 'lock'], Photo: ['bg-[#d9eafd]', 'eye'],
  'Medical report': ['bg-[#d4f1e7]', 'heart'], 'Old policy': ['bg-[#eef1f5]', 'folder'], Policy: ['bg-[#fde8c9]', 'shield'], 'Policy document': ['bg-[#fde8c9]', 'shield'],
  'Vehicle RC': ['bg-[#d9eafd]', 'car'], RC: ['bg-[#d9eafd]', 'car'], 'Vehicle photo': ['bg-[#d9eafd]', 'car'], PUC: ['bg-[#d9eafd]', 'car'],
}
const CAT_STYLE = { identity: ['bg-[#fde8ec]', 'lock'], policies: ['bg-[#fde8c9]', 'shield'], medical: ['bg-[#d4f1e7]', 'heart'], vehicle: ['bg-[#d9eafd]', 'car'], other: ['bg-[#eef1f5]', 'folder'] }
const styleOf = (d) => TYPE_STYLE[d.type] ?? CAT_STYLE[categoryOf(d.type)] ?? CAT_STYLE.other
const STATUS = { UNCONFIRMED: ['bg-[#fbf1e1] text-[#8a5a12]', 'alert', 'Unconfirmed'], CONFIRMED: ['bg-[#e7f4ee] text-[#127650]', 'check', 'Confirmed'] }

/** Three-dot card menu: open the file / check the unconfirmed values. */
function MoreMenu({ onOpen, onCheck }) {
  const [open, setOpen] = useState(false)
  if (!onOpen && !onCheck) return <Icon name="more" size={18} className="shrink-0 text-muted" />
  return (
    <div className="relative shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
      <button type="button" aria-label="More" onClick={() => setOpen((o) => !o)} className="flex text-muted hover:text-ink"><Icon name="more" size={18} /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-6 right-0 z-20 flex w-[160px] flex-col rounded-[14px] border border-line bg-white p-1.5 shadow-[0px_12px_24px_-10px_rgba(19,41,75,0.25)]">
            {onCheck && <button type="button" onClick={() => { setOpen(false); onCheck() }} className="rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-panel">Check values</button>}
            {onOpen && <button type="button" onClick={() => { setOpen(false); onOpen() }} className="rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-panel">Open file</button>}
          </div>
        </>
      )}
    </div>
  )
}

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
  const tabs = [
    { key: 'all', label: 'All', count: all.length },
    ...FIXED.map((key) => ({ key, label: CATEGORY[key].title, count: counts[key] })),
    ...(counts.other ? [{ key: 'other', label: 'Other', count: counts.other }] : []),
  ]
  const openFile = (d) => d.file && window.open(api.files.url(d.file.id), '_blank', 'noopener')
  const check = (d) => setDlg({ kind: 'verify', doc: d })
  const open = (d) => (needsCheck(d) ? check(d) : openFile(d))
  return (
    <AppLayout active="customers">
      <Header breadcrumb="POLICY HOLDERS  /  DOCUMENTS" title="Documents" subtitle="Every upload is kept as a version. Nothing is ever deleted."
        actions={<HeadButton icon="upload" onClick={() => setDlg({ kind: 'pick' })}>Document</HeadButton>} />
      <div className="mt-[13px]"><SegTabs items={tabs} value={tab} onChange={setTab} /></div>
      <ErrorNote error={list.error} />
      <div className="mt-7 grid grid-cols-4 gap-5">
        {rows.map((d) => {
          const [bg, icon] = styleOf(d)
          const [tone, chipIcon, txt] = STATUS[d.status] ?? ['bg-[#eef1f5] text-[#44526a]', null, 'Saved']
          const uploader = d.uploadedBy?.name ?? d.uploadedByName ?? d.uploader?.name ?? null
          return (
            <div key={d.id} role="button" tabIndex={0} onClick={() => open(d)} onKeyDown={(e) => e.key === 'Enter' && open(d)} className={cx('flex cursor-pointer flex-col overflow-hidden rounded-[28px] bg-white text-left transition hover:-translate-y-0.5', SH8)}>
              <div className={cx('flex h-[130px] items-center justify-center', bg)}>
                <div className="flex w-[110px] rotate-[4deg] flex-col gap-1.5 rounded-[12px] bg-white px-4 py-3.5 shadow-[0px_8px_8px_rgba(19,41,75,0.12)]">
                  <Icon name={icon} size={18} className="text-ink" />
                  <span className="h-[5px] w-[70px] rounded-[3px] bg-[#e3e8f0]" /><span className="h-[5px] w-[54px] rounded-[3px] bg-[#e3e8f0]" /><span className="h-[5px] w-[62px] rounded-[3px] bg-[#e3e8f0]" />
                </div>
              </div>
              <div className="flex flex-col gap-2 px-[18px] pt-4 pb-[18px]">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 truncate text-[14px] font-bold text-ink">{d.type === 'Other' ? d.name : (d.name || label(d.type))}</p>
                  <MoreMenu onOpen={d.file ? () => openFile(d) : undefined} onCheck={needsCheck(d) ? () => check(d) : undefined} />
                </div>
                <p className="truncate text-[12px] font-semibold text-[#44526a]">{d.personName}{d.customer && d.personName !== d.customer.name ? ` · ${d.customer.name}` : ''}</p>
                <p className="text-[11px] font-medium text-muted">v{d.version} · {fmtDate(d.uploadedAt, { year: false })}{uploader ? ` · ${uploader}` : ''}</p>
                <span className={cx('mt-1.5 flex w-fit items-center gap-1 rounded-[14px] px-2.5 py-1 text-[12px] font-semibold', tone)}>{chipIcon && <Icon name={chipIcon} size={12} />}{txt}</span>
              </div>
            </div>
          )
        })}
      </div>
      {!rows.length && (
        <NoMatches className={cx('rounded-[24px] bg-white', SH8)} text={list.loading ? 'Loading…' : q.trim() ? 'No matches' : 'No documents yet'}
          sub={q.trim() ? `No documents match “${q.trim()}”.` : tab === 'all' ? 'Add a document for a policy holder or a family member.' : `No ${CATEGORY[tab]?.title.toLowerCase() ?? ''} documents yet.`} onClear={q.trim() ? clearQ : undefined} />
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
