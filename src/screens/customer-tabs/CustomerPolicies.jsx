// Figma 56:8633 · 05f · Customer — Policies
import { useState } from 'react'
import { cx } from '../../components/ui'
import { ProfileShell, PillButton, SChip, IconTile, CARD_SHADOW } from './_parts'
import { policies } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'

export default function CustomerPolicies() {
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const rows = policies.filter((p) => matches(q, p.title, p.sub, p.term, p.chip[2], p.boxes))
  return (
    <ProfileShell tab="policies" crumb="POLICIES">
      <div className="flex gap-5">
        {rows.map((p) => (
          <section key={p.title} className={cx('flex w-[580px] flex-col gap-4 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
            <div className="flex items-center gap-3.5">
              <IconTile icon="shield" bg={p.bg} size={52} iconSize={24} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                <p className="text-[16px] font-bold text-ink">{p.title}</p>
                <p className="text-[12px] font-medium text-muted">{p.sub}</p>
              </div>
              <SChip tone={p.chip[0]} icon={p.chip[1]}>{p.chip[2]}</SChip>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 overflow-hidden rounded-[5px] bg-panel">
                {p.progress > 0 && <div className="h-full rounded-[5px] bg-[#16845b]" style={{ width: `${p.progress}%` }} />}
              </div>
              <p className="text-[12px] font-semibold text-ink-2">{p.term}</p>
            </div>
            <div className="flex gap-2.5">
              {p.boxes.map(([k, v]) => (
                <div key={k} className="flex h-14 flex-1 flex-col gap-0.5 rounded-[14px] bg-panel p-3 whitespace-nowrap">
                  <p className="text-[11px] font-medium text-muted">{k}</p>
                  <p className="text-[13px] font-bold text-ink">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <PillButton variant="navy" size="sm" icon="arrow" to="/policies/1">Open policy</PillButton>
              <PillButton variant="outline" size="sm" icon={p.second.icon} to={p.second.to}>{p.second.label}</PillButton>
            </div>
          </section>
        ))}
        {!rows.length && <NoMatches className="w-[580px] bg-white" label={`No policies match “${q}”`} onClear={() => setQ('')} />}
      </div>
      <PillButton variant="pink" icon="plus" className="mt-[59px]" to="/x/pp2-record-existing-policy">Record existing policy</PillButton>
    </ProfileShell>
  )
}
