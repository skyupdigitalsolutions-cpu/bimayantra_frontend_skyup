// Figma 24:1876 · 19 · Public quotation (customer)
import Icon from '../../components/Icon'
import { PublicPage, RingAvatar, SBtn, SChip, cardShadow } from './_parts'
import { cx } from '../../components/ui'
import { publicQuote as q } from '../../data/public'

export function AdvisorBar({ className = '' }) {
  return (
    <div className={cx('flex h-[76px] items-center gap-3.5 rounded-[30px] bg-white px-6 shadow-[0px_10px_28px_-12px_rgba(19,41,75,0.1)]', className)}>
      <RingAvatar ini="SR" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[16px] font-bold text-ink">Suresh Rao</p>
        <p className="text-[12px] font-medium text-muted">Rao Insurance Services · IRDAI licence 12345678</p>
      </div>
      <SBtn variant="white" icon="phone">Call 98450 12345</SBtn>
      <SBtn icon="chat">WhatsApp</SBtn>
    </div>
  )
}

export default function PublicQuotation() {
  return (
    <PublicPage blob={{ x: 900, y: -260, size: 620, color: 'rgba(242,157,176,0.3)' }}>
      <AdvisorBar className="absolute top-8 left-[120px] w-[1200px]" />

      <div className="absolute top-[140px] left-[120px] flex w-[720px] flex-col gap-5">
        <div className="flex flex-col gap-3 rounded-[34px] bg-linear-to-b from-[#fbd3dc] to-[#f6b3c3] px-8 py-[30px] shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
          <div className="flex gap-2">
            <SChip icon="quote" className="bg-[#fde8ec] text-[#b4325a]">Quotation</SChip>
            <SChip icon="clock">Valid until {q.validUntil}</SChip>
          </div>
          <h1 className="text-[34px] font-bold tracking-[-0.7px] text-ink">Your quotation, Kavya</h1>
          <p className="text-[14px] font-medium text-rose-ink">{q.ref}</p>
        </div>

        <div className={cx('flex flex-col gap-5 rounded-[28px] bg-white p-6', cardShadow)}>
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#fde8ec]"><Icon name="heart" size={26} className="text-[#b4325a]" /></span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">{q.product}</p>
              <p className="text-[12px] font-medium text-muted">{q.uin}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {q.facts.map(([icon, k, v]) => (
              <div key={k} className="flex flex-1 flex-col gap-2 rounded-[20px] bg-panel p-4">
                <Icon name={icon} size={20} className="text-ink" />
                <p className="text-[12px] font-medium text-muted">{k}</p>
                <p className="text-[14px] font-bold text-ink">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {q.features.map((f) => <SChip key={f} tone="green" icon="check">{f}</SChip>)}
          </div>
        </div>
        <p className="text-[12px] leading-[18px] font-medium text-muted">
          This quotation is based on the details you shared and the insurer’s published rates. The insurer decides the final premium and whether to accept the proposal. Please read the policy wording before you buy.
        </p>
      </div>

      <div className="absolute top-[140px] left-[880px] flex w-[440px] flex-col gap-[18px] rounded-[28px] bg-white p-6 shadow-[0px_24px_48px_-16px_rgba(19,41,75,0.1)]">
        <p className="text-[17px] font-bold text-ink">Premium</p>
        <div className="flex flex-col gap-2.5">
          {q.ledger.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-muted">{k}</span>
              <span className="text-[15px] font-semibold text-ink">{v}</span>
            </div>
          ))}
          <span className="h-px bg-line" />
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-ink">Total</span>
            <span className="text-[26px] font-bold tracking-[-0.3px] text-ink">{q.total}</span>
          </div>
        </div>
        <SBtn size="lg" icon="arrow" className="h-[54px] w-full text-[15px]" to="/x/p2-payment-record-payment">Pay on Niva Bupa website</SBtn>
        <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e7f4ee] px-3.5 py-3">
          <Icon name="lock" size={16} className="shrink-0 text-[#127650]" />
          <p className="w-[330px] text-[12px] leading-[18px] font-semibold text-[#127650]">Opens pay.nivabupa.com. You pay the insurer directly, not Bimayantra.</p>
        </div>
      </div>

      <div className={cx('absolute top-[580px] left-[880px] flex w-[440px] flex-col gap-3 rounded-[28px] bg-white/70 p-6', cardShadow)}>
        <p className="text-[15px] font-bold text-ink">Questions?</p>
        <p className="text-[13px] leading-5 font-medium text-muted">Reply to Suresh on WhatsApp or call. He can revise this quotation for you.</p>
      </div>

      <p className="absolute top-[968px] left-[120px] text-[12px] font-medium text-muted">
        Sent through Bimayantra. Your advisor shares this page; it is not a customer account.
      </p>
    </PublicPage>
  )
}
