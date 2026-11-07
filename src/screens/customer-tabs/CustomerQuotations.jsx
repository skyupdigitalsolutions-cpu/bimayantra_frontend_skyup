// Figma 55:9116 · 05e · Customer — Quotations
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../components/ui'
import { ProfileShell, SChip, IconTile, Chev, CARD_SHADOW } from './_parts'
import { quotations } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'

export default function CustomerQuotations() {
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const rows = quotations.filter((x) => matches(q, x.title, x.sub, x.status, x.amount, x.chip[2]))
  return (
    <ProfileShell tab="quotations" crumb="QUOTATIONS">
      <div className="flex flex-col gap-3.5">
        {rows.map((q) => (
          <Link
            key={q.title}
            to="/quotations/1"
            className={cx('group flex h-[84px] items-center gap-4 rounded-[24px] bg-white px-[22px] py-[18px]', CARD_SHADOW)}
          >
            <IconTile icon={q.icon} bg={q.bg} />
            <div className="flex min-w-0 flex-1 flex-col gap-[3px] whitespace-nowrap">
              <p className="text-[15px] font-bold text-ink">{q.title}</p>
              <p className="text-[12px] font-medium text-muted">{q.sub}</p>
            </div>
            <p className="w-[220px] text-[12px] font-semibold whitespace-nowrap text-ink-2">{q.status}</p>
            <p className="w-[110px] text-[16px] font-bold whitespace-nowrap text-ink">{q.amount}</p>
            <SChip tone={q.chip[0]} icon={q.chip[1]}>{q.chip[2]}</SChip>
            <Chev />
          </Link>
        ))}
        {!rows.length && <NoMatches className="bg-white" label={`No quotations match “${q}”`} onClear={() => setQ('')} />}
      </div>
    </ProfileShell>
  )
}
