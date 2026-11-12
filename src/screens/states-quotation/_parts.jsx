// Base layout for the Quotation-detail lifecycle states (QS1–QS8) and payment states (PY1–PY5),
// plus the overlay pieces (scrim, dialog, toast) they layer on top.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { PillButton, SChip, SCard, SCardHead, KVItem, Ledger } from '../sales/_parts'
import { quotation as Q } from '../../data/sales'
import { FixedScrim, FixedDialog } from '../catalogue/_overlay'
import { useHeaderSearch } from '../customer-tabs/_search'

export const NAVY_SH = 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]'
export { PillButton, SChip }

/* ───────────── Header ───────────── */

function Search() {
  useHeaderSearch() // Ctrl/Cmd+K focuses the pill (detail pages have no list to filter)
  return (
    <label className="flex h-[50px] w-[240px] items-center gap-2.5 rounded-[25px] bg-white pr-2 pl-[18px] shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
      <Icon name="search" size={18} className="text-muted" />
      <input placeholder="Search anything" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
      <kbd className="rounded-[10px] bg-chip px-2 py-1 font-sans text-[11px] font-semibold text-muted">Ctrl K</kbd>
    </label>
  )
}

export function Header({ chip, actions, breadcrumb = 'QUOTATIONS  /  QT-202610-00012  R2', title = Q.id, subtitle = Q.meta }) {
  return (
    <header className="flex items-start justify-between max-xl:flex-col max-xl:gap-3">
      <div className="flex w-0 flex-1 flex-col gap-1.5 whitespace-nowrap">
        <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre max-xl:whitespace-pre-wrap text-muted">{breadcrumb}</p>
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">{title}</h1>
          {chip}
        </div>
        <p className="text-[14px] font-medium text-muted">{subtitle}</p>
      </div>
      <div className="mt-1 flex shrink-0 items-center gap-3 max-xl:flex-wrap">
        <Search />
        <button type="button" aria-label="Notifications" className="flex size-11 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)] hover:bg-tile">
          <Icon name="bell" size={18.5} />
        </button>
        {actions}
      </div>
    </header>
  )
}

/** Header button set used across states */
export const Btn = {
  edit: () => <PillButton key="edit" variant="outline" icon="edit" className="pl-4" to="/x/q6-quotation-details">Edit</PillButton>,
  cancel: () => <PillButton key="cancel" variant="outline" icon="x" to="/x/qs6-quotation-cancel">Cancel</PillButton>,
  share: () => <PillButton key="share" variant="navy" icon="send" className={NAVY_SH} to="/x/qs2-quotation-share">Share</PillButton>,
  reject: () => <PillButton key="reject" variant="outline" icon="x" to="/x/qs3-quotation-mark-rejected">Mark rejected</PillButton>,
  reviseOutline: () => <PillButton key="revise" variant="outline" icon="edit" to="/x/q6-quotation-details">Revise</PillButton>,
  reviseNavy: () => <PillButton key="revise" variant="navy" icon="edit" className={NAVY_SH} to="/x/qs8-quotation-revise">Revise</PillButton>,
  accept: () => <PillButton key="accept" variant="navy" icon="check" className={NAVY_SH} to="/x/08c-quotation-detail-accepted">Mark accepted</PillButton>,
  acceptLocked: () => (
    <span key="accept" title="Record the payment first" className="flex h-[46px] cursor-not-allowed items-center gap-2 rounded-[24px] bg-[#eef1f5] pr-5 pl-4 text-[14px] font-semibold text-faint">
      <Icon name="lock" size={18} />
      Mark accepted
    </span>
  ),
  duplicate: () => <PillButton key="dup" variant="outline" icon="quote" to="/x/q1-quotation-customer">Duplicate as new</PillButton>,
}

export const CHIPS = {
  ready: <SChip tone="blue" icon="check">Ready</SChip>,
  shared: <SChip tone="blue" icon="send">Shared</SChip>,
  rejected: <SChip tone="red" icon="x">Rejected</SChip>,
  expired: <SChip tone="red" icon="clock">Expired</SChip>,
  cancelled: <SChip tone="gray" icon="x">Cancelled</SChip>,
}

/* ───────────── Cards ───────────── */

const PAY_CHIP = {
  awaiting: <SChip tone="violet" icon="clock">Awaiting payment</SChip>,
  failed: <SChip tone="red" icon="x">Failed</SChip>,
  linkExpired: <SChip tone="amber" icon="clock">Link expired</SChip>,
  cancelled: <SChip tone="gray" icon="x">Cancelled</SChip>,
  paid: <SChip tone="green" icon="check">Payment successful</SChip>,
  reversed: <SChip tone="red" icon="refresh">Reversed</SChip>,
}

/** payment: awaiting | failed | linkExpired | cancelled | paid | reversed */
function PaymentCard({ payment }) {
  const paid = payment === 'paid' || payment === 'reversed'
  const newLink = payment === 'failed' || payment === 'linkExpired'
  const dim = payment === 'cancelled' ? 'opacity-30' : ''
  return (
    <SCard className="h-[404px]">
      <div className="flex items-center gap-3">
        <p className="flex-1 text-[17px] font-bold text-ink">Premium payment</p>
        {PAY_CHIP[payment]}
      </div>
      {paid && (
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e7f4ee] px-4 text-[13px] font-semibold text-[#127650]">
          <Icon name="check" size={16} />
          Payment successful.
        </div>
      )}
      <div className="flex h-[31px] w-max items-center gap-2 rounded-[12px] bg-[#e7f4ee] px-3 text-[12px] font-semibold text-[#127650]">
        <Icon name="shield" size={15} />
        Paid to Niva Bupa, recorded by you
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] font-medium text-muted">{paid ? 'Amount paid to Niva Bupa' : 'Amount on insurer portal'}</p>
        <p className="text-[28px] font-bold tracking-[-0.6px] text-ink">₹17,582.00</p>
      </div>
      <a href="#" onClick={(e) => e.preventDefault()} className="flex h-10 items-center gap-2.5 rounded-[16px] bg-panel px-3.5 text-[13px] font-semibold text-ink hover:bg-[#edf1f8]">
        <Icon name="link" size={16} className="text-muted" />
        <span className="flex-1">{paid ? 'UPI · UTR6271839934 · 26 Oct 2026' : 'pay.nivabupa.com/p/9LM4X'}</span>
        <Icon name="arrow" size={16} className="text-muted" />
      </a>
      <div className="flex gap-2.5">
        {paid ? (
          <>
            <PillButton variant="outline" size="sm" className="px-3.5" to={payment === 'paid' ? '/x/py4-payment-reverse-undo' : undefined}>Undo payment</PillButton>
            <PillButton variant="ghost" size="sm" icon="download">Receipt</PillButton>
          </>
        ) : (
          <>
            <PillButton variant="navy" size="sm" icon="check" className={cx(NAVY_SH, dim)} to="/x/08a-quotation-detail-record-payment">
              {newLink ? 'Add new payment link' : 'Record payment'}
            </PillButton>
            <PillButton variant="outline" size="sm" icon="x" className={cx('pr-[15px] pl-[13px]', dim)} to={payment === 'cancelled' ? undefined : '/x/py1-payment-mark-failed'}>Mark failed</PillButton>
          </>
        )}
      </div>
      {!paid && (
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 text-[13px] font-semibold text-blue">
          <Icon name="lock" size={16} />
          Record the payment to enable Mark accepted.
        </div>
      )}
      <p className="mt-auto text-[12px] leading-[18px] font-medium text-muted">Bimayantra never collects premiums and does not check payments with insurers.</p>
    </SCard>
  )
}

const LINK = {
  notShared: { sub: 'Not shared yet', days: '15', title: 'Validity starts when you first share', note: '15 days from the first share' },
  valid: { sub: 'First shared 24 Oct 2026', days: '13', title: 'Valid until 08 Nov 2026', note: 'Later shares do not extend it' },
  expired: { sub: 'First shared 24 Oct 2026', days: '0', title: 'Expired on 08 Nov 2026', note: 'Revise to send fresh prices' },
}

function CustomerLinkCard({ link }) {
  const L = LINK[link]
  const [copied, setCopied] = useState(false)
  const tiles = [
    { icon: 'mail', label: 'Email', to: link === 'notShared' ? '/x/qs2-quotation-share' : undefined },
    { icon: 'chat', label: 'WhatsApp', to: link === 'notShared' ? '/x/qs2-quotation-share' : undefined },
    { icon: 'link', label: copied ? 'Copied' : 'Copy link', onClick: () => { setCopied(true); setTimeout(() => setCopied(false), 1500) } },
    { icon: 'download', label: 'PDF' },
  ]
  const tileCls = 'flex h-16 w-20 flex-col items-center justify-center gap-1.5 rounded-[18px] bg-panel text-ink hover:bg-[#edf1f8]'
  return (
    <SCard>
      <SCardHead title="Customer link" subtitle={L.sub} />
      <div className="flex h-[88px] items-center gap-3.5 rounded-[20px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] px-4">
        <span className="flex size-14 flex-col items-center justify-center rounded-full bg-white text-[#5b3fb8]">
          <span className="text-[18px] leading-[23px] font-bold">{L.days}</span>
          <span className="text-[10px] leading-[13px] font-semibold">days</span>
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-[14px] font-bold text-ink">{L.title}</p>
          <p className="text-[12px] font-medium text-[#5b3fb8]">{L.note}</p>
        </div>
      </div>
      <div className="flex gap-2.5">
        {tiles.map((t) =>
          t.to ? (
            <Link key={t.icon} to={t.to} className={tileCls}>
              <Icon name={t.icon} size={20} />
              <span className="text-[11px] font-semibold">{t.label}</span>
            </Link>
          ) : (
            <button key={t.icon} type="button" onClick={t.onClick} className={tileCls}>
              <Icon name={t.icon} size={20} />
              <span className="text-[11px] font-semibold">{t.label}</span>
            </button>
          ),
        )}
      </div>
    </SCard>
  )
}

/**
 * Quotation detail base.
 *  chip (title chip node) · actions (header buttons) · activity (events)
 *  payment: awaiting | failed | linkExpired | cancelled | paid | reversed
 *  link: notShared | valid | expired · children: overlays (dialog / toast)
 */
export function QuoteDetailBase({ chip, actions, activity, payment = 'awaiting', link = 'valid', children }) {
  return (
    <AppLayout active="quotations" panelClass="h-[976px] overflow-y-auto pb-5! [scrollbar-width:none]">
      <Header chip={chip} actions={actions} />

      <div className="mt-[37px] flex items-start gap-5">
        <div className="flex w-[760px] shrink-0 flex-col gap-5">
          <SCard>
            <SCardHead title="Quotation" subtitle="Everything printed on the PDF" right={<PillButton variant="ghost" size="sm" icon="download">PDF</PillButton>} />
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {Q.kv.map(([k, v]) => <KVItem key={k} k={k} v={v} />)}
            </div>
          </SCard>

          <SCard>
            <SCardHead title="Premium" subtitle="Base → riders → override → discount → GST" />
            <Ledger rows={Q.ledger} total={Q.total} />
          </SCard>

          <SCard gap="gap-3.5">
            <p className="text-[17px] font-bold text-ink">Activity</p>
            {activity.map((a) => (
              <div key={a.title} className="flex items-center gap-3.5">
                <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full text-ink" style={{ background: a.bg }}>
                  <Icon name={a.icon} size={17} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold text-ink">{a.title}</p>
                  <p className="text-[12px] font-medium text-muted">{a.meta}</p>
                </div>
              </div>
            ))}
          </SCard>
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <PaymentCard payment={payment} />
          <CustomerLinkCard link={link} />
        </div>
      </div>

      {children}
    </AppLayout>
  )
}

/* ───────────── Overlays ───────────── */

/** Scrim over the workspace panel (1260×976, #0e1f3b @ 40%). Click → `to`. */
export function Scrim({ to }) {
  const nav = useNavigate()
  return <FixedScrim z="z-30" onClick={() => to && nav(to)} />
}

export function Dialog({ top, left = 360, width = 540, children }) {
  return (
    <FixedDialog
      top={top}
      left={left}
      width={width}
      frameClass="z-40"
      className="flex flex-col gap-4 rounded-[30px] bg-white p-[30px] shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]"
    >
      {children}
    </FixedDialog>
  )
}

export function DialogIcon({ icon, bg = '#fbebec', color = '#b4323c' }) {
  return (
    <span className="flex size-[60px] items-center justify-center rounded-full" style={{ background: bg, color }}>
      <Icon name={icon} size={26} />
    </span>
  )
}

export function DialogTitle({ children }) {
  return <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">{children}</p>
}

export function DialogText({ children }) {
  return <p className="w-full text-[13px] leading-5 font-medium text-muted">{children}</p>
}

export function FieldLabel({ children }) {
  return <span className="text-[13px] font-semibold text-ink">{children}</span>
}

export const fieldShell = 'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink focus-within:ring-2 focus-within:ring-blue/30'

/** Single-line text field (label + 50px input) */
export function TextField({ label, defaultValue }) {
  const [v, setV] = useState(defaultValue)
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <span className={fieldShell}>
        <input value={v} onChange={(e) => setV(e.target.value)} className="min-w-0 flex-1 bg-transparent outline-none" />
      </span>
    </label>
  )
}

/** Cancel (outline) + destructive / primary confirm row */
export function DialogActions({ cancelTo, confirm }) {
  return (
    <div className="flex gap-2.5">
      <PillButton variant="outline" className="flex-1 justify-center px-5" to={cancelTo}>Cancel</PillButton>
      {confirm}
    </div>
  )
}

export function DangerButton({ icon = 'x', to, children }) {
  return (
    <PillButton variant="danger" icon={icon} className="flex-1 justify-center bg-white" to={to}>{children}</PillButton>
  )
}

/** Navy toast at the bottom-left of the workspace (40,900). */
export function Toast({ children }) {
  return (
    <div data-overlay="toast" className="fixed bottom-[52px] left-[196px] z-20 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]">
      <span className="flex size-6 items-center justify-center rounded-full bg-[#16845b]">
        <Icon name="check" size={13} />
      </span>
      {children}
    </div>
  )
}
