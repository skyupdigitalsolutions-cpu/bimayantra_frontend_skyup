// Figma 255:22144 · RNB3 · Renewal — New quotation · Review
import Icon from '../../components/Icon'
import { Btn, Field, TextBox } from '../flow-policy/_kit'
import { P } from '../../data/flow-policy'
import { NewQuoteWizard } from './_parts'

const NOTES = [
  ['Portability requested', 'Waiting periods served carry over'],
  ['Rohan added', 'New member, standard waiting periods'],
  ['Sum insured raised to ₹15 lakh', 'Extra ₹5 lakh has fresh waiting periods'],
]

export default function NewQuotationReview() {
  return (
    <NewQuoteWizard
      step={2}
      title="Review"
      sub="Old policy and new quotation side by side"
      backTo={P.rnb2}
      next={<Btn icon="sparkle" to={P.rnb4}>Generate renewal quotation</Btn>}
    >
      <div className="flex gap-3.5">
        <div className="flex flex-1 flex-col gap-1.5 rounded-[22px] bg-panel p-[18px]">
          <p className="text-[10px] leading-[13px] font-bold tracking-[0.6px] text-muted">NOW · ENDS 03 DEC</p>
          <p className="text-[15px] leading-[19px] font-bold text-ink">Star Health FamilySure · Plus</p>
          <p className="text-[12px] leading-[15px] font-medium text-muted">3 people · ₹10 lakh</p>
          <p className="text-[24px] leading-[30px] font-bold tracking-[-0.2px] text-ink">₹21,340</p>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 rounded-[22px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-[18px]">
          <p className="text-[10px] leading-[13px] font-bold tracking-[0.6px] text-[#c9d6ea]">NEW · FROM 04 DEC</p>
          <p className="text-[15px] leading-[19px] font-bold text-white">Niva Bupa CareFirst · Gold</p>
          <p className="text-[12px] leading-[15px] font-medium text-[#c9d6ea]">4 people · ₹15 lakh</p>
          <p className="text-[24px] leading-[30px] font-bold tracking-[-0.2px] text-white">₹24,544</p>
        </div>
      </div>
      {NOTES.map(([t, s]) => (
        <div key={t} className="flex h-[31px] items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#e8f0fd] text-blue"><Icon name="alert" size={12} /></span>
          <div className="flex flex-col gap-px">
            <p className="text-[13px] leading-4 font-bold text-ink">{t}</p>
            <p className="text-[11px] leading-[14px] font-medium text-muted">{s}</p>
          </div>
        </div>
      ))}
      <Field label="Payment link (optional)" className="flex-none"><TextBox icon="link" defaultValue="https://pay.nivabupa.com/p/RN81Q" /></Field>
    </NewQuoteWizard>
  )
}
