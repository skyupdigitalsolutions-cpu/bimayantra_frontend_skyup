// Figma 48:8610 · S11 · Settings — Security
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, SBtn, SChip } from './_parts'
import { devices } from '../../data/settings'

const STEPS = [
  ['OTP on current number', 'Proves it is you'],
  ['Enter new number', 'Must not already have access'],
  ['OTP on new number', 'Other devices log out'],
]

export default function Security() {
  const [list, setList] = useState(devices)
  const logout = (name) => setList((l) => l.filter((d) => d.current || d.name !== name))
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  SECURITY"
      title="Security"
      subtitle="Login is by mobile and OTP only. No passwords."
      contentClass="gap-[18px]"
    >
      <SCard className="gap-2.5 p-6">
        <SHead title="Signed-in devices" subtitle="Up to 3 at a time. The oldest ends when a fourth signs in." />
        {list.map((d) => (
          <div key={d.name} className={cx('flex items-center gap-3.5 rounded-[20px] p-3.5', d.current ? 'h-[72px] border border-[#c9daf8] bg-[#f3f7ff]' : 'h-[70px] bg-panel')}>
            <span className="flex size-[42px] items-center justify-center rounded-full bg-white"><Icon name={d.icon} size={18} className="text-ink" /></span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">{d.name}</p>
              <p className="text-[12px] font-medium text-muted">{d.where}</p>
            </div>
            {d.current ? <SChip tone="blue">This device</SChip> : <SBtn variant="white" icon="logout" onClick={() => logout(d.name)}>Log out</SBtn>}
          </div>
        ))}
        <SBtn variant="danger" icon="logout" className="w-fit border-[#f2c4c8] text-[#b4323c]" onClick={() => setList((l) => l.filter((d) => d.current))}>
          Log out all other devices
        </SBtn>
      </SCard>

      <SCard className="gap-4 p-6">
        <SHead title="Login mobile" subtitle="+91 98450 12345" />
        <div className="flex items-start gap-3.5">
          {STEPS.map(([t, s], i) => (
            <div key={t} className={cx('flex items-center gap-3 rounded-[20px] p-4', i === 0 ? 'h-[66px] w-[276px] border border-blue bg-[#f3f7ff]' : 'h-16 w-[274px] bg-panel')}>
              <span className={cx('flex size-8 items-center justify-center rounded-full text-[13px] font-bold', i === 0 ? 'bg-navy text-white' : 'bg-white text-muted')}>{i + 1}</span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">{t}</p>
                <p className="text-[11px] font-medium text-muted">{s}</p>
              </div>
            </div>
          ))}
        </div>
        <SBtn icon="phone" className="w-fit">Change mobile number</SBtn>
      </SCard>
    </SettingsLayout>
  )
}
