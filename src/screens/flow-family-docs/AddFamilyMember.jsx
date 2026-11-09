// Figma 238:17768 · FD1 · Add family member
import { useState } from 'react'
import { SelectCompat } from '../../components/pickers'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ProfileShell, FamilyBody, Scrim, Drawer, OverlayHead, PillButton, Note, FieldBox, INPUT } from './_parts'
import { useNavigate } from 'react-router-dom'

function SelectBox({ label, value, onChange, options }) {
  return (
    <FieldBox label={label} className="flex-1">
      <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </SelectCompat>
    </FieldBox>
  )
}

export default function AddFamilyMember() {
  const navigate = useNavigate()
  const [f, setF] = useState({ name: 'Rohan Hegde', rel: 'Son', gender: 'Male', dob: '14-02-2024', mobile: '', email: '', nominee: false })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v?.target ? v.target.value : v }))
  return (
    <ProfileShell
      tab="family"
      crumb="FAMILY"
      overlay={
        <>
          <Scrim onClick={() => navigate('/x/05a-customer-family')} />
          <Drawer>
            <OverlayHead title="Add family member" sub="Kavya Hegde’s household" closeTo="/x/05a-customer-family" />
            <FieldBox label="Full name *" focus>
              <input value={f.name} onChange={set('name')} className={INPUT} />
            </FieldBox>
            <div className="flex gap-3">
              <SelectBox label="Relationship *" value={f.rel} onChange={set('rel')} options={['Son', 'Daughter', 'Spouse', 'Father', 'Mother', 'Other']} />
              <SelectBox label="Gender" value={f.gender} onChange={set('gender')} options={['Male', 'Female', 'Other']} />
            </div>
            <div className="flex items-start gap-3">
              <FieldBox label="Date of birth *" hint="Needed for quotations" className="flex-1">
                <input value={f.dob} onChange={set('dob')} className={INPUT} />
                <Icon name="calendar" size={18} className="text-muted" />
              </FieldBox>
              <FieldBox label="Mobile" className="flex-1">
                <span className="text-[14px] font-semibold text-muted">+91</span>
                <input value={f.mobile} onChange={set('mobile')} placeholder="Optional" className={INPUT} />
              </FieldBox>
            </div>
            <FieldBox label="Email">
              <Icon name="mail" size={18} className="text-muted" />
              <input value={f.email} onChange={set('email')} placeholder="Optional" className={INPUT} />
            </FieldBox>
            <label className="flex h-[60px] cursor-pointer items-center gap-3 rounded-[16px] bg-panel p-3.5">
              <input type="checkbox" checked={f.nominee} onChange={(e) => set('nominee')(e.target.checked)} className="peer sr-only" />
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border border-[#c3ccd8] bg-white text-white peer-checked:border-navy peer-checked:bg-navy">
                {f.nominee && <Icon name="check" size={13} />}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-ink">Make default nominee</span>
                <span className="text-[11px] font-medium text-muted">Suggested on new proposals. Arjun is the current default.</span>
              </span>
            </label>
            <Note icon="lock" bg="#e8f0fd" color="#1f5fd6" className="w-full items-center [&>span]:leading-4">
              Aadhaar and PAN can be added after saving. Personal-data consent is already recorded for this household.
            </Note>
            <div className="sticky bottom-0 z-10 -mx-7 mt-auto flex shrink-0 gap-2.5 bg-white px-7 pt-3 shadow-[0_24px_0_0_#fff]">
              <PillButton variant="outline" className="flex-1 justify-center px-5" to="/x/05a-customer-family">Cancel</PillButton>
              <PillButton variant="navy" icon="check" className="w-[214px] justify-center" to="/x/fd2-family-member-added">Save member</PillButton>
            </div>
          </Drawer>
        </>
      }
    >
      <FamilyBody links={false} />
    </ProfileShell>
  )
}
