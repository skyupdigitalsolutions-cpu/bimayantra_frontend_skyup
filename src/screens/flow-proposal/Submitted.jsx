// Figma 45:7141 · R7 · Proposal — Submitted
import { Shell, Header, Btn, Pill, Hero, Card, CardHead } from '../flow-policy/_kit'
import { proposal as p, frozen, R } from '../../data/flow-proposal'

export default function Submitted() {
  return (
    <Shell active="proposals">
      <Header
        search
        crumb={`PROPOSALS  /  ${p.id}`}
        title={p.id}
        chips={<Pill tone="violet" icon="clock">Submitted</Pill>}
        sub="Submitted 26 Oct 2026 · waiting for Niva Bupa to issue"
        actions={<>
          <Btn variant="danger" icon="x" to={R.declined}>Mark declined</Btn>
          <Btn icon="shield" to={R.recordPolicy}>Record issued policy</Btn>
        </>}
      />
      <Hero
        tone="violet"
        className="mt-[21px]"
        icon="clock"
        iconColor="#5b3fb8"
        title="Waiting for the insurer"
        sub="Policy record PL-000071 is awaiting issuance. Record the policy number and PDF when Niva Bupa issues it."
        subColor="#5b3fb8"
      />
      <Card className="mt-12 gap-3.5">
        <CardHead title="Frozen on the policy record" />
        <div className="flex items-start gap-3.5">
          {frozen.map(([k, v]) => (
            <div key={k} className="flex flex-1 flex-col gap-1 rounded-[18px] bg-panel p-4">
              <p className="text-[12px] leading-[15px] font-medium text-muted">{k}</p>
              <p className="text-[14px] leading-[18px] font-bold text-ink">{v}</p>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  )
}
