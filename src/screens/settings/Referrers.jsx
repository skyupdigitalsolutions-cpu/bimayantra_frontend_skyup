// Figma 47:8206 · S07 · Settings — Referrers
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { SettingsLayout, SCard, SHead, SBtn, SChip } from './_parts'
import { referrerStats, referrers } from '../../data/settings'
import { matches, clearHeaderSearch, NoMatches } from '../admin/_filter'

const moreBtn = 'flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'

export default function Referrers() {
  const [q, setQ] = useState('')
  const rows = referrers.filter((r) => matches(q, r.name, r.sub, r.status))
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  REFERRERS"
      title="Referrers"
      subtitle="People who send you leads. Each link is valid for 365 days."
      actions={<SBtn variant="pink" size="lg" icon="plus">Add referrer</SBtn>}
      contentClass="gap-[18px]"
      onSearch={setQ}
    >
      <div className="flex gap-5 rounded-[26px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] px-[26px] py-5">
        {referrerStats.map(([n, l]) => (
          <div key={l} className="flex flex-1 flex-col gap-0.5">
            <p className="text-[26px] font-bold tracking-[-0.5px] text-ink">{n}</p>
            <p className="text-[12px] font-semibold text-[#5b3fb8]">{l}</p>
          </div>
        ))}
      </div>

      <SCard className="gap-2.5 p-6">
        <SHead title="Referrers" subtitle="3 of 25" />
        {rows.length === 0 && <NoMatches onClear={() => { clearHeaderSearch(); setQ('') }} hint={`No referrers match “${q}”.`} />}
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3.5 rounded-[20px] bg-panel p-3.5">
            <span className="flex size-11 items-center justify-center rounded-full border-2 border-white text-[14px] font-bold text-navy" style={{ background: r.bg }}>{r.ini}</span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">{r.name}</p>
              <p className="text-[12px] font-medium text-muted">{r.sub}</p>
            </div>
            <SChip tone={r.status === 'Active' ? 'green' : 'blue'}>{r.status}</SChip>
            <SBtn variant="white" icon="chat">Share invite</SBtn>
            {r.to ? (
              <Link to={r.to} className={moreBtn}><Icon name="more" size={15.1} className="text-ink" /></Link>
            ) : (
              <button type="button" className={moreBtn}><Icon name="more" size={15.1} className="text-ink" /></button>
            )}
          </div>
        ))}
      </SCard>
    </SettingsLayout>
  )
}
