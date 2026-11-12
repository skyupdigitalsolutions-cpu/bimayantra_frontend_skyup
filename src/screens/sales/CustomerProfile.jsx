// Figma 9:845 · 05 · Customer profile
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, IconButton, SearchPill } from '../../components/ui'
import { PillButton, SChip, SCard, SCardHead, KVItem, SegTabs, Dot, NOWRAP } from './_parts'
import { customerProfile as MOCK, customerTabs as MOCK_TABS } from '../../data/sales'
import { useCtrlK } from '../tasks/_filter'

function MaskedRow({ label, masked, onShow, shown }) {
  return (
    <div className="flex items-center gap-3 rounded-[18px] bg-panel py-3 pr-3 pl-4">
      <Icon name="lock" size={18} className="text-muted" />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[12px] font-medium text-muted">{label}</p>
        <p className="text-[16px] font-bold tracking-[0.6px] text-ink">{shown ?? masked ?? 'Not added'}</p>
      </div>
      {masked && !shown && <PillButton variant="outline" size="sm" icon="eye" className="pl-[13px] pr-[15px]" {...(onShow ? { onClick: onShow } : { to: '/customers' })}>Show</PillButton>}
    </div>
  )
}

/** data: live view model from src/live/Customers.jsx (same keys as the mock); without it the Figma mock renders. */
export default function CustomerProfile({ data }) {
  useCtrlK()
  const C = data ?? MOCK
  const customerTabs = data?.tabs ?? MOCK_TABS
  return (
    <AppLayout active="customers">
      <PageHeader
        className={NOWRAP}
        hideSearch
        breadcrumb={`POLICY HOLDERS  /  ${C.name.toUpperCase()}`}
        title={C.name}
        titleExtra={data ? <SChip tone={data.active ? 'green' : 'gray'} icon={data.active ? 'check' : 'x'}>{data.active ? 'Active' : 'Inactive'}</SChip> : <SChip tone="green" icon="check">Active</SChip>}
        subtitle={C.meta}
        actions={
          <>
            <SearchPill />
            {data?.statusActions ?? <PillButton variant="danger" size="sm" className="px-3.5" to="/customers">Deactivate</PillButton>}
            <IconButton icon="bell" />
            <PillButton variant="outline" icon="target" className="pl-[17px]" to={data?.bestFitTo ?? '/best-fit'}>Best fit</PillButton>
            {data?.active !== false && <PillButton variant="pink" icon="quote" to={data?.quoteTo ?? '/quotations/new'}>New quotation</PillButton>}
          </>
        }
      />

      {/* Profile hero */}
      <div className="mt-[13px] flex flex-wrap items-center gap-4 rounded-[32px] bg-linear-to-r from-[#fbd3dc] to-[#f6b3c3] px-5 py-5 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)] md:gap-6 md:px-8 md:py-[26px] xl:h-[144px] xl:flex-nowrap">
        <span className="flex size-[92px] shrink-0 items-center justify-center rounded-full border-4 border-white bg-white text-[29px] font-bold text-navy">
          {C.initials}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">{C.name}</p>
          <p className="text-[13px] font-medium text-rose-ink">{C.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {data ? <SChip tone={data.consentChip.tone} icon={data.consentChip.icon}>{data.consentChip.label}</SChip> : <SChip tone="green" icon="check">WhatsApp consent</SChip>}
            {(data ? data.sourceChip : 'Referred by Shanthi Rao') && <SChip tone="gray" icon="link">{data ? data.sourceChip : 'Referred by Shanthi Rao'}</SChip>}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 xl:flex-nowrap">
          {C.minis.map(([k, v]) => (
            <div key={k} className="flex h-[70px] flex-col gap-0.5 rounded-[20px] bg-white/80 px-5 py-3.5">
              <p className="text-[12px] font-semibold whitespace-nowrap text-rose-ink">{k}</p>
              <p className="text-[20px] font-bold whitespace-nowrap text-ink">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <SegTabs className="mt-5" items={customerTabs} value="overview" />

      <div className="mt-7 flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-5">
          <SCard>
            <SCardHead
              title="Details"
              subtitle="Contact, address and dates"
              right={data?.active === false ? null : <PillButton variant="ghost" size="sm" icon="edit" to={data?.editTo ?? '/customers'}>Edit</PillButton>}
            />
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {C.details.map(([k, v]) => <KVItem key={k} k={k} v={v} />)}
            </div>
            <KVItem k="Address" v={C.address} className="w-auto" />
          </SCard>

          <SCard>
            <SCardHead title="Household" subtitle={data ? data.householdSub : '3 members · default nominee Arjun Hegde'} />
            {C.members.length === 0 && <p className="text-[13px] font-medium text-muted">No family members yet.</p>}
            <div className="flex gap-3.5">
              {C.members.map((m) => (
                <div key={m.name} className="flex w-[224px] items-center gap-3 rounded-[22px] bg-panel py-3 pr-4 pl-3">
                  <Dot initials={m.initials} bg={m.bg} size={44} font={14} />
                  <div className="flex flex-col gap-0.5 whitespace-nowrap">
                    <p className="text-[14px] font-bold text-ink">{m.name}</p>
                    <p className={`text-[12px] font-medium ${m.warn ? 'text-[#b4323c]' : 'text-muted'}`}>{m.rel}</p>
                  </div>
                </div>
              ))}
            </div>
          </SCard>
        </div>

        <div className="flex w-[400px] flex-col gap-5">
          <SCard>
            <SCardHead title="Identity numbers" subtitle="From confirmed documents" right={data ? <SChip tone={data.consentChip.tone} icon={data.consentChip.icon}>{data.consentChip.short}</SChip> : <SChip tone="green" icon="check">Consent given</SChip>} />
            {C.ids.map((x) => <MaskedRow key={x.label} {...x} />)}
            <p className="text-[12px] leading-[18px] font-medium text-muted">
              Showing a full number is recorded. It hides again after 30 seconds.
            </p>
          </SCard>

          <SCard>
            <SCardHead title="Open items" />
            {C.openItems.length === 0 && <p className="text-[13px] font-medium text-muted">Nothing open.</p>}
            {C.openItems.map((it) => {
              const body = (
                <>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink" style={{ background: it.bg }}>
                    <Icon name={it.icon} size={18} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-[13px] font-bold text-ink">{it.title}</p>
                    <p className="text-[12px] font-medium text-muted">{it.sub}</p>
                  </div>
                  <SChip tone={it.chip[0]}>{it.chip[1]}</SChip>
                </>
              )
              return it.to ? (
                <Link key={it.title} to={it.to} className="-mx-2 flex items-center gap-3 rounded-[16px] px-2 hover:bg-panel-2">{body}</Link>
              ) : (
                <div key={it.title} className="flex items-center gap-3">{body}</div>
              )
            })}
          </SCard>
        </div>
      </div>
    </AppLayout>
  )
}