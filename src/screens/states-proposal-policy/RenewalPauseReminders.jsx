// Figma 285:33944 · RS5 · Renewal — Pause reminders
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cx } from '../../components/ui'
import { Radio } from '../flow-policy/_kit'
import { RenewalsBoard, Scrim, Dialog, DialogButton, DialogActions, DField } from './_parts'
import { S } from '../../data/states-proposal-policy'

const MODES = ['Until a date', 'Until I resume']

function PauseDialog() {
  const nav = useNavigate()
  const [mode, setMode] = useState(MODES[0])
  return (
    <>
      <Scrim onClick={() => nav(S.renewals)} />
      <Dialog
        top={140}
        icon="clock"
        iconBg="bg-[#fbf1e1]"
        iconColor="text-[#8a5a12]"
        title="Pause customer reminders?"
        body="Kavya Hegde · FamilySure. Your own reminders continue."
      >
        {MODES.map((m) => {
          const on = m === mode
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cx('flex items-center gap-3 rounded-[14px] p-3 text-left', on ? 'h-12 border border-blue bg-[#f3f7ff]' : 'h-[46px] bg-panel')}
            >
              <Radio on={on} />
              <span className="text-[13px] leading-4 font-bold text-ink">{m}</span>
            </button>
          )
        })}
        <DField label="Resume on" defaultValue="10-11-2026" trailing="calendar" disabled={mode !== MODES[0]} />
        <DialogActions>
          <DialogButton to={S.renewals}>Cancel</DialogButton>
          <DialogButton variant="navy" icon="clock" to={S.renewals} className="w-[232px] flex-none">Pause reminders</DialogButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default function RenewalPauseReminders() {
  const [tab, setTab] = useState('due')
  return <RenewalsBoard tab={tab} onTab={setTab} overlay={<PauseDialog />} />
}
