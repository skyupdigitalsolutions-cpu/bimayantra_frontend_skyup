// Figma 133:15701 · ADa · SkyUp Admin — Add product (reading brochure)
import Icon from '../../components/Icon'
import { ACardHead, HButton, Pill } from '../admin/_parts'
import { AddProductShell, BODY_CARD } from './_parts'

export default function AddReading() {
  return (
    <AddProductShell subtitle="Verified catalogue · Health · Aditya Birla Health" step={2}>
      <div className={`mt-[35px] flex w-[760px] flex-col gap-4 ${BODY_CARD}`}>
        <ACardHead title="2 · Reading the brochure" subtitle="activ-one-max-brochure.pdf · 16 pages" right={<Pill tone="violet" icon="clock">Reading</Pill>} />
        <div className="flex flex-col gap-3 rounded-[22px] bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb] p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Icon name="sparkle" size={22} className="text-violet" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[15px] font-bold text-ink">Extracting variants and features…</p>
              <p className="text-[12px] font-medium text-violet">Page 11 of 16</p>
            </div>
            <p className="text-[18px] font-bold text-violet">68%</p>
          </div>
          <div className="h-2 rounded-[4px] bg-white/70">
            <div className="h-2 w-[484px] rounded-[4px] bg-violet" />
          </div>
        </div>
        <div className="flex w-fit items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3">
          <Icon name="lock" size={16} className="text-blue" />
          <p className="text-[13px] font-semibold text-blue">Nothing reaches advisors until you review every value and a second admin approves.</p>
        </div>
        <HButton variant="navy" icon="arrow" to="/x/adb-skyup-admin-review-extracted-values" className="w-fit">Review extracted values</HButton>
      </div>
    </AddProductShell>
  )
}
