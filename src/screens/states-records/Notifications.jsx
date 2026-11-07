// Figma 286:35009 · NTF · Notifications
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SegTabs, StatusChip } from '../catalogue/_parts'
import { SH8 } from './_parts'
import { notifications as seed, notificationTabs } from '../../data/states-records'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

export default function Notifications() {
  const [tab, setTab] = useState('all')
  const [items, setItems] = useState(seed)
  const unread = items.filter((n) => n.unread).length
  const [q, clearQ] = useHeaderSearch()
  const tabs = notificationTabs.map((t) => (t.key === 'unread' ? { ...t, count: unread } : t.key === 'all' ? { ...t, count: items.length } : t))
  const shown = items.filter((n) => (tab === 'all' || (tab === 'unread' ? n.unread : n.cat === tab)) && matchesQuery(q, n.title, n.sub, n.when))
  const label = notificationTabs.find((t) => t.key === tab).label.toLowerCase()
  const read = (i) => setItems((xs) => xs.map((n, j) => (j === i ? { ...n, unread: false } : n)))

  return (
    <AppLayout active="dashboard">
      <Header
        breadcrumb="NOTIFICATIONS"
        title="Notifications"
        subtitle="Kept for 30 days."
        actions={<HeadButton variant="white" icon="check" onClick={() => setItems((xs) => xs.map((n) => ({ ...n, unread: false })))}>Mark all read</HeadButton>}
      />
      <SegTabs items={tabs} value={tab} onChange={setTab} className="mt-[13px]" />
      <div className={cx('mt-5 flex w-[1180px] flex-col gap-1.5 rounded-[28px] bg-white p-6', SH8)}>
        {shown.map((n) => {
          const i = items.indexOf(n)
          return (
            <button
              key={n.title}
              type="button"
              onClick={() => read(i)}
              className={cx('flex items-start gap-3.5 rounded-[16px] p-3.5 text-left', n.unread && 'bg-[#f7f9ff]')}
            >
              <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-[20px]', n.bg)}>
                <Icon name={n.icon} size={18} className="text-ink" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <p className="text-[14px] leading-[18px] font-bold text-ink">{n.title}</p>
                {n.sub && <p className="text-[12px] leading-[15px] font-medium text-muted">{n.sub}</p>}
                <p className="text-[11px] leading-[14px] font-semibold text-muted">{n.when}</p>
              </div>
              {n.unread ? <StatusChip tone="sky">Unread</StatusChip> : <p className="text-[11px] font-semibold text-muted">Read</p>}
            </button>
          )
        })}
        {shown.length === 0 && (
          <NoMatches
            className="px-3.5 py-3.5"
            text={q.trim() ? 'No matches' : 'All caught up'}
            sub={q.trim() ? `No ${tab === 'all' ? '' : `${label} `}notifications match “${q.trim()}”.` : `No ${label} notifications right now.`}
            onClear={q.trim() ? () => { clearQ(); setTab('all') } : undefined}
          />
        )}
      </div>
    </AppLayout>
  )
}
