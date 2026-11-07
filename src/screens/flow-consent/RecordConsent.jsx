// Figma 245:18821 · CS1 · Record consent
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ConsentPage, Drawer, DrawerHead, Btn, SmallBtn, Check, RadioCard, Label, InputBox } from './_parts'

const METHODS = [
  ['form', 'Signed consent form', 'Photo or scan of the signed page'],
  ['call', 'Verbal, on a call', 'You note the date and time'],
  ['reply', 'Reply on WhatsApp or email', 'Screenshot of the reply'],
]

function ChannelCard({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('flex h-[46px] items-center gap-2 rounded-[14px] border px-3.5', on ? 'border-blue bg-[#f3f7ff]' : 'border-line bg-white')}
    >
      <Check checked={on} onChange={onClick} />
      <span className="text-[13px] font-semibold text-ink">{children}</span>
    </button>
  )
}

export default function RecordConsent() {
  const [ch, setCh] = useState({ WhatsApp: false, Email: true, SMS: false })
  const [method, setMethod] = useState('form')
  const [date, setDate] = useState('26-10-2026')
  const [self, setSelf] = useState(true)

  return (
    <ConsentPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/x/05b-customer-consent" className="w-[220px] flex-none">Cancel</Btn>
              <Btn variant="navy" icon="check" to="/x/cs2-consent-recorded">Save consent</Btn>
            </>
          }
        >
          <DrawerHead title="Record consent" sub="Arjun Hegde · Spouse" />
          <div className="flex flex-col gap-2">
            <Label>Channels *</Label>
            <div className="flex gap-2">
              {Object.keys(ch).map((k) => (
                <ChannelCard key={k} on={ch[k]} onClick={() => setCh((s) => ({ ...s, [k]: !s[k] }))}>{k}</ChannelCard>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>How was it given? *</Label>
            {METHODS.map(([k, t, s]) => (
              <RadioCard key={k} on={method === k} onClick={() => setMethod(k)} title={t} sub={s} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Proof *</Label>
            <div className="flex h-[74px] items-center gap-3 rounded-[14px] border border-[#c7ebda] bg-[#f5fbf8] px-3">
              <span className="flex h-12 w-10 items-center justify-center rounded-[10px] border border-line bg-white text-muted"><Icon name="edit" size={16} /></span>
              <span className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="text-[13px] font-bold text-ink">consent-form-arjun.jpg</span>
                <span className="text-[11px] font-medium text-[#127650]">Uploaded · 1.1 MB</span>
              </span>
              <SmallBtn>Replace</SmallBtn>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Date given *</Label>
            <InputBox value={date} onChange={setDate} trailing="calendar" />
          </div>
          <label className="flex items-center gap-2.5">
            <Check checked={self} onChange={setSelf} />
            <span className="text-[13px] font-semibold text-ink">Arjun gave this consent himself.</span>
          </label>
        </Drawer>
      }
    />
  )
}
