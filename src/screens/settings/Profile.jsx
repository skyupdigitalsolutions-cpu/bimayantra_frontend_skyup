// Figma 13:1595 · 16 · Settings — Profile
import { useState } from 'react'
import { Button, CardHead, Chip, Field, Input, ToggleChip, ProgressBar, Avatar } from '../../components/ui'
import Icon from '../../components/Icon'
import { SettingsLayout, SCard, MutedSelect } from './_parts'
import { profile } from '../../data/settings'

export default function Profile() {
  const [cats, setCats] = useState(profile.categories)
  const toggle = (c) => setCats((s) => ({ ...s, [c]: !s[c] }))

  return (
    <SettingsLayout breadcrumb="SETTINGS  /  MY PROFILE" title="My profile" subtitle="Your details print on every quotation.">
      {/* Completion */}
      <div className="flex items-center gap-5 rounded-[28px] bg-pink-hero px-[26px] py-4 drop-shadow-[0px_18px_18px_rgba(232,137,156,0.25)]">
        <Avatar initials="SR" size={72} tone="white" className="border-4 border-white text-[23px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-[18px] font-bold text-ink">Profile 70% complete</p>
          <p className="text-[13px] font-medium text-rose-ink">Missing: an insurer with an active agent code, verified KYC</p>
          <ProgressBar value={70} />
        </div>
        <Button size="sm" icon="plus" to="/x/s04-settings-my-insurers">Add insurer</Button>
      </div>

      <SCard>
        <CardHead title="Personal and contact" subtitle="Each section saves on its own" right={<Button size="sm" icon="check">Save section</Button>} />
        <div className="flex gap-4">
          <Field label="Full name *"><Input defaultValue={profile.name} /></Field>
          <Field label="Date of birth *"><Input defaultValue={profile.dob} trailing={<Icon name="calendar" size={18} className="text-muted" />} /></Field>
        </div>
        <div className="flex items-start gap-4">
          <Field label="Email *"><Input defaultValue={profile.email} leading={<Icon name="mail" size={18} className="text-muted" />} /></Field>
          <Field label="Login mobile" hint="Change it in Security."><Input defaultValue={profile.mobile} prefix="+91" /></Field>
        </div>
        <Field label="Address *"><Input defaultValue={profile.address} /></Field>
      </SCard>

      <SCard>
        <CardHead
          title="Professional"
          subtitle="Changing your licence number sends KYC for review again"
          right={<Chip tone="violet" icon="clock">KYC pending review</Chip>}
        />
        <div className="flex gap-4">
          <Field label="Advisor type *"><MutedSelect options={['Individual agent', 'Corporate agent', 'POSP', 'Broker']} defaultValue="Individual agent" /></Field>
          <Field label="IRDAI licence number *"><Input defaultValue={profile.licence} /></Field>
        </div>
        <div className="flex gap-4">
          <Field label="Licence valid until *"><Input defaultValue={profile.licenceUntil} trailing={<Icon name="calendar" size={18} className="text-muted" />} /></Field>
          <Field label="Name on quotations"><Input defaultValue={profile.quoteName} /></Field>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-ink">Authorised categories *</span>
          {Object.keys(cats).map((c) => (
            <ToggleChip key={c} selected={cats[c]} onClick={() => toggle(c)}>{c}</ToggleChip>
          ))}
        </div>
      </SCard>
    </SettingsLayout>
  )
}
