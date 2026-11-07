// Figma 25:1976 · 22 · SkyUp Admin — Home
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { AdminLayout, AdminHeader, ACard, ACardHead, SButton, Pill, IconDisc } from './_parts'
import { homeStats, homeApprovals, planBars, kycWaiting, recentActivity } from '../../data/admin'

export default function AdminHome() {
  const [done, setDone] = useState({})
  return (
    <AdminLayout active="home">
      <AdminHeader title="Good morning, Meena" titleExtra={<Pill tone="violet" icon="lock">Admin</Pill>} subtitle="Monday, 26 Oct 2026" />

      <div className="mt-[13px] flex gap-5">
        {homeStats.map((s) => (
          <div key={s.label} className="flex h-[149px] w-[280px] flex-col gap-1.5 rounded-[26px] p-[22px]" style={{ background: s.bg }}>
            <div className="flex items-center gap-2.5">
              <IconDisc icon={s.icon} size={40} className="bg-white/70" />
              <p className="text-[13px] font-semibold text-ink-2">{s.label}</p>
            </div>
            <p className="text-[30px] font-bold tracking-[-0.6px] text-ink">{s.value}</p>
            <p className="text-[12px] font-medium text-slate">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-[35px] flex gap-5">
        <div className="flex w-[760px] flex-col gap-5">
          <ACard className="flex flex-col gap-3">
            <ACardHead
              title="Needs your approval"
              subtitle="Maker and checker · OTP on approve"
              right={<SButton variant="ghost" icon="arrow" to="/x/23-skyup-admin-approvals">View all</SButton>}
            />
            {homeApprovals.map((a, i) => (
              <div key={a.title} className="flex h-[72px] items-center gap-3.5 rounded-[20px] bg-panel px-4">
                <IconDisc icon={a.icon} className={a.tint} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-ink">{a.title}</p>
                  <p className="text-[12px] font-medium text-muted">{a.meta}</p>
                </div>
                {a.own ? (
                  <Pill tone="amber" icon="lock">Your change · needs another admin</Pill>
                ) : done[i] ? (
                  <Pill tone={done[i] === 'ok' ? 'green' : 'red'} icon={done[i] === 'ok' ? 'check' : 'x'}>{done[i] === 'ok' ? 'Approved' : 'Rejected'}</Pill>
                ) : (
                  <>
                    <SButton variant="outline" onClick={() => setDone({ ...done, [i]: 'no' })}>Reject</SButton>
                    <SButton variant="navy" icon="check" onClick={() => setDone({ ...done, [i]: 'ok' })}>Approve</SButton>
                  </>
                )}
              </div>
            ))}
          </ACard>

          <ACard className="flex flex-col gap-3">
            <ACardHead title="Recent activity" subtitle="From the audit log" />
            {recentActivity.map((r) => (
              <div key={r.text} className="flex w-[580px] items-center gap-3">
                <span className="size-2 shrink-0 rounded-full bg-violet" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[13px] font-semibold text-ink">{r.text}</p>
                  <p className="text-[12px] font-medium text-muted">{r.meta}</p>
                </div>
              </div>
            ))}
          </ACard>
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <ACard className="flex flex-col gap-4">
            <ACardHead title="Accounts by plan" subtitle="5 accounts" />
            {planBars.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <p className="w-[70px] text-[13px] font-semibold text-ink">{p.label}</p>
                <span className="h-3 w-[220px] rounded-[6px] bg-panel">
                  <span className="block h-3 rounded-[6px]" style={{ width: p.w, background: p.color }} />
                </span>
                <p className="text-[14px] font-bold text-ink">{p.n}</p>
              </div>
            ))}
          </ACard>

          <div className="flex flex-col gap-3 rounded-[28px] bg-linear-to-b from-[#fde8c9] to-[#fbd9b0] p-6 shadow-[0px_14px_30px_-12px_rgba(201,138,46,0.2)]">
            <div className="flex items-center gap-3">
              <p className="flex-1 text-[17px] font-bold text-ink">KYC waiting</p>
              <Pill tone="amber">2</Pill>
            </div>
            {kycWaiting.map((k) => (
              <Link key={k.name} to="/x/24-skyup-admin-advisor-kyc" className="flex h-[62px] items-center gap-3 rounded-[18px] bg-white/80 px-3">
                <span className="flex size-[38px] items-center justify-center rounded-full border-2 border-white bg-white text-[12px] font-bold text-navy">{k.initials}</span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-[13px] font-bold text-ink">{k.name}</p>
                  <p className="text-[12px] font-medium text-[#8a5a12]">{k.wait}</p>
                </div>
                <Icon name="chev-right" size={18} className="text-ink" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
