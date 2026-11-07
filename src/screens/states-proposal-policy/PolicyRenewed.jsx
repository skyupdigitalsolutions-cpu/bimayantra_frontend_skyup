// Figma 285:33076 · PO4 · Policy — Renewed
import { PolicyBase, CHIPS, HeadButton } from './_parts'
import { S } from '../../data/states-proposal-policy'

export default function PolicyRenewed() {
  return (
    <PolicyBase
      chip={CHIPS.renewed}
      endLabel="Renewed by 2245/88/27/0002210"
      daysLabel="renewed on 30 Nov"
      actions={<HeadButton variant="navy" icon="arrow" to={S.l2}>Open new policy</HeadButton>}
    />
  )
}
