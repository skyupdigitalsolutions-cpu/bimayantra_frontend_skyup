// Figma 24:2076 · 21 · Referrer dashboard
import { useState } from 'react'
import Icon from '../../components/Icon'
import { IconButton, cx } from '../../components/ui'
import { ReferrerShell, RingAvatar, SBtn, SChip, cardShadow } from './_parts'
import { referrerStatsCards, myReferrals } from '../../data/public'

export default function ReferrerDashboard() {
  const [copied, setCopied] = useState(false)
  return (
    <ReferrerShell>
      <header className="flex items-start justify-between max-xl:flex-col max-xl:gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-semibold tracking-[0.2px] text-muted">REFERRER</p>
          <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">My referrals</h1>
          <p className="text-[14px] font-medium text-muted">Referring for Suresh Rao, Rao Insurance Services</p>
        </div>
        <IconButton icon="bell" iconSize={18.5} className="mt-1" />
      </header>

      <div className="mt-[21px] flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-4 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 shadow-[0px_24px_44px_-14px_rgba(19,41,75,0.3)]">
          <div className="flex items-center gap-2.5">
            <p className="flex-1 text-[17px] font-bold text-white">My referral link</p>
            <span className="rounded-[12px] bg-white/10 px-3 py-[5px] text-[11px] font-semibold text-white">Valid until 01 Mar 2027</span>
          </div>
          <div className="flex h-12 items-center gap-3 rounded-[18px] bg-white/10 px-4">
            <Icon name="link" size={18} className="text-[#f7b9c4]" />
            <p className="text-[16px] font-bold text-white">bimayantra.in/r/K7MX4QPA</p>
          </div>
          <div className="flex gap-2.5">
            <SBtn variant="pink" icon={copied ? 'check' : 'link'} onClick={() => setCopied(true)}>{copied ? 'Copied' : 'Copy link'}</SBtn>
            <SBtn variant="white" icon="chat">Share on WhatsApp</SBtn>
            <SBtn variant="white" icon="download">QR code</SBtn>
          </div>
        </div>

        <div className="flex w-[400px] flex-col gap-3 rounded-[28px] bg-linear-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
          <span className="flex size-[52px] items-center justify-center rounded-full bg-white"><Icon name="user-plus" size={24} className="text-navy" /></span>
          <p className="text-[18px] font-bold text-ink">Refer someone now</p>
          <p className="text-[13px] leading-5 font-medium text-rose-ink">Fill the form for them. They must agree to be contacted.</p>
          <SBtn icon="plus" className="w-fit" to="/r/suresh-rao">Refer someone</SBtn>
        </div>
      </div>

      <div className="mt-[45px] flex gap-5">
        {referrerStatsCards.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col gap-1.5 rounded-[24px] p-5" style={{ background: s.bg }}>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/70"><Icon name={s.icon} size={18} className="text-ink" /></span>
              <span className="text-[13px] font-semibold text-ink-2">{s.label}</span>
            </div>
            <p className="text-[28px] font-bold tracking-[-0.6px] text-ink">{s.n}</p>
          </div>
        ))}
      </div>

      <section className={cx('mt-[23px] flex flex-col gap-3 rounded-[28px] bg-white p-6', cardShadow)}>
        <div className="flex flex-col gap-[3px]">
          <p className="text-[17px] font-bold text-ink">My referrals</p>
          <p className="text-[12px] font-medium text-muted">Names you sent, with progress</p>
        </div>
        {myReferrals.map((r) => (
          <div key={r.name} className="flex h-16 items-center gap-3.5 rounded-[20px] bg-panel px-4">
            <RingAvatar ini={r.ini} bg={r.bg} size={40} text={13} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">{r.name}</p>
              <p className="text-[12px] font-medium text-muted">{r.sub}</p>
            </div>
            <SChip tone={r.tone} icon={r.icon}>{r.status}</SChip>
          </div>
        ))}
      </section>
    </ReferrerShell>
  )
}
