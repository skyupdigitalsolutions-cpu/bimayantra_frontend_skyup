// Figma 39:3892 · F2 · Convert lead to customer
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import LeadShell, { FormCard, Row, FField, TInput, SInput, Pill, PrimaryAction, cardShadow } from './_parts'
import { convertLead as L, convertChoices, convertOutcomes, genders, contactPrefs } from '../../data/flow-lead'

export default function ConvertLead() {
  const [choice, setChoice] = useState('new')
  const [f, setF] = useState({ ...L })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  return (
    <LeadShell
      active="leads"
      breadcrumb="LEADS  /  ANAND KULKARNI  /  CONVERT"
      title="Convert Anand Kulkarni"
      titleExtra={<Pill className="bg-blue-50 text-blue">Qualified</Pill>}
      subtitle={`${L.id} · Health pipeline · Qualified`}
      actions={<PrimaryAction to="/x/ls6-lead-converted" icon="user-plus">Save customer</PrimaryAction>}
      side={
        <>
          <aside className="flex flex-col gap-3 rounded-[28px] bg-pink-hero p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 items-center justify-center rounded-full border-2 border-white bg-white text-[18px] font-bold text-navy">{L.initials}</span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[17px] font-bold text-ink">{L.name}</span>
                <span className="text-[12px] font-medium text-rose-ink">{L.referredBy}</span>
              </span>
            </div>
            <div className="flex gap-2">
              <Pill className="bg-[#eef1f5] text-ink-2">Low priority</Pill>
              <Pill className="bg-pink-100 text-[#b4325a]">Health</Pill>
            </div>
          </aside>
          <div className={cx('mt-[29px] flex flex-col gap-3 rounded-[28px] bg-white p-6', cardShadow)}>
            <p className="text-[15px] font-bold text-ink">When you save</p>
            {convertOutcomes.map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className="flex size-[22px] items-center justify-center rounded-full bg-[#e7f4ee]">
                  <Icon name="check" size={12} className="text-[#127650]" />
                </span>
                <span className="text-[13px] font-medium text-ink-2">{t}</span>
              </div>
            ))}
          </div>
        </>
      }
    >
      <FormCard
        title="Another customer uses this mobile"
        subtitle="Anitha Kulkarni (CU-000320) · 98450 77120"
        right={<Pill icon="alert" className="bg-[#fbf1e1] text-[#8a5a12]">Check</Pill>}
      >
        {convertChoices.map((c) => {
          const on = choice === c.key
          return (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setChoice(c.key)}
              className={cx(
                'flex items-center gap-3.5 rounded-[20px] p-4 text-left',
                on ? 'h-[70px] border-[1.5px] border-blue bg-[#f3f7ff]' : 'h-[67px] bg-panel hover:bg-[#eef1f8]',
              )}
            >
              <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
              <span className="flex flex-col gap-0.5">
                <span className="text-[14px] font-bold text-ink">{c.title}</span>
                <span className="text-[12px] font-medium text-muted">{c.text}</span>
              </span>
            </button>
          )
        })}
      </FormCard>

      <FormCard title="Customer details" subtitle="Copied from the lead. Check and complete." gap={16} className="mt-[18px]">
        <Row>
          <FField label="Full name *"><TInput value={f.name} onChange={set('name')} /></FField>
          <FField label="Date of birth"><TInput value={f.dob} onChange={set('dob')} trailing="calendar" /></FField>
          <FField label="Gender"><SInput value={f.gender} onChange={set('gender')} options={genders} /></FField>
        </Row>
        <Row>
          <FField label="Primary mobile *"><TInput prefix="+91" value={f.mobile} onChange={set('mobile')} /></FField>
          <FField label="Email"><TInput leading="mail" value={f.email} onChange={set('email')} /></FField>
          <FField label="Preferred contact"><SInput value={f.preferred} onChange={set('preferred')} options={contactPrefs} /></FField>
        </Row>
        <Row>
          <FField label="City"><TInput value={f.city} onChange={set('city')} /></FField>
          <FField label="PIN code"><TInput value={f.pin} onChange={set('pin')} /></FField>
          <FField label="Source"><TInput value={`Lead ${L.id}`} onChange={() => {}} /></FField>
        </Row>
      </FormCard>
    </LeadShell>
  )
}
