// Figma 25:2215 · 23 · SkyUp Admin — Approvals
import { useState } from 'react'
import Icon from '../../components/Icon'
import { AdminLayout, AdminHeader, ACard, ACardHead, SButton, Pill, SegTabs, PanelScrim, Dialog, IconDisc, OtpBoxes, HButton } from './_parts'
import { approvals } from '../../data/admin'
import { NoMatches } from './_filter'

/** Field / Live now / Pending comparison table */
export function DiffTable({ rows }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[18px] bg-panel p-1">
      <div className="flex gap-3 px-3.5 py-2.5 text-[11px] font-semibold text-muted">
        <p className="w-[180px]">Field</p>
        <p className="w-[458px]">Live now</p>
        <p className="min-w-0 flex-1">Pending</p>
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="flex h-10 items-center gap-3 rounded-[14px] bg-white px-3.5">
          <p className="w-[180px] text-[13px] font-semibold text-ink">{r[0]}</p>
          <p className="w-[458px] text-[13px] font-medium text-muted">{r[1]}</p>
          <p className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px] font-bold text-[#127650]">
            <Icon name="arrow" size={13} />
            {r[2]}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function Approvals() {
  const [tab, setTab] = useState('pending')
  const [dialog, setDialog] = useState(1)
  const [decided, setDecided] = useState({})
  const pending = approvals.filter((_, i) => !decided[i])
  const list = tab === 'pending' ? approvals.map((a, i) => [a, i]).filter(([, i]) => !decided[i]) : approvals.map((a, i) => [a, i]).filter(([, i]) => decided[i])

  return (
    <AdminLayout
      active="approvals"
      overlay={null}
    >
      <AdminHeader title="Approvals" subtitle="Each change is approved by a different admin, with an OTP. Live values stay in use until then." />

      <SegTabs
        className="mt-[41px]"
        value={tab}
        onChange={setTab}
        items={[
          { key: 'pending', label: 'Pending', count: pending.length },
          { key: 'decided', label: 'Decided', count: Object.keys(decided).length },
        ]}
      />

      <div className="mt-6 flex flex-col gap-4">
        {list.length === 0 && (
          <ACard>
            <NoMatches
              label={tab === 'pending' ? 'Nothing waiting' : 'No decisions yet'}
              hint={tab === 'pending' ? 'Every change has been approved or rejected.' : 'Approved and rejected changes show up here.'}
              clearLabel={tab === 'pending' ? 'See decided' : 'See pending'}
              onClear={() => setTab(tab === 'pending' ? 'decided' : 'pending')}
            />
          </ACard>
        )}
        {list.map(([a, i]) => (
          <ACard key={a.title} className="flex flex-col gap-4">
            <ACardHead
              title={a.title}
              subtitle={a.meta}
              right={
                decided[i] ? (
                  <Pill tone={decided[i] === 'ok' ? 'green' : 'red'} icon={decided[i] === 'ok' ? 'check' : 'x'}>{decided[i] === 'ok' ? 'Approved' : 'Rejected'}</Pill>
                ) : (
                  <Pill tone="violet" icon="clock">Pending approval</Pill>
                )
              }
            />
            <DiffTable rows={a.rows} />
            {!decided[i] && (
              <div className="flex items-center gap-2.5">
                {a.own ? (
                  <>
                    <SButton icon="lock" className="bg-[#eef1f5] pr-3.5 pl-3 text-faint">Approve</SButton>
                    <p className="text-[13px] font-semibold text-[#8a5a12]">You made this change. A different admin must approve it.</p>
                  </>
                ) : (
                  <>
                    <SButton variant="navy" icon="check" onClick={() => setDialog(i + 1)}>Approve</SButton>
                    <SButton variant="outline" icon="x" onClick={() => setDecided({ ...decided, [i]: 'no' })}>Reject</SButton>
                  </>
                )}
              </div>
            )}
          </ACard>
        ))}
      </div>

      {dialog > 0 && (
        <PanelScrim onClose={() => setDialog(0)}>
          <Dialog top={240} left={390} className="flex w-[480px] flex-col items-center gap-[18px]">
            <IconDisc icon="check" size={64} iconSize={30} className="bg-[#e7f4ee]" iconClass="text-[#127650]" />
            <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">Approve {approvals[dialog - 1]?.short ?? 'this change'}?</p>
            <p className="w-[416px] text-center text-[13px] leading-5 font-medium text-muted">
              The pending values go live from the next request. Records already saved are not changed.
            </p>
            <p className="text-[12px] font-semibold text-muted">OTP sent to your mobile</p>
            <OtpBoxes />
            <div className="flex w-full gap-2.5">
              <HButton variant="outline" onClick={() => setDialog(0)} className="w-[206px] justify-center px-5">Cancel</HButton>
              <HButton
                variant="navy"
                icon="check"
                onClick={() => {
                  setDecided({ ...decided, [dialog - 1]: 'ok' })
                  setDialog(0)
                }}
                className="w-[200px] justify-center pr-5 pl-4"
              >
                Approve
              </HButton>
            </div>
          </Dialog>
        </PanelScrim>
      )}
    </AdminLayout>
  )
}
