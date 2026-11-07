// Figma 285:33452 · RS2 · Renewal — Not renewing
import { Btn } from '../flow-policy/_kit'
import { RenewalBase, CHIPS, Toast } from './_parts'
import { S } from '../../data/states-proposal-policy'

export const reopenToast = 'Reminders stopped. You can reopen until the grace period ends on 02 Jan 2027.'

export default function RenewalNotRenewing() {
  return (
    <RenewalBase
      chip={CHIPS.notRenewing}
      title="Not renewing · bought elsewhere"
      reminders="Stopped"
      actions={<Btn icon="refresh" to={S.rs3}>Reopen</Btn>}
      overlay={<Toast>{reopenToast}</Toast>}
    />
  )
}
