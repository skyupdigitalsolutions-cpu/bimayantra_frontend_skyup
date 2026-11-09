// Policy-holder tab bodies (Overview, Family, Documents, Vehicles, Policies, Activities)
// layered on the shared profile shell from flow-consent.
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Dropdown } from '../../components/pickers'
import { ProfileShell, PageHeading, SmallBtn, Btn } from '../flow-consent/_parts'
import { holder } from '../../data/flow-consent'
import { overviewStats, overviewCounts, details, address, household, openItems, familyMembers, documentGroups } from '../../data/flow-tab-actions'

export const CARD = 'rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

export function CardHead({ title, sub, right, className = '' }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">{title}</p>
        {sub && <p className="text-[12px] font-medium text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function Chip({ icon, className = '', children }) {
  return (
    <span className={cx('inline-flex h-[25px] w-fit shrink-0 items-center gap-[5px] rounded-[14px] px-3 text-[12px] font-semibold whitespace-nowrap', icon && 'pl-2', className)}>
      {icon && <Icon name={icon} size={13} />}{children}
    </span>
  )
}

/* ───────────── Overview (large hero) ───────────── */

export function OverviewHero() {
  return (
    <section className="mt-[13px] flex h-[144px] items-center gap-6 rounded-[32px] bg-pink-hero px-8 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
      <span className="flex size-[92px] items-center justify-center rounded-full border-4 border-white bg-white text-[29px] font-bold text-navy">{holder.initials}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">{holder.name}</p>
        <p className="text-[13px] font-medium text-rose-ink">{holder.about}</p>
        <div className="flex gap-2">
          <Chip icon="check" className="bg-[#e7f4ee] text-[#127650]">WhatsApp consent</Chip>
          <Chip icon="link" className="bg-[#eef1f5] text-ink-2">Referred by Shanthi Rao</Chip>
        </div>
      </div>
      {overviewStats.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-0.5 rounded-[20px] bg-white/80 px-5 py-3.5">
          <p className="text-[12px] font-semibold text-rose-ink">{k}</p>
          <p className="text-[20px] font-bold text-ink">{v}</p>
        </div>
      ))}
    </section>
  )
}

function KV({ k, v, className = 'w-[220px]' }) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <p className="text-[12px] font-medium text-muted">{k}</p>
      <p className="text-[14px] font-semibold text-ink">{v}</p>
    </div>
  )
}

function MaskedRow({ label, value, shown, onShow, timer }) {
  return (
    <div className={cx('flex items-center gap-3 rounded-[18px] py-3 pr-3 pl-4', shown ? 'border border-[#f1d9a8] bg-[#fff9ef]' : 'bg-panel')}>
      <Icon name="lock" size={18} className="text-muted" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[12px] font-medium text-muted">{label}</p>
        <p className="text-[16px] font-bold tracking-[0.6px] text-ink">{value}</p>
      </div>
      {shown ? (
        <Chip icon="clock" className="bg-[#fbf1e1] text-[#8a5a12]">Hides in {timer}</Chip>
      ) : (
        <SmallBtn variant="outline" icon="eye" onClick={onShow} className="pr-3.5">Show</SmallBtn>
      )}
    </div>
  )
}

/**
 * Overview tab. `panShown` = seconds left (number) when PAN is revealed.
 */
export function OverviewBody({ pan, onShowPan, onShowAadhaar }) {
  const shown = pan != null
  const timer = shown ? `0:${String(pan).padStart(2, '0')}` : ''
  return (
    <div className="flex items-start gap-5">
      <div className="flex w-[760px] flex-col gap-5">
        <section className={cx(CARD, 'flex flex-col gap-4 p-6')}>
          <CardHead title="Details" sub="Contact, address and dates" right={<SmallBtn icon="edit" to="/x/pe1-edit-details">Edit</SmallBtn>} />
          <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
            {details.map(([k, v]) => <KV key={k} k={k} v={v} />)}
          </div>
          <KV k="Address" v={address} className="" />
        </section>
        <section className={cx(CARD, 'flex flex-col gap-4 p-6')}>
          <CardHead title="Household" sub="3 members · default nominee Arjun Hegde" />
          <div className="flex gap-3.5">
            {household.map((m) => (
              <Link key={m.name} to="/x/05a-customer-family" className="flex h-[68px] w-[224px] items-center gap-3 rounded-[22px] bg-panel pr-4 pl-3">
                <span className="flex size-11 items-center justify-center rounded-full border-2 border-white text-[14px] font-bold text-navy" style={{ background: m.av }}>{m.initials}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-ink">{m.name}</span>
                  <span className={cx('text-[12px] font-medium', m.warn ? 'text-[#b4323c]' : 'text-muted')}>{m.sub}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className="flex w-[400px] flex-col gap-5">
        <section className={cx(CARD, 'flex flex-col gap-4 p-6')}>
          <CardHead title="Identity numbers" sub="From confirmed documents" right={<Chip icon="check" className="bg-[#e7f4ee] text-[#127650]">Consent given</Chip>} />
          <MaskedRow label="PAN" value={shown ? 'ABCPH1234K' : 'ABCXX1234X'} shown={shown} timer={timer} onShow={onShowPan} />
          <MaskedRow label="Aadhaar" value="XXXX XXXX 1234" onShow={onShowAadhaar} />
          <p className="text-[12px] leading-[18px] font-medium text-muted">Showing a full number is recorded. It hides again after 30 seconds.</p>
          {shown && (
            <div className="flex items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4 py-3">
              <Icon name="eye" size={16} className="shrink-0 text-[#8a5a12]" />
              <p className="text-[13px] font-semibold text-[#8a5a12]">Shown to you at 10:42. This view is recorded in the activity log.</p>
            </div>
          )}
        </section>
        <section className={cx(CARD, 'flex flex-col gap-4 p-6')}>
          <CardHead title="Open items" />
          {openItems.map((it) => (
            <div key={it.title} className="flex h-10 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink" style={{ background: it.bg }}><Icon name={it.icon} size={18} /></span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13px] font-bold text-ink">{it.title}</span>
                <span className="text-[12px] font-medium text-muted">{it.sub}</span>
              </span>
              <Chip className={it.chipCls}>{it.chip}</Chip>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export function OverviewPage({ overlay, ...body }) {
  return (
    <ProfileShell
      tab="overview"
      counts={overviewCounts}
      heading={<PageHeading crumb="POLICY HOLDERS  /  KAVYA HEGDE" />}
      hero={<OverviewHero />}
      tabsClass="mt-5"
      bodyClass="mt-7"
      overlay={overlay}
    >
      <OverviewBody {...body} />
    </ProfileShell>
  )
}

/** Generic tab page (compact hero) for Family / Documents / Vehicles / Policies / Activities. */
export function TabPage({ tab, crumb, counts, overlay, children, bodyClass }) {
  return (
    <ProfileShell tab={tab} counts={counts} crumb={`POLICY HOLDERS  /  KAVYA HEGDE  /  ${crumb}`} overlay={overlay} bodyClass={bodyClass}>
      {children}
    </ProfileShell>
  )
}

export function SelectBox({ value, onChange, options, className = '' }) {
  return (
    <Dropdown value={value} onChange={onChange} options={options} className={cx('w-full', className)} />
  )
}

export function Field({ label, hint, className = '', children }) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <p className="text-[13px] font-semibold text-ink">{label}</p>
      {children}
      {hint}
    </div>
  )
}

export function Avatar({ initials, bg, size = 36, text = 12, className = '' }) {
  return (
    <span
      className={cx('flex shrink-0 items-center justify-center rounded-full border-2 border-white font-bold text-navy', className)}
      style={{ background: bg, width: size, height: size, fontSize: text }}
    >
      {initials}
    </span>
  )
}

/* ───────────── Family tab ───────────── */

const DOC_CHIP = {
  check: 'bg-[#e7f4ee] text-[#127650]',
  folder: 'bg-[#eef1f5] text-ink-2',
  alert: 'bg-[#fbebec] text-[#b4323c]',
}

function MemberCard({ m }) {
  const head = (
    <div className="flex h-[52px] items-center gap-3.5">
      <Avatar initials={m.initials} bg={m.av} size={52} text={17} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[15px] font-bold text-ink">{m.name}</p>
        <p className="text-[12px] font-medium text-muted">{m.sub}</p>
      </div>
      {m.edit
        ? <Link to={m.edit} aria-label="Edit member" className="text-muted"><Icon name="more" size={18} /></Link>
        : <Icon name="more" size={18} className="text-muted" />}
    </div>
  )
  return (
    <section className={cx(CARD, 'flex w-[370px] flex-col gap-3.5 p-6')}>
      {m.to ? <Link to={m.to}>{head}</Link> : head}
      <div className="flex gap-2.5">
        <span className="flex h-[35px] w-[156px] items-center gap-2 rounded-[14px] bg-panel px-3">
          <Icon name="calendar" size={15} className="text-muted" />
          {m.dob
            ? <span className="text-[12px] font-semibold text-ink">{m.dob}</span>
            : <Link to="/x/pf3-edit-family-member" className="text-[12px] font-semibold text-[#b4323c]">Add date of birth</Link>}
        </span>
        <span className="flex h-[35px] w-[156px] items-center gap-2 rounded-[14px] bg-panel px-3">
          <Icon name="phone" size={15} className="text-muted" />
          <span className="text-[12px] font-semibold text-ink">{m.mobile}</span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[12px] font-bold text-muted">Documents</p>
          <Link to={m.addTo ?? '/x/fd4-add-document-which-document'} className="flex items-center gap-1 text-[12px] font-bold text-blue">
            <Icon name="plus" size={13} />Document
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {m.docs.length === 0 && <p className="text-[12px] font-medium text-faint">No documents yet</p>}
          {m.docs.map(([ic, t]) => <Chip key={t} icon={ic} className={DOC_CHIP[ic]}>{t}</Chip>)}
        </div>
      </div>
    </section>
  )
}

export function FamilyBody() {
  return (
    <div className="flex items-start gap-5">
      <div className="flex w-[760px] flex-wrap items-start gap-5">
        {familyMembers.map((m) => <MemberCard key={m.key} m={m} />)}
      </div>
      <div className="flex w-[400px] flex-col">
        <section className={cx(CARD, 'flex flex-col gap-3 bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7] p-6')}>
          <CardHead title="Default nominee" right={<SmallBtn variant="outline" to="/x/pf1-change-default-nominee">Change</SmallBtn>} />
          <div className="flex items-center gap-3">
            <Avatar initials="AH" bg="#ffffff" size={44} text={14} />
            <span className="flex flex-col gap-0.5">
              <span className="text-[14px] font-bold text-ink">Arjun Hegde</span>
              <span className="text-[12px] font-medium text-[#2f6b55]">Spouse · 100%</span>
            </span>
          </div>
          <p className="text-[12px] font-medium text-[#2f6b55]">Suggested on new proposals only. Never changes a policy.</p>
        </section>
        <section className={cx(CARD, 'mt-[33px] flex flex-col gap-3 p-6')}>
          <CardHead title="Linked customers" right={<SmallBtn variant="outline" icon="link" to="/x/pf2-link-a-policy-holder" className="pr-3.5">Link</SmallBtn>} />
          <div className="flex w-fit items-center gap-3 rounded-[16px] bg-panel p-3">
            <Avatar initials="SR" bg="#e9e3fc" size={38} />
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-bold text-ink">Shanthi Rao</span>
              <span className="text-[12px] font-medium text-muted">Parent · CU-000322</span>
            </span>
          </div>
        </section>
        <div className="mt-3 flex flex-col gap-2.5">
          <Btn variant="pink" icon="user-plus" to="/x/fd1-add-family-member" className="flex-none">Add family member</Btn>
          <Btn icon="upload" to="/x/fd3-add-document-whose-document" className="flex-none">Add document</Btn>
        </div>
      </div>
    </div>
  )
}

export function FamilyPage({ overlay }) {
  return (
    <TabPage tab="family" crumb="FAMILY" overlay={overlay}>
      <FamilyBody />
    </TabPage>
  )
}

/* ───────────── Documents tab ───────────── */

const DOC_STATUS = {
  unconfirmed: <Chip icon="alert" className="bg-[#fbf1e1] text-[#8a5a12]">Unconfirmed</Chip>,
  confirmed: <Chip icon="check" className="bg-[#e7f4ee] text-[#127650]">Confirmed</Chip>,
  saved: <Chip className="bg-[#eef1f5] text-ink-2">Saved</Chip>,
}

export function DocumentsBody() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-10 w-fit items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4">
        <Icon name="alert" size={16} className="text-[#8a5a12]" />
        <p className="text-[13px] font-semibold text-[#8a5a12]">Missing for Shanta Hegde: Aadhaar and PAN. Needed before a proposal that covers her.</p>
      </div>
      <div className="flex items-start gap-5">
        <section className={cx(CARD, 'flex w-[760px] flex-col gap-3 p-6')}>
          <CardHead title="Documents" sub="Never deleted. A new upload of the same type adds a version." />
          {documentGroups.map((g) => (
            <div key={g.owner} className="flex flex-col gap-3">
              <p className="text-[11px] font-bold tracking-[0.4px] text-muted">{g.owner}</p>
              {g.docs.map((d) => (
                <div key={d.title} className="flex h-20 items-center gap-3.5 rounded-[18px] bg-panel px-3.5">
                  <span className="flex h-[52px] w-11 items-center justify-center rounded-[12px] text-ink" style={{ background: d.bg }}><Icon name="folder" size={18} /></span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-ink">{d.title}</span>
                    <span className="text-[12px] font-medium text-muted">{d.sub}</span>
                  </span>
                  {DOC_STATUS[d.status]}
                  {d.check && <SmallBtn variant="navy" to={d.check} className="text-white">Check values</SmallBtn>}
                  <SmallBtn icon="list" to={d.versions} className="pr-3.5">Versions</SmallBtn>
                </div>
              ))}
            </div>
          ))}
        </section>
        <section className="flex h-[225px] w-[400px] flex-col items-center gap-3 rounded-[28px] border border-dashed border-[#c3ccd8] bg-white p-7">
          <span className="flex size-[60px] items-center justify-center rounded-full bg-[#e8f0fd] text-blue"><Icon name="upload" size={26} /></span>
          <p className="text-[16px] font-bold text-ink">Upload a document</p>
          <p className="text-[12px] font-medium text-muted">PDF, JPG or PNG · file or camera</p>
          <div className="flex gap-2">
            <SmallBtn variant="navy" icon="folder" to="/x/fd3-add-document-whose-document" className="pr-3.5 text-white">Choose file</SmallBtn>
            <SmallBtn variant="outline" icon="phone" to="/x/fd3-add-document-whose-document" className="pr-3.5">Camera</SmallBtn>
          </div>
        </section>
      </div>
    </div>
  )
}

export function DocumentsPage({ overlay }) {
  return (
    <TabPage tab="documents" crumb="DOCUMENTS" overlay={overlay}>
      <DocumentsBody />
    </TabPage>
  )
}

/* ───────────── Vehicles tab ───────────── */

const NEEDS = [['folder', 'RC'], ['eye', 'Front'], ['eye', 'Rear'], ['eye', 'Left'], ['eye', 'Right'], ['eye', 'Odometer']]

function PhotoChecklist() {
  return (
    <section className={cx(CARD, 'flex w-[400px] flex-col gap-3.5 p-6')}>
      <CardHead title="What you’ll need" sub="For each vehicle" />
      <div className="flex w-[352px] flex-wrap gap-2">
        {NEEDS.map(([ic, t]) => (
          <div key={t} className="flex h-[63px] w-[108px] flex-col items-center gap-1.5 rounded-[16px] bg-panel p-3">
            <Icon name={ic} size={18} className="text-muted" />
            <span className="text-[12px] font-semibold text-ink">{t}</span>
          </div>
        ))}
      </div>
      <p className="text-[12px] leading-[18px] font-medium text-muted">RC plus 4 photos minimum. Registration number checked against the RC format.</p>
    </section>
  )
}

function VehiclesEmpty() {
  return (
    <section className={cx(CARD, 'flex h-[321px] w-[760px] flex-col items-center gap-3.5 rounded-[32px] p-10')}>
      <span className="flex size-[84px] items-center justify-center rounded-full bg-linear-to-b from-[#d9eafd] to-[#c2dbfb] text-blue"><Icon name="car" size={38} /></span>
      <p className="text-[20px] font-bold text-ink">No vehicles yet</p>
      <p className="w-[440px] text-center text-[14px] leading-[22px] font-medium text-muted">Add a vehicle with its RC and at least 4 photos to quote motor insurance for Kavya.</p>
      <Btn variant="pink" icon="plus" to="/x/pv1-add-vehicle" className="flex-none">Add vehicle</Btn>
    </section>
  )
}

function VehicleCard() {
  return (
    <section className={cx(CARD, 'flex w-[760px] flex-col gap-3.5 p-6')}>
      <div className="flex h-[52px] items-center gap-3.5">
        <span className="flex size-[52px] items-center justify-center rounded-full bg-[#d9eafd] text-blue"><Icon name="car" size={24} /></span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[17px] font-bold text-ink">KA 01 MX 4521</span>
          <span className="text-[12px] font-medium text-muted">Hyundai Creta SX · 2022 · Private car</span>
        </span>
        <Chip icon="check" className="bg-[#e7f4ee] text-[#127650]">5 of 6 photos</Chip>
        <SmallBtn variant="navy" icon="quote" to="/x/q1-quotation-customer" className="pr-3.5 text-white">Motor quotation</SmallBtn>
        <SmallBtn icon="x" to="/x/vh1-vehicle-mark-inactive" className="pr-3.5">Mark inactive</SmallBtn>
      </div>
      <div className="flex gap-2">
        {['RC', 'Front', 'Rear', 'Left', 'Right'].map((t) => (
          <div key={t} className="flex h-[52px] w-[110px] flex-col items-center gap-1 rounded-[12px] bg-panel p-2.5">
            <Icon name="check" size={14} className="text-[#127650]" />
            <span className="text-[11px] font-semibold text-ink">{t}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function VehiclesPage({ added, overlay }) {
  return (
    <TabPage tab="vehicles" crumb="VEHICLES" counts={added ? { vehicles: 1 } : undefined} overlay={overlay}>
      <div className="flex items-start gap-5">
        {added ? <VehicleCard /> : <VehiclesEmpty />}
        <PhotoChecklist />
      </div>
    </TabPage>
  )
}

/* ───────────── Policies tab ───────────── */

const POLICIES = [
  {
    name: 'Star Health FamilySure', no: '2245/88/26/0001842', bg: '#d4f1e7', progress: 0.9, dates: '04 Dec 2025 → 03 Dec 2026',
    chip: <Chip icon="check" className="bg-[#e7f4ee] text-[#127650]">Issued</Chip>,
    kv: [['Premium', '₹21,340'], ['Status', 'Renews in 38 days'], ['Insured', 'Kavya, Arjun, Anya']],
    action: <SmallBtn variant="outline" icon="users" to="/x/pp1-edit-policy-nominees" className="pr-3.5">Edit nominees</SmallBtn>,
  },
  {
    name: 'Niva Bupa CareFirst Family · Gold', no: 'Number pending · PL-000071', bg: '#e9e3fc', progress: 0, dates: '10 Nov 2026 → 09 Nov 2027',
    chip: <Chip icon="clock" className="bg-[#f0ecfb] text-[#5b3fb8]">Awaiting issuance</Chip>,
    kv: [['Premium', '₹18,054'], ['Status', 'Submitted 26 Oct'], ['Insured', 'Kavya, Arjun, Anya']],
    action: <SmallBtn variant="outline" icon="shield" to="/x/l1-record-issued-policy" className="pr-3.5">Record issued policy</SmallBtn>,
  },
]

export function PoliciesPage({ overlay }) {
  return (
    <TabPage tab="policies" crumb="POLICIES" overlay={overlay}>
      <div className="flex gap-5">
        {POLICIES.map((p) => (
          <section key={p.name} className={cx(CARD, 'flex w-[580px] flex-col gap-4 p-6')}>
            <div className="flex h-[52px] items-center gap-3.5">
              <span className="flex size-[52px] items-center justify-center rounded-full text-ink" style={{ background: p.bg }}><Icon name="shield" size={24} /></span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[16px] font-bold text-ink">{p.name}</span>
                <span className="text-[12px] font-medium text-muted">{p.no}</span>
              </span>
              {p.chip}
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 rounded-[5px] bg-panel">
                {p.progress > 0 && <div className="h-2.5 rounded-[5px] bg-[#16845b]" style={{ width: `${p.progress * 100}%` }} />}
              </div>
              <p className="text-[12px] font-semibold text-ink-2">{p.dates}</p>
            </div>
            <div className="flex gap-2.5">
              {p.kv.map(([k, v]) => (
                <div key={k} className="flex h-14 flex-1 flex-col gap-0.5 rounded-[14px] bg-panel p-3">
                  <span className="text-[11px] font-medium text-muted">{k}</span>
                  <span className="text-[13px] font-bold text-ink">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <SmallBtn variant="navy" icon="arrow" to="/policies/1" className="pr-3.5 text-white">Open policy</SmallBtn>
              {p.action}
            </div>
          </section>
        ))}
      </div>
      <Btn variant="pink" icon="plus" to="/x/pp2-record-existing-policy" className="mt-[59px] w-fit flex-none">Record existing policy</Btn>
    </TabPage>
  )
}
