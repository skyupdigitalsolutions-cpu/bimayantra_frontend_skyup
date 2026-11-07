// Figma 25:2413 · 24 · SkyUp Admin — Advisor KYC
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { AdminLayout, AdminHeader, ACard, ACardHead, HButton, Pill } from './_parts'
import { kycQueue } from '../../data/admin'

function DocTile({ icon, label, bg }) {
  return (
    <div className="flex h-[190px] w-[368px] flex-col items-center justify-center gap-3 rounded-[24px] p-5" style={{ background: bg }}>
      <div className="flex h-[108px] w-[220px] flex-col gap-2 rounded-[14px] bg-white px-[18px] py-4 shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.1)]">
        <Icon name={icon} size={20} className="text-ink" />
        {[150, 120, 170, 90].map((w) => (
          <span key={w} className="h-1.5 rounded-[3px] bg-[#e3e8f0]" style={{ width: w }} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[13px] font-bold text-ink">{label}</p>
        <button type="button" aria-label={`View ${label}`} className="flex size-[30px] items-center justify-center rounded-[15px] bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
          <Icon name="eye" size={12.6} className="text-ink" />
        </button>
      </div>
    </div>
  )
}

/** KYC queue + review card. `overlay` renders inside the panel (e.g. reject dialog). */
export function KycBase({ overlay, initialSel = 0 }) {
  const [sel, setSel] = useState(initialSel)
  const [status, setStatus] = useState({})
  const k = kycQueue[sel]
  const st = status[sel]
  return (
    <AdminLayout active="kyc">
      <AdminHeader title="Advisor KYC" subtitle="Oldest first. Target: 2 working days." />
      <div className="mt-[21px] flex items-start gap-5">
        <ACard className="flex w-[360px] flex-col gap-2.5">
          <ACardHead title="Queue" subtitle={`${kycQueue.length} waiting`} />
          {kycQueue.map((q, i) => (
            <button
              key={q.name}
              type="button"
              onClick={() => setSel(i)}
              className={cx('flex items-center gap-3 rounded-[20px] p-3.5 text-left', i === sel ? 'border-[1.5px] border-blue bg-[#f3f7ff]' : 'bg-panel')}
            >
              <span className={cx('flex size-[42px] shrink-0 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold text-navy', q.tint)}>{q.initials}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-ink">{q.name}</span>
                <span className="text-[12px] font-medium text-muted">{q.meta}</span>
              </span>
            </button>
          ))}
        </ACard>
        <ACard className="flex w-[800px] flex-col gap-5">
          <ACardHead
            title={k.name}
            subtitle={k.submitted}
            right={st ? <Pill tone="green" icon="check">KYC verified</Pill> : <Pill tone="violet" icon="clock">Pending review</Pill>}
          />
          <div className="flex gap-4">
            <DocTile icon="card" label="PAN card" bg="#e9e3fc" />
            <DocTile icon="shield" label="IRDAI licence" bg="#fde8c9" />
          </div>
          <div className="grid grid-cols-[236px_236px_236px] gap-x-5 gap-y-4">
            {k.kv.map(([l, v]) => (
              <div key={l} className="flex flex-col gap-1">
                <p className="text-[12px] font-medium text-muted">{l}</p>
                <p className="text-[14px] font-semibold text-ink">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <HButton variant="navy" icon="check" onClick={() => setStatus({ ...status, [sel]: 'ok' })}>Verify KYC</HButton>
            <HButton variant="danger" icon="x" to="/x/aa5-admin-reject-kyc">Reject with reason</HButton>
            <p className="ml-auto text-[12px] font-medium text-muted">The advisor is notified either way.</p>
          </div>
        </ACard>
      </div>
      {overlay}
    </AdminLayout>
  )
}

export default function AdvisorKyc() {
  return <KycBase />
}
