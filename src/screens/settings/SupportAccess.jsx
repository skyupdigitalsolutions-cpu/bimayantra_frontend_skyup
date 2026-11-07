// Figma 48:7887 · S08 · Settings — Support access
import { useState } from 'react'
import Icon from '../../components/Icon'
import { SettingsLayout, SCard, SHead, SBtn, SChip } from './_parts'
import { supportOpened } from '../../data/settings'
import { matches, clearHeaderSearch, NoMatches } from '../admin/_filter'

export default function SupportAccess() {
  const [active, setActive] = useState(true)
  const [q, setQ] = useState('')
  const opened = supportOpened.filter(([t, w]) => matches(q, t, w))
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  SUPPORT ACCESS"
      title="Support access"
      titleExtra={active && <SChip tone="green" icon="eye">Active now</SChip>}
      subtitle="SkyUp sees your customers only if you allow it. Read only, up to 24 hours."
      actions={<SBtn size="lg" icon="eye" to="/x/sa1-support-access-give-access">Give access</SBtn>}
      contentClass="gap-[18px]"
      onSearch={setQ}
    >
      {active && (
        <div className="flex items-center gap-4 rounded-[28px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <div className="flex size-[76px] shrink-0 flex-col items-center justify-center rounded-full bg-white text-[#5b3fb8]">
            <span className="text-[20px] leading-[25px] font-bold">22h</span>
            <span className="text-[10px] font-semibold">left</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-[17px] font-bold text-ink">Rahul N (SkyUp support) can view your customers</p>
            <p className="text-[13px] leading-5 font-medium text-[#5b3fb8]">Reason: Ticket #4471, quotation PDF shows wrong name · ends 27 Oct 2026, 09:30</p>
          </div>
          <SBtn variant="danger" size="lg" icon="x" className="border-[#f2c4c8] text-[#b4323c]" onClick={() => setActive(false)}>End access now</SBtn>
        </div>
      )}

      <SCard className="gap-2.5 p-6">
        <SHead title="Records they opened" subtitle="Updated live · also in your activity log" />
        {opened.length === 0 && <NoMatches onClear={() => { clearHeaderSearch(); setQ('') }} hint={`No records match “${q}”.`} />}
        {opened.map(([t, w]) => (
          <div key={t} className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-white"><Icon name="eye" size={16} className="text-ink" /></span>
            <p className="flex-1 text-[13px] font-bold text-ink">{t}</p>
            <p className="text-[12px] font-medium text-muted">{w}</p>
          </div>
        ))}
      </SCard>

      <SCard className="gap-2.5 p-6">
        <SHead title="Past access" />
        <div className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-bold text-ink">Divya P (SkyUp support)</p>
            <p className="text-[12px] font-medium text-muted">12 Sep, 10:00 to 12 Sep, 12:00 · 3 records opened</p>
          </div>
          <SChip>Ended</SChip>
        </div>
      </SCard>
    </SettingsLayout>
  )
}
