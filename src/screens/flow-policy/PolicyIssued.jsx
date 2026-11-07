// Figma 46:6773 · L2 · Policy issued
import Icon from '../../components/Icon'
import { Shell, Header, Btn, Pill, Hero, Card, CardHead, Journey } from './_kit'
import { issued as d, saleJourney, alsoActions, P } from '../../data/flow-policy'

export default function PolicyIssued() {
  return (
    <Shell active="policies">
      <Header
        search
        crumb="POLICIES  /  PL-000071"
        title={d.number}
        chips={<Pill tone="green" icon="check">Issued</Pill>}
        sub={d.sub}
        actions={<Btn icon="arrow" to={P.policy}>View policy</Btn>}
      />
      <Hero
        className="mt-[21px]"
        icon="shield"
        title="Policy issued. Renewal tracking has started."
        sub="Covers Kavya, Arjun and Anya · ₹10 lakh · 10 Nov 2026 to 09 Nov 2027"
      />
      <Card className="mt-12 gap-4">
        <CardHead title="Sale complete" sub="Every step is on record" />
        <Journey steps={saleJourney} itemW={77.8} />
      </Card>
      <div className="mt-4 flex items-start gap-5">
        <div className="flex flex-1 flex-col gap-3 rounded-[28px] bg-linear-to-r from-[#fde8c9] to-[#fbd9b0] p-6 shadow-[0px_14px_30px_-12px_rgba(201,138,46,0.2)]">
          <div className="flex items-center gap-3">
            <p className="flex-1 text-[17px] leading-[21px] font-bold text-ink">Renewal cycle created</p>
            <Pill icon="clock">Upcoming</Pill>
          </div>
          <p className="text-[13px] leading-5 font-medium text-[#8a5a12]">Becomes Due on 10 Sep 2027 (60 days before). Reminders go out on channels with consent.</p>
        </div>
        <Card className="flex-1 gap-3">
          <p className="text-[15px] leading-[19px] font-bold text-ink">You might also</p>
          {alsoActions.map((a) => (
            <button key={a.label} type="button" className="group flex h-8 items-center gap-3 self-start text-left">
              <span className="flex size-8 items-center justify-center rounded-full bg-panel text-ink group-hover:bg-line"><Icon name={a.icon} size={15} /></span>
              <span className="text-[13px] font-semibold text-ink group-hover:underline">{a.label}</span>
            </button>
          ))}
        </Card>
      </div>
    </Shell>
  )
}
