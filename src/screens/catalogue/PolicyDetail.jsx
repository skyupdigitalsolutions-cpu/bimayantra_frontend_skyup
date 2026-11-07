// Figma 11:1662 · 12 · Policy detail
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { Header, HeadButton, SmallButton, StatusChip, Panel, PanelHead, RingAvatar } from './_parts'
import { policyDetail as p } from '../../data/catalogue'

export default function PolicyDetail() {
  return (
    <AppLayout active="policies">
      <Header
        breadcrumb={`POLICIES  /  ${p.ref}`}
        title={p.number}
        titleExtra={<StatusChip tone="green" icon="check">Issued</StatusChip>}
        subtitle={`${p.ref} · ${p.customer} · ${p.product}`}
        actions={
          <>
            <HeadButton variant="white" icon="x" to="/x/po1-policy-record-cancellation" className="border-[#f2c4c8] text-[#b4323c]">Record cancellation</HeadButton>
            <HeadButton variant="white" icon="edit">Correct details</HeadButton>
            <HeadButton variant="navy" icon="users">Edit nominees</HeadButton>
          </>
        }
      />

      {/* Coverage hero */}
      <section className="mt-[37px] flex w-[1180px] items-center gap-6 rounded-[32px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-[30px] py-[26px] shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-[36px] bg-white/90">
          <Icon name="shield" size={32} className="text-[#127650]" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <p className="text-[22px] font-bold tracking-[-0.22px] text-ink">{p.product}</p>
          <p className="text-[13px] font-medium text-[#2f6b55]">{p.covers}</p>
          <div className="flex w-[520px] flex-col gap-1.5">
            <div className="h-2.5 overflow-hidden rounded-[5px] bg-white/70">
              <div className="h-full rounded-[5px] bg-[#16845b]" style={{ width: `${p.progress * 100}%` }} />
            </div>
            <div className="flex text-[12px]">
              <p className="flex-1 font-semibold text-[#2f6b55]">{p.start}</p>
              <p className="font-bold whitespace-nowrap text-ink">{p.end}</p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5 rounded-[20px] bg-white/80 px-5 py-3.5">
          <p className="text-[12px] font-semibold text-[#2f6b55]">Premium</p>
          <p className="text-[22px] font-bold text-ink">{p.premium}</p>
        </div>
      </section>

      <div className="mt-7 flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-5">
          <Panel className="flex flex-col gap-4">
            <PanelHead title="Policy" subtitle={p.source} right={<SmallButton icon="download">Policy PDF</SmallButton>} />
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {p.kv.map(([k, v]) => (
                <div key={k} className="flex w-[220px] flex-col gap-1 whitespace-nowrap">
                  <p className="text-[12px] font-medium text-muted">{k}</p>
                  <p className="text-[14px] font-semibold text-ink">{v}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="flex flex-col gap-4">
            <PanelHead title="Nominees" subtitle="Version 1 · 28 Nov 2025" right={<StatusChip tone="green" icon="check">100%</StatusChip>} />
            {p.nominees.map((n) => (
              <div key={n.name} className="flex items-center gap-3.5 rounded-[20px] bg-panel px-4 py-3.5">
                <RingAvatar initials={n.initials} bg="bg-blue-100" size={44} text={14} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-ink">{n.name}</p>
                  <p className="text-[12px] font-medium text-muted">{n.sub}</p>
                </div>
                <p className="text-[18px] font-bold text-ink">{n.share}</p>
              </div>
            ))}
            <p className="text-[12px] leading-[18px] font-medium text-muted">
              Changes need the insurer’s endorsement reference. Each save keeps the earlier version.
            </p>
          </Panel>
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-[28px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-6 shadow-[0px_14px_30px_-12px_rgba(201,138,46,0.2)]">
            <PanelHead title="Renewal" right={<StatusChip tone="amber" icon="alert">Due</StatusChip>} />
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 items-center justify-center rounded-[28px] bg-white text-[18px] font-bold text-ink">38</span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[16px] font-bold text-ink">days to renewal</p>
                <p className="text-[12px] font-medium text-[#8a5a12]">Reminders on: 60 days sent</p>
              </div>
            </div>
            <SmallButton variant="navy" icon="arrow" to="/x/n1-renewal-detail" className="self-start">Open renewal</SmallButton>
          </div>

          <div className="flex flex-col gap-4 rounded-[28px] bg-rail p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.05)]">
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[17px] font-bold text-white">Expected commission</p>
              <span className="flex items-center gap-[5px] rounded-[12px] bg-white/12 px-2.5 py-[5px] text-[11px] font-semibold text-white">
                <Icon name="lock" size={13} className="text-[#f7b9c4]" />
                Only you
              </span>
            </div>
            <p className="text-[32px] font-bold tracking-[-0.64px] text-white">{p.commission}</p>
            <p className="text-[12px] leading-[18px] font-medium text-[#c9d6ea]">15% of premium before tax. For your reference only.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
