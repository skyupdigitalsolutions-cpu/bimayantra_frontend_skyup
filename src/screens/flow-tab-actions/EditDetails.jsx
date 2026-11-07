// Figma 246:19670 · PE1 · Edit details
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Drawer, DrawerHead, Btn, Label, InputBox } from '../flow-consent/_parts'
import { OverviewPage, SelectBox } from './_parts'

function Field({ label, className = '', children }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export default function EditDetails() {
  const [f, setF] = useState({
    name: 'Kavya Hegde', dob: '14-03-1992', mobile: '98861 23456', email: 'kavya.hegde@example.in',
    contact: 'WhatsApp', occupation: 'Software engineer', anniversary: '25-11-2018',
    address: '42, 3rd Cross, HSR Layout, Sector 2, Bengaluru 560102',
  })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))

  return (
    <OverviewPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/customers/1" className="w-[220px] flex-none">Cancel</Btn>
              <Btn variant="navy" icon="check" to="/customers/1">Save changes</Btn>
            </>
          }
        >
          <DrawerHead title="Edit details" sub="Kavya Hegde · CU-000318" close="/customers/1" />
          <div className="flex gap-3">
            <Field label="Full name *" className="w-[216px]"><InputBox value={f.name} onChange={set('name')} /></Field>
            <Field label="Date of birth" className="w-[216px]"><InputBox value={f.dob} onChange={set('dob')} trailing="calendar" /></Field>
          </div>
          <div className="flex gap-3">
            <Field label="Primary mobile *" className="w-[216px]">
              <InputBox value={f.mobile} onChange={set('mobile')} className="border-2 border-blue pl-[18px]" leading={<span className="text-[14px] font-semibold text-muted">+91</span>} />
            </Field>
            <Field label="Email" className="w-[216px]">
              <InputBox value={f.email} onChange={set('email')} leading={<Icon name="mail" size={18} className="shrink-0 text-muted" />} />
            </Field>
          </div>
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4 py-3">
            <Icon name="alert" size={16} className="shrink-0 text-[#8a5a12]" />
            <p className="text-[13px] font-semibold text-[#8a5a12]">Changing mobile or email resets message consent for that channel.</p>
          </div>
          <div className="flex gap-3">
            <Field label="Preferred contact" className="w-[216px]"><SelectBox value={f.contact} onChange={set('contact')} options={['WhatsApp', 'Call', 'Email', 'SMS']} /></Field>
            <Field label="Occupation" className="w-[216px]"><InputBox value={f.occupation} onChange={set('occupation')} /></Field>
          </div>
          <Field label="Wedding anniversary"><InputBox value={f.anniversary} onChange={set('anniversary')} trailing="calendar" /></Field>
          <Field label="Address">
            <textarea value={f.address} onChange={(e) => set('address')(e.target.value)} className="h-24 w-full resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none" />
          </Field>
        </Drawer>
      }
    />
  )
}
