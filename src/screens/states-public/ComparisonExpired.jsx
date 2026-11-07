// Figma 291:38329 · CX1 · Comparison — Expired
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { SBtn, SChip } from '../settings/_parts'

const card = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
const OPTIONS = [
  { name: 'CareFirst Family · Gold', insurer: 'Niva Bupa', head: '#fde8ec', price: '₹17,582', ped: '3 years', claims: '91.2%', rec: true },
  { name: 'CareFirst Family · Platinum', insurer: 'Niva Bupa', head: '#fde8c9', price: '₹24,960', ped: '2 years', claims: '91.2%' },
  { name: 'SecurePlus · Secure', insurer: 'HDFC ERGO', head: '#e9e3fc', price: '₹19,978', ped: '3 years', claims: '98.6%' },
]
const ACTIVITY = [
  ['eye', 'Viewed by customer', '24 Oct, 20:05'],
  ['mail', 'Emailed to Kavya', '20 Oct, 15:00'],
]

export default function ComparisonExpired() {
  const [toast, setToast] = useState(true)
  return (
    <AppLayout active="quotations">
      <PageHeader
        breadcrumb="QUOTATIONS  /  CQ-202610-00003"
        title="CQ-202610-00003"
        titleExtra={<SChip tone="red" icon="clock">Expired</SChip>}
        subtitle="Kavya Hegde · 3 options at ₹10 lakh · valid until 11 Nov 2026"
        actions={<SBtn size="lg" icon="compare" to="/x/cq2-comparison-type">New comparison</SBtn>}
        className="min-h-[83px]"
      />

      <div className="mt-[21px] flex items-start gap-5">
        {OPTIONS.map((o) => (
          <div key={o.name} className={cx('flex w-[380px] flex-col overflow-hidden rounded-[28px] bg-white', card, o.rec && 'border-2 border-blue')}>
            <div className="flex h-[109px] flex-col gap-1.5 px-5 py-[18px]" style={{ background: o.head }}>
              {o.rec ? <SChip tone="green" icon="star" className="w-fit">Recommended</SChip> : <SChip className="w-fit">Option</SChip>}
              <p className="text-[17px] font-bold text-ink">{o.name}</p>
              <p className="text-[12px] font-medium text-slate">{o.insurer}</p>
            </div>
            <div className="flex flex-col gap-2.5 p-5">
              <div className="flex items-end gap-1.5">
                <span className="text-[26px] font-bold tracking-[-0.3px] text-ink">{o.price}</span>
                <span className="pb-[3px] text-[12px] font-medium text-muted">/ year</span>
              </div>
              {[['Room rent', 'No limit'], ['Co-pay', '0%'], ['PED wait', o.ped], ['Claims settled', o.claims]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-muted">{k}</span>
                  <span className="font-bold text-ink">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-20 items-center gap-3.5 rounded-[24px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] px-[22px]">
        <span className="flex size-11 items-center justify-center rounded-full bg-white/70"><Icon name="star" size={20} className="text-[#5b3fb8]" /></span>
        <p className="text-[14px] font-semibold text-ink">Why Gold is recommended: No room-rent limit and unlimited restore suit a young family; premium is within budget.</p>
      </div>

      <section className={cx('mt-5 flex flex-col gap-3 rounded-[28px] bg-white p-6', card)}>
        <p className="text-[17px] font-bold text-ink">Activity</p>
        {ACTIVITY.map(([icon, t, w]) => (
          <div key={t} className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-panel"><Icon name={icon} size={16} className="text-ink" /></span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">{t}</p>
              <p className="text-[12px] font-medium text-muted">{w}</p>
            </div>
          </div>
        ))}
      </section>

      {toast && (
        <button
          type="button"
          onClick={() => setToast(false)}
          data-overlay="toast"
          className="fixed bottom-[52px] left-[196px] z-30 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-[#16845b]"><Icon name="check" size={13} className="text-white" /></span>
          <span className="text-[13px] font-semibold text-white">Expired on 11 Nov 2026 with no product chosen.</span>
        </button>
      )}
    </AppLayout>
  )
}
