// Figma 255:21917 · RNB2 · Renewal — New quotation · Details and premium
import { useState } from 'react'
import { cx } from '../../components/ui'
import { Btn, Pill, Check, Field, TextBox, SelectBox } from '../flow-policy/_kit'
import { P, sumInsuredOptions } from '../../data/flow-policy'
import { NewQuoteWizard } from './_parts'

const PEOPLE = [
  { initials: 'KH', bg: '#fbd5dd', label: 'Kavya · 34', name: 'Kavya' },
  { initials: 'AH', bg: '#d9eafd', label: 'Arjun · 38', name: 'Arjun' },
  { initials: 'AH', bg: '#d4f1e7', label: 'Anya · 5', name: 'Anya' },
  { initials: 'RH', bg: '#e9e3fc', label: 'Rohan · 2 · new', name: 'Rohan', isNew: true },
]
const num = (s) => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export default function NewQuotationDetails() {
  const [on, setOn] = useState(PEOPLE.map(() => true))
  const [si, setSi] = useState('₹15 lakh')
  const [base, setBase] = useState('19,600')
  const [rider, setRider] = useState('1,200')
  const count = on.filter(Boolean).length
  const gst = (num(base) + num(rider)) * 0.18
  const total = num(base) + num(rider) + gst
  const extra = num(si) - 10
  const rohan = on[3]

  return (
    <NewQuoteWizard
      step={1}
      title="Details and premium"
      sub="Change people or cover, then enter the premium"
      backTo={P.rnb1}
      next={<Btn icon="arrow" to={P.rnb3}>Next: Review</Btn>}
      summary={[
        ['Now', 'Star Health FamilySure · Plus'],
        ['New', 'Niva Bupa CareFirst · Gold'],
        ['People', `${count} people${rohan ? ' · Rohan added' : ''}`],
        ['Sum insured', si],
        ['Portability', 'Requested'],
      ]}
    >
      <p className="text-[13px] leading-4 font-semibold text-ink">People to cover</p>
      <div className="flex gap-2.5">
        {PEOPLE.map((p, i) => (
          <div
            key={p.name}
            onClick={() => setOn(on.map((v, j) => (j === i ? !v : v)))}
            className={cx('flex h-12 w-[170px] shrink-0 cursor-pointer items-center gap-2 rounded-[16px] border pr-3 pl-2', on[i] ? 'border-blue bg-[#f3f7ff]' : 'border-transparent bg-panel')}
          >
            <span className="flex size-[30px] items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-navy" style={{ background: p.bg }}>{p.initials}</span>
            <span className="flex-1 text-[12px] font-bold whitespace-nowrap text-ink">{p.label}</span>
            <Check on={on[i]} onChange={(v) => setOn(on.map((x, j) => (j === i ? v : x)))} className="ml-2" />
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3.5">
        <Field label="Sum insured *" hint={extra > 0 ? <span className="block w-[220px]">New waiting periods apply to the extra ₹{extra} lakh.</span> : null}>
          <SelectBox options={sumInsuredOptions} value={si} onChange={(e) => setSi(e.target.value)} />
        </Field>
        <Field label="Start date *"><TextBox trailing="calendar" defaultValue="04-12-2026" /></Field>
      </div>
      <div className="flex flex-col gap-3 rounded-[18px] bg-panel p-4">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-bold text-ink">Premium for {count} people</p>
          <Pill tone="amber" icon="edit">Enter manually</Pill>
        </div>
        <p className="text-[12px] leading-[18px] font-medium text-muted">Copy it from the Niva Bupa portal. With several people, it depends on the insurer’s floater rules.</p>
        <div className="flex gap-3">
          <Field label="Base premium before GST *"><TextBox bg="white" focused prefix="₹" value={base} onChange={(e) => setBase(e.target.value.replace(/[^\d,]/g, ''))} /></Field>
          <Field label="Daily hospital cash (rider)"><TextBox bg="white" prefix="₹" value={rider} onChange={(e) => setRider(e.target.value.replace(/[^\d,]/g, ''))} /></Field>
        </div>
        <div className="flex h-[23px] items-center gap-2">
          <p className="flex-1 text-[13px] font-bold text-ink">GST 18% {inr(gst)} · Total</p>
          <p className="text-[18px] font-bold text-ink">{inr(total)}</p>
        </div>
      </div>
    </NewQuoteWizard>
  )
}
