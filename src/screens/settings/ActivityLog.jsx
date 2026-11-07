// Figma 48:8364 · S10 · Settings — Activity log
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SettingsLayout, SBtn } from './_parts'
import { activityLog } from '../../data/settings'
import { matches, clearHeaderSearch, NoMatches } from '../admin/_filter'

const TABS = ['All', 'You', 'Priya', 'System', 'SkyUp']
const soft = 'shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]'

export default function ActivityLog() {
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')
  const groups = activityLog
    .map((g) => ({ ...g, items: g.items.filter((e) => (tab === 'All' || e.who === tab) && matches(q, e.title, e.meta)) }))
    .filter((g) => g.items.length)
  const clear = () => {
    clearHeaderSearch()
    setQ('')
    setTab('All')
  }
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  ACTIVITY LOG"
      title="Activity log"
      subtitle="Everything done in your account. Entries cannot be changed or deleted."
      actions={<SBtn variant="white" size="lg" icon="download">Export CSV</SBtn>}
      contentClass="gap-[18px]"
      onSearch={setQ}
    >
      <div className="flex items-center gap-3">
        <label className={cx('flex h-[46px] w-[300px] items-center gap-2.5 rounded-[24px] bg-white px-4', soft)}>
          <Icon name="search" size={16} className="text-muted" />
          <input placeholder="Search activity" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink outline-none placeholder:text-faint" />
        </label>
        <div className={cx('flex gap-1 rounded-[26px] bg-white p-[5px]', soft)}>
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cx('h-[34px] rounded-[21px] px-4 text-[13px] font-semibold', tab === t ? 'bg-navy text-white' : 'text-slate')}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-1.5 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        {groups.length === 0 && <NoMatches onClear={clear} hint="No activity matches your search or filter." />}
        {groups.map((g) => (
          <div key={g.day} className="contents">
            <p className="px-2 pt-2.5 pb-1 text-[11px] font-bold tracking-[0.4px] text-muted">{g.day}</p>
            {g.items.map((e) => (
              <div key={e.title} className="flex items-center gap-3.5 rounded-[16px] px-2 py-2.5">
                <span className="flex size-[38px] items-center justify-center rounded-full" style={{ background: e.bg }}>
                  <Icon name={e.icon} size={17} className="text-ink" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-[13px] font-bold text-ink">{e.title}</p>
                  <p className="text-[12px] font-medium text-muted">{e.meta}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </SettingsLayout>
  )
}
