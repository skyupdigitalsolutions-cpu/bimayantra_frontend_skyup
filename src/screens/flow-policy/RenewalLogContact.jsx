// Figma 46:7154 · N2 · Renewal — Log contact
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Btn, Scrim, Radio, Field, TextBox, TextArea, SelectBox } from './_kit'
import { RenewalDetail } from './_parts'
import { renewal as r, contactOutcomes, followUpTimes, P } from '../../data/flow-policy'

function LogContactDrawer() {
  const nav = useNavigate()
  const [outcome, setOutcome] = useState(contactOutcomes[0])
  const close = () => nav(P.n1)
  return (
    <>
      <Scrim onClick={close} />
      <aside data-overlay="drawer" className="fixed top-12 right-12 bottom-12 z-50 flex w-[480px] flex-col overflow-y-auto overscroll-contain gap-[18px] rounded-[32px] bg-white px-7 pt-7 pb-6 shadow-[0px_30px_60px_-10px_rgba(19,41,75,0.3)]">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[20px] leading-[25px] font-bold tracking-[-0.2px] text-ink">Log contact</p>
            <p className="text-[12px] leading-[15px] font-medium text-muted">Kavya Hegde · {r.phone}</p>
          </div>
          <button type="button" aria-label="Close" onClick={close} className="flex size-9 items-center justify-center rounded-full bg-panel text-ink hover:bg-line"><Icon name="x" size={16} /></button>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] leading-4 font-semibold text-ink">Outcome *</p>
          {contactOutcomes.map((o) => {
            const on = o === outcome
            return (
              <button key={o} type="button" onClick={() => setOutcome(o)} className={cx('flex items-center gap-3 rounded-[16px] px-3.5 text-left', on ? 'h-[52px] border border-blue bg-[#f3f7ff]' : 'h-[50px] bg-panel hover:bg-panel-2')}>
                <Radio on={on} />
                <span className="text-[14px] font-semibold text-ink">{o}</span>
              </button>
            )
          })}
        </div>
        <Field label="Note" className="flex-none"><TextArea defaultValue="Wants to compare with CareFirst before renewing." /></Field>
        <div className="flex gap-3">
          <Field label="Next follow-up"><TextBox trailing="calendar" defaultValue="02-11-2026" /></Field>
          <Field label="Time"><SelectBox options={followUpTimes} defaultValue="11:00 AM" /></Field>
        </div>
        <span className="flex-1" />
        <div className="sticky bottom-0 flex gap-2.5 bg-white">
          <Btn variant="white" className="w-[210px] justify-center" onClick={close}>Cancel</Btn>
          <Btn icon="check" to={P.n1} className="flex-1 justify-center">Save contact</Btn>
        </div>
      </aside>
    </>
  )
}

export default function RenewalLogContact() {
  return <RenewalDetail overlay={<LogContactDrawer />} />
}
