// Figma 46:7544 · N4 · Renewal — Renewed
import { Shell, Header, Btn, Pill, Hero, Card, CardHead, Journey } from './_kit'
import { renewal as r, renewedJourney, P } from '../../data/flow-policy'

export default function RenewalRenewed() {
  return (
    <Shell active="renewals">
      <Header
        crumb={r.crumb}
        title={r.title}
        chips={<Pill tone="green" icon="check">Renewed</Pill>}
        sub="Star Health FamilySure · closed by the new policy"
        actions={<Btn icon="arrow" to={P.policy}>Open new policy</Btn>}
      />
      <Hero
        className="mt-[21px]"
        icon="refresh"
        title="Renewed. A new cycle has started."
        sub="New policy 2245/88/27/0002210 recorded on 30 Nov 2026 · next renewal 03 Dec 2027"
      />
      <Card className="mt-12 gap-3.5">
        <CardHead title="How this renewal went" />
        <Journey steps={renewedJourney} itemW={93.8} />
      </Card>
    </Shell>
  )
}
