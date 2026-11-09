// Figma 24:1999 · 20 · Public referral form
import { useState } from 'react'
import { SelectCompat } from '../../components/pickers'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { PublicPage, RingAvatar, SBtn, SChip } from './_parts'
import { referralInterests } from '../../data/public'

const inputCls = 'flex h-[50px] w-full items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink'
const fieldInput = 'min-w-0 flex-1 bg-transparent font-semibold outline-none placeholder:font-medium placeholder:text-faint'

function F({ label, children }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {children}
    </label>
  )
}

export default function ReferralForm() {
  const [interest, setInterest] = useState(referralInterests)
  const [agree, setAgree] = useState(true)
  const [name, setName] = useState('Nisha Rao')
  const [sent, setSent] = useState(false)

  return (
    <PublicPage blob={{ x: -160, y: 520, size: 560, color: 'rgba(52,120,246,0.2)' }}>
      <form
        onSubmit={(e) => { e.preventDefault(); setSent(true) }}
        className="absolute top-[70px] left-[200px] flex w-[600px] flex-col gap-[18px] rounded-[28px] bg-white p-9 shadow-[0px_24px_48px_-16px_rgba(19,41,75,0.1)]"
      >
        <div className="flex items-center gap-3.5">
          <RingAvatar ini="SR" />
          <div className="flex flex-col gap-0.5">
            <p className="text-[15px] font-bold text-ink">Suresh Rao</p>
            <p className="text-[12px] font-medium text-muted">Rao Insurance Services · Insurance advisor</p>
          </div>
        </div>
        <SChip icon="star" className="w-fit bg-[#fde8ec] text-[#b4325a]">Recommended by Manjunath K</SChip>
        <h1 className="text-[28px] font-bold tracking-[-0.6px] text-ink">Ask Suresh to contact you</h1>

        <div className="flex gap-4">
          <F label="Your name *"><span className={inputCls}><input className={fieldInput} value={name} onChange={(e) => setName(e.target.value)} /></span></F>
          <F label="Mobile *"><span className={inputCls}><span className="text-muted">+91</span><input className={fieldInput} defaultValue="91234 00001" /></span></F>
        </div>
        <div className="flex gap-4">
          <F label="Email"><span className={inputCls}><input className={fieldInput} placeholder="Optional" /></span></F>
          <F label="How you know Manjunath *">
            <span className={cx(inputCls, 'relative')}>
              <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0" defaultValue="Friend">
                {['Friend', 'Family', 'Colleague', 'Neighbour', 'Other'].map((o) => <option key={o}>{o}</option>)}
              </SelectCompat>
            </span>
          </F>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold text-ink">Insurance you are interested in *</span>
          <div className="flex gap-2">
            {Object.keys(interest).map((k) => {
              const on = interest[k]
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setInterest((s) => ({ ...s, [k]: !s[k] }))}
                  className={cx('flex h-[34px] items-center gap-1.5 rounded-[18px] border text-[13px] font-semibold', on ? 'border-blue bg-[#e8f0fd] pr-3.5 pl-2.5 text-blue' : 'border-line bg-white px-3.5 text-muted')}
                >
                  {on && <Icon name="check" size={14} />}
                  {k}
                </button>
              )
            })}
          </div>
        </div>

        <F label="Message">
          <textarea
            defaultValue="Looking for cover for my parents."
            className="h-24 w-full resize-none rounded-[16px] bg-panel px-4 pt-3.5 text-[14px] font-semibold text-ink outline-none"
          />
        </F>

        <div className="flex gap-3">
          <button type="button" onClick={() => setAgree(!agree)} className={cx('flex size-[22px] shrink-0 items-center justify-center rounded-[7px]', agree ? 'bg-navy text-white' : 'border border-[#c3ccd8] bg-white')}>
            {agree && <Icon name="check" size={14} />}
          </button>
          <p className="w-[480px] text-[13px] leading-5 font-medium text-ink">I agree that Suresh Rao may contact me by phone and WhatsApp about insurance.</p>
        </div>

        <SBtn size="lg" icon="send" type="submit" className="h-[54px] w-full text-[15px]">Submit</SBtn>
      </form>

      <p className="absolute top-[190px] left-[860px] text-[12px] font-semibold tracking-[0.2px] text-muted">After submit</p>
      <div className={cx('absolute top-[220px] left-[860px] flex w-[440px] flex-col items-center gap-3.5 rounded-[28px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] p-9 shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]', sent && 'ring-2 ring-[#127650]/30')}>
        <span className="flex size-20 items-center justify-center rounded-full bg-white"><Icon name="check" size={38} className="text-[#127650]" /></span>
        <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">Thank you, {name.split(' ')[0] || 'Nisha'}.</p>
        <p className="text-[14px] font-medium text-[#2f6b55]">Suresh Rao will contact you soon.</p>
      </div>
    </PublicPage>
  )
}
