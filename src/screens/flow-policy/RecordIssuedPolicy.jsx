// Figma 46:6554 · L1 · Record issued policy
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Shell, Header, Btn, Pill, Card, CardHead, Field, TextBox, SelectBox, ActionBar, KV } from './_kit'
import { issued as d, P } from '../../data/flow-policy'

export default function RecordIssuedPolicy() {
  const [f, setF] = useState(d)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <Shell active="policies">
      <Header
        search
        crumb="POLICIES  /  PL-000071  /  RECORD"
        title="Record issued policy"
        chips={<Pill tone="violet" icon="clock">Awaiting issuance</Pill>}
        sub={d.sub}
      />
      <div className="mt-[21px] flex items-start gap-5">
        <div className="flex w-[760px] flex-col gap-4">
          <Card className="gap-3.5">
            <CardHead title="From the insurer" sub="Copy these from the policy schedule" />
            <div className="flex items-start gap-3.5">
              <Field label="Insurer policy number *"><TextBox focused autoFocus value={f.number} onChange={set('number')} className="pl-[18px]" /></Field>
              <Field label="Issue date *" hint="Not before the payment date (26 Oct)."><TextBox trailing="calendar" value={f.issueDate} onChange={set('issueDate')} /></Field>
            </div>
            <div className="flex items-start gap-3.5">
              <Field label="Start date *"><TextBox trailing="calendar" value={f.startDate} onChange={set('startDate')} /></Field>
              <Field label="End date *" hint="Start + 1 year − 1 day"><TextBox trailing="calendar" value={f.endDate} onChange={set('endDate')} /></Field>
              <Field label="Frequency *"><SelectBox options={d.frequencies} value={f.frequency} onChange={set('frequency')} /></Field>
            </div>
            <div className="flex items-start gap-3.5">
              <Field label="Premium *"><TextBox prefix="₹" value={f.premium} onChange={set('premium')} /></Field>
              <Field label="Sum insured *"><SelectBox options={d.sumInsuredOptions} value={f.sumInsured} onChange={set('sumInsured')} /></Field>
            </div>
          </Card>
          <Card className="gap-3">
            <CardHead title="Policy document" sub="Required" />
            <div className="flex h-[74px] items-center gap-3.5 rounded-[18px] border border-[#c7ebda] bg-[#f5fbf8] px-3.5">
              <span className="flex size-11 items-center justify-center rounded-full bg-white text-[#127650]"><Icon name="folder" size={20} /></span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[14px] leading-[18px] font-bold text-ink">{d.file}</p>
                <p className="text-[12px] leading-[15px] font-medium text-[#127650]">{d.fileMeta}</p>
              </div>
              <label className="flex h-9 cursor-pointer items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">
                Replace<input type="file" accept="application/pdf" className="hidden" />
              </label>
            </div>
          </Card>
        </div>
        <div className="flex w-[400px] flex-col">
          <div className="flex flex-col gap-3 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <div className="flex h-6 items-center gap-2.5">
              <p className="flex-1 text-[16px] font-bold text-white">Expected commission</p>
              <span className="flex h-6 items-center gap-[5px] rounded-[12px] bg-white/10 px-2.5 text-[11px] font-semibold text-white"><Icon name="lock" size={13} className="text-[#f7b9c4]" />Only you</span>
            </div>
            <div className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-white/10 px-4">
              <span className="text-[14px] font-semibold text-[#c9d6ea]">₹</span>
              <span className="text-[16px] font-bold text-white">{d.commission}</span>
            </div>
            <p className="text-[12px] font-medium text-[#c9d6ea]">15% × premium before tax. For your reference.</p>
          </div>
          <Card className="mt-[69px] gap-3">
            <p className="text-[15px] leading-[19px] font-bold text-ink">From the proposal</p>
            {d.fromProposal.map(([k, v]) => <KV key={k} k={k} v={v} className="h-4" />)}
          </Card>
        </div>
      </div>
      <ActionBar className="absolute top-[900px] right-10 left-10">
        <Btn variant="white" back>Cancel</Btn>
        <span className="flex-1" />
        <Btn icon="shield" to={P.l2}>Save policy</Btn>
      </ActionBar>
    </Shell>
  )
}
