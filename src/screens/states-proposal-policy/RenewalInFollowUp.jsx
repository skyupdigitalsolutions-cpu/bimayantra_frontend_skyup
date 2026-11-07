// Figma 285:33305 · RS1 · Renewal — In follow-up
import { Btn } from '../flow-policy/_kit'
import { RenewalBase, CHIPS } from './_parts'
import { S } from '../../data/states-proposal-policy'

export default function RenewalInFollowUp() {
  return (
    <RenewalBase
      chip={CHIPS.followup}
      title="Renews on 03 Dec 2026"
      reminders="1 of 6 sent"
      actions={<>
        <Btn variant="danger" icon="x" to={S.n3}>Not renewing</Btn>
        <Btn variant="white" icon="phone" to={S.n2}>Log contact</Btn>
        <Btn icon="quote" to={S.rn0}>Create renewal quotation</Btn>
      </>}
    />
  )
}
