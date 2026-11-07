// Figma 283:29950 · QS2 · Quotation — Share
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { QuoteDetailBase, CHIPS, Scrim, Dialog, DialogActions, PillButton, SChip, NAVY_SH } from './_parts'
import { readyActions } from './QuotationReady'
import { revisionEvent, shareChannels } from '../../data/states-quotation'

function Channel({ c, selected, onSelect }) {
  const blocked = c.blocked
  return (
    <div
      role={blocked ? undefined : 'radio'}
      aria-checked={blocked ? undefined : selected}
      onClick={blocked ? undefined : onSelect}
      className={cx(
        'flex items-center gap-3 rounded-[14px] p-3',
        blocked ? 'h-[62px] border border-[#f1d9a8] bg-[#fff9ef]' : selected ? 'h-[62px] cursor-pointer border border-blue bg-[#f3f7ff]' : 'h-[60px] cursor-pointer bg-panel hover:bg-[#edf1f8]',
      )}
    >
      <span className={cx('flex size-9 shrink-0 items-center justify-center rounded-full bg-white', blocked ? 'text-[#8a5a12]' : 'text-ink')}>
        <Icon name={c.icon} size={16} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <p className={cx('text-[13px] font-bold', blocked ? 'text-[#8a5a12]' : 'text-ink')}>{c.title}</p>
        <p className={cx('text-[11px] font-medium', blocked ? 'text-[#8a5a12]' : 'text-muted')}>{c.sub}</p>
      </div>
      {c.consent && <SChip tone="green" icon="check">Consent given</SChip>}
      {blocked && <PillButton variant="outline" size="sm" className="px-3.5" to="/x/qs2-quotation-share">Record consent</PillButton>}
    </div>
  )
}

export default function QuotationShare() {
  const [sel, setSel] = useState('email')
  const cta = shareChannels.find((c) => c.key === sel)?.cta
  return (
    <QuoteDetailBase chip={CHIPS.ready} actions={readyActions} activity={[revisionEvent]} link="notShared">
      <Scrim to="/x/qs1-quotation-ready-not-shared" />
      <Dialog top={80} left={330} width={600}>
        <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">Share QT-202610-00012 R2</p>
        <p className="text-[13px] leading-5 font-medium text-muted">Kavya Hegde. Only channels with consent can be used.</p>
        {shareChannels.map((c) => <Channel key={c.key} c={c} selected={sel === c.key} onSelect={() => setSel(c.key)} />)}
        <div className="flex h-10 items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 text-[13px] font-semibold text-blue">
          <Icon name="clock" size={16} />
          First share starts the 15-day validity (until 08 Nov).
        </div>
        <DialogActions
          cancelTo="/x/qs1-quotation-ready-not-shared"
          confirm={<PillButton variant="navy" icon="send" className={cx('flex-1 justify-center', NAVY_SH)} to="/quotations/1">{cta}</PillButton>}
        />
      </Dialog>
    </QuoteDetailBase>
  )
}
