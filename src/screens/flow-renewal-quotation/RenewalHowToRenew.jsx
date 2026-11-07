// Figma 255:21407 · RN0 · Renewal — How to renew
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Btn, Pill, Scrim, Radio } from '../flow-policy/_kit'
import { RenewalDetail, PanelDialog } from '../flow-policy/_parts'
import { P } from '../../data/flow-policy'

const CHOICES = [
  { key: 'same', icon: 'refresh', bg: '#fde8c9', title: 'Renew the same policy', badge: true, to: P.n1b, text: 'Same product, people and sum insured. Enter the premium from the renewal notice. Waiting periods already served continue.' },
  { key: 'new', icon: 'quote', bg: '#e9e3fc', title: 'Create a new quotation', to: P.rnb1, text: 'Change product, insurer, people or sum insured. Moving insurer is a portability request.' },
  { key: 'compare', icon: 'compare', bg: '#d4f1e7', title: 'Compare options', to: P.cq2, text: 'Show Kavya 2 to 3 options side by side before she decides.' },
]

function HowDialog() {
  const nav = useNavigate()
  const [pick] = useState('same') // Figma: same policy pre-selected; each choice links to its flow
  const choice = CHOICES.find((c) => c.key === pick)
  return (
    <>
      <Scrim onClick={() => nav(P.n1)} />
      <PanelDialog left={290} top={70} width={680} className="gap-4 rounded-[30px] p-[30px]">
        <p className="text-[21px] leading-[26px] font-bold tracking-[-0.2px] text-ink">How do you want to renew?</p>
        <p className="text-[13px] leading-5 font-medium text-muted">Kavya Hegde · Star Health FamilySure · Plus · ends 03 Dec 2026</p>
        {CHOICES.map((c) => {
          const on = c.key === pick
          return (
            <Link
              key={c.key}
              to={c.to}
              className={cx('flex items-start gap-3.5 rounded-[20px] text-left', on ? 'border-2 border-blue bg-[#f3f7ff] p-4' : 'border border-line bg-white p-4 hover:bg-panel-2')}
            >
              <Radio on={on} />
              <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full text-ink" style={{ background: c.bg }}><Icon name={c.icon} size={20} /></span>
              <span className="flex w-[430px] flex-col gap-1">
                <span className="flex items-center gap-2">
                  <span className="text-[15px] leading-[19px] font-bold text-ink">{c.title}</span>
                  {c.badge && <Pill tone="green" icon="star">Recommended</Pill>}
                </span>
                <span className="text-[12px] leading-[18px] font-medium text-muted">{c.text}</span>
              </span>
            </Link>
          )
        })}
        <div className="flex gap-2.5">
          <Btn variant="white" to={P.n1} className="flex-1 justify-center">Cancel</Btn>
          <Btn icon="arrow" to={choice.to} className="w-[302px] justify-center">Continue</Btn>
        </div>
      </PanelDialog>
    </>
  )
}

export default function RenewalHowToRenew() {
  return <RenewalDetail links={{ create: P.n1b }} overlay={<HowDialog />} />
}
