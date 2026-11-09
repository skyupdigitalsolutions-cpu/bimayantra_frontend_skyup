// 05a–05i · Customer profile tabs, CU1/CU2 deactivate and reactivate, on the live API.
// Every tab shares the real profile header (useCustomerShell). Each tab body matches the current Figma
// (05a Family … 05i Activities) while keeping the live data wiring and the add/edit flows (FD*, PF*, CS*, PV*, PP*).
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { RecordConsentDialog, WithdrawConsentDialog } from './Consent'
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

/* ───────── 05a · Family (55:8054) ───────── */
export function LiveCustomerFamily() {
  return (
    <TabPage tab="family" crumb="FAMILY">
      {(live, id) => <FamilyTab live={live} id={id} />}
    </TabPage>
  )
}

/** ⋯ menu on a member card header (Edit / Add document / Make inactive). */
function MoreMenu({ items = [] }) {
  const [open, setOpen] = useState(false)
  const real = items.filter(Boolean)
  if (!real.length) return <Icon name="more" size={18} className="text-muted" />
  return (
    <div className="relative shrink-0">
      <button type="button" aria-label="More" onClick={() => setOpen((o) => !o)} className="flex size-[18px] items-center justify-center text-muted hover:text-ink">
        <Icon name="more" size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-7 right-0 z-30 flex w-[190px] flex-col rounded-[16px] bg-white p-1.5 shadow-[0px_16px_30px_-10px_rgba(19,41,75,0.25)]">
            {real.map((it) => (
              <button key={it.label} type="button" onClick={() => { setOpen(false); it.onClick() }}
                className={cx('rounded-[12px] px-3 py-2 text-left text-[13px] font-semibold hover:bg-panel', it.danger ? 'text-[#b4323c]' : 'text-ink')}>{it.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FamilyMemberCard({ name, sub, inactive, info, chips, menuItems, onAddDoc, canAct }) {
  return (
    <div className={cx('flex w-[370px] flex-col gap-3.5 rounded-[28px] bg-white p-6', CARD_SHADOW, inactive && 'opacity-60')}>
      <div className="flex items-center gap-3.5">
        <Dot initials={initials(name)} bg={avatarHex(name)} size={52} font={17} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
          <p className="text-[15px] font-bold text-ink">{name}</p>
          <p className="text-[12px] font-medium text-muted">{sub}</p>
        </div>
        {canAct ? <MoreMenu items={menuItems} /> : <Icon name="more" size={18} className="text-muted" />}
      </div>
      <div className="flex gap-2.5">
        {info.map(([icon, v, warn]) => (
          <div key={icon} className="flex flex-1 items-center gap-2 rounded-[14px] bg-panel px-3 py-2.5">
            <Icon name={icon} size={15} className="text-muted" />
            <span className={cx('text-[12px] font-semibold whitespace-nowrap', warn ? 'text-[#b4323c]' : 'text-ink')}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[12px] font-bold text-muted">Documents</p>
          {canAct && onAddDoc && (
            <button type="button" onClick={onAddDoc} className="flex items-center gap-1 text-[12px] font-bold text-blue hover:underline"><Icon name="plus" size={13} />Document</button>
          )}
        </div>
        {chips.length
          ? <div className="flex flex-wrap gap-1.5">{chips.map((d) => <SChip key={d.label} tone={d.tone} icon={d.icon}>{d.label}</SChip>)}</div>
          : <p className="text-[12px] font-medium text-faint">No documents yet</p>}
      </div>
    </div>
  )
}

function FamilyTab({ live, id }) {
  const navigate = useNavigate()
  const [dlg, setDlg] = useState(null)
  const links = useQuery(['links', id], () => api.customers.links(id))
  const nominee = useQuery(['default-nominee', id], () => api.customers.defaultNominee(id))
  const docs = useQuery(['documents', id], () => api.customers.documents(id))
  const members = live.raw.family || []
  // Missing required documents per person — only when the payload reports them (shape guarded).
  const missingFor = (personKey) => {
    const m = docs.data?.missing
    if (!m) return []
    const byPerson = m.byPerson?.[personKey]
    if (Array.isArray(byPerson)) return byPerson.map((t) => `${label(t)} missing`)
    if (Array.isArray(m.items)) {
      return m.items
        .filter((it) => it && typeof it === 'object' && it.personKey === personKey)
        .flatMap((it) => (it.types || [it.type]).filter(Boolean).map((t) => `${label(t)} missing`))
    }
    return []
  }
  const chipsFor = (personKey) => {
    const present = (docs.data?.groups || []).filter((g) => g.personKey === personKey).map((g) => {
      const ok = g.versions[0]?.status === 'CONFIRMED'
      return { label: g.name || label(g.type), tone: ok ? 'green' : 'gray', icon: ok ? 'check' : 'folder' }
    })
    return [...present, ...missingFor(personKey).map((l) => ({ label: l, tone: 'red', icon: 'alert' }))]
  }
  const age = live.raw.age
  return (
    <div className="flex items-start gap-5">
      <div className="flex w-[760px] flex-wrap items-start gap-5">
        {/* The policy holder's own "Self" card, first. */}
        <FamilyMemberCard
          name={live.raw.name}
          sub={`Self${age != null ? ` · ${age}` : ''}`}
          canAct={live.active}
          info={[['calendar', live.raw.dob ? fmtDate(live.raw.dob) : 'Add date of birth', !live.raw.dob], ['phone', fmtMobile(live.raw.mobile)]]}
          chips={chipsFor(`C:${id}`)}
          onAddDoc={() => setDlg({ kind: 'doc', personKey: `C:${id}` })}
          menuItems={[{ label: 'Edit details', onClick: () => navigate(`/customers/${id}/edit`) }, { label: 'Add document', onClick: () => setDlg({ kind: 'doc', personKey: `C:${id}` }) }]}
        />
        {members.map((m) => {
          const activeM = m.status === 'ACTIVE'
          return (
            <FamilyMemberCard
              key={m.id}
              name={m.name}
              sub={`${m.relationship}${m.age != null ? ` · ${m.age}` : ''}${!activeM ? ' · inactive' : ''}`}
              inactive={!activeM}
              canAct={live.active}
              info={[['calendar', m.dob ? fmtDate(m.dob) : 'Add date of birth', !m.dob], ['phone', m.mobile ? fmtMobile(m.mobile) : 'No mobile']]}
              chips={chipsFor(`F:${m.id}`)}
              onAddDoc={activeM ? () => setDlg({ kind: 'doc', personKey: `F:${m.id}` }) : null}
              menuItems={activeM
                ? [{ label: 'Edit', onClick: () => setDlg({ kind: 'edit', member: m }) }, { label: 'Add document', onClick: () => setDlg({ kind: 'doc', personKey: `F:${m.id}` }) }, { label: 'Make inactive', danger: true, onClick: () => setDlg({ kind: 'status', member: m }) }]
                : [{ label: 'Make active', onClick: () => setDlg({ kind: 'status', member: m }) }]}
            />
          )
        })}
      </div>

      <div className="flex w-[400px] flex-col gap-[33px]">
        <section className={cx('flex flex-col gap-3 rounded-[28px] bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7] p-6', CARD_SHADOW)}>
          <Head title="Default nominee" right={live.active && <PillButton variant="outline" size="sm" className="px-3.5" onClick={() => setDlg({ kind: 'nominee' })}>{nominee.data?.defaultNominee ? 'Change' : 'Set'}</PillButton>} />
          {nominee.data?.defaultNominee ? (
            <>
              <div className="flex items-center gap-3">
                <Dot initials={initials(nominee.data.defaultNominee.name)} bg="#ffffff" size={44} font={14} />
                <div className="flex min-w-0 flex-col gap-0.5 whitespace-nowrap">
                  <p className="text-[14px] font-bold text-ink">{nominee.data.defaultNominee.name}</p>
                  <p className="text-[12px] font-medium text-[#2f6b55]">{nominee.data.defaultNominee.relationship} · 100%</p>
                </div>
              </div>
              <p className="text-[12px] font-medium text-[#2f6b55]">Suggested on new proposals only. Never changes a policy.</p>
            </>
          ) : (
            <p className="text-[12px] font-medium text-[#2f6b55]">No default nominee yet. Suggested on new proposals only.</p>
          )}
        </section>

        <section className={cx('flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Linked customers" right={live.active && <PillButton variant="outline" size="sm" icon="link" onClick={() => setDlg({ kind: 'link' })}>Link</PillButton>} />
          {(links.data || []).map((l) => (
            <div key={l.id} className="flex items-center gap-3 rounded-[16px] bg-panel p-3">
              <Dot initials={initials(l.customer.name)} bg={avatarHex(l.customer.name)} size={38} font={12} />
              <Link to={`/customers/${l.customer.id}`} className="flex min-w-0 flex-1 flex-col whitespace-nowrap">
                <span className="truncate text-[13px] font-bold text-ink">{l.customer.name}</span>
                <span className="text-[12px] font-medium text-muted">{l.relationship} · {l.customer.number}</span>
              </Link>
              {live.active && <UnlinkButton customer={live.raw} link={l} />}
            </div>
          ))}
          {links.data && !links.data.length && <p className="text-[13px] font-medium text-muted">Nobody linked yet.</p>}
        </section>

        {live.active && (
          <div className="flex flex-col gap-2.5">
            <PillButton variant="pink" icon="user-plus" className="w-full justify-center" onClick={() => setDlg({ kind: 'add' })}>Add family member</PillButton>
            <PillButton variant="outline" icon="upload" className="w-full justify-center" onClick={() => setDlg({ kind: 'doc' })}>Add document</PillButton>
          </div>
        )}
      </div>

      {dlg?.kind === 'add' && <FamilyDialog customerId={id} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'edit' && <FamilyDialog customerId={id} member={dlg.member} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'status' && <FamilyStatusDialog customerId={id} member={dlg.member} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'doc' && <AddDocumentDialog customer={live.raw} people={peopleOf(live.raw)} presetPersonKey={dlg.personKey} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'nominee' && <DefaultNomineeDialog customer={live.raw} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'link' && <LinkHolderDialog customer={live.raw} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05b · Consent (55:8353) ───────── */
const CH_META = [['WHATSAPP', 'WhatsApp'], ['EMAIL', 'Email'], ['SMS', 'SMS']]
const CCHIP = { GIVEN: ['green', 'check', 'Given'], WITHDRAWN: ['red', 'x', 'Withdrawn'], NOT_RECORDED: ['gray', null, 'Not recorded'] }
export function LiveCustomerConsent() {
  return <TabPage tab="consent" crumb="CONSENT">{(live, id) => <ConsentTab id={id} live={live} />}</TabPage>
}
function ConsentTab({ id, live }) {
  const [dlg, setDlg] = useState(null)
  const people = peopleOf(live.raw)
  const q = useQuery(['consents', id], () => api.customers.consents(id))
  const rows = q.data?.rows || []
  const history = q.data?.history || []
  const pd = live.raw.personalDataConsent
  const given = pd === 'GIVEN'
  // Personal-data grant detail from the newest matching history entry (its fields are guarded).
  const pdGrant = history.find((h) => h.channel === 'PERSONAL_DATA' && h.to === 'GIVEN')
  const pdDetail = given
    ? [pdGrant?.at ? fmtDate(pdGrant.at) : null, pdGrant?.howGiven, 'allows PAN, Aadhaar and identity documents'].filter(Boolean).join(' · ')
    : 'Record it before adding PAN or Aadhaar'
  return (
    <div className="flex flex-col gap-6">
      <div className={cx('flex h-[92px] items-center gap-4 rounded-[28px] px-6 py-5', given ? 'bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7]' : 'bg-[#fbf1e1]')}>
        <span className={cx('flex size-[52px] shrink-0 items-center justify-center rounded-full bg-white', given ? 'text-[#127650]' : 'text-[#8a5a12]')}>
          <Icon name={given ? 'lock' : 'alert'} size={24} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[16px] font-bold text-ink">Consent to store personal data: {(CCHIP[pd]?.[2] ?? 'Not recorded').toLowerCase()}</p>
          <p className={cx('text-[12px] font-medium', given ? 'text-[#2f6b55]' : 'text-[#8a5a12]')}>{pdDetail}</p>
        </div>
        {live.active && (given
          ? <PillButton variant="danger" size="sm" className="px-3.5" onClick={() => setDlg({ kind: 'withdraw', person: people[0], channel: 'PERSONAL_DATA' })}>Withdraw</PillButton>
          : <PillButton variant="navy" size="sm" icon="shield" onClick={() => setDlg({ kind: 'pd' })}>Record</PillButton>)}
      </div>

      <div className="flex items-start gap-5">
        <section className={cx('w-[760px] overflow-hidden rounded-[28px] bg-white', CARD_SHADOW)}>
          <div className="flex gap-3 px-[22px] py-[18px] text-[12px] font-semibold text-muted">
            <span className="w-[220px] shrink-0">Person</span>
            {CH_META.map(([, l]) => <span key={l} className="flex-1">{l}</span>)}
          </div>
          {q.loading && !q.data && <div className="px-[22px] pb-4"><Loading /></div>}
          {rows.map((r) => {
            const P = people.find((p) => p.id === r.person.id) || r.person
            return (
              <div key={r.person.id} className="flex flex-col">
                <div className="h-px bg-line" />
                <div className="flex items-center gap-3 px-[22px] py-4">
                  <div className="flex w-[220px] shrink-0 items-center gap-2.5">
                    <Dot initials={initials(r.person.name)} bg={avatarHex(r.person.name)} size={36} font={12} />
                    <div className="flex flex-col gap-px whitespace-nowrap">
                      <p className="text-[13px] font-bold text-ink">{r.person.name}</p>
                      <p className="text-[11px] font-medium text-muted">{r.person.relationship}</p>
                    </div>
                  </div>
                  {CH_META.map(([ch]) => {
                    const v = r.channels?.[ch] ?? { status: 'NOT_RECORDED' }
                    const [tone, icon, txt] = CCHIP[v.status] ?? CCHIP.NOT_RECORDED
                    const isGiven = v.status === 'GIVEN'
                    return (
                      <div key={ch} className="flex flex-1 flex-col items-start gap-1">
                        <SChip tone={tone} icon={icon}>{txt}</SChip>
                        {live.active && (
                          <button type="button" className="text-[11px] font-bold text-blue hover:underline"
                            onClick={() => setDlg(isGiven ? { kind: 'withdraw', person: P, channel: ch } : { kind: 'record', person: P })}>
                            {isGiven ? 'Withdraw' : 'Record'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        <section className={cx('flex w-[400px] flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="History" sub="Who changed what, and how" />
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="size-2.5 shrink-0 rounded-full bg-[#5b3fb8]" />
              <div className="flex min-w-0 flex-col gap-px whitespace-nowrap">
                <p className="text-[13px] font-bold text-ink">
                  {h.channel === 'PERSONAL_DATA' ? 'Personal data consent' : `${label(h.channel)} ${h.to === 'GIVEN' ? 'given' : h.to === 'WITHDRAWN' ? 'withdrawn' : label(h.to)}`}
                  {h.person && h.channel !== 'PERSONAL_DATA' ? ` · ${h.person}` : ''}
                </p>
                <p className="text-[11px] font-medium text-muted">{[fmtDate(h.at, { year: false }), h.howGiven, h.note].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
          ))}
          {!history.length && <p className="text-[13px] font-medium text-muted">{q.loading ? 'Loading…' : 'No consent recorded yet.'}</p>}
        </section>
      </div>

      {dlg?.kind === 'record' && <RecordConsentDialog customer={live.raw} people={people} presetPersonId={dlg.person.id} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'pd' && <RecordConsentDialog customer={live.raw} people={people} presetPersonId={live.raw.id} personalData onClose={() => setDlg(null)} />}
      {dlg?.kind === 'withdraw' && <WithdrawConsentDialog customer={live.raw} person={dlg.person} channel={dlg.channel} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05c · Documents (55:8652) ───────── */
export function LiveCustomerDocuments() {
  return <TabPage tab="documents" crumb="DOCUMENTS">{(live, id) => <DocumentsTab id={id} live={live} />}</TabPage>
}
function DocumentsTab({ id, live }) {
  const [dlg, setDlg] = useState(null)
  const q = useQuery(['documents', id], () => api.customers.documents(id))
  const groups = q.data?.groups || []
  // Group documents under per-person headers, keeping the order they arrive in.
  const byPerson = []
  for (const g of groups) {
    let b = byPerson.find((x) => x.key === g.personKey)
    if (!b) { b = { key: g.personKey, name: g.personName, items: [] }; byPerson.push(b) }
    b.items.push(g)
  }
  return (
    <div className="flex flex-col gap-6">
      {q.data?.missing?.message && <Note icon="alert" bg="#fbf1e1" color="#8a5a12">{q.data.missing.message}</Note>}
      <div className="flex items-start gap-5">
        <section className={cx('flex w-[760px] flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Documents" sub="Never deleted. A new upload of the same type adds a version." />
          {q.loading && !q.data && <Loading />}
          {byPerson.map((b) => (
            <div key={b.key} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold tracking-[0.44px] text-muted">{(b.name || '').toUpperCase()}</p>
              {b.items.map((g) => {
                const v = g.versions[0]
                const uploader = v?.uploadedByName ?? v?.uploaderName ?? v?.uploadedBy
                const confirmed = v?.status === 'CONFIRMED'
                const check = needsCheck(v)
                const [tone, icon, txt] = confirmed ? ['green', 'check', 'Confirmed'] : check ? ['amber', 'alert', 'Unconfirmed'] : ['gray', null, 'Saved']
                return (
                  <div key={`${g.personKey}:${g.type}:${g.name}`} className="flex items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
                    <span className="flex h-[52px] w-11 shrink-0 items-center justify-center rounded-[12px] text-ink" style={{ background: avatarHex(g.name || g.type) }}><Icon name="folder" size={18} /></span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                      <p className="text-[14px] font-bold text-ink">{g.name || label(g.type)}</p>
                      <p className="text-[12px] font-medium text-muted">{[v?.version != null ? `v${v.version}` : null, v?.uploadedAt ? fmtDate(v.uploadedAt, { year: false }) : null, uploader].filter(Boolean).join(' · ')}</p>
                    </div>
                    <SChip tone={tone} icon={icon}>{txt}</SChip>
                    {check && <PillButton variant="navy" size="sm" className="px-3.5" onClick={() => setDlg({ kind: 'verify', vid: v.id })}>Check values</PillButton>}
                    <PillButton variant="ghost" size="sm" icon="list" onClick={() => setDlg({ kind: 'versions', group: g })}>Versions</PillButton>
                  </div>
                )
              })}
            </div>
          ))}
          {!q.loading && !groups.length && <p className="px-2 py-4 text-[13px] font-medium text-muted">No documents yet.</p>}
        </section>

        {live.active && (
          <section className="flex w-[400px] flex-col items-center gap-3 rounded-[28px] border border-dashed border-[#c3ccd8] bg-white p-7">
            <span className="flex size-[60px] items-center justify-center rounded-full bg-[#e8f0fd] text-blue"><Icon name="upload" size={26} /></span>
            <p className="text-[16px] font-bold text-ink">Upload a document</p>
            <p className="text-[12px] font-medium text-muted">PDF, JPG or PNG · file or camera</p>
            <div className="flex gap-2">
              <PillButton variant="navy" size="sm" icon="folder" onClick={() => setDlg({ kind: 'add' })}>Choose file</PillButton>
              <PillButton variant="outline" size="sm" icon="phone" onClick={() => setDlg({ kind: 'add' })}>Camera</PillButton>
            </div>
          </section>
        )}
      </div>

      {dlg?.kind === 'add' && <AddDocumentDialog customer={live.raw} people={peopleOf(live.raw)} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'verify' && <VerifyDialog documentId={dlg.vid} customerId={id} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'versions' && <DocumentVersionsDialog group={dlg.group} canRelabel={live.active} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05d · Vehicles (55:8898) ───────── */
export function LiveCustomerVehicles() {
  return <TabPage tab="vehicles" crumb="VEHICLES">{(live, id) => <VehiclesTab id={id} live={live} />}</TabPage>
}
function VehiclesTab({ id, live }) {
  const [dlg, setDlg] = useState(null)
  const q = useQuery(['vehicles', id], () => api.customers.vehicles(id))
  const rows = q.data?.vehicles || []
  const minPhotos = q.data?.rules?.minPhotos ?? 4
  const slots = q.data?.rules?.slots ?? ['Front', 'Rear', 'Left', 'Right', 'Odometer']
  const checklist = [['folder', 'RC'], ...slots.map((s) => ['eye', s])]
  const first = live.name.split(' ')[0]
  return (
    <div className="flex items-start gap-5">
      <div className="flex w-[760px] flex-col gap-5">
        {q.loading && !q.data && <Loading />}
        {rows.length > 0 ? (
          <div className="flex flex-wrap gap-5">
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
          </div>
        ) : !q.loading && (
          <section className={cx('flex flex-col items-center gap-3.5 rounded-[32px] bg-white p-10', CARD_SHADOW)}>
            <span className="flex size-[84px] items-center justify-center rounded-full bg-linear-to-r from-[#d9eafd] to-[#c2dbfb] text-blue"><Icon name="car" size={38} /></span>
            <p className="text-[20px] font-bold text-ink">No vehicles yet</p>
            <p className="w-[440px] text-center text-[14px] leading-[22px] font-medium text-muted">Add a vehicle with its RC and at least {minPhotos} photos to quote motor insurance for {first}.</p>
            {live.active && <PillButton variant="pink" icon="plus" onClick={() => setDlg({ kind: 'add' })}>Add vehicle</PillButton>}
          </section>
        )}
        {rows.length > 0 && live.active && <PillButton variant="pink" icon="plus" className="self-start" onClick={() => setDlg({ kind: 'add' })}>Add vehicle</PillButton>}
      </div>

      <section className={cx('flex w-[400px] flex-col gap-3.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        <Head title="What you’ll need" sub="For each vehicle" />
        <div className="flex flex-wrap gap-2">
          {checklist.map(([icon, l]) => (
            <div key={l} className="flex h-[63px] w-[108px] flex-col items-center gap-1.5 rounded-[16px] bg-panel p-3">
              <Icon name={icon} size={18} className="text-muted" />
              <span className="text-[12px] font-semibold text-ink">{l}</span>
            </div>
          ))}
        </div>
        <p className="text-[12px] leading-[18px] font-medium text-muted">RC plus {minPhotos} photos minimum. Registration number checked against the RC format.</p>
      </section>

      {dlg?.kind === 'add' && <AddVehicleDialog customer={live.raw} rules={q.data?.rules} tooFewPhotosMessage={q.data?.tooFewPhotosMessage} onClose={() => setDlg(null)} />}
      {dlg?.kind === 'status' && <VehicleStatusDialog vehicle={dlg.vehicle} onClose={() => setDlg(null)} />}
    </div>
  )
}

/* ───────── 05e · Quotations (55:9116) ───────── */
const Q_CHIP = { DRAFT: ['gray', 'edit', 'Draft'], READY: ['blue', 'check', 'Ready'], SHARED: ['blue', 'send', 'Shared'], ACCEPTED: ['green', 'check', 'Accepted'], REJECTED: ['red', 'x', 'Rejected'], EXPIRED: ['amber', 'clock', 'Expired'], CANCELLED: ['gray', 'x', 'Cancelled'], SUPERSEDED: ['gray', 'x', 'Superseded'] }
const Q_TILE = { ACCEPTED: '#e7f4ee', SHARED: '#e8f0fd', READY: '#e8f0fd', DRAFT: '#eef1f5', REJECTED: '#fbebec', EXPIRED: '#fbf1e1', CANCELLED: '#eef1f5', SUPERSEDED: '#eef1f5' }
export function LiveCustomerQuotations() {
  return <TabPage tab="quotations" crumb="QUOTATIONS">{(live, id) => <QuotationsTab live={live} id={id} />}</TabPage>
}
function QuotationsTab({ live, id }) {
  const first = live.name.split(' ')[0]
  // Comparisons share this list in Figma; include them when the account has any for this customer.
  const comparisons = useQuery(['comparisons', id], () => api.comparisons.list({ customerId: id }))
  const qRows = live.quotes.map((q) => ({
    k: `Q:${q.id}`, to: `/quotations/${q.id}`, icon: 'quote', bg: Q_TILE[q.status] ?? '#e9e3fc',
    title: q.number ?? 'Draft quotation',
    sub: [q.type, q.productName, q.variantName].filter(Boolean).join(' · ') || [q.insurerName, q.productName].filter(Boolean).join(' · ') || 'No product chosen yet',
    mid: q.statusLine ?? (q.validUntil ? `Valid till ${fmtDate(q.validUntil, { year: false })}` : `Updated ${fmtDate(q.updatedAt, { year: false })}`),
    amount: q.premium ? fmtMoney(q.premium) : '—',
    chip: Q_CHIP[q.status] ?? ['gray', null, label(q.status)], at: q.updatedAt ?? q.createdAt,
  }))
  const cRows = (comparisons.data || [])
    .filter((c) => !c.customerId || c.customerId === id)
    .map((c) => ({
      k: `C:${c.id}`, to: `/comparisons/${c.id}`, icon: 'compare', bg: '#e9e3fc',
      title: c.number ?? 'Comparison',
      sub: `Comparison · ${c.optionCount ?? c.options?.length ?? 0} options`,
      mid: c.statusLine ?? (c.chosenLabel ? `${first} chose ${c.chosenLabel}` : label(c.status)),
      amount: '—',
      chip: c.chosenLabel ? ['green', 'check', 'Product chosen'] : ['gray', 'compare', label(c.status)],
      at: c.updatedAt ?? c.createdAt,
    }))
  const rows = [...qRows, ...cRows].sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0))
  return (
    <div className="flex flex-col gap-3.5">
      {rows.map((r) => (
        <Link key={r.k} to={r.to} className={cx('group flex h-[84px] items-center gap-4 rounded-[24px] bg-white px-[22px] py-[18px]', CARD_SHADOW)}>
          <IconTile icon={r.icon} bg={r.bg} />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] whitespace-nowrap">
            <p className="text-[15px] font-bold text-ink">{r.title}</p>
            <p className="text-[12px] font-medium text-muted">{r.sub}</p>
          </div>
          <p className="w-[220px] text-[12px] font-semibold whitespace-nowrap text-ink-2">{r.mid}</p>
          <p className="w-[110px] text-[16px] font-bold whitespace-nowrap text-ink">{r.amount}</p>
          <SChip tone={r.chip[0]} icon={r.chip[1]}>{r.chip[2]}</SChip>
          <Chev />
        </Link>
      ))}
      {!rows.length && <Empty>No quotations for {live.name} yet.</Empty>}
    </div>
  )
}

/* ───────── 05f · Policies (56:8633) ───────── */
const P_CHIP = { AWAITING_ISSUANCE: ['violet', 'clock', 'Awaiting issuance'], ISSUED: ['green', 'check', 'Issued'], EXPIRED: ['amber', 'alert', 'Expired'], RENEWED: ['blue', 'refresh', 'Renewed'], CANCELLED: ['gray', 'x', 'Cancelled'] }
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
            {live.policies.map((p) => {
              const insured = (p.insured || []).map((m) => (m.name || '').split(' ')[0]).filter(Boolean).join(', ')
              const statusText = p.status === 'ISSUED'
                ? (p.renewal?.daysLeft != null ? `Renews in ${p.renewal.daysLeft} days` : p.endDate ? `Ends ${fmtDate(p.endDate)}` : label(p.status))
                : p.status === 'AWAITING_ISSUANCE'
                  ? (p.submittedAt ? `Submitted ${fmtDate(p.submittedAt, { year: false })}` : 'Awaiting issuance')
                  : label(p.status)
              const ref = p.reference ?? p.ref
              const sub = p.policyNumber ? p.policyNumber : `Number pending${ref ? ` · ${ref}` : ''}`
              return (
                <section key={p.id} className={cx('flex w-[580px] flex-col gap-4 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
                  <div className="flex items-center gap-3.5">
                    <IconTile icon="shield" bg={p.status === 'ISSUED' ? '#d4f1e7' : '#e9e3fc'} size={52} iconSize={24} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                      <p className="text-[16px] font-bold text-ink">{[p.insurer, p.productName].filter(Boolean).join(' ') || 'Policy'}</p>
                      <p className="text-[12px] font-medium text-muted">{sub}</p>
                    </div>
                    <SChip tone={P_CHIP[p.status]?.[0] ?? 'gray'} icon={P_CHIP[p.status]?.[1]}>{P_CHIP[p.status]?.[2] ?? label(p.status)}</SChip>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-2.5 overflow-hidden rounded-[5px] bg-panel">{termProgress(p) > 0 && <div className="h-full rounded-[5px] bg-[#16845b]" style={{ width: `${termProgress(p)}%` }} />}</div>
                    <p className="text-[12px] font-semibold text-ink-2">{p.startDate && p.endDate ? `${fmtDate(p.startDate)} → ${fmtDate(p.endDate)}` : 'Dates set when the policy is issued'}</p>
                  </div>
                  <div className="flex gap-2.5">
                    {[['Premium', p.premium ? fmtMoney(p.premium) : '—'], ['Status', statusText], ['Insured', insured || '—']].map(([k, v]) => (
                      <div key={k} className="flex flex-1 flex-col gap-0.5 rounded-[14px] bg-panel p-3 whitespace-nowrap"><p className="text-[11px] font-medium text-muted">{k}</p><p className="text-[13px] font-bold text-ink">{v}</p></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <PillButton variant="navy" size="sm" icon="arrow" to={`/policies/${p.id}`}>Open policy</PillButton>
                    {live.active && p.status === 'ISSUED' && <PillButton variant="outline" size="sm" icon="users" onClick={() => setNomFor(p.id)}>Edit nominees</PillButton>}
                    {live.active && p.status === 'AWAITING_ISSUANCE' && <PillButton variant="outline" size="sm" icon="shield" to={`/policies/${p.id}/issue`}>Record issued policy</PillButton>}
                  </div>
                </section>
              )
            })}
            {!live.policies.length && <Empty className="w-[580px]">No policies for {live.name} yet.</Empty>}
          </div>
          {live.active && <PillButton variant="pink" icon="plus" className="mt-[59px]" to={`/customers/${id}/policies/new`}>Record existing policy</PillButton>}
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

/* ───────── 05g · Payments (56:8884) ───────── */
const PAY_CHIP = { PAID: ['green', 'check', 'Paid'], AWAITING_PAYMENT: ['violet', 'clock', 'Awaiting payment'], FAILED: ['red', 'x', 'Failed'], EXPIRED: ['gray', 'clock', 'Link expired'], REVERSED: ['gray', 'refresh', 'Reversed'], CANCELLED: ['red', 'x', 'Cancelled'] }
const PAY_TILE = { PAID: '#e7f4ee', AWAITING_PAYMENT: '#f0ecfb', FAILED: '#fbebec', CANCELLED: '#fbebec', EXPIRED: '#eef1f5', REVERSED: '#eef1f5' }
export function LiveCustomerPayments() {
  return <TabPage tab="payments" crumb="PAYMENTS">{(live) => <PaymentsTab live={live} />}</TabPage>
}
function PaymentsTab({ live }) {
  const pays = useQuery(['payments', 'customer', live.raw.id], () => api.payments.list({ customerId: live.raw.id, limit: 100 }))
  const rows = pays.data || []
  const amt = (p) => p.amount || p.portalAmount || 0
  const totalRecorded = rows.filter((p) => p.status === 'PAID').reduce((a, p) => a + amt(p), 0)
  const awaiting = rows.filter((p) => p.status === 'AWAITING_PAYMENT').reduce((a, p) => a + amt(p), 0)
  const paidTo = rows.find((p) => p.status === 'PAID')?.insurer ?? rows[0]?.insurer ?? '—'
  const totals = [['#d4f1e7', 'Total recorded', fmtMoney(totalRecorded)], ['#e9e3fc', 'Awaiting', fmtMoney(awaiting)], ['#fde8ec', 'Paid to', paidTo]]
  return (
    <>
      <Note icon="shield" bg="#e7f4ee" color="#127650">{live.name.split(' ')[0]} pays insurers directly. You record each payment on its quotation.</Note>
      <section className={cx('mt-6 flex flex-col gap-2.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        {pays.loading && !pays.data && <Loading />}
        {rows.map((p) => {
          const [tone, icon, txt] = PAY_CHIP[p.status] ?? ['gray', null, label(p.status)]
          return (
            <Link key={p.id} to={`/quotations/${p.quotationId}`} className="group flex items-center gap-4 rounded-[20px] bg-panel p-4">
              <IconTile icon="card" bg={PAY_TILE[p.status] ?? '#d4f1e7'} size={46} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[14px] font-bold text-ink">{[p.quotationNumber, [p.insurer, p.productName].filter(Boolean).join(' ')].filter(Boolean).join(' · ')}</p>
                <p className="text-[12px] font-medium text-muted">{[p.mode, p.reference, p.paymentDate ? fmtDate(p.paymentDate) : fmtDate(p.createdAt)].filter(Boolean).join(' · ')}</p>
              </div>
              <p className="text-[16px] font-bold whitespace-nowrap text-ink">{amt(p) ? fmtMoney(amt(p), { decimals: 2 }) : '—'}</p>
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

/* ───────── 05h · Renewals (56:9120) ───────── */
export function LiveCustomerRenewals() {
  return <TabPage tab="renewals" crumb="RENEWALS">{(live, id) => <RenewalsTab id={id} live={live} />}</TabPage>
}
function RenewalsTab({ id, live }) {
  const q = useQuery(['renewals', id], () => api.renewals.list({ customerId: id }))
  const rows = (q.data || []).slice().sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
  const [first, ...rest] = rows
  const upcoming = live.policies.filter((p) => p.status === 'AWAITING_ISSUANCE')
  const heroSub = (r) => {
    const premium = r.lastPremium ?? r.premium ?? r.policy?.premium
    return [
      r.graceUntil ? `Grace until ${fmtDate(r.graceUntil)}` : null,
      premium != null ? `last premium ${fmtMoney(premium)}` : null,
      r.remindersSent != null ? `${r.remindersSent} of ${r.reminderTotal ?? 6} reminders sent` : null,
    ].filter(Boolean).join(' · ') || label(r.status)
  }
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
            <p className="text-[13px] font-medium text-[#8a5a12]">{heroSub(first)}</p>
            <SChip tone="amber" icon="alert">{label(first.status)}</SChip>
          </div>
          <PillButton variant="outline" size="sm" icon="phone" to={`/renewals?open=${first.id}`}>Log contact</PillButton>
          <PillButton variant="navy" size="sm" icon="quote" to={`/renewals?open=${first.id}`}>Create renewal quotation</PillButton>
        </section>
      )}
      {(rest.length > 0 || upcoming.length > 0) && (
        <section className={cx('mt-12 flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Next in line" />
          {rest.map((r) => (
            <Link key={r.id} to={`/renewals?open=${r.id}`} className="flex items-center gap-3.5 rounded-[20px] bg-panel p-4">
              <IconTile icon="refresh" bg="#e9e3fc" size={44} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap"><p className="text-[14px] font-bold text-ink">{[r.policy?.insurer, r.policy?.product].filter(Boolean).join(' ')}</p><p className="text-[12px] font-medium text-muted">Renews {fmtDate(r.dueDate)}</p></div>
              <SChip tone="gray" icon="clock">{label(r.status)}</SChip>
            </Link>
          ))}
          {upcoming.map((p) => (
            <div key={p.id} className="flex items-center gap-3.5 rounded-[20px] bg-panel p-4">
              <IconTile icon="refresh" bg="#e9e3fc" size={44} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap"><p className="text-[14px] font-bold text-ink">{[p.insurer, p.productName].filter(Boolean).join(' ')}</p><p className="text-[12px] font-medium text-muted">Cycle starts when the policy is issued{p.endDate ? ` · renews ${fmtDate(p.endDate)}` : ''}</p></div>
              <SChip tone="gray" icon="clock">Upcoming</SChip>
            </div>
          ))}
        </section>
      )}
      {!q.loading && !rows.length && !upcoming.length && <Empty>No renewals yet. A renewal cycle starts when a policy is issued.</Empty>}
    </>
  )
}

/* ───────── 05i · Activities (56:9324) ───────── */
const ACT_FILTERS = ['All', 'Quotations', 'Payments', 'Documents', 'Messages', 'Consent']
const ACT_KIND = (e) => (/PAYMENT/.test(e.action) ? 'Payments' : /QUOTATION|COMPARISON/.test(e.action) ? 'Quotations' : /DOCUMENT/.test(e.action) ? 'Documents' : /CONSENT/.test(e.action) ? 'Consent' : /MESSAGE|COMM|SHARE/.test(e.action) ? 'Messages' : 'Other')
const ACT_ICON = { Payments: ['card', '#d4f1e7'], Quotations: ['quote', '#e9e3fc'], Documents: ['folder', '#fde8c9'], Consent: ['check', '#e7f4ee'], Messages: ['chat', '#d9eafd'], Other: ['refresh', '#eef1f5'] }
export function LiveCustomerActivities() {
  return <TabPage tab="activities" crumb="ACTIVITIES">{(live, id) => <ActivitiesTab id={id} live={live} />}</TabPage>
}
function ActivitiesTab({ id }) {
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
