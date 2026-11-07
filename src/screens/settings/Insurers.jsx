// Figma 47:7464 · S04 · Settings — My insurers
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, SBtn, SChip, SNote } from './_parts'
import { insurers } from '../../data/settings'
import { matches, clearHeaderSearch, NoMatches } from '../admin/_filter'

export default function Insurers() {
  const [q, setQ] = useState('')
  const rows = insurers.filter((r) => matches(q, r.name, r.code, r.until, r.status))
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  MY INSURERS"
      title="My insurers"
      subtitle="Quotations need an active agent code for the insurer."
      actions={<SBtn variant="pink" size="lg" icon="plus" to="/x/in1-my-insurers-add-insurer">Add insurer</SBtn>}
      contentClass="gap-[18px]"
      onSearch={setQ}
    >
      <SCard className="gap-2.5 p-6">
        <SHead title="Insurers and agent codes" subtitle="5 added · 4 active" />
        {rows.length === 0 && <NoMatches onClear={() => { clearHeaderSearch(); setQ('') }} hint={`No insurers match “${q}”.`} />}
        {rows.map((r) => {
          const expired = r.status === 'expired'
          return (
            <div
              key={r.code}
              className={cx('flex items-center gap-3.5 rounded-[20px] p-3.5', expired ? 'border border-[#f2c4c8] bg-[#fff7f7]' : 'bg-panel')}
            >
              <span className="flex size-[42px] items-center justify-center rounded-full bg-white text-[13px] font-bold text-ink">{r.ini}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[14px] font-bold text-ink">{r.name}</p>
                <p className="text-[12px] font-medium text-muted">Agent code {r.code} · valid until {r.until}</p>
              </div>
              {r.status === 'active' && <SChip tone="green" icon="check">Active</SChip>}
              {r.status === 'expiring' && <SChip tone="amber" icon="clock">Expires in 66 days</SChip>}
              {expired && <SChip tone="red" icon="x">Expired</SChip>}
              {r.to ? (
                <Link to={r.to} className="flex h-9 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink">
                  {r.action}
                </Link>
              ) : (
                <button type="button" className="flex h-9 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink">
                  {r.action}
                </button>
              )}
            </div>
          )
        })}
      </SCard>
      <SNote>Deactivating an insurer stops new quotations for it. Existing quotations and policies stay.</SNote>
    </SettingsLayout>
  )
}
