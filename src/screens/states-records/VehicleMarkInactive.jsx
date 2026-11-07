// Figma 286:34407 · VH1 · Vehicle — Mark inactive
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { StatusChip, SmallButton, Panel, PanelHead, Scrim, Dialog, DialogButton, Toast } from '../catalogue/_parts'
import { HolderShell, HOLDER_ACTIONS, SH8 } from './_parts'
import { vehiclePhotos, photoChecklist } from '../../data/states-records'

const REASONS = ['Sold in Oct 2026', 'No longer insured', 'Scrapped', 'Transferred to family member']

export default function VehicleMarkInactive() {
  const [reason, setReason] = useState(REASONS[0])
  return (
    <HolderShell
      tab="vehicles"
      crumb="VEHICLES"
      statusChip={<StatusChip tone="green" icon="check">Active</StatusChip>}
      actions={HOLDER_ACTIONS}
      counts={{ family: 3, documents: 3, vehicles: 1, quotations: 3, policies: 2, renewals: 1 }}
      overlay={
        <>
          <Toast>Vehicle KA 01 MX 4521 added</Toast>
          <Scrim to="/x/pv2-vehicle-added" />
          <Dialog top={160} icon="car" iconBg="bg-[#fbebec]" iconColor="text-[#b4323c]" title="Mark KA 01 MX 4521 inactive?" body="Use this when it’s sold or no longer insured. RC and photos are kept.">
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-ink">Reason</span>
              <span className="flex h-[50px] items-center rounded-[16px] bg-panel px-4">
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="min-w-0 flex-1 appearance-none bg-transparent text-[14px] font-semibold text-ink outline-none">
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
                <Icon name="chev-down" size={18} className="pointer-events-none text-muted" />
              </span>
            </label>
            <div className="flex gap-2.5">
              <DialogButton to="/x/pv2-vehicle-added">Cancel</DialogButton>
              <DialogButton variant="danger" icon="x" to="/x/pv2-vehicle-added">Mark inactive</DialogButton>
            </div>
          </Dialog>
        </>
      }
    >
      <div className="mt-6 flex items-start gap-5">
        <Panel className={cx('flex w-[760px] flex-col gap-3.5', SH8)}>
          <div className="flex items-center gap-3.5">
            <span className="flex size-[52px] items-center justify-center rounded-[26px] bg-[#d9eafd]">
              <Icon name="car" size={24} className="text-blue" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5 whitespace-nowrap">
              <p className="text-[17px] font-bold text-ink">KA 01 MX 4521</p>
              <p className="text-[12px] font-medium text-muted">Hyundai Creta SX · 2022 · Private car</p>
            </div>
            <StatusChip tone="green" icon="check">5 of 6 photos</StatusChip>
            <SmallButton variant="navy" icon="quote" to="/x/q1-quotation-customer">Motor quotation</SmallButton>
            <SmallButton icon="x">Mark inactive</SmallButton>
          </div>
          <div className="flex gap-2">
            {vehiclePhotos.map((p) => (
              <div key={p} className="flex h-[52px] w-[110px] flex-col items-center justify-center gap-1 rounded-[12px] bg-panel">
                <Icon name="check" size={14} className="text-[#127650]" />
                <p className="text-[11px] font-semibold text-ink">{p}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className={cx('flex w-[400px] flex-col gap-3.5', SH8)}>
          <PanelHead title="What you’ll need" subtitle="For each vehicle" />
          <div className="flex flex-wrap gap-2">
            {photoChecklist.map((p) => (
              <div key={p.label} className="flex h-[63px] w-[108px] flex-col items-center justify-center gap-1.5 rounded-[16px] bg-panel">
                <Icon name={p.icon} size={18} className="text-muted" />
                <p className="text-[12px] font-semibold text-ink">{p.label}</p>
              </div>
            ))}
          </div>
          <p className="text-[12px] leading-[18px] font-medium text-muted">RC plus 4 photos minimum. Registration number checked against the RC format.</p>
        </Panel>
      </div>
    </HolderShell>
  )
}
