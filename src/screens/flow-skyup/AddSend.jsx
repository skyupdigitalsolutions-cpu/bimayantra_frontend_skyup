// Figma 133:16297 · ADc · SkyUp Admin — Review and send for approval
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ACardHead, HButton } from '../admin/_parts'
import { AddProductShell, BODY_CARD } from './_parts'
import { reviewTiles, corrections } from '../../data/flow-skyup'

export default function AddSend() {
  const [agree, setAgree] = useState(true)
  return (
    <AddProductShell subtitle="Verified catalogue · Health · Activ One MAX" step={7}>
      <div className={`mt-[35px] flex flex-col gap-4 ${BODY_CARD}`}>
        <ACardHead title="7 · Review and send" subtitle="A second admin approves before it goes live" />
        <div className="flex gap-3.5">
          {reviewTiles.map((t) => (
            <div key={t.label} className="flex flex-1 flex-col gap-1.5 rounded-[22px] p-[18px]" style={{ background: t.bg }}>
              <span className="flex size-9 items-center justify-center rounded-full bg-white/80">
                <Icon name={t.icon} size={16} className="text-ink" />
              </span>
              <p className="text-[12px] font-semibold text-ink-2">{t.label}</p>
              <p className="text-[22px] font-bold text-ink">{t.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 rounded-[20px] bg-panel p-4">
          <p className="text-[13px] font-bold text-ink">Corrections made to the AI reading</p>
          {corrections.map((c) => (
            <div key={c.field} className="flex h-[51px] items-center gap-3 rounded-[12px] bg-white px-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fbf1e1]">
                <Icon name="edit" size={12} className="text-[#8a5a12]" />
              </span>
              <div className="flex flex-1 flex-col gap-px">
                <p className="text-[12px] font-bold text-ink">{c.field}</p>
                <p className="text-[12px] font-medium text-ink-2">{c.change}</p>
              </div>
              <p className="text-[11px] font-semibold text-muted">{c.who}</p>
            </div>
          ))}
        </div>
        <div className="flex h-[46px] items-center gap-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={agree}
            onClick={() => setAgree(!agree)}
            className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px]', agree ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white')}
          >
            {agree && <Icon name="check" size={15} />}
          </button>
          <span className="text-[13px] font-semibold text-ink">I reviewed every value against the brochure.</span>
          <span className="flex-1" />
          <HButton variant="navy" icon="send" to="/x/ad1-skyup-admin-catalogue-product-published">Send for approval</HButton>
        </div>
      </div>
    </AddProductShell>
  )
}
