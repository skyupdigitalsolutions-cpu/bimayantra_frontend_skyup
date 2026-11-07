// Figma 285:32464 · PO1 · Policy — Record cancellation
import { useNavigate } from 'react-router-dom'
import { PolicyBase, CHIPS, HeadButton, Scrim, Dialog, DialogButton, DialogActions, DField } from './_parts'
import { S } from '../../data/states-proposal-policy'

export default function PolicyRecordCancellation() {
  const nav = useNavigate()
  return (
    <PolicyBase
      chip={CHIPS.issued}
      endLabel="03 Dec 2026 · 38 days left"
      daysLabel="days to renewal"
      actions={<>
        <HeadButton variant="danger" icon="x" to={S.po1}>Record cancellation</HeadButton>
        <HeadButton variant="white" icon="edit">Correct details</HeadButton>
        <HeadButton variant="navy" icon="users">Edit nominees</HeadButton>
      </>}
      overlay={<>
        <Scrim onClick={() => nav(S.policy)} />
        <Dialog
          top={110}
          icon="shield"
          iconBg="bg-[#fbebec]"
          iconColor="text-[#b4323c]"
          title="Record insurer cancellation?"
          body="Use this only when the insurer has cancelled the policy. The renewal cycle closes."
        >
          <div className="flex gap-3">
            <DField label="Cancellation date *" className="flex-1" defaultValue="15-11-2026" trailing="calendar" />
            <DField label="Refund (optional)" className="flex-1" prefix="₹" defaultValue="4,200" />
          </div>
          <DField label="Reason *" defaultValue="Policyholder asked to cancel (free look)" />
          <DialogActions>
            <DialogButton to={S.policy}>Cancel</DialogButton>
            <DialogButton variant="danger" icon="x" to={S.po2} className="w-[233px] flex-none">Record cancellation</DialogButton>
          </DialogActions>
        </Dialog>
      </>}
    />
  )
}
