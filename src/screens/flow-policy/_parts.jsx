// Shared bases for Flow · Policy & renewal and Flow · Renewal quotation.
//  - RenewalDetail: N1 base (header + countdown + contacts + how to renew). N2/N3/RN0 layer overlays on it.
//  - QuotationReady: N1c / RNB4 (green hero + share + "to close this renewal").
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Shell, Header, Btn, Pill, Card, CardHead, Hero, SH_CARD } from './_kit'
import { renewal as r, contacts, shareChannels, P } from '../../data/flow-policy'
import { FixedDialog } from '../catalogue/_overlay'

/* ───────── Renewal detail (N1 base) ───────── */

function Countdown() {
  return (
    <div className="flex h-[144px] items-center gap-[22px] rounded-[34px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] px-[30px] shadow-[0px_18px_36px_-12px_rgba(201,138,46,0.2)]">
      <span className="flex size-[92px] shrink-0 flex-col items-center justify-center rounded-full bg-white">
        <span className="text-[28px] leading-[35px] font-bold text-ink">{r.days}</span>
        <span className="text-[11px] leading-[14px] font-semibold text-[#8a5a12]">days</span>
      </span>
      <div className="flex flex-1 flex-col gap-1.5">
        <p className="text-[24px] leading-[30px] font-bold tracking-[-0.2px] text-ink">{r.renewsOn}</p>
        <p className="text-[13px] leading-4 font-medium text-[#8a5a12]">{r.grace}</p>
      </div>
      <div className="flex flex-col gap-0.5 rounded-[18px] bg-white/80 px-[18px] py-3">
        <p className="text-[12px] leading-[15px] font-semibold text-[#8a5a12]">Reminders</p>
        <p className="text-[16px] leading-5 font-bold whitespace-nowrap text-ink">{r.reminders}</p>
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

export function HowToRenew() {
  return (
    <div className={cx('flex h-[118px] w-[400px] flex-col gap-2.5 rounded-[28px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-6', SH_CARD)}>
      <p className="text-[16px] leading-5 font-bold text-ink">How to renew</p>
      <p className="text-[13px] leading-5 font-medium text-ink-2">Renewal quotation → share → record payment → proposal → record the new policy. That closes this renewal.</p>
    </div>
  )
}

/**
 * links: { notRenewing, logContact, create } — header button targets (overlay frames have none in Figma,
 * but they stay usable). overlay: drawer/dialog rendered over the workspace.
 */
export function RenewalDetail({ overlay, links = {} }) {
  return (
    <Shell active="renewals" overlay={overlay}>
      <Header
        crumb={r.crumb}
        title={r.title}
        chips={<Pill tone="amber" icon="alert">Due</Pill>}
        sub={r.sub}
        actions={<>
          <Btn variant="danger" icon="x" to={links.notRenewing ?? P.n3}>Not renewing</Btn>
          <Btn variant="white" icon="phone" to={links.logContact ?? P.n2}>Log contact</Btn>
          <Btn icon="quote" to={links.create ?? P.rn0}>Create renewal quotation</Btn>
        </>}
      />
      <div className="mt-[21px]"><Countdown /></div>
      <div className="mt-9 flex items-start gap-5">
        <Contacts />
        <HowToRenew />
      </div>
    </Shell>
  )
}

/** Dialog surface used by N3 / RN0 (positioned at Figma panel coords). */
export function PanelDialog({ left, top, width, className = '', children }) {
  return (
    <FixedDialog top={top} left={left} width={width} className={cx('flex flex-col rounded-[28px] bg-white shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]', className)}>
      {children}
    </FixedDialog>
  )
}

/* ───────── Quotation ready (N1c / RNB4) ───────── */

const SEND_LABEL = { email: 'Send by email', whatsapp: 'Send on WhatsApp', link: 'Copy link', pdf: 'Download PDF' }

export function QuotationReady({ crumb, title, sub, heroSub, total, insurer }) {
  const [ch, setCh] = useState('email')
  const steps = [`Kavya pays ${insurer}`, 'Record the payment', 'Submit the proposal', 'Record the new policy']
  return (
    <Shell active="renewals">
      <Header
        crumb={crumb}
        title={title}
        chips={<Pill tone="blue" icon="check">Ready</Pill>}
        sub={sub}
        actions={<Btn variant="white" icon="arrow" to={P.n1}>Back to renewal</Btn>}
      />
      <Hero
        className="mt-[21px]"
        icon="check"
        iconSize={36}
        title="Renewal quotation is ready"
        sub={heroSub}
        right={
          <div className="flex w-[141px] flex-col gap-0.5 rounded-[20px] bg-white/80 px-5 py-3.5">
            <p className="text-[12px] leading-[15px] font-semibold text-[#2f6b55]">Total</p>
            <p className="text-[24px] leading-[30px] font-bold text-ink">{total}</p>
          </div>
        }
      />
      <div className="mt-[58px] flex items-start gap-5">
        <Card className="w-[760px] gap-4">
          <CardHead title="Share with Kavya" sub="Email and WhatsApp consent given" />
          <div className="flex items-start gap-3.5">
            {shareChannels.map((c) => {
              const on = c.key === ch
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCh(c.key)}
                  className={cx('flex h-[104px] flex-1 flex-col items-start gap-2.5 rounded-[22px] p-4 text-left transition', on ? 'bg-[#f3f7ff] outline-[1.5px] outline-blue outline-solid' : 'bg-panel hover:bg-panel-2')}
                >
                  <span className="flex size-11 items-center justify-center rounded-full text-ink" style={{ background: c.bg }}><Icon name={c.icon} size={20} /></span>
                  <span className="text-[14px] leading-[18px] font-bold text-ink">{c.label}</span>
                </button>
              )
            })}
          </div>
          <Btn icon="send" to={P.n4} className="self-start">{SEND_LABEL[ch]}</Btn>
        </Card>
        <Card className="w-[400px] gap-3">
          <p className="text-[16px] leading-5 font-bold text-ink">To close this renewal</p>
          {steps.map((s, i) => (
            <div key={s} className="flex h-7 items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-panel text-[12px] font-bold text-muted">{i + 1}</span>
              <span className="text-[13px] font-bold text-ink">{s}</span>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  )
}
