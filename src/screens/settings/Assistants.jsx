// Figma 47:7954 · S06 · Settings — Assistants
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, SBtn, SChip } from './_parts'
import { assistantRules } from '../../data/settings'

function RuleCard({ ok, title, items }) {
  return (
    <div className={cx('flex flex-1 flex-col gap-2.5 rounded-[28px] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]', ok ? 'bg-[#f5fbf8]' : 'bg-[#fff7f7]')}>
      <p className={cx('text-[15px] font-bold', ok ? 'text-[#127650]' : 'text-[#b4323c]')}>{title}</p>
      {items.map((t) => (
        <div key={t} className="flex items-center gap-2.5">
          <span className={cx('flex size-[22px] items-center justify-center rounded-full', ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbebec] text-[#b4323c]')}>
            <Icon name={ok ? 'check' : 'x'} size={12} />
          </span>
          <span className="text-[13px] font-medium text-ink">{t}</span>
        </div>
      ))}
    </div>
  )
}

export default function Assistants() {
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  ASSISTANTS"
      title="Assistants"
      titleExtra={<SChip tone="blue">1 of 2</SChip>}
      subtitle="Up to 2 on Premium. Included in your trial."
      actions={<SBtn variant="pink" size="lg" icon="user-plus">Add assistant</SBtn>}
      contentClass="gap-[18px]"
    >
      <SCard className="gap-3.5 p-6">
        <SHead title="Assistants" />
        <div className="flex items-center gap-3.5 rounded-[22px] bg-panel p-4">
          <span className="flex size-[52px] items-center justify-center rounded-full border-2 border-white bg-violet-100 text-[17px] font-bold text-navy">PK</span>
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-[15px] font-bold text-ink">Priya K</p>
            <p className="text-[12px] font-medium text-muted">98765 00011 · last login today, 09:12</p>
            <p className="text-[12px] font-medium text-slate">Recent: uploaded Aadhaar v2 for Kavya · shared QT-202610-00012 R2</p>
          </div>
          <SChip tone="green" icon="check">Active</SChip>
          <Link to="/x/as1-assistant-disable" className="flex h-9 items-center rounded-[18px] border border-[#f2c4c8] bg-white px-3.5 text-[13px] font-semibold text-[#b4323c]">
            Disable
          </Link>
        </div>
        <button type="button" className="flex h-14 items-center justify-center gap-3 rounded-[22px] border border-dashed border-[#c3ccd8] text-[13px] font-semibold text-muted">
          <Icon name="user-plus" size={18} />
          Add a second assistant
        </button>
      </SCard>
      <div className="flex gap-[18px]">
        <RuleCard ok title="Assistants can" items={assistantRules.can} />
        <RuleCard title="Assistants cannot" items={assistantRules.cannot} />
      </div>
    </SettingsLayout>
  )
}
