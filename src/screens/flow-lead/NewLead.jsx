// Figma 39:3634 · F1 · New lead
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import LeadShell, { FormCard, Row, FField, TInput, SInput, Segmented, Pill, AfterSave, PrimaryAction, SecondaryAction, cardShadow } from './_parts'
import { newLead, pipelines, referrers, priorities, interestOptions, times, duplicate, leadAfterSave } from '../../data/flow-lead'

const EMPTY = { name: '', pipeline: 'Health', mobile: '', alt: '', email: '', referrer: 'Manjunath K', priority: 'Medium', interests: [], followUp: '', time: '11:00 AM' }

export default function NewLead() {
  const [f, setF] = useState({ ...newLead, alt: '', referrer: newLead.referrer.name })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const toggleInterest = (i) => set('interests')(f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i])
  const dup = f.mobile.replace(/\D/g, '') === '9845077120'

  return (
    <LeadShell
      active="leads"
      breadcrumb="LEADS  /  NEW LEAD"
      title="New lead"
      subtitle="Name, mobile and source are enough to start."
      actions={
        <>
          <SecondaryAction onClick={() => setF(EMPTY)}>Save and add another</SecondaryAction>
          <PrimaryAction to="/leads/1" icon="check">Save lead</PrimaryAction>
        </>
      }
      side={
        <>
          <AfterSave tone="bg-linear-to-b from-[#e9e3fc] to-[#dcd2fb]" steps={leadAfterSave} />
          <div className={cx('mt-28 flex flex-col gap-2.5 rounded-[28px] bg-white p-6', cardShadow)}>
            <p className="text-[15px] font-bold text-ink">Faster entry</p>
            <p className="text-[13px] leading-[20px] font-medium text-muted">
              Leads from your referral links arrive here on their own, with consent already recorded.
            </p>
          </div>
        </>
      }
    >
      <FormCard
        title="Contact"
        subtitle="We check for duplicates as you type"
        right={<Pill className="bg-blue-50 text-blue">{f.pipeline} pipeline</Pill>}
      >
        <Row>
          <FField label="Lead name *"><TInput value={f.name} onChange={set('name')} /></FField>
          <FField label="Pipeline *"><SInput value={f.pipeline} onChange={set('pipeline')} options={pipelines} /></FField>
        </Row>
        <Row>
          <FField label="Primary mobile *"><TInput prefix="+91" value={f.mobile} onChange={set('mobile')} focused /></FField>
          <FField label="Alternate mobile"><TInput prefix="+91" value={f.alt} onChange={set('alt')} placeholder="Optional" /></FField>
          <FField label="Email"><TInput leading="mail" value={f.email} onChange={set('email')} /></FField>
        </Row>
        {dup && (
          <div className="flex h-[60px] items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-3.5">
            <Icon name="alert" size={18} className="text-[#8a5a12]" />
            <div className="flex min-w-px flex-1 flex-col gap-0.5 text-[#8a5a12]">
              <p className="text-[13px] font-bold">{duplicate.title}</p>
              <p className="text-[12px] font-medium">{duplicate.text}</p>
            </div>
            <Link to="/customers/1" className="inline-flex h-9 items-center rounded-[18px] border border-line bg-white px-3.5 text-[13px] font-semibold text-ink hover:bg-tile">
              Open customer
            </Link>
          </div>
        )}
      </FormCard>

      <FormCard title="Source and interest" className="mt-4">
        <Row>
          <FField label="Lead source *" className="w-[228px] flex-none">
            <Link to="/x/f1b-new-lead-lead-source-options" className="relative flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 hover:bg-[#eef1f8]">
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">{newLead.source}</span>
              <Icon name="chev-down" size={18} className="text-muted" />
            </Link>
          </FField>
          <FField label="Referrer *" className="w-[228px] flex-none">
            <SInput
              value={f.referrer}
              onChange={set('referrer')}
              options={referrers}
              lead={
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-amber-100 text-[10px] font-bold text-navy">
                  {f.referrer.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </span>
              }
            />
          </FField>
          <FField label="Priority" className="w-[228px] flex-none">
            <Segmented items={priorities} value={f.priority} onChange={set('priority')} />
          </FField>
        </Row>
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Insurance interest</span>
          <div className="flex gap-2">
            {interestOptions.map((i) => {
              const on = f.interests.includes(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={cx(
                    'inline-flex h-[34px] items-center gap-1.5 rounded-[18px] border text-[13px] font-semibold',
                    on ? 'border-blue bg-blue-50 pr-3.5 pl-2.5 text-blue' : 'border-line bg-white px-3.5 text-muted hover:text-ink',
                  )}
                >
                  {on && <Icon name="check" size={14} />}
                  {i}
                </button>
              )
            })}
          </div>
        </div>
        <Row>
          <FField label="Next follow-up" hint="Creates a follow-up task.">
            <TInput value={f.followUp} onChange={set('followUp')} trailing="calendar" />
          </FField>
          <FField label="Time"><SInput value={f.time} onChange={set('time')} options={times} /></FField>
        </Row>
      </FormCard>
    </LeadShell>
  )
}
