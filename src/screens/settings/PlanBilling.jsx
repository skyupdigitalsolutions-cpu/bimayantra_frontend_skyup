// Figma 13:1854 · 17 · Settings — Plan and billing
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Chip, cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, SBtn } from './_parts'
import { plans } from '../../data/settings'

function Period({ dark, value, onChange }) {
  return (
    <div className={cx('flex w-fit gap-1 rounded-[20px] p-1', dark ? 'bg-white/10' : 'bg-panel')}>
      {['Monthly', 'Yearly'].map((p) => {
        const on = value === p
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cx(
              'rounded-[16px] px-4 py-[7px] text-[12px] font-semibold',
              on ? (dark ? 'bg-white text-navy' : 'bg-navy text-white') : dark ? 'text-[#c9d6ea]' : 'text-muted',
            )}
          >
            {p}
          </button>
        )
      })}
    </div>
  )
}

function Feature({ ok, dark, children }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cx('flex size-[22px] items-center justify-center rounded-full', dark ? 'bg-pink-300' : ok ? 'bg-[#e7f4ee]' : 'bg-[#eef1f5]')}>
        <Icon name={ok ? 'check' : 'x'} size={12} className={dark ? 'text-navy' : ok ? 'text-[#127650]' : 'text-muted'} />
      </span>
      <span className={cx('text-[13px] font-medium', dark ? 'text-white' : ok ? 'text-ink' : 'text-muted')}>{children}</span>
    </div>
  )
}

export default function PlanBilling() {
  const [p1, setP1] = useState('Monthly')
  const [p2, setP2] = useState('Monthly')
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  MY PLAN"
      title="My plan and billing"
      titleExtra={<Chip tone="blue" icon="clock">Trial · 3 days left</Chip>}
      subtitle="Plans and wallet recharges are bought on the website only."
      contentClass="gap-5"
    >
      <div className="flex items-start gap-5">
        <div className="flex w-[440px] flex-col gap-[18px] rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <p className="text-[20px] font-bold text-ink">Normal</p>
          <div className="flex items-end gap-1.5">
            <span className="text-[36px] font-bold tracking-[-0.7px] text-ink">₹499</span>
            <span className="text-[13px] font-medium text-muted">/ month + GST</span>
          </div>
          <p className="text-[13px] font-semibold text-blue">or ₹4,990 / year</p>
          <Period value={p1} onChange={setP1} />
          {plans.normal.map(([ok, t]) => <Feature key={t} ok={ok}>{t}</Feature>)}
          <SBtn size="lg" icon="arrow" className="w-full">Choose Normal</SBtn>
        </div>
        <div className="flex w-[440px] flex-col gap-[18px] rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 shadow-[0px_24px_44px_-14px_rgba(19,41,75,0.3)]">
          <div className="flex items-center gap-2.5">
            <p className="flex-1 text-[20px] font-bold text-white">Premium</p>
            <span className="rounded-[12px] bg-linear-to-b from-[#f9c6d0] to-[#f29db0] px-3 py-[5px] text-[11px] font-bold text-navy">Most popular</span>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-[36px] font-bold tracking-[-0.7px] text-white">₹999</span>
            <span className="text-[13px] font-medium text-[#c9d6ea]">/ month + GST</span>
          </div>
          <p className="text-[13px] font-semibold text-pink-300">or ₹9,990 / year</p>
          <Period dark value={p2} onChange={setP2} />
          {plans.premium.map((t) => <Feature key={t} ok dark>{t}</Feature>)}
          <SBtn size="lg" variant="pink" icon="arrow" className="w-full">Choose Premium</SBtn>
        </div>
      </div>

      <SCard className="p-6">
        <SHead
          title="Billing history"
          subtitle="A GST invoice is emailed after each payment"
          right={
            <span className="flex items-center gap-1.5 rounded-[12px] border border-[#d9d0f0] bg-[#f3f0fa] px-3 py-1.5 text-[11px] font-bold text-violet">
              <Icon name="user-plus" size={13} />Paid to SkyUp
            </span>
          }
        />
        <div className="flex items-center gap-4 rounded-[18px] bg-panel px-[18px] py-3.5">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[14px] font-bold text-ink">Trial started</p>
            <p className="text-[12px] font-medium text-muted">SKY/26-27/1007 · 19 Oct 2026</p>
          </div>
          <p className="text-[14px] font-bold text-ink">₹0.00</p>
          <Chip tone="blue">Free</Chip>
        </div>
        <p className="text-[12px] font-medium text-muted">Sample prices, pending confirmation (DEC-06). No proration or refunds in this release.</p>
      </SCard>
    </SettingsLayout>
  )
}
