// Figma 55:8898 · 05d · Customer — Vehicles
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ProfileShell, PillButton, Head, CARD_SHADOW } from './_parts'
import { vehicleChecklist } from '../../data/customer-tabs'

export default function CustomerVehicles() {
  return (
    <ProfileShell tab="vehicles" crumb="VEHICLES">
      <div className="flex items-start gap-5">
        <section className={cx('flex w-[760px] flex-col items-center gap-3.5 rounded-[32px] bg-white p-10', CARD_SHADOW)}>
          <span className="flex size-[84px] items-center justify-center rounded-full bg-linear-to-r from-[#d9eafd] to-[#c2dbfb] text-blue">
            <Icon name="car" size={38} />
          </span>
          <p className="text-[20px] font-bold text-ink">No vehicles yet</p>
          <p className="w-[440px] text-center text-[14px] leading-[22px] font-medium text-muted">
            Add a vehicle with its RC and at least 4 photos to quote motor insurance for Kavya.
          </p>
          <PillButton variant="pink" icon="plus" to="/x/pv1-add-vehicle">Add vehicle</PillButton>
        </section>

        <section className={cx('flex w-[400px] flex-col gap-3.5 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="What you’ll need" sub="For each vehicle" />
          <div className="flex flex-wrap gap-2">
            {vehicleChecklist.map(([icon, label]) => (
              <div key={label} className="flex h-[63px] w-[108px] flex-col items-center gap-1.5 rounded-[16px] bg-panel p-3">
                <Icon name={icon} size={18} className="text-muted" />
                <span className="text-[12px] font-semibold text-ink">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] leading-[18px] font-medium text-muted">RC plus 4 photos minimum. Registration number checked against the RC format.</p>
        </section>
      </div>
    </ProfileShell>
  )
}
