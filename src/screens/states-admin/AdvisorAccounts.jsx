// Figma 289:37046 · AA1 · Admin — Advisor accounts
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SegTabs } from '../admin/_parts'
import { AdminLayout, AdminHeader, TPill } from './_parts'
import { accounts, accountTabs } from '../../data/states-admin'
import { NoMatches } from '../admin/_filter'

const COLS = [
  ['Advisor', 'w-[260px]'],
  ['Plan', 'w-[110px]'],
  ['Subscription', 'w-[170px]'],
  ['Account', 'w-[120px]'],
  ['KYC', 'w-[150px]'],
  ['Last active', 'w-[130px]'],
  ['', 'w-10'],
]

export default function AdvisorAccounts() {
  const [tab, setTab] = useState('all')
  const rows = tab === 'all' ? accounts : accounts.filter((a) => a.tags.includes(tab))
  // Tab badges are counted from the data so they always match the rows shown
  const tabs = accountTabs.map((t) => ({ ...t, count: t.key === 'all' ? accounts.length : accounts.filter((a) => a.tags.includes(t.key)).length }))
  return (
    <AdminLayout active="accounts">
      <AdminHeader title="Advisor accounts" subtitle="Summary only. Customer data is never shown here." />
      <SegTabs className="mt-[21px]" items={tabs} value={tab} onChange={setTab} />
      <div className="mt-5 overflow-hidden rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
        <div className="flex gap-4 bg-[#fafbfd] px-6 py-3.5">
          {COLS.map(([l, w]) => <p key={l} className={cx('text-[12px] font-semibold text-muted', w)}>{l}</p>)}
        </div>
        {rows.map((a) => (
          <Link key={a.name} to="/x/aa2-admin-account-detail" className="flex h-[57px] items-center gap-4 border-t border-line px-6 hover:bg-panel-2">
            <div className="flex w-[260px] items-center gap-2">
              <span className={cx('flex size-[30px] items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-navy', a.tint)}>{a.initials}</span>
              <span className="text-[13px] font-bold text-ink">{a.name}</span>
            </div>
            <div className="w-[110px]"><TPill t={a.plan} /></div>
            <div className="w-[170px]"><TPill t={a.sub} /></div>
            <div className="w-[120px]"><TPill t={a.acct} /></div>
            <div className="w-[150px]"><TPill t={a.kyc} /></div>
            <p className="w-[130px] text-[13px] font-medium text-ink-2">{a.last}</p>
            <div className="w-10"><Icon name="chev-right" size={16} className="text-muted" /></div>
          </Link>
        ))}
        {rows.length === 0 && (
          <div className="border-t border-line p-4">
            <NoMatches hint="No advisor accounts in this group." onClear={() => setTab('all')} />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
