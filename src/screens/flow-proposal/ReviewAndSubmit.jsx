// Figma 45:6881 · R6 · Proposal — Review and submit
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Btn, Scrim, Check } from '../flow-policy/_kit'
import { proposal as p, reviewChecks, R } from '../../data/flow-proposal'
import { ProposalWizard, Tick } from './_parts'
import { FixedDialog } from '../catalogue/_overlay'

function SubmitDialog({ onClose }) {
  const [done, setDone] = useState(true)
  return (
    <>
      <Scrim onClick={onClose} />
      <FixedDialog top={230} left={380} width={500} className="flex flex-col items-center gap-[18px] rounded-[28px] bg-white p-8 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
        <span className="flex size-[68px] items-center justify-center rounded-full bg-[#e8f0fd] text-blue"><Icon name="send" size={30} /></span>
        <p className="text-[21px] leading-[26px] font-bold tracking-[-0.2px] text-ink">Submit {p.id}?</p>
        <p className="text-center text-[13px] leading-5 font-medium text-muted">Members, declarations and nominees are frozen on the policy record. Bimayantra does not send anything to Niva Bupa.</p>
        <label className="flex h-[50px] w-full cursor-pointer items-center gap-3 rounded-[16px] bg-panel px-3.5" onClick={() => setDone(!done)}>
          <Check size={22} on={done} onChange={setDone} />
          <span className="text-[13px] font-semibold text-ink">I have submitted this proposal on the Niva Bupa portal.</span>
        </label>
        <div className="flex w-full gap-2.5">
          <Btn variant="white" className="flex-1 justify-center" onClick={onClose}>Cancel</Btn>
          <Btn icon="send" to={done ? R.submitted : undefined} onClick={(e) => !done && e.preventDefault()} className={`w-[210px] justify-center ${done ? '' : 'pointer-events-none opacity-50'}`}>Submit proposal</Btn>
        </div>
      </FixedDialog>
    </>
  )
}

export default function ReviewAndSubmit() {
  const [open, setOpen] = useState(true)
  return (
    <ProposalWizard
      step={5}
      title="Review and submit"
      sub="All checks pass. Submit on the Niva Bupa portal first."
      backTo={R.premium}
      next={<Btn icon="send" onClick={() => setOpen(true)}>Submit proposal</Btn>}
      overlay={open && <SubmitDialog onClose={() => setOpen(false)} />}
    >
      {reviewChecks.map(([t, s]) => (
        <div key={t} className="flex h-[34px] items-center gap-3">
          <Tick />
          <div className="flex flex-col gap-px">
            <p className="text-[14px] leading-[18px] font-bold text-ink">{t}</p>
            <p className="text-[12px] leading-[15px] font-medium text-muted">{s}</p>
          </div>
        </div>
      ))}
    </ProposalWizard>
  )
}
