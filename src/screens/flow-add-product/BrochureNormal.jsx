// Figma 128:15470 · AP2d · Add product — Brochure (Normal plan)
import { useRef, useState } from 'react'
import Icon from '../../components/Icon'
import { Shell, StepCard, StepFooter, PreviewCard, Btn, Chip, R } from './_parts'
import { previewByStep } from '../../data/flow-add-product'

export default function BrochureNormal() {
  const input = useRef(null)
  const [attached, setAttached] = useState(null)

  return (
    <Shell step={3} subtitle="Health" aside={<PreviewCard values={previewByStep.company} />}>
      <StepCard title="3 · Brochure" subtitle="Auto-fill from brochure is a Premium feature" chip={<Chip tone="gray" className="bg-[#eef1f5]">Normal plan</Chip>}>
        <div className="flex items-center gap-4 rounded-[24px] bg-rail p-[22px]">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/10 text-pink-300">
            <Icon name="sparkle" size={26} />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-[16px] font-bold text-white">Let us read the brochure for you</p>
            <p className="w-[420px] text-[12px] leading-[18px] font-medium text-[#c9d6ea]">
              On Premium, we fill the company, product, variants and features from the brochure. Saves about 10 minutes per product.
            </p>
          </div>
          <Btn variant="pink" size="sm" icon="arrow" to={R.billing}>Upgrade</Btn>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[22px] bg-panel p-5">
          <p className="text-[14px] font-bold text-ink">On your Normal plan</p>
          <p className="text-[13px] leading-5 font-medium text-muted">You fill in each step yourself. You can still attach the brochure for reference.</p>
          <div className="flex items-center gap-2">
            <Btn variant="outline" size="sm" icon="folder" onClick={() => input.current?.click()}>
              {attached ?? 'Attach brochure (optional)'}
            </Btn>
            <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setAttached(e.target.files?.[0]?.name ?? null)} />
          </div>
        </div>

        <StepFooter back={R.company} next={<Btn icon="edit" to={R.product}>Fill in manually</Btn>} />
      </StepCard>
    </Shell>
  )
}
