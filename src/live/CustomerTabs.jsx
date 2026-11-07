// 05a–05i · Customer profile tabs, CU1/CU2 deactivate and reactivate, on the live API.
// Every tab shares the real profile header (useCustomerShell). Read-only for now on Family, Consent, Documents and
// Vehicles: their add/edit flows (FD*, PF*, CS*, PV*) are the next batches.
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cx } from '../components/ui'
import Icon from '../components/Icon'
import { ProfileShell, PillTabs, SChip, PillButton, Dot, IconTile, Chev, Note, Head, CARD_SHADOW } from '../screens/customer-tabs/_parts'
import { api, useQuery } from '../api'
import { avatarHex, daysFromToday, fmtDate, fmtMobile, fmtMoney, fmtTime, initials } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import { ActionDialog, Field, useAct, label } from './kit'
import { LoadingPanel, ErrorPanel } from './common'
import { customerTabPath } from './views'
import { AddDocumentDialog, DefaultNomineeDialog, DocumentVersionsDialog, FamilyDialog, FamilyStatusDialog, LinkHolderDialog, UnlinkButton, VerifyDialog, needsCheck } from './FamilyDocs'
import { ConsentHistoryDialog, RecordConsentDialog, WithdrawConsentDialog } from './Consent'
import { AddVehicleDialog, VehicleStatusDialog } from './Vehicles'
import { EditNomineesDrawer } from './PolicyRecords'

/** The customer and their active household as the people a document or consent can belong to. */
export const peopleOf = (raw) => [
  { id: raw.id, key: `C:${raw.id}`, type: 'CUSTOMER', name: raw.name, relationship: 'Customer', mobile: raw.mobile, email: raw.email },
  ...(raw.family || []).filter((m) => m.status === 'ACTIVE').map((m) => ({ id: m.id, key: `F:${m.id}`, type: 'FAMILY', name: m.name, relationship: m.relationship, mobile: m.mobile, email: m.email })),
]

const PREF = { WHATSAPP: 'WhatsApp', PHONE_CALL: 'Phone call', EMAIL: 'Email' }
const OPEN_Q = ['DRAFT', 'READY', 'SHARED']

/** The real profile header and tab bar, shared by every tab page. */
export function useCustomerShell(id) {
  const c = useQuery(['customer', id], () => api.customers.get(id))
  const quotes = useQuery(['quotations', id], () => api.quotations.list({ customerId: id }))
  const policies = useQuery(['policies', id], () => api.policies.list({ customerId: id }))
  const x = c.data
  const live = useMemo(() => {
    if (!x) return null
    const fam = (x.family || []).filter((m) => m.status === 'ACTIVE')
    const qs = quotes.data || []
    const ps = policies.data || []
    const tab = (key, l, count) => ({ key, label: l, count, to: customerTabPath(id, key) })
    return {
      raw: x, active: x.status === 'ACTIVE', name: x.name, initials: initials(x.name),
      meta: [x.number, x.age != null ? `${x.age} years` : null, x.city].filter(Boolean).join(' · '),
      tagline: [x.occupation, x.preferredContact ? `prefers ${PREF[x.preferredContact]}` : null].filter(Boolean).join(' · ') || 'No occupation or contact preference yet',
      minis: [['Policies', String(ps.length)], ['Open quotes', String(qs.filter((q) => OPEN_Q.includes(q.status)).length)], ['Family', String(fam.length)]],
      tabs: [tab('overview', 'Overview'), tab('family', 'Family', fam.length), tab('consent', 'Consent'), tab('documents', 'Documents'), tab('vehicles', 'Vehicles'),
        tab('quotations', 'Quotations', qs.length), tab('policies', 'Policies', ps.length), tab('payments', 'Payments'), tab('renewals', 'Renewals'), tab('activities', 'Activities')],
      quoteTo: `/quotations/new?customerId=${id}`, bestFitTo: `/best-fit?customerId=${id}`,
      actions: <CustomerStatusActions c={x} />,
      quotes: qs, policies: ps,
    }
  }, [x, quotes.data, policies.data, id])
  return { c, live }
}

/** Edit + Deactivate / Reactivate buttons for the profile header (CU1, CU2). */
export function CustomerStatusActions({ c, edit = true }) {
  const { can } = useAuth()
  const [open, setOpen] = useState(false)
  const active = c.status === 'ACTIVE'
  return (
    <>
      {edit && active && <PillButton variant="outline" icon="edit" to={`/customers/${c.id}/edit`}>Edit</PillButton>}
      {(!can || can('customers.deactivate')) && (
        <PillButton variant="outline" icon={active ? 'x' : 'refresh'} onClick={() => setOpen(true)}>{active ? 'Deactivate' : 'Reactivate'}</PillButton>
      )}
      {open && <StatusDialog c={c} onClose={() => setOpen(false)} />}
    </>
  )
}

function StatusDialog({ c, onClose }) {
  const { reference } = useAuth()
  const active = c.status === 'ACTIVE'
  const reasons = reference?.deactivationReasons ?? []
  const [f, setF] = useState({ reason: reasons[0] ?? '', note: '' })
  const { act, busy, error, fieldErrors } = useAct()
  const run = () => act(
    () => (active ? api.customers.deactivate(c.id, { version: c.version, reason: f.reason, note: f.note || undefined }) : api.customers.reactivate(c.id, { version: c.version, note: f.note || undefined })),
    { invalidates: ['customer', 'customers', 'customers:stats'], onDone: onClose, quiet: true },
  )
  // CU1: the API refuses while open quotations, proposals or policies need this person; its message says which.
  return (
    <ActionDialog title={active ? `Deactivate ${c.name}?` : `Reactivate ${c.name}?`} icon={active ? 'x' : 'refresh'} tone={active ? 'danger' : 'navy'}
      body={active ? 'They move to the Inactive tab. Nothing is deleted, and you can reactivate them later.' : 'They move back to the Active tab.'}
      confirm={active ? 'Deactivate' : 'Reactivate'} busy={busy} error={error} onConfirm={run} onClose={onClose}>
      {active && <Field label="Reason *" type="select" value={f.reason} onChange={(v) => setF({ ...f, reason: v })} options={reasons} error={fieldErrors.reason} />}
      <Field label="Note" type="textarea" value={f.note} onChange={(v) => setF({ ...f, note: v })} error={fieldErrors.note} />
    </ActionDialog>
  )
}

/** Loads the header; renders loading/error; gives the tab body the live header. */
function TabPage({ tab, crumb, children }) {
  const { id } = useParams()
  const { c, live } = useCustomerShell(id)
  if (c.error) return <ErrorPanel active="customers" error={c.error} back="/customers" />
  if (!live) return <LoadingPanel active="customers" />
  return <ProfileShell live={live} tab={tab} crumb={crumb}>{children(live, id)}</ProfileShell>
}

const Empty = ({ children, className = '' }) => (
  <p className={cx('rounded-[24px] bg-white px-6 py-8 text-center text-[14px] font-medium text-muted', CARD_SHADOW, className)}>{children}</p>
)
const Loading = () => <p className="px-2 py-6 text-[13px] font-medium text-muted">Loading…</p>

/* ───────── 05a · Family (read-only; add/edit/nominee are batch 3) ───────── */
export function LiveCustomerFamily() {
  return (
    <TabPage tab="family" crumb="FAMILY">
      {(live, id) => <FamilyTab live={live} id={id} />}
    </TabPage>
  )
}
function FamilyTab({ live, id }) {
  const [dlg, setDlg] = useState(null) // { kind, member? }
  const links = useQuery(['links', id], () => api.customers.links(id))
  const nominee = useQuery(['default-nominee', id], () => api.customers.defaultNominee(id))
  const docs = useQuery(['documents', id], () => api.customers.documents(id))
  const members = live.raw.family || []
  const docChips = (personKey) => (docs.data?.groups || []).filter((g) => g.personKey === personKey).map((g) => {
    const v = g.versions[0]
    return { label: g.name || label(g.type), tone: v?.status === 'CONFIRMED' ? 'green' : 'amber', icon: v?.status === 'CONFIRMED' ? 'check' : 'alert' }
  })
  return (
    <div className="flex items-start gap-5">
      <div className="flex w-[760px] flex-wrap items-start gap-5">
        {members.map((m) => (
          <div key={m.id} className={cx('flex w-[370px] flex-col gap-3.5 rounded-[28px] bg-white p-6', CARD_SHADOW, m.status !== 'ACTIVE' && 'opacity-60')}>
            <div className="flex items-center gap-3.5">
              <Dot initials={initials(m.name)} bg={avatarHex(m.name)} size={52} font={17} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[15px] font-bold text-ink">{m.name}</p>
                <p className="text-[12px] font-medium text-muted">{m.relationship}{m.age != null ? ` · ${m.age}` : ''}{m.status !== 'ACTIVE' ? ' · inactive' : ''}</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              {[['calendar', m.dob ? fmtDate(m.dob) : 'Add date of birth', !m.dob], ['phone', m.mobile ? fmtMobile(m.mobile) : 'No mobile']].map(([icon, v, warn]) => (
                <div key={icon} className="flex h-[35px] flex-1 items-center gap-2 rounded-[14px] bg-panel px-3">
                  <Icon name={icon} size={15} className="text-muted" />
                  <span className={cx('text-[12px] font-semibold whitespace-nowrap', warn ? 'text-[#b4323c]' : 'text-ink')}>{v}</span>
                </div>
              ))}
            </div>
            {live.active && (
              <div className="flex gap-3 text-[12px] font-semibold">
                {m.status === 'ACTIVE' && <button type="button" className="text-ink underline" onClick={() => setDlg({ kind: 'edit', member: m })}>Edit</button>}
                {m.status === 'ACTIVE' && <button type="button" className="text-ink underline" onClick={() => setDlg({ kind: 'doc', personKey: `F:${m.id}` })}>Add document</button>}
                <button type="button" className={m.status === 'ACTIVE' ? 'text-[#b4323c] underline' : 'text-ink underline'} onClick={() => setDlg({ kind: 'status', member: m })}>{m.status === 'ACTIVE' ? 'Make inactive' : 'Make active'}</button>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-bold text-muted">Documents</p>
              {docChips(`F:${m.id}`).length
                ? <div className="flex flex-wrap gap-1.5">{docChips(`F:${m.id}`).map((d) => <SChip key={d.label} tone={d.tone} icon={d.icon}>{d.label}</SChip>)}</div>
                : <p className="text-[12px] font-medium text-faint">No documents yet</p>}
            </div>
          </div>
        ))}
        {!members.length && <Empty className="w-full">No family members yet.</Empty>}
      </div>
      <div className="flex w-[400px] flex-col gap-2.5">
        {live.active && <PillButton variant="pink" icon="user-plus" className="w-full justify-center" onClick={() => setDlg({ kind: 'add' })}>Add family member</PillButton>}
        {live.active && <PillButton variant="outline" icon="folder" className="w-full justify-center" onClick={() => setDlg({ kind: 'doc' })}>Add document</PillButton>}
        <section className={cx('flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Default nominee" sub="Pre-fills new proposals" />
          {nominee.data?.defaultNominee
            ? <p className="text-[14px] font-bold text-ink">{nominee.data.defaultNominee.name} <span className="font-medium text-muted">· {nominee.data.defaultNominee.relationship}</span></p>
            : <p className="text-[13px] font-medium text-muted">No default nominee yet.</p>}
          {live.active && <PillButton variant="outline" size="sm" icon="edit" className="self-start" onClick={() => setDlg({ kind: 'nominee' })}>{nominee.data?.defaultNominee ? 'Change' : 'Set default nominee'}</PillButton>}
        </section>
        <section className={cx('flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Linked policy holders" sub="Other customers of yours" />
          {(links.data || []).map((l) => (
            <div key={l.id} className="flex items-center gap-3 rounded-[16px] bg-panel p-3">
              <Link to={`/customers/${l.customer.id}`} className="flex min-w-0 flex-1 flex-col"><span className="truncate text-[13px] font-bold text-ink">{l.customer.name}</span><span className="text-[12px] font-medium text-muted">{l.relationship} · {l.customer.number}</span></Link>
              {live.active && <UnlinkButton customer={live.raw} link={l} />}
            </div>
          ))}
          {links.data && !links.data.length && <p className="text-[13px] font-medium text-muted">Nobody linked yet.</p>}
          {live.active && <PillButton variant="outline" size="sm" icon="users" className="self-start" onClick={() => setDlg({ kind: 'link' })}>Link a policy holder</PillButton>}
        </section>
        {dlg?.kind === 'add' && <FamilyDialog customerId={id} onClose={() => setDlg(null)} />}
        {dlg?.kind === 'edit' && <FamilyDialog customerId={id} member={dlg.member} onClose={() => setDlg(null)} />}
        {dlg?.kind === 'status' && <FamilyStatusDialog customerId={id} member={dlg.member} onClose={() => setDlg(null)} />}
        {dlg?.kind === 'doc' && <AddDocumentDialog customer={live.raw} people={peopleOf(live.raw)} presetPersonKey={dlg.personKey} onClose={() => setDlg(null)} />}
        {dlg?.kind === 'nominee' && <DefaultNomineeDialog customer={live.raw} onClose={() => setDlg(null)} />}
        {dlg?.kind === 'link' && <LinkHolderDialog customer={live.raw} onClose={() => setDlg(null)} />}
      </div>
    </div>
  )
}

/* ───────── 05b · Consent (read-only; recording is batch 4) ───────── */
const CONSENT_TONE = { GIVEN: ['green', 'check', 'Given'], WITHDRAWN: ['red', 'x', 'Withdrawn'], NOT_RECORDED: ['gray', null, 'Not recorded'] }
export function LiveCustomerConsent() {
  return <TabPage tab="consent" crumb="CONSENT">{(live, id) => <ConsentTab id={id} live={live} />}</TabPage>
}
function ConsentTab({ id, live }) {
  const [dlg, setDlg] = useState(null)
  const people = peopleOf(live.raw)
  const q = useQuery(['consents', id], () => api.customers.consents(id))
  const rows = q.data?.rows || []
  const pd = live.raw.personalDataConsent
  return (
    <div className="flex flex-col gap-5">
      <Note icon={pd === 'GIVEN' ? 'check' : 'alert'} bg={pd === 'GIVEN' ? '#e7f4ee' : '#fbf1e1'} color={pd === 'GIVEN' ? '#127650' : '#8a5a12'}>
        Personal-data consent: {CONSENT_TONE[pd]?.[2] ?? 'Not recorded'}{pd !== 'GIVEN' ? ' · record it before adding PAN or Aadhaar' : ''}
      </Note>
      <section className={cx('flex flex-col gap-2.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        <Head title="Messages consent" sub="Per person and channel" />
        {q.loading && !q.data && <Loading />}
        {rows.map((r) => (
          <div key={r.person.id} className="flex items-center gap-4 rounded-[20px] bg-panel p-4">
            <Dot initials={initials(r.person.name)} bg={avatarHex(r.person.name)} size={40} font={13} />
            <div className="flex w-[220px] flex-col gap-0.5"><p className="text-[14px] font-bold text-ink">{r.person.name}</p><p className="text-[12px] font-medium text-muted">{r.person.relationship}</p></div>
            {Object.entries(r.channels).map(([ch, v]) => {
              const [tone, icon, txt] = CONSENT_TONE[v.status] ?? CONSENT_TONE.NOT_RECORDED
              return (
                <div key={ch} className="flex flex-1 flex-col gap-1">
                  <p className="text-[11px] font-semibold text-muted">{ch === 'WHATSAPP' ? 'WhatsApp' : label(ch)}</p>
                  <SChip tone={tone} icon={icon}>{txt}{v.at ? ` · ${fmtDate(v.at, { year: false })}` : ''}</SChip>
                  {live.active && v.status === 'GIVEN' && <button type="button" className="self-start text-[11px] font-semibold text-[#b4323c] underline" onClick={() => setDlg({ kind: 'withdraw', person: r.person, channel: ch })}>Withdraw</button>}
                </div>
              )
            })}
          </div>
        ))}
      </section>
      <div className="flex gap-3">
        {live.active && <PillButton variant="pink" icon="check" onClick={() => setDlg({ kind: 'record' })}>Record consent</PillButton>}
        {live.active && pd !== 'GIVEN' && <PillButton variant="outline" icon="shield" onClick={() => setDlg({ kind: 'pd' })}>Record personal-data consent</PillButton>}
        {live.active && pd === 'GIVEN' && <PillButton variant="outline" icon="x" onClick={() => setDlg({ kind: 'withdraw', person: people[0], channel: 'PERSONAL_DATA' })}>Withdraw personal-data consent</PillButton>}
        <PillButton variant="outline" icon="clock" onClick={() => setDlg({ kind: 'history' })}>History</PillButton>
      </div>
      {dlg?.kind === 'record' && <RecordConsentDialog customer={live.raw} people={people} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'pd' && <RecordConsentDialog customer={live.raw} people={people} presetPersonId={live.raw.id} personalData onClose={() => setDlg(null)} />}
      {dlg?.kind === 'withdraw' && <WithdrawConsentDialog customer={live.raw} person={dlg.person} channel={dlg.channel} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'history' && <ConsentHistoryDialog customerId={id} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05c · Documents (read-only; upload is batch 3) ───────── */
export function LiveCustomerDocuments() {
  return <TabPage tab="documents" crumb="DOCUMENTS">{(live, id) => <DocumentsTab id={id} live={live} />}</TabPage>
}
function DocumentsTab({ id, live }) {
  const [dlg, setDlg] = useState(null)
  const q = useQuery(['documents', id], () => api.customers.documents(id))
  const groups = q.data?.groups || []
  return (
    <div className="flex flex-col gap-5">
      {q.data?.missing?.items?.length > 0 && <Note icon="alert" bg="#fbf1e1" color="#8a5a12">{q.data.missing.message}</Note>}
      <section className={cx('flex flex-col gap-2.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        <Head title="Documents" sub="Newest version of each document" />
        {q.loading && !q.data && <Loading />}
        {groups.map((g) => {
          const v = g.versions[0]
          return (
            <div key={`${g.personKey}:${g.type}:${g.name}`} className="flex h-[72px] cursor-pointer items-center gap-4 rounded-[20px] bg-panel p-4" onClick={() => setDlg({ kind: 'versions', group: g })}>
              <IconTile icon="folder" bg="#fde8c9" size={44} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[14px] font-bold text-ink">{g.name || label(g.type)} · {g.personName}</p>
                <p className="text-[12px] font-medium text-muted">Version {v?.version} · uploaded {fmtDate(v?.uploadedAt, { year: false })}{g.versions.length > 1 ? ` · ${g.versions.length} versions` : ''}</p>
              </div>
              {needsCheck(v) && <button type="button" className="text-[12px] font-semibold text-blue underline" onClick={(e) => { e.stopPropagation(); setDlg({ kind: 'verify', id: v.id }) }}>Check values</button>}
              <SChip tone={v?.status === 'CONFIRMED' ? 'green' : 'amber'} icon={v?.status === 'CONFIRMED' ? 'check' : 'clock'}>{label(v?.status)}</SChip>
            </div>
          )
        })}
        {!q.loading && !groups.length && <p className="px-2 py-4 text-[13px] font-medium text-muted">No documents yet.</p>}
      </section>
      {live.active && <PillButton variant="outline" icon="upload" className="self-start" onClick={() => setDlg({ kind: 'add' })}>Add document</PillButton>}
      {dlg?.kind === 'add' && <AddDocumentDialog customer={live.raw} people={peopleOf(live.raw)} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'verify' && <VerifyDialog documentId={dlg.id} customerId={id} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'versions' && <DocumentVersionsDialog group={dlg.group} canRelabel={live.active} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05d · Vehicles (read-only; add is batch 5) ───────── */
export function LiveCustomerVehicles() {
  return <TabPage tab="vehicles" crumb="VEHICLES">{(live, id) => <VehiclesTab id={id} live={live} />}</TabPage>
}
function VehiclesTab({ id, live }) {
  const [dlg, setDlg] = useState(null)
  const q = useQuery(['vehicles', id], () => api.customers.vehicles(id))
  const rows = q.data?.vehicles || []
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-5">
        {q.loading && !q.data && <Loading />}
        {rows.map((v) => (
          <section key={v.id} className={cx('flex w-[370px] flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW, v.status !== 'ACTIVE' && 'opacity-60')}>
            <div className="flex items-center gap-3.5">
              <IconTile icon="car" bg="#d9eafd" size={48} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[15px] font-bold text-ink">{v.registrationNumber ?? v.registration ?? '—'}</p>
                <p className="text-[12px] font-medium text-muted">{[v.make, v.model, v.year].filter(Boolean).join(' · ')}</p>
              </div>
              <SChip tone={v.status === 'ACTIVE' ? 'green' : 'gray'}>{label(v.status)}</SChip>
            </div>
            {live.active && <button type="button" className="self-start text-[12px] font-semibold text-ink underline" onClick={() => setDlg({ kind: 'status', vehicle: v })}>{v.status === 'ACTIVE' ? 'Mark sold' : 'Make active again'}</button>}
          </section>
        ))}
        {!q.loading && !rows.length && <Empty className="w-[760px]">No vehicles yet.</Empty>}
      </div>
      {live.active && <PillButton variant="pink" icon="plus" className="self-start" onClick={() => setDlg({ kind: 'add' })}>Add vehicle</PillButton>}
      {dlg?.kind === 'add' && <AddVehicleDialog customer={live.raw} rules={q.data?.rules} tooFewPhotosMessage={q.data?.tooFewPhotosMessage} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'status' && <VehicleStatusDialog vehicle={dlg.vehicle} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05e · Quotations ───────── */
const Q_CHIP = { DRAFT: ['gray', 'edit'], READY: ['blue', 'check'], SHARED: ['violet', 'send'], ACCEPTED: ['green', 'check'], REJECTED: ['red', 'x'], EXPIRED: ['amber', 'clock'], CANCELLED: ['gray', 'x'] }
export function LiveCustomerQuotations() {
  return (
    <TabPage tab="quotations" crumb="QUOTATIONS">
      {(live) => (
        <div className="flex flex-col gap-3.5">
          {live.quotes.map((q) => (
            <Link key={q.id} to={`/quotations/${q.id}`} className={cx('group flex h-[84px] items-center gap-4 rounded-[24px] bg-white px-[22px] py-[18px]', CARD_SHADOW)}>
              <IconTile icon="quote" bg="#e9e3fc" />
              <div className="flex min-w-0 flex-1 flex-col gap-[3px] whitespace-nowrap">
                <p className="text-[15px] font-bold text-ink">{q.number ?? 'Draft quotation'}</p>
                <p className="text-[12px] font-medium text-muted">{[q.insurerName, q.productName].filter(Boolean).join(' · ') || 'No product chosen yet'}</p>
              </div>
              <p className="w-[220px] text-[12px] font-semibold whitespace-nowrap text-ink-2">{q.validUntil ? `Valid till ${fmtDate(q.validUntil)}` : `Updated ${fmtDate(q.updatedAt, { year: false })}`}</p>
              <p className="w-[110px] text-[16px] font-bold whitespace-nowrap text-ink">{q.premium ? fmtMoney(q.premium) : '—'}</p>
              <SChip tone={Q_CHIP[q.status]?.[0] ?? 'gray'} icon={Q_CHIP[q.status]?.[1]}>{label(q.status)}</SChip>
              <Chev />
            </Link>
          ))}
          {!live.quotes.length && <Empty>No quotations for {live.name} yet.</Empty>}
        </div>
      )}
    </TabPage>
  )
}

/* ───────── 05f · Policies ───────── */
const P_CHIP = { AWAITING_ISSUANCE: ['violet', 'clock'], ISSUED: ['green', 'check'], EXPIRED: ['amber', 'alert'], RENEWED: ['blue', 'refresh'], CANCELLED: ['gray', 'x'] }
function termProgress(p) {
  if (!p.startDate || !p.endDate) return 0
  const s = new Date(p.startDate).getTime(), e = new Date(p.endDate).getTime()
  return Math.max(0, Math.min(100, Math.round(((Date.now() - s) / (e - s)) * 100)))
}
export function LiveCustomerPolicies() {
  const [nomFor, setNomFor] = useState(null) // policy id whose nominees are being edited (PP1)
  return (
    <TabPage tab="policies" crumb="POLICIES">
      {(live, id) => (
        <>
          <div className="flex flex-wrap gap-5">
            {live.policies.map((p) => (
              <section key={p.id} className={cx('flex w-[580px] flex-col gap-4 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
                <div className="flex items-center gap-3.5">
                  <IconTile icon="shield" bg="#d4f1e7" size={52} iconSize={24} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                    <p className="text-[16px] font-bold text-ink">{[p.insurer, p.productName].filter(Boolean).join(' ') || 'Policy'}</p>
                    <p className="text-[12px] font-medium text-muted">{p.policyNumber ? `Policy ${p.policyNumber}` : 'Policy number pending'}</p>
                  </div>
                  <SChip tone={P_CHIP[p.status]?.[0] ?? 'gray'} icon={P_CHIP[p.status]?.[1]}>{label(p.status)}</SChip>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 overflow-hidden rounded-[5px] bg-panel">{termProgress(p) > 0 && <div className="h-full rounded-[5px] bg-[#16845b]" style={{ width: `${termProgress(p)}%` }} />}</div>
                  <p className="text-[12px] font-semibold text-ink-2">{p.startDate && p.endDate ? `${fmtDate(p.startDate)} – ${fmtDate(p.endDate)}` : 'Dates set when the policy is issued'}</p>
                </div>
                <div className="flex gap-2.5">
                  {[['Premium', p.premium ? fmtMoney(p.premium) : '—'], ['Ends', p.endDate ? fmtDate(p.endDate) : '—'], ['Renewal', p.renewal ? label(p.renewal.status) : '—']].map(([k, v]) => (
                    <div key={k} className="flex h-14 flex-1 flex-col gap-0.5 rounded-[14px] bg-panel p-3 whitespace-nowrap"><p className="text-[11px] font-medium text-muted">{k}</p><p className="text-[13px] font-bold text-ink">{v}</p></div>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <PillButton variant="navy" size="sm" icon="arrow" to={`/policies/${p.id}`}>Open policy</PillButton>
                  {live.active && ['AWAITING_ISSUANCE', 'ISSUED'].includes(p.status) && <PillButton variant="outline" size="sm" icon="users" onClick={() => setNomFor(p.id)}>Edit nominees</PillButton>}
                </div>
              </section>
            ))}
            {!live.policies.length && <Empty className="w-[580px]">No policies for {live.name} yet.</Empty>}
          </div>
          {live.active && <PillButton variant="pink" icon="plus" className="mt-8" to={`/customers/${id}/policies/new`}>Record existing policy</PillButton>}
          {nomFor && <PolicyNominees id={nomFor} onClose={() => setNomFor(null)} />}
        </>
      )}
    </TabPage>
  )
}

/** PP1 from a policy card: load the full policy (nominee versions), then the drawer. */
function PolicyNominees({ id, onClose }) {
  const q = useQuery(['policy', id], () => api.policies.get(id))
  return q.data ? <EditNomineesDrawer policy={q.data} onClose={onClose} /> : null
}

/* ───────── 05g · Payments (collected from the customer's quotations: gap G-P1) ───────── */
const PAY_CHIP = { PAID: ['green', 'check', 'Paid'], AWAITING_PAYMENT: ['amber', 'clock', 'Awaiting'], FAILED: ['red', 'x', 'Failed'], EXPIRED: ['gray', 'clock', 'Link expired'], REVERSED: ['gray', 'refresh', 'Reversed'] }
export function LiveCustomerPayments() {
  return <TabPage tab="payments" crumb="PAYMENTS">{(live) => <PaymentsTab live={live} />}</TabPage>
}
function PaymentsTab({ live }) {
  const pays = useQuery(['payments', 'customer', live.raw.id], () => api.payments.list({ customerId: live.raw.id, limit: 100 }))
  const rows = pays.data || []
  const paid = rows.filter((p) => p.status === 'PAID')
  const totals = [
    ['#e7f4ee', 'Paid', fmtMoney(paid.reduce((a, p) => a + (p.amount || 0), 0))],
    ['#fbf1e1', 'Awaiting', String(rows.filter((p) => p.status === 'AWAITING_PAYMENT').length)],
    ['#eef1f5', 'Payments recorded', String(rows.length)],
  ]
  return (
    <>
      <Note icon="shield" bg="#e7f4ee" color="#127650">{live.name.split(' ')[0]} pays insurers directly. You record each payment on its quotation.</Note>
      <section className={cx('mt-6 flex flex-col gap-2.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        {pays.loading && !pays.data && <Loading />}
        {rows.map((p) => {
          const [tone, icon, txt] = PAY_CHIP[p.status] ?? ['gray', null, label(p.status)]
          return (
            <Link key={p.id} to={`/quotations/${p.quotationId}`} className="group flex h-[78px] items-center gap-4 rounded-[20px] bg-panel p-4">
              <IconTile icon="card" bg="#d4f1e7" size={46} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[14px] font-bold text-ink">{p.quotationNumber} · {[p.insurer, p.productName].filter(Boolean).join(' ')}</p>
                <p className="text-[12px] font-medium text-muted">{[p.mode, p.reference, p.paymentDate ? fmtDate(p.paymentDate) : fmtDate(p.createdAt)].filter(Boolean).join(' · ')}</p>
              </div>
              <p className="text-[16px] font-bold whitespace-nowrap text-ink">{p.amount ? fmtMoney(p.amount) : p.portalAmount ? fmtMoney(p.portalAmount) : '—'}</p>
              <SChip tone={tone} icon={icon}>{txt}</SChip>
              <Chev size={34} />
            </Link>
          )
        })}
        {!pays.loading && !rows.length && <p className="px-2 py-4 text-[13px] font-medium text-muted">No payments recorded yet.</p>}
      </section>
      <div className="mt-3.5 flex gap-5">
        {totals.map(([bg, k, v]) => (
          <div key={k} className="flex h-[89px] flex-1 flex-col gap-1 rounded-[24px] p-5" style={{ background: bg }}>
            <p className="text-[12px] font-semibold text-ink-2">{k}</p><p className="text-[24px] font-bold tracking-[-0.2px] text-ink">{v}</p>
          </div>
        ))}
      </div>
    </>
  )
}

/* ───────── 05h · Renewals ───────── */
export function LiveCustomerRenewals() {
  return <TabPage tab="renewals" crumb="RENEWALS">{(live, id) => <RenewalsTab id={id} live={live} />}</TabPage>
}
function RenewalsTab({ id, live }) {
  const q = useQuery(['renewals', id], () => api.renewals.list({ customerId: id }))
  const rows = (q.data || []).slice().sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
  const [first, ...rest] = rows
  const upcoming = live.policies.filter((p) => p.status === 'AWAITING_ISSUANCE')
  return (
    <>
      {q.loading && !q.data && <Loading />}
      {first && (
        <section className="flex h-[132px] items-center gap-[22px] rounded-[32px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] px-7 py-6 shadow-[0px_18px_36px_-12px_rgba(201,138,46,0.2)]">
          <div className="flex size-[84px] shrink-0 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-[26px] leading-[33px] font-bold text-ink">{Math.abs(first.daysLeft ?? 0)}</span>
            <span className="text-[11px] font-semibold text-[#8a5a12]">{(first.daysLeft ?? 0) < 0 ? 'days late' : 'days'}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 whitespace-nowrap">
            <p className="text-[19px] font-bold text-ink">{[first.policy?.insurer, first.policy?.product].filter(Boolean).join(' ')} renews on {fmtDate(first.dueDate)}</p>
            <p className="text-[13px] font-medium text-[#8a5a12]">{[first.graceUntil ? `Grace until ${fmtDate(first.graceUntil)}` : null, first.policy?.number ? `Policy ${first.policy.number}` : null].filter(Boolean).join(' · ') || label(first.status)}</p>
            <SChip tone="amber" icon="alert">{label(first.status)}</SChip>
          </div>
          <PillButton variant="navy" size="sm" icon="arrow" to={`/renewals?open=${first.id}`}>Open renewal</PillButton>
        </section>
      )}
      {(rest.length > 0 || upcoming.length > 0) && (
        <section className={cx('mt-12 flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Next in line" />
          {rest.map((r) => (
            <Link key={r.id} to={`/renewals?open=${r.id}`} className="flex h-[76px] items-center gap-3.5 rounded-[20px] bg-panel p-4">
              <IconTile icon="refresh" bg="#e9e3fc" size={44} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap"><p className="text-[14px] font-bold text-ink">{[r.policy?.insurer, r.policy?.product].filter(Boolean).join(' ')}</p><p className="text-[12px] font-medium text-muted">Renews {fmtDate(r.dueDate)}</p></div>
              <SChip tone="gray" icon="clock">{label(r.status)}</SChip>
            </Link>
          ))}
          {upcoming.map((p) => (
            <div key={p.id} className="flex h-[76px] items-center gap-3.5 rounded-[20px] bg-panel p-4">
              <IconTile icon="refresh" bg="#e9e3fc" size={44} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap"><p className="text-[14px] font-bold text-ink">{[p.insurer, p.productName].filter(Boolean).join(' ')}</p><p className="text-[12px] font-medium text-muted">Cycle starts when the policy is issued</p></div>
              <SChip tone="gray" icon="clock">Upcoming</SChip>
            </div>
          ))}
        </section>
      )}
      {!q.loading && !rows.length && !upcoming.length && <Empty>No renewals yet. A renewal cycle starts when a policy is issued.</Empty>}
    </>
  )
}

/* ───────── 05i · Activities (customer + its quotations and policies: gap G-A1) ───────── */
const ACT_FILTERS = ['All', 'Quotations', 'Payments', 'Documents', 'Messages', 'Consent']
const ACT_KIND = (e) => (/PAYMENT/.test(e.action) ? 'Payments' : /QUOTATION|COMPARISON/.test(e.action) ? 'Quotations' : /DOCUMENT/.test(e.action) ? 'Documents' : /CONSENT/.test(e.action) ? 'Consent' : /MESSAGE|COMM|SHARE/.test(e.action) ? 'Messages' : 'Other')
const ACT_ICON = { Payments: ['card', '#d4f1e7'], Quotations: ['quote', '#e9e3fc'], Documents: ['folder', '#fde8c9'], Consent: ['check', '#e7f4ee'], Messages: ['chat', '#d9eafd'], Other: ['refresh', '#eef1f5'] }
export function LiveCustomerActivities() {
  return <TabPage tab="activities" crumb="ACTIVITIES">{(live, id) => <ActivitiesTab id={id} live={live} />}</TabPage>
}
function ActivitiesTab({ id, live }) {
  const { can } = useAuth()
  const [filter, setFilter] = useState('All')
  // B-05: the advisor reads /audit?customerId=; B-06: assistants read /customers/:id/activity (no old/new values).
  const q = useQuery(['activity', id], () => (!can || can('audit.view') ? api.audit.list({ customerId: id, limit: 100 }) : api.customers.activity(id, { limit: 100 })))
  const rows = (q.data || []).map((e) => ({ ...e, kind: ACT_KIND(e) })).filter((e) => filter === 'All' || e.kind === filter)
  const groups = []
  for (const e of rows) {
    const d = daysFromToday(e.at)
    const day = d === 0 ? 'TODAY' : d === -1 ? 'YESTERDAY' : fmtDate(e.at).toUpperCase()
    if (groups.at(-1)?.day !== day) groups.push({ day, items: [] })
    groups.at(-1).items.push(e)
  }
  return (
    <>
      <PillTabs items={ACT_FILTERS.map((f) => ({ key: f, label: f }))} value={filter} onChange={setFilter} />
      <section className={cx('mt-[22px] flex flex-col gap-1.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        {q.loading && !q.data && <Loading />}
        {groups.map((g) => (
          <div key={g.day} className="contents">
            <p className="px-2 pt-2.5 pb-1 text-[11px] font-bold tracking-[0.4px] text-muted">{g.day}</p>
            {g.items.map((i) => {
              const [icon, bg] = ACT_ICON[i.kind]
              return (
                <div key={i.id} className="flex h-14 items-center gap-3.5 rounded-[16px] p-2 hover:bg-panel">
                  <IconTile icon={icon} bg={bg} size={40} iconSize={18} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                    <p className="text-[14px] font-bold text-ink">{label(i.action)}{i.entityRef ? ` · ${i.entityRef}` : ''}</p>
                    <p className="text-[12px] font-medium text-muted">{i.actorName ?? 'System'} · {fmtTime(i.at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        {!q.loading && !groups.length && <p className="px-2 py-4 text-[13px] font-medium text-muted">{filter === 'All' ? 'No activity yet.' : `No ${filter.toLowerCase()} activity yet.`}</p>}
      </section>
    </>
  )
}