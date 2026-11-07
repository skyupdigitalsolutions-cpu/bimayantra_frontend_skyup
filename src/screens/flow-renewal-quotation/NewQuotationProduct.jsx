// Figma 255:21703 · RNB1 · Renewal — New quotation · Product
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Btn, Radio, Check } from '../flow-policy/_kit'
import { P } from '../../data/flow-policy'
import { NewQuoteWizard } from './_parts'

const PRODUCTS = [
  { key: 'cf', logo: 'NB', name: 'CareFirst Family', insurer: 'Niva Bupa', short: 'Niva Bupa CareFirst', variants: ['Gold · Family floater', 'Silver · Family floater', 'Platinum · Family floater'] },
  { key: 'fs', logo: 'SH', name: 'FamilySure (current)', insurer: 'Star Health', short: 'Star Health FamilySure', variants: ['Plus · Family floater', 'Classic · Family floater'] },
  { key: 'sp', logo: 'HE', name: 'SecurePlus', insurer: 'HDFC ERGO', short: 'HDFC ERGO SecurePlus', variants: ['Secure · Family floater', 'Secure Plus · Family floater'] },
]

export default function NewQuotationProduct() {
  const [pick, setPick] = useState('cf')
  const [variant, setVariant] = useState(Object.fromEntries(PRODUCTS.map((p) => [p.key, p.variants[0]])))
  const [port, setPort] = useState(true)
  const sel = PRODUCTS.find((p) => p.key === pick)
  const moving = pick !== 'fs'

  return (
    <NewQuoteWizard
      step={0}
      title="Insurer, product and variant"
      sub="Pick what Kavya renews into"
      backTo={P.rn0}
      next={<Btn icon="arrow" to={P.rnb2}>Next: Details and premium</Btn>}
      summary={[
        ['Now', 'Star Health FamilySure · Plus'],
        ['New', `${sel.short} · ${variant[pick].split(' · ')[0]}`],
        ['People', 'Kavya, Arjun, Anya'],
        ['Sum insured', '₹10 lakh'],
        ['Portability', moving && port ? 'Requested' : 'Not needed'],
      ]}
    >
      {PRODUCTS.map((p) => {
        const on = p.key === pick
        return (
          <div
            key={p.key}
            role="radio"
            aria-checked={on}
            tabIndex={0}
            onClick={() => setPick(p.key)}
            className={cx('flex cursor-pointer items-center gap-3 rounded-[18px] px-3.5', on ? 'h-[71px] border-[1.5px] border-blue bg-[#f3f7ff]' : 'h-[68px] bg-panel hover:bg-panel-2')}
          >
            <Radio on={on} />
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-bold text-ink">{p.logo}</span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[14px] leading-[18px] font-bold text-ink">{p.name}</p>
              <p className="text-[12px] leading-[15px] font-medium text-muted">{p.insurer}</p>
            </div>
            <label onClick={(e) => e.stopPropagation()} className="relative flex h-[38px] items-center gap-2 rounded-[14px] border border-line bg-white px-3">
              <select
                value={variant[p.key]}
                onChange={(e) => setVariant({ ...variant, [p.key]: e.target.value })}
                className="cursor-pointer appearance-none bg-transparent text-[12px] font-bold text-ink outline-none"
              >
                {p.variants.map((v) => <option key={v}>{v}</option>)}
              </select>
              <Icon name="chev-down" size={15} className="pointer-events-none text-muted" />
            </label>
          </div>
        )
      })}
      {moving && (
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-linear-to-r from-[#e9e3fc] to-[#dcd2fb] p-4">
          <div className="flex items-center gap-2.5">
            <Check on={port} onChange={setPort} />
            <p className="text-[14px] font-bold text-ink">Request portability from Star Health</p>
          </div>
          <p className="text-[12px] leading-[18px] font-medium text-[#5b3fb8]">Waiting periods Kavya has already served carry over. Submit the portability form at least 45 days before 03 Dec.</p>
        </div>
      )}
    </NewQuoteWizard>
  )
}
