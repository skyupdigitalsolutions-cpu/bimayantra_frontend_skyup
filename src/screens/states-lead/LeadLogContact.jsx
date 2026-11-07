// Figma 282:29000 · LS2 · Lead — Log contact
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { LeadDetailBase, Scrim, Drawer, RadioOption, FieldLabel, TextField, SelectField, AreaField, FootButton } from './_parts'

const CHANNELS = ['Call', 'WhatsApp', 'Email', 'Meeting']
const OUTCOMES = [
  { key: 'spoke', title: 'Spoke to him' },
  { key: 'unreachable', title: 'Not reachable' },
  { key: 'callback', title: 'Asked to call back', sub: 'Sets a follow-up date' },
]

export default function LeadLogContact() {
  const [channel, setChannel] = useState('Call')
  const [outcome, setOutcome] = useState('spoke')
  const [note, setNote] = useState('Wants quotes from 2 insurers by Friday.')
  const [date, setDate] = useState('30-10-2026')
  const [time, setTime] = useState('11:00 AM')
  const [move, setMove] = useState('Contacted')
  return (
    <LeadDetailBase
      overlay={
        <>
          <Scrim to="/leads/1" />
          <Drawer>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]">
                <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">Log contact</p>
                <p className="text-[12px] font-medium text-muted">Ramesh Gowda · 98860 12345</p>
              </div>
              <Link to="/leads/1" aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel text-ink hover:bg-line">
                <Icon name="x" size={16} />
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>How did you contact him? *</FieldLabel>
              <div className="flex items-start gap-1.5">
                {CHANNELS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChannel(c)}
                    className={cx(
                      'rounded-[16px] px-3 py-[7px] text-[12px] font-semibold',
                      c === channel ? 'bg-navy text-white' : 'border border-line bg-white text-ink-2 hover:bg-tile',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Outcome *</FieldLabel>
              {OUTCOMES.map((o) => (
                <RadioOption key={o.key} {...o} selected={outcome === o.key} onSelect={() => setOutcome(o.key)} />
              ))}
            </div>

            <AreaField label="Note" value={note} onChange={setNote} />

            <div className="flex gap-3">
              <TextField label="Next follow-up" value={date} onChange={setDate} trailing="calendar" className="min-w-0 flex-1 basis-0" />
              <SelectField label="Time" value={time} onChange={setTime} options={['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '5:00 PM']} className="min-w-0 flex-1 basis-0" />
            </div>

            <SelectField label="Move lead to (optional)" value={move} onChange={setMove} options={['Contacted', 'Qualified', 'Follow-up']} />

            <div className="sticky bottom-0 z-10 -mx-7 mt-auto flex shrink-0 gap-2.5 bg-white px-7 pt-3 shadow-[0_24px_0_0_#fff]">
              <FootButton to="/leads/1">Cancel</FootButton>
              <FootButton variant="navy" icon="check" to="/leads/1">Save contact</FootButton>
            </div>
          </Drawer>
        </>
      }
    />
  )
}
