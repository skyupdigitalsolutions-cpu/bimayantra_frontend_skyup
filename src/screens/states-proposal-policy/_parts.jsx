// Shared bases for States · Proposal / Policy / Renewal (Figma 285:31639 … 285:33944).
//  - SubmittedBase: R7 layout (PRD / PRD2)
//  - PolicyBase:    policy detail layout with variable status (PO1–PO4)
//  - RenewalBase:   renewal detail layout with variable status (RS1–RS4)
//  - RenewalsBoard: Renewals list layout (RS5)
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { RenewalCard } from '../../components/cards'
import { cx } from '../../components/ui'
import { Shell, Header as KitHeader, Pill, Hero, Card, CardHead, Field, TextBox } from '../flow-policy/_kit'
import { HowToRenew } from '../flow-policy/_parts'
import {
  Header, HeadButton, SmallButton, SegTabs, Panel, PanelHead, StatusChip, RingAvatar, Dialog, DialogButton, Toast, Scrim,
} from '../catalogue/_parts'
import { renewalTabs, renewalCards, reminderSteps } from '../../data/catalogue'
import { submitted as sp, policy as p, renewal as rn, contacts } from '../../data/states-proposal-policy'

export { Header, HeadButton, SmallButton, SegTabs, Panel, PanelHead, StatusChip, RingAvatar, Dialog, DialogButton, Toast, Scrim }

/* ───────── Status chips ───────── */

const RED = 'bg-[#fbebec] text-[#b4323c]'
export const CHIPS = {
  submitted: <Pill tone="violet" icon="clock">Submitted</Pill>,
  draft: <Pill>Draft</Pill>,
  issued: <Pill tone="green" icon="check">Issued</Pill>,
  declined: <Pill icon="x" className={RED}>Declined</Pill>,
  cancelled: <Pill icon="x" className={RED}>Cancelled</Pill>,
  expired: <Pill tone="amber" icon="clock">Expired</Pill>,
  renewed: <Pill tone="green" icon="refresh">Renewed</Pill>,
  followup: <Pill tone="violet" icon="phone">In follow-up</Pill>,
  notRenewing: <Pill icon="x">Not renewing</Pill>,
  lapsed: <Pill icon="x" className={RED}>Lapsed</Pill>,
}

/* ───────── Dialog field (label + h50 input on #f4f6fb) ───────── */

export function DField({ label, className = 'flex-none', ...input }) {
  return (
    <Field label={label} className={className}>
      <TextBox {...input} />
    </Field>
  )
}

/** Two dialog buttons: 480 row, gap 10 */
export function DialogActions({ children }) {
  return <div className="flex gap-2.5">{children}</div>
}

/* ───────── PRD / PRD2 — submitted proposal ───────── */

export function SubmittedBase({ chip, actions, heroTitle, overlay }) {
  return (
    <Shell active="proposals" overlay={overlay}>
      <KitHeader search crumb={`PROPOSALS  /  ${sp.id}`} title={sp.id} chips={chip} sub={sp.sub} actions={actions} />
      <Hero
        tone="violet"
        className="mt-[21px]"
        icon="clock"
        iconColor="#5b3fb8"
        title={heroTitle}
        sub={sp.heroSub}
        subColor="#5b3fb8"
      />
      <Card className="mt-12 gap-3.5">
        <CardHead title="Frozen on the policy record" />
        <div className="flex items-start gap-3.5">
          {sp.frozen.map(([k, v]) => (
            <div key={k} className="flex flex-1 flex-col gap-1 rounded-[18px] bg-panel p-4">
              <p className="text-[12px] leading-[15px] font-medium text-muted">{k}</p>
              <p className="text-[14px] leading-[18px] font-bold text-ink">{v}</p>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  )
}

/* ───────── PO1–PO4 — policy detail ───────── */

export function PolicyBase({ chip, actions, endLabel, days = '38', daysLabel, overlay }) {
  return (
    <AppLayout active="policies">
      <Header breadcrumb={p.crumb} title={p.number} titleExtra={chip} subtitle={p.sub} actions={actions} />

      <section className="mt-[37px] flex w-[1180px] items-center gap-6 rounded-[32px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-[30px] py-[26px] shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[36px] bg-white/90">
          <Icon name="shield" size={32} className="text-[#127650]" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <p className="text-[22px] leading-[28px] font-bold tracking-[-0.2px] text-ink">{p.product}</p>
          <p className="text-[13px] leading-4 font-medium text-[#2f6b55]">{p.covers}</p>
          <div className="flex w-[520px] flex-col gap-1.5">
            <div className="h-2.5 overflow-hidden rounded-[5px] bg-white/70">
              <div className="h-full rounded-[5px] bg-[#16845b]" style={{ width: `${p.progress * 100}%` }} />
            </div>
            <div className="flex text-[12px] leading-[15px]">
              <p className="flex-1 font-semibold text-[#2f6b55]">{p.start}</p>
              <p className="font-bold whitespace-nowrap text-ink">{endLabel}</p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5 rounded-[20px] bg-white/80 px-5 py-3.5">
          <p className="text-[12px] leading-[15px] font-semibold text-[#2f6b55]">Premium</p>
          <p className="text-[22px] leading-[28px] font-bold text-ink">{p.premium}</p>
        </div>
      </section>

      <div className="mt-[27px] flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-5">
          <Panel className="flex flex-col gap-4 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <PanelHead titleClass="text-ink leading-[21px]" title="Policy" subtitle={p.source} right={<SmallButton icon="download">Policy PDF</SmallButton>} />
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {p.kv.map(([k, v]) => (
                <div key={k} className="flex w-[220px] flex-col gap-1 whitespace-nowrap">
                  <p className="text-[12px] leading-[15px] font-medium text-muted">{k}</p>
                  <p className="text-[14px] leading-[18px] font-semibold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <PanelHead titleClass="text-ink leading-[21px]" title="Nominees" subtitle="Version 1 · 28 Nov 2025" right={<StatusChip tone="green" icon="check">100%</StatusChip>} />
            <div className="flex items-center gap-3.5 rounded-[20px] bg-panel px-4 py-3.5">
              <RingAvatar initials={p.nominee.initials} bg="bg-[#d9eafd]" size={44} text={14} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[14px] leading-[18px] font-bold text-ink">{p.nominee.name}</p>
                <p className="text-[12px] leading-[15px] font-medium text-muted">{p.nominee.sub}</p>
              </div>
              <p className="text-[18px] font-bold text-ink">{p.nominee.share}</p>
            </div>
            <p className="text-[12px] leading-[18px] font-medium text-muted">
              Changes need the insurer’s endorsement reference. Each save keeps the earlier version.
            </p>
          </Panel>
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-[28px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-6 shadow-[0px_14px_30px_-12px_rgba(201,138,46,0.2)]">
            <PanelHead title="Renewal" right={<StatusChip tone="amber" icon="alert">Due</StatusChip>} />
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 items-center justify-center rounded-[28px] bg-white text-[18px] font-bold text-ink">{days}</span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[16px] leading-5 font-bold text-ink">{daysLabel}</p>
                <p className="text-[12px] leading-[15px] font-medium text-[#8a5a12]">Reminders on: 60 days sent</p>
              </div>
            </div>
            <SmallButton variant="navy" icon="arrow" to="/x/n1-renewal-detail" className="self-start">Open renewal</SmallButton>
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[17px] font-bold text-white">Expected commission</p>
              <span className="flex items-center gap-[5px] rounded-[12px] bg-white/10 px-2.5 py-[5px] text-[11px] font-semibold text-white">
                <Icon name="lock" size={13} className="text-[#f7b9c4]" />
                Only you
              </span>
            </div>
            <p className="text-[32px] leading-10 font-bold tracking-[-0.6px] text-white">{p.commission}</p>
            <p className="text-[12px] leading-[18px] font-medium text-[#c9d6ea]">15% of premium before tax. For your reference only.</p>
          </div>
        </div>
      </div>
      {overlay}
    </AppLayout>
  )
}

/* ───────── RS1–RS4 — renewal detail ───────── */

function Countdown({ days, title, reminders }) {
  return (
    <div className="flex h-[144px] items-center gap-[22px] rounded-[34px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] px-[30px] shadow-[0px_18px_36px_-12px_rgba(201,138,46,0.2)]">
      <span className="flex size-[92px] shrink-0 flex-col items-center justify-center rounded-full bg-white">
        <span className="text-[28px] leading-[35px] font-bold text-ink">{days}</span>
        <span className="text-[11px] leading-[14px] font-semibold text-[#8a5a12]">days</span>
      </span>
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-[24px] leading-[30px] font-bold tracking-[-0.2px] text-ink">{title}</p>
        <p className="text-[13px] leading-4 font-medium text-[#8a5a12]">{rn.grace}</p>
      </div>
      <div className="flex flex-col gap-0.5 rounded-[18px] bg-white/80 px-[18px] py-3">
        <p className="text-[12px] leading-[15px] font-semibold text-[#8a5a12]">Reminders</p>
        <p className="text-[16px] leading-5 font-bold whitespace-nowrap text-ink">{reminders}</p>
      </div>
    </div>
  )
}

function Contacts() {
  return (
    <Card className="w-[760px] gap-3.5">
      <CardHead title="Contacts" sub="Logging one moves the renewal to In follow-up" />
      {contacts.map((c) => (
        <div key={c.title} className="flex items-start gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink" style={{ background: c.bg }}>
            <Icon name={c.icon} size={18} />
          </span>
          <div className="flex flex-col gap-[3px]">
            <p className="text-[14px] leading-[18px] font-bold text-ink">{c.title}</p>
            <p className="text-[12px] leading-[15px] font-medium text-muted">{c.meta}</p>
            {c.note && <p className="self-start rounded-[12px] bg-panel px-3 py-2 text-[12px] leading-[15px] font-medium text-ink-2">{c.note}</p>}
          </div>
        </div>
      ))}
    </Card>
  )
}

export function RenewalBase({ chip, actions, days = '38', title, reminders, overlay }) {
  return (
    <Shell active="renewals" overlay={overlay}>
      <KitHeader crumb={rn.crumb} title={rn.title} chips={chip} sub={rn.sub} actions={actions} />
      <div className="mt-[21px]"><Countdown days={days} title={title} reminders={reminders} /></div>
      <div className="mt-9 flex items-start gap-5">
        <Contacts />
        <HowToRenew />
      </div>
    </Shell>
  )
}

/* ───────── RS5 — renewals board ───────── */

export function RenewalsBoard({ tab = 'due', onTab, overlay }) {
  return (
    <AppLayout active="renewals">
      <Header
        breadcrumb={'AFTER-SALE  /  RENEWALS'}
        title="Renewals"
        subtitle="The system moves each renewal by date. You close each one."
        actions={<HeadButton variant="white" icon="calendar">Next 60 days</HeadButton>}
      />
      <SegTabs items={renewalTabs} value={tab} onChange={onTab} className="mt-[13px]" />
      <div className="mt-7 flex items-start gap-6">
        <div className="flex w-[756px] flex-col">
          <div className="flex flex-wrap gap-5">
            {renewalCards.map((r) => <RenewalCard key={r.name} r={r} to="/x/n1-renewal-detail" />)}
          </div>
          <div className="mt-[49px] flex items-center gap-3.5 rounded-[26px] bg-white px-[22px] py-[18px] shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <RingAvatar initials="SP" bg="bg-[#eef1f5]" size={44} text={14} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[14px] leading-[18px] font-bold text-ink">Suresh Patil · Star Health FamilySure</p>
              <p className="text-[12px] leading-[15px] font-medium text-muted">Grace ended 03 Sep 2026. If the insurer revives it, you can still record the renewal.</p>
            </div>
            <StatusChip tone="rose" icon="x">Lapsed</StatusChip>
          </div>
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <Panel className="flex flex-col gap-3.5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <PanelHead title="Customer reminders" subtitle="Kavya Hegde · only on channels with consent" right={<StatusChip tone="sky" icon="clock">Auto</StatusChip>} />
            {reminderSteps.map((s, i) => (
              <div key={s.title} className="flex items-center gap-3">
                <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-[14px]', s.done ? 'bg-[#16845b] text-white' : 'bg-panel text-[11px] font-bold text-muted')}>
                  {s.done ? <Icon name="check" size={14} /> : i + 1}
                </span>
                <div className="flex flex-col gap-px">
                  <p className={cx('text-[13px] leading-4 font-bold', s.done ? 'text-ink' : 'text-ink-2')}>{s.title}</p>
                  <p className="text-[11px] leading-[14px] font-medium text-muted">{s.sub}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-2.5">
              <SmallButton variant="outline" icon="clock" to="/x/rs5-renewal-pause-reminders">Pause reminders</SmallButton>
              <SmallButton variant="navy" icon="phone" to="/x/n2-renewal-log-contact">Log contact</SmallButton>
            </div>
          </Panel>

          <div className="flex flex-col items-start gap-2.5 rounded-[28px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <p className="text-[16px] leading-5 font-bold text-ink">How to renew</p>
            <p className="text-[13px] leading-5 font-medium text-ink-2">
              Create the renewal quotation, share it, record payment, submit the proposal, then record the new policy. That closes this renewal and starts the next.
            </p>
            <SmallButton variant="navy" icon="quote" to="/x/rn0-renewal-how-to-renew">Create renewal quotation</SmallButton>
          </div>
        </div>
      </div>
      {overlay}
    </AppLayout>
  )
}
