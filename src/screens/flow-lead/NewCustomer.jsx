// Figma 39:4123 · F3 · New customer
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import LeadShell, { FormCard, Row, FField, TInput, SInput, AfterSave, PrimaryAction, cardShadow } from './_parts'
import { newCustomer, genders, contactPrefs, states, customerAfterSave } from '../../data/flow-lead'

export default function NewCustomer() {
  const [f, setF] = useState({ ...newCustomer, alt: '', anniversary: '' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  return (
    <LeadShell
      active="customers"
      breadcrumb="POLICY HOLDERS  /  NEW CUSTOMER"
      title="New customer"
      subtitle="Add someone directly, without a lead."
      actions={<PrimaryAction to="/customers/1" icon="check">Save customer</PrimaryAction>}
      side={
        <>
          <aside className={cx('flex flex-col gap-3 rounded-[28px] bg-rail p-6', cardShadow)}>
            <span className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <Icon name="lock" size={22} className="text-pink-300" />
            </span>
            <p className="text-[16px] font-bold text-white">PAN and Aadhaar come later</p>
            <p className="text-[13px] leading-[20px] font-medium text-[#c9d6ea]">
              Record consent to store personal data first, on the Consent tab. Numbers are stored encrypted and always shown masked.
            </p>
          </aside>
          <AfterSave tone="mt-[60px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7]" steps={customerAfterSave} />
        </>
      }
    >
      <FormCard title="Identity" gap={16}>
        <Row>
          <FField label="Full name *"><TInput value={f.name} onChange={set('name')} /></FField>
          <FField label="Date of birth" hint="Some products need it at quotation."><TInput value={f.dob} onChange={set('dob')} trailing="calendar" /></FField>
          <FField label="Gender"><SInput value={f.gender} onChange={set('gender')} options={genders} /></FField>
        </Row>
      </FormCard>

      <FormCard title="Contact" gap={16} className="mt-[18px]">
        <Row>
          <FField label="Primary mobile *"><TInput prefix="+91" value={f.mobile} onChange={set('mobile')} /></FField>
          <FField label="Alternate mobile"><TInput prefix="+91" value={f.alt} onChange={set('alt')} placeholder="Optional" /></FField>
          <FField label="Email"><TInput leading="mail" value={f.email} onChange={set('email')} /></FField>
        </Row>
        <Row>
          <FField label="Preferred contact"><SInput value={f.preferred} onChange={set('preferred')} options={contactPrefs} /></FField>
          <FField label="Occupation"><TInput value={f.occupation} onChange={set('occupation')} /></FField>
          <FField label="Wedding anniversary"><TInput value={f.anniversary} onChange={set('anniversary')} placeholder="Optional" trailing="calendar" /></FField>
        </Row>
      </FormCard>

      <FormCard title="Address" gap={16} className="mt-[18px]">
        <FField label="Address"><TInput value={f.address} onChange={set('address')} /></FField>
        <Row>
          <FField label="City"><TInput value={f.city} onChange={set('city')} /></FField>
          <FField label="State"><SInput value={f.state} onChange={set('state')} options={states} /></FField>
          <FField label="PIN code"><TInput value={f.pin} onChange={set('pin')} /></FField>
        </Row>
      </FormCard>
    </LeadShell>
  )
}
