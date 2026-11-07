// Figma 246:20845 · PF3 · Edit family member
import { useState } from 'react'
import { Drawer, DrawerHead, Btn, SmallBtn, InputBox } from '../flow-consent/_parts'
import { FamilyPage, Field, SelectBox } from './_parts'

export default function EditFamilyMember() {
  const [f, setF] = useState({ name: 'Shanta Hegde', rel: 'Mother', gender: 'Female', dob: '', mobile: '98450 11223' })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  return (
    <FamilyPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/x/05a-customer-family" className="w-[220px] flex-none">Cancel</Btn>
              <Btn variant="navy" icon="check" to="/x/05a-customer-family">Save member</Btn>
            </>
          }
        >
          <DrawerHead title="Edit family member" sub="Shanta Hegde · Mother" close="/x/05a-customer-family" />
          <Field label="Full name *"><InputBox value={f.name} onChange={set('name')} /></Field>
          <div className="flex gap-3">
            <Field label="Relationship *" className="w-[216px]"><SelectBox value={f.rel} onChange={set('rel')} options={['Mother', 'Father', 'Spouse', 'Son', 'Daughter']} /></Field>
            <Field label="Gender" className="w-[216px]"><SelectBox value={f.gender} onChange={set('gender')} options={['Female', 'Male', 'Other']} /></Field>
          </div>
          <div className="flex items-start gap-3">
            <Field label="Date of birth" className="w-[216px]" hint={<p className="w-[180px] text-[12px] font-medium text-muted">Needed to include her in quotations</p>}>
              <InputBox value={f.dob} onChange={set('dob')} placeholder="Add date of birth" trailing="calendar" className="border-2 border-blue pl-[18px]" />
            </Field>
            <Field label="Mobile" className="w-[216px]">
              <InputBox value={f.mobile} onChange={set('mobile')} leading={<span className="text-[14px] font-semibold text-muted">+91</span>} />
            </Field>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] border border-[#f2c4c8] bg-[#fff7f7] p-3.5">
            <div className="flex w-[267px] flex-col gap-0.5">
              <p className="text-[13px] font-bold text-[#b4323c]">Mark as inactive</p>
              <p className="w-[300px] text-[11px] font-medium text-[#b4323c]">Her documents and history are kept. She’s left out of new quotations until reactivated.</p>
            </div>
            <SmallBtn variant="danger" icon="x" className="ml-auto pr-3.5">Mark inactive</SmallBtn>
          </div>
        </Drawer>
      }
    />
  )
}
