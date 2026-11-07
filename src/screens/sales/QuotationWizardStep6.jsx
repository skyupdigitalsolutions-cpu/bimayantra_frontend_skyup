// Figma 10:803 · 07 · Quotation wizard — Step 6
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, Field, Select, Input, cx } from '../../components/ui'
import { PillButton, SChip, SCard, SCardHead, Dot, NOWRAP, Ledger } from './_parts'
import { quoteSteps, quotePeople } from '../../data/sales'
import { useCtrlK } from '../tasks/_filter'

/** Figma "Stepper" (1180×97): 34px circles, 2px connectors */
function WizardStepper({ steps, current }) {
  return (
    <div className="flex items-start rounded-[28px] bg-white px-7 py-5 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      {steps.map((s, i) => {
        const done = i < current
        const on = i === current
        return (
          <div key={s} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-[59px] flex-col items-center gap-2">
              <span
                className={cx(
                  'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
                  done && 'bg-navy text-white',
                  on && 'border-2 border-blue bg-white text-blue shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
                  !done && !on && 'bg-panel text-muted',
                )}
              >
                {done ? <Icon name="check" size={16} /> : i + 1}
              </span>
              <span className={cx('text-[12px] whitespace-nowrap', on ? 'font-bold text-ink' : done ? 'font-semibold text-ink-2' : 'font-semibold text-muted')}>{s}</span>
            </div>
            {i < steps.length - 1 && <span className={cx('mt-4 h-[2px] flex-1 rounded-full', i < current ? 'bg-navy' : 'bg-line')} />}
          </div>
        )
      })}
    </div>
  )
}

export default function QuotationWizardStep6() {
  useCtrlK()
  const [people, setPeople] = useState(quotePeople)
  const n = people.filter((p) => p.on).length

  return (
    <AppLayout active="quotations">
      <PageHeader
        className={NOWRAP}
        breadcrumb={'QUOTATIONS  /  QT-202610-00013  R1'}
        title="New quotation"
        titleExtra={<SChip tone="green" icon="check">Draft saved 10:42</SChip>}
        subtitle="Kavya Hegde · Niva Bupa CareFirst Family"
        actions={<PillButton variant="outline" icon="download" className="pl-[17px]" to="/quotations">Save and exit</PillButton>}
      />

      <div className="mt-[21px]">
        <WizardStepper steps={quoteSteps} current={5} />
      </div>

      <div className="mt-[35px] flex items-start gap-5">
        <SCard className="w-[760px] shrink-0" gap="gap-0">
          <SCardHead title="6 · Details" subtitle="Who to cover, how much, and from when" />

          <div className="mt-[22px] flex flex-col gap-2.5">
            <p className="text-[13px] font-semibold text-ink">People to cover *</p>
            <div className="grid grid-cols-[344px_344px] gap-3">
              {people.map((p) => (
                <div
                  key={p.key}
                  onClick={() => !p.disabled && setPeople((xs) => xs.map((x) => (x.key === p.key ? { ...x, on: !x.on } : x)))}
                  className={cx(
                    'flex h-[75px] items-center gap-3 rounded-[20px] py-3.5 pr-4 pl-3.5 transition',
                    p.disabled ? 'cursor-not-allowed border border-line bg-white' : 'cursor-pointer',
                    !p.disabled && (p.on ? 'border-[1.5px] border-blue bg-[#f3f7ff]' : 'border-[1.5px] border-line bg-white hover:bg-tile'),
                  )}
                >
                  <Dot initials={p.initials} bg={p.bg} size={44} font={14} />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className={cx('text-[14px] font-bold', p.disabled ? 'text-faint' : 'text-ink')}>{p.name}</p>
                    <p className={cx('text-[12px] font-medium', p.disabled ? 'text-[#b4323c]' : 'text-muted')}>{p.sub}</p>
                  </div>
                  {p.on && !p.disabled ? (
                    <span className="flex size-6 items-center justify-center rounded-[8px] bg-blue text-white"><Icon name="check" size={16} /></span>
                  ) : (
                    <span className="size-6 rounded-[8px] border border-[#c3ccd8] bg-white" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex h-9 w-max items-center gap-2.5 rounded-[14px] bg-[#e7f4ee] px-3.5 text-[13px] font-semibold text-[#127650]">
              <Icon name="check" size={16} />
              {n === 0 ? 'Pick at least one person' : `All ${n} are within the age limits: adults 18–65, children 0–25.`}
            </div>
          </div>

          <div className="mt-[22px] grid grid-cols-3 gap-4">
            <Field label="Sum insured *"><Select options={['₹5 lakh', '₹10 lakh', '₹15 lakh', '₹25 lakh']} defaultValue="₹10 lakh" /></Field>
            <Field label="Policy term *"><Select options={['1 year', '2 years', '3 years']} /></Field>
            <Field label="Planned start date *"><Input defaultValue="10-11-2026" trailing={<Icon name="calendar" size={18} className="text-muted" />} className="ring-2 ring-blue focus-within:ring-2 focus-within:ring-blue" /></Field>
          </div>

          <div className="mt-[22px] h-px bg-line" />

          <div className="mt-[22px] flex items-center gap-3">
            <PillButton variant="outline" icon="chev-right" className="[&>svg]:rotate-180" to="/x/q5-quotation-product">Back</PillButton>
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
              <Icon name="check" size={16} className="text-[#127650]" /> Draft saved 10:42
            </span>
            <span className="flex-1" />
            <PillButton variant="navy" icon="arrow" className="shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]" to="/x/q7-quotation-riders">Next: Riders</PillButton>
          </div>
        </SCard>

        {/* Live estimate */}
        <div className="flex w-[400px] flex-col gap-4 rounded-[28px] bg-linear-to-r from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-[3px]">
              <p className="text-[17px] font-bold text-ink">Live estimate</p>
              <p className="text-[12px] font-medium text-muted">Updates as you fill in</p>
            </div>
            <SChip tone="high">Not final</SChip>
          </div>
          <div className="flex items-center gap-3 rounded-[20px] bg-white/80 p-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-white text-[#b4325a]"><Icon name="heart" size={22} /></span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">Niva Bupa CareFirst Family</p>
              <p className="text-[11px] font-medium text-muted">UIN NBHHLIP00001V012526</p>
            </div>
          </div>
          <div className="rounded-[20px] bg-white/80 p-[18px]">
            <Ledger
              rows={[['Base premium (PV-3, eldest 37)', '₹14,900.00'], ['Riders', '₹0.00'], ['GST 18%', '₹2,682.00']]}
              totalLabel="Total"
              total="₹17,582.00"
            />
          </div>
          <p className="text-[12px] leading-[18px] font-medium text-rose-ink">
            The price version is frozen on this revision when you generate it.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
