// Figma 41:5484 · Q10 · Quotation — Review
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Field, Toggle } from '../../components/ui'
import QuoteWizard, { StepCard, LiveSummary, Ledger } from './_parts'
import { reviewKV, GENERATED_PATH, SUBTITLE_VARIANT } from '../../data/quotation-flow'

export default function QuotationReview() {
  const [withLink, setWithLink] = useState(true)
  return (
    <QuoteWizard step={9} numbered subtitle={SUBTITLE_VARIANT}>
      <StepCard
        index={9}
        title="Review"
        subtitle="Every check runs again before the PDF is made."
        next={{ label: 'Generate quotation', to: GENERATED_PATH, icon: 'sparkle' }}
      >
        <div className="grid grid-cols-[220px_220px_220px] gap-x-5 gap-y-3.5 [&>div]:h-[37px]">
          {reviewKV.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <span className="text-[12px] font-medium text-muted">{k}</span>
              <span className="text-[14px] font-semibold text-ink">{v}</span>
            </div>
          ))}
        </div>
        <Ledger
          rows={[
            ['Override (calculated ₹16,100)', '₹15,800.00'],
            ['Discount NB-DIWALI-26', '− ₹500.00'],
            ['GST 18%', '₹2,754.00'],
          ]}
          total={['Total payable', '₹18,054.00']}
        />
        <div className="flex items-center gap-3.5">
          <Toggle checked={withLink} onChange={setWithLink} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-ink">Add the insurer’s payment link now</span>
            <span className="text-[12px] font-medium text-muted">Must be on nivabupa.com</span>
          </span>
        </div>
        {withLink && (
          <Field label="Payment link" className="gap-2">
            <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] border-2 border-blue bg-panel px-4">
              <Icon name="link" size={18} className="text-muted" />
              <input defaultValue="https://pay.nivabupa.com/p/7KQ2M" className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none" />
            </span>
          </Field>
        )}
      </StepCard>
      <LiveSummary
        filled={6}
        extraRows={[
          ['Riders', 'Daily hospital cash'],
          ['Discount', '− ₹500'],
        ]}
        total="₹18,054"
      />
    </QuoteWizard>
  )
}
