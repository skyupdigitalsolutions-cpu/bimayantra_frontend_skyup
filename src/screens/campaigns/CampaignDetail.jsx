// Figma 298:40033 · CA2 · Campaign detail
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { cx } from '../../components/ui'
import { detailStats, leadsPerDay, detailAds, detailLeads } from '../../data/campaigns'
import { Icon, PageHead, Pill, Btn, Avatar, CardHead, EmptyRow, cardCls } from './_parts'

export default function CampaignDetail() {
  // Clicking an ad narrows "Leads from this campaign" to that ad; click again (or ×) to clear.
  const [ad, setAd] = useState(null)
  const leads = ad ? detailLeads.filter((l) => l.ad === ad) : detailLeads
  return (
    <AppLayout active="campaigns">
      <PageHead
        crumb="CAMPAIGNS  /  DIWALI FAMILY FLOATER"
        title="Diwali family floater"
        chip={<Pill tone="green" icon="check">Active</Pill>}
        sub="Meta Ads · lead form “Family cover quote” · Health pipeline · since 12 Oct 2026"
        actions={
          <>
            <Btn icon="link">Open in Meta</Btn>
            <Btn icon="refresh">Sync now</Btn>
          </>
        }
      />

      <div className="mt-[21px] flex gap-4">
        {detailStats.map((s) => (
          <div key={s.label} className="flex h-[79px] flex-1 flex-col gap-1 rounded-[20px] p-4" style={{ background: s.bg }}>
            <p className="text-[12px] font-semibold text-ink-2">{s.label}</p>
            <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-[31px] flex items-start gap-5">
        <div className={cx('flex h-[239px] w-[760px] shrink-0 flex-col gap-3 p-6', cardCls)}>
          <CardHead title="Leads per day" sub="Last 14 days" />
          <div className="flex h-[140px] items-end gap-2.5">
            {leadsPerDay.map(([h, d], i) => (
              <div key={d} className="flex flex-1 flex-col items-center gap-1">
                <span className={cx('w-[30px] rounded-[6px]', i === leadsPerDay.length - 1 ? 'bg-[#1f5fd6]' : 'bg-[#c9daf8]')} style={{ height: h }} />
                <span className="text-[9px] font-medium text-muted">{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cx('flex h-[237px] min-w-0 flex-1 flex-col gap-2.5 p-6', cardCls)}>
          <CardHead title="Ads in this campaign" sub="Leads by ad · click to filter" />
          {detailAds.map((a) => {
            const on = ad === a.name
            return (
              <button
                key={a.name}
                type="button"
                aria-pressed={on}
                onClick={() => setAd(on ? null : a.name)}
                className={cx('flex h-10 items-center gap-2.5 rounded-[14px] px-3 text-left', on ? 'bg-[#e8f0fd] ring-[1.5px] ring-[#1f5fd6]' : 'bg-panel hover:bg-tile')}
              >
                <p className="flex-1 text-[13px] font-semibold text-ink">{a.name}</p>
                <p className="text-[13px] font-bold text-[#1f5fd6]">{a.leads}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className={cx('mt-5 flex flex-col gap-2 p-6', cardCls)}>
        <CardHead
          title="Leads from this campaign"
          sub="Created automatically in Leads · Health pipeline"
          right={
            <div className="flex items-center gap-3">
            {ad && (
              <button type="button" onClick={() => setAd(null)} className="flex h-[25px] items-center gap-1.5 rounded-[14px] bg-[#e8f0fd] pr-2 pl-3 text-[12px] font-semibold text-[#1f5fd6]">
                Ad: {ad}
                <Icon name="x" size={12} />
              </button>
            )}
            <Link to="/leads" className="flex items-center gap-1.5 text-[13px] font-bold text-[#1f5fd6] hover:underline">
              Open in Leads
              <Icon name="arrow" size={14} />
            </Link>
            </div>
          }
        />
        {leads.map((l) => (
          <Link key={l.name} to={l.to} className="flex h-14 items-center gap-3.5 rounded-[14px] px-1 hover:bg-panel-2">
            <Avatar initials={l.initials} bg={l.bg} />
            <div className="flex w-[220px] flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">{l.name}</p>
              <p className="text-[12px] font-medium text-muted">{l.phone}</p>
            </div>
            <p className="w-[220px] text-[12px] font-semibold text-ink-2">{l.ad}</p>
            <p className="w-[140px] text-[12px] font-medium text-muted">{l.when}</p>
            <div className="w-[170px]"><Pill tone={l.tone}>{l.chip}</Pill></div>
            <p className={cx('flex-1 text-[12px] font-medium', l.noteWarn ? 'text-[#8a5a12]' : 'text-muted')}>{l.note}</p>
            <Icon name="chev-right" size={16} className="text-muted" />
          </Link>
        ))}
        {leads.length === 0 && <EmptyRow className="h-14 px-1" text="No recent leads from this ad" onClear={() => setAd(null)} />}
      </div>
    </AppLayout>
  )
}
