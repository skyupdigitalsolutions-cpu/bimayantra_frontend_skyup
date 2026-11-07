// Figma 285:33618 · RS3 · Renewal — Reopen
import { useNavigate } from 'react-router-dom'
import { Btn } from '../flow-policy/_kit'
import { RenewalBase, CHIPS, Toast, Scrim, Dialog, DialogButton, DialogActions, DField } from './_parts'
import { reopenToast } from './RenewalNotRenewing'
import { S } from '../../data/states-proposal-policy'

export default function RenewalReopen() {
  const nav = useNavigate()
  return (
    <RenewalBase
      chip={CHIPS.notRenewing}
      title="Not renewing · bought elsewhere"
      reminders="Stopped"
      actions={<Btn icon="refresh">Reopen</Btn>}
      overlay={<>
        <Toast>{reopenToast}</Toast>
        <Scrim onClick={() => nav(S.rs2)} />
        <Dialog
          top={150}
          icon="refresh"
          iconBg="bg-[#e8f0fd]"
          iconColor="text-blue"
          title="Reopen this renewal?"
          body="It moves to In follow-up and customer reminders restart."
        >
          <DField label="Reason *" defaultValue="Group cover did not include parents" />
          <DialogActions>
            <DialogButton to={S.rs2}>Cancel</DialogButton>
            <DialogButton variant="navy" icon="refresh" to={S.rs1} className="w-[232px] flex-none">Reopen</DialogButton>
          </DialogActions>
        </Dialog>
      </>}
    />
  )
}
