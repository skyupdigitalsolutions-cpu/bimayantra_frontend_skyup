// Figma 45:6674 · R5 · Proposal — Premium
import Icon from '../../components/Icon'
import { Btn, Pill } from '../flow-policy/_kit'
import { payment, R } from '../../data/flow-proposal'
import { ProposalWizard } from './_parts'

export default function Premium() {
  return (
    <ProposalWizard
      step={4}
      title="Premium"
      sub="The payment must be recorded before you submit."
      backTo={R.kyc}
      next={<Btn icon="arrow" to={R.review}>Next: Review</Btn>}
    >
      <div className="flex h-[92px] items-center gap-4 rounded-[22px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-5">
        <span className="flex size-[52px] items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="check" size={24} /></span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[18px] leading-[23px] font-bold text-ink">{payment.title}</p>
          <p className="text-[12px] leading-[15px] font-medium text-[#2f6b55]">{payment.sub}</p>
        </div>
        <Pill tone="green" icon="shield">Paid to Niva Bupa</Pill>
      </div>
      <div className="flex flex-col gap-2.5 rounded-[20px] bg-panel p-[18px]">
        {payment.ledger.map(([k, v]) => (
          <div key={k} className="flex h-[18px] items-center justify-between">
            <span className="text-[13px] font-medium text-muted">{k}</span>
            <span className="text-[14px] font-semibold text-ink">{v}</span>
          </div>
        ))}
        <div className="h-px bg-line" />
        <div className="flex h-7 items-center justify-between">
          <span className="text-[15px] font-bold text-ink">Total</span>
          <span className="text-[22px] font-bold tracking-[-0.2px] text-ink">{payment.total}</span>
        </div>
      </div>
    </ProposalWizard>
  )
}
