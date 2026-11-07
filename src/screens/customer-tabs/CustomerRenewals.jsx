// Figma 56:9120 · 05h · Customer — Renewals
import { cx } from '../../components/ui'
import { ProfileShell, PillButton, SChip, IconTile, Head, CARD_SHADOW } from './_parts'

export default function CustomerRenewals() {
  return (
    <ProfileShell tab="renewals" crumb="RENEWALS">
      <section className="flex h-[132px] items-center gap-[22px] rounded-[32px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] px-7 py-6 shadow-[0px_18px_36px_-12px_rgba(201,138,46,0.2)]">
        <div className="flex size-[84px] shrink-0 flex-col items-center justify-center rounded-full bg-white">
          <span className="text-[26px] leading-[33px] font-bold text-ink">38</span>
          <span className="text-[11px] font-semibold text-[#8a5a12]">days</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 whitespace-nowrap">
          <p className="text-[19px] font-bold text-ink">Star Health FamilySure renews on 03 Dec 2026</p>
          <p className="text-[13px] font-medium text-[#8a5a12]">Grace until 02 Jan 2027 · last premium ₹21,340 · 1 of 6 reminders sent</p>
          <SChip tone="amber" icon="alert">Due</SChip>
        </div>
        <PillButton variant="outline" size="sm" icon="phone" to="/x/n2-renewal-log-contact">Log contact</PillButton>
        <PillButton variant="navy" size="sm" icon="quote" to="/x/rn0-renewal-how-to-renew">Create renewal quotation</PillButton>
      </section>

      <section className={cx('mt-12 flex flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
        <Head title="Next in line" />
        <div className="flex h-[76px] items-center gap-3.5 rounded-[20px] bg-panel p-4">
          <IconTile icon="refresh" bg="#e9e3fc" size={44} />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
            <p className="text-[14px] font-bold text-ink">Niva Bupa CareFirst Family · Gold</p>
            <p className="text-[12px] font-medium text-muted">Cycle starts when the policy is issued · renews 09 Nov 2027</p>
          </div>
          <SChip tone="gray" icon="clock">Upcoming</SChip>
        </div>
      </section>
    </ProfileShell>
  )
}
