// Figma 56:8884 · 05g · Customer — Payments
import { useState } from 'react'
import { cx } from '../../components/ui'
import { ProfileShell, SChip, IconTile, Chev, Note, CARD_SHADOW } from './_parts'
import { payments, paymentTotals } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'

export default function CustomerPayments() {
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const rows = payments.filter((p) => matches(q, p.title, p.sub, p.amount, p.chip[2]))
  return (
    <ProfileShell tab="payments" crumb="PAYMENTS">
      <Note icon="shield" bg="#e7f4ee" color="#127650">
        Kavya pays insurers directly. You record each payment on its quotation.
      </Note>

      <section className={cx('mt-6 flex flex-col gap-2.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        {rows.map((p) => (
          <div key={p.title} className="flex h-[78px] items-center gap-4 rounded-[20px] bg-panel p-4">
            <IconTile icon="card" bg={p.bg} size={46} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
              <p className="text-[14px] font-bold text-ink">{p.title}</p>
              <p className="text-[12px] font-medium text-muted">{p.sub}</p>
            </div>
            <p className="text-[16px] font-bold whitespace-nowrap text-ink">{p.amount}</p>
            <SChip tone={p.chip[0]} icon={p.chip[1]}>{p.chip[2]}</SChip>
            <Chev size={34} to="/x/08b-quotation-detail-payment-successful" />
          </div>
        ))}
        {!rows.length && <NoMatches label={`No payments match “${q}”`} onClear={() => setQ('')} />}
      </section>

      <div className="mt-3.5 flex gap-5">
        {paymentTotals.map(([bg, k, v]) => (
          <div key={k} className="flex h-[89px] flex-1 flex-col gap-1 rounded-[24px] p-5" style={{ background: bg }}>
            <p className="text-[12px] font-semibold text-ink-2">{k}</p>
            <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">{v}</p>
          </div>
        ))}
      </div>
    </ProfileShell>
  )
}
