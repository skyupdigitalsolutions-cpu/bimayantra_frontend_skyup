// Figma 219:18211 · CQ9 · Comparison — Generated
import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { CqHeader, Btn, Pill, CardHead, card } from './_parts'
import { CQ, CQ_NO, shareChannels } from '../../data/flow-comparative'

const SEND = { email: 'Send by email', whatsapp: 'Send on WhatsApp', link: 'Copy link', pdf: 'Download PDF' }

export default function ComparisonGenerated() {
  const [channel, setChannel] = useState('email')
  return (
    <AppLayout active="quotations">
      <CqHeader
        crumb={CQ_NO}
        title={CQ_NO}
        chip={<Pill tone="blue" icon="check">Ready</Pill>}
        subtitle="Kavya Hegde · 3 options at ₹10 lakh"
        action={<Btn variant="outline" icon="arrow" to={CQ.shared}>Open comparison</Btn>}
      />

      <section className="mt-[21px] flex h-[132px] items-center gap-[22px] rounded-[34px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-8 shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]">
        <span className="flex size-[76px] shrink-0 items-center justify-center rounded-full bg-white text-[#127650]">
          <Icon name="check" size={36} />
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="text-[24px] font-bold tracking-[-0.2px] text-ink">Comparison is ready to share</p>
          <p className="text-[13px] font-medium text-[#2f6b55]">3 options · Gold recommended · PDF generated. Validity starts on the first share.</p>
        </div>
      </section>

      <section className={cx(card, 'mt-12 flex flex-col gap-4 p-6')}>
        <CardHead title="Share with Kavya" subtitle="Email consent given" />
        <div className="flex items-start gap-3.5">
          {shareChannels.map((c) => {
            const on = c.key === channel
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setChannel(c.key)}
                className={cx(
                  'flex flex-1 flex-col items-start gap-2.5 rounded-[22px] p-4',
                  on ? 'h-[107px] border-[1.5px] border-[#1f5fd6] bg-[#f3f7ff]' : 'h-[104px] bg-panel hover:bg-[#eef1f7]',
                )}
              >
                <span className={cx('flex size-11 items-center justify-center rounded-full', c.tint)}>
                  <Icon name={c.icon} size={20} className="text-ink" />
                </span>
                <span className="text-[14px] font-bold text-ink">{c.label}</span>
              </button>
            )
          })}
        </div>
        <Btn icon="send" to={CQ.shared} className="self-start">{SEND[channel]}</Btn>
      </section>
    </AppLayout>
  )
}
