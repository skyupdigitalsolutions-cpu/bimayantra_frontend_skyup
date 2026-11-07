// Figma 285:33778 · RS4 · Renewal — Lapsed
import { Btn } from '../flow-policy/_kit'
import { RenewalBase, CHIPS, Toast } from './_parts'

export default function RenewalLapsed() {
  return (
    <RenewalBase
      chip={CHIPS.lapsed}
      days="0"
      title="Lapsed · grace ended 02 Jan 2027"
      reminders="1 of 6 sent"
      actions={<Btn icon="refresh">Record renewal (revived)</Btn>}
      overlay={<Toast>If the insurer revives the policy, record the renewal and the cycle closes as Renewed.</Toast>}
    />
  )
}
