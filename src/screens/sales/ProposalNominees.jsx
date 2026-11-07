// Figma 10:1354 · 09 · Proposal — Nominees
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, Field, Select, Input, cx } from '../../components/ui'
import { PillButton, SChip, SCard, SCardHead, Dot, NOWRAP } from './_parts'
import { proposalSteps } from '../../data/sales'
import { useCtrlK } from '../tasks/_filter'

const CURRENT = 2

function StepsCard() {
  return (
    <SCard className="w-[300px] shrink-0" gap="gap-1.5">
      <div className="mb-0 flex flex-col gap-[3px]">
        <p className="text-[17px] font-bold text-ink">Proposal</p>
        <p className="text-[12px] leading-[15px] font-medium text-muted">Submit on the insurer portal, then record it here</p>
      </div>
      {proposalSteps.map((s, i) => {
        const on = i === CURRENT
        return (
          <div key={s.label} className={cx('flex h-14 items-center gap-3 rounded-[18px] px-3', on && 'bg-[#f3f7ff]')}>
            <span
              className={cx(
                'flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                s.done && 'bg-navy text-white',
                on && 'border-2 border-blue bg-white text-blue',
                !s.done && !on && 'bg-panel text-muted',
              )}
            >
              {s.done ? <Icon name="check" size={15} /> : i + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <p className={cx('text-[13px] font-bold', s.done || on ? 'text-ink' : 'text-muted')}>{s.label}</p>
              <p className="text-[11px] font-medium text-muted">{s.sub}</p>
            </div>
          </div>
        )
      })}
    </SCard>
  )
}

export default function ProposalNominees() {
  useCtrlK()
  const [nominee, setNominee] = useState(true)
  const [share, setShare] = useState('100')
  const pct = nominee ? Math.min(100, Number(share) || 0) : 0
  const ok = pct === 100

  return (
    <AppLayout active="proposals">
      <PageHeader
        className={NOWRAP}
        breadcrumb={'PROPOSALS  /  PR-202610-00004'}
        title="PR-202610-00004"
        titleExtra={<SChip tone="gray">Draft</SChip>}
        subtitle="Faizal Khan Sr · ICICI Lombard Private Car Package · QT-202610-00010"
        actions={<PillButton variant="danger" icon="x" className="pl-[17px]">Cancel proposal</PillButton>}
      />

      <div className="mt-[37px] flex items-start gap-10">
        <StepsCard />

        <SCard className="w-[840px] shrink-0" gap="gap-5">
          <SCardHead
            title="3 · Nominees"
            subtitle="For this policy only. Pre-filled from the default nominee."
            right={<SChip tone="gray">Up to 1 nominee</SChip>}
          />

          {nominee ? (
            <div className="flex flex-col gap-4 rounded-[24px] bg-panel p-5">
              <div className="flex items-center gap-3">
                <Dot initials="SK" bg="#d9eafd" size={40} font={13} />
                <p className="flex-1 text-[15px] font-bold text-ink">Nominee 1</p>
                <PillButton variant="ghost" size="sm" icon="x" className="hover:bg-white" onClick={() => setNominee(false)}>Remove</PillButton>
              </div>
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-4">
                <Field label="Person *"><Select className="bg-white! [&>svg]:text-muted" options={['Sameena Khan', 'Faizal Khan Jr', 'Someone else']} /></Field>
                <Field label="Relationship *"><Select className="bg-white! [&>svg]:text-muted" options={['Spouse', 'Son', 'Daughter', 'Parent']} /></Field>
                <Field label="Date of birth *"><Input className="bg-white!" defaultValue="12-04-1972" trailing={<Icon name="calendar" size={18} className="text-muted" />} /></Field>
                <Field label="Share % *"><Input className="bg-white!" prefix="%" value={share} onChange={(e) => setShare(e.target.value.replace(/\D/g, '').slice(0, 3))} /></Field>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => { setNominee(true); setShare('100') }}
              className="flex h-[60px] items-center justify-center gap-2 rounded-[22px] border border-dashed border-[#bcd2f7] text-[14px] font-semibold text-blue hover:bg-blue-50">
              <Icon name="plus" size={18} /> Add nominee
            </button>
          )}

          <div className={cx('flex h-[46px] items-center gap-3.5 rounded-[18px] px-[18px]', ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbebec] text-[#b4323c]')}>
            <Icon name={ok ? 'check' : 'alert'} size={18} />
            <p className="w-[124px] text-[14px] font-bold whitespace-nowrap">Shares total {pct}%</p>
            <div className="h-2.5 w-[360px] overflow-hidden rounded-[5px] bg-white">
              <div className={cx('h-full rounded-[5px]', ok ? 'bg-[#16845b]' : 'bg-[#e0727c]')} style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="flex h-10 w-max items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 text-[13px] font-semibold text-blue">
            <Icon name="alert" size={16} />
            A nominee under 18 needs an appointee. The policyholder cannot be their own nominee.
          </div>

          <div className="flex items-center gap-3">
            <PillButton variant="outline" className="px-5" to="/x/r2-proposal-declarations">Back</PillButton>
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
              <Icon name="check" size={16} className="text-[#127650]" /> Draft saved
            </span>
            <span className="flex-1" />
            <PillButton variant="navy" icon="arrow" to={ok ? '/x/r4-proposal-kyc-check' : undefined} className={ok ? 'shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]' : 'pointer-events-none opacity-40'}>
              Next: KYC check
            </PillButton>
          </div>
        </SCard>
      </div>
    </AppLayout>
  )
}
