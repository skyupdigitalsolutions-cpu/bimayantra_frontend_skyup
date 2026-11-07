// Figma 45:6474 · R4 · Proposal — KYC check
import Icon from '../../components/Icon'
import { Btn, Note } from '../flow-policy/_kit'
import { kyc, R } from '../../data/flow-proposal'
import { ProposalWizard } from './_parts'

export default function KycCheck() {
  return (
    <ProposalWizard
      step={3}
      title="KYC check"
      sub="From the document vault. Nothing is uploaded here."
      backTo={R.nominees}
      next={<Btn icon="arrow" to={R.premium}>Next: Premium</Btn>}
    >
      {kyc.map((k) => (
        <div key={k.doc} className="flex h-[78px] items-center gap-3.5 rounded-[20px] border border-[#c7ebda] bg-[#f5fbf8] px-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#e7f4ee] text-[#127650]"><Icon name="check" size={20} /></span>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[14px] leading-[18px] font-bold text-ink">{k.doc}</p>
            <p className="text-[12px] leading-[15px] font-medium text-[#127650]">{k.status}</p>
          </div>
          <p className="text-[15px] font-bold tracking-[0.6px] text-ink">{k.masked}</p>
        </div>
      ))}
      <Note icon="alert">Aadhaar v2 uploaded on 24 Oct is still unconfirmed. The confirmed v1 is used.</Note>
    </ProposalWizard>
  )
}
