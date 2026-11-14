// Figma 41:5739 · Q11 · Quotation — Generated
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { NavyButton, OutlineButton, Head } from './_parts'
import { shareChannels, nextSteps, QUOTE_ID, SUBTITLE_VARIANT } from '../../data/quotation-flow'
import { useHeaderSearch } from '../customer-tabs/_search'

const card = 'rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

export default function QuotationGenerated() {
  useHeaderSearch() // Ctrl/Cmd+K focuses the header search pill
  const navigate = useNavigate()
  const [ch, setCh] = useState('email')
  const [done, setDone] = useState(null)
  const active = shareChannels.find((c) => c.key === ch)

  return (
    <AppLayout active="quotations">
      <PageHeader
        breadcrumb={`QUOTATIONS  /  ${QUOTE_ID}`}
        title={QUOTE_ID}
        titleExtra={
          <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-blue-50 py-[5px] pr-3 pl-2 text-[12px] font-semibold text-blue">
            <Icon name="check" size={13} />
            Ready
          </span>
        }
        subtitle={`${SUBTITLE_VARIANT} · R1`}
        actions={<OutlineButton to="/quotations/1" icon="arrow" className="mt-px">Open quotation</OutlineButton>}
      />

      {/* Success hero */}
      <section className="mt-[21px] flex h-[144px] items-center gap-6 rounded-[34px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-[34px] shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)] max-md:mt-3 max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-3 max-md:rounded-[22px] max-md:px-4 max-md:py-4">
        <div className="flex items-center gap-3 max-md:w-full md:contents">
          <span className="flex size-[84px] shrink-0 items-center justify-center rounded-full bg-white max-md:size-12">
            <Icon name="check" size={40} className="text-[#127650] max-md:!size-6" />
          </span>
          <div className="flex min-w-px flex-1 flex-col gap-1.5 max-md:gap-0.5">
            <p className="text-[26px] font-bold tracking-[-0.3px] text-ink max-md:text-[18px] max-md:tracking-[-0.2px]">Quotation is ready to share</p>
            <p className="text-[14px] font-medium text-[#2f6b55] max-md:text-[12px]">PDF generated with price PV-3 frozen. Validity (15 days) starts on the first share.</p>
          </div>
        </div>
        <div className="flex h-[75px] w-[138px] shrink-0 flex-col gap-0.5 rounded-[20px] bg-white/80 px-5 py-3.5 max-md:h-auto max-md:w-full max-md:flex-row max-md:items-center max-md:rounded-[14px] max-md:px-3.5 max-md:py-2.5">
          <span className="text-[12px] font-semibold text-[#2f6b55]">Total</span>
          <span className="text-[24px] font-bold text-ink max-md:ml-auto max-md:text-[20px]">₹18,054</span>
        </div>
      </section>

      <div className="mt-[46px] flex items-start gap-5 max-md:mt-4 max-md:flex-col">
        {/* Share now */}
        <section className={cx(card, 'flex w-[760px] shrink-0 flex-col gap-4 max-md:!w-full max-md:!shrink max-md:min-w-0 max-md:rounded-[22px] max-md:p-4')}>
          <Head title="Share with Kavya" subtitle="Pick a channel. Email consent: given." />
          <div className="flex items-start gap-3.5 max-md:flex-wrap max-md:gap-2.5">
            {shareChannels.map((c) => {
              const on = c.key === ch
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => { setCh(c.key); setDone(null) }}
                  className={cx(
                    'flex flex-col items-start gap-2.5 rounded-[22px] p-4 text-left transition max-md:rounded-[16px] max-md:p-3',
                    on ? 'h-[131px] w-[169.8px] shrink-0 border-[1.5px] border-blue bg-[#f3f7ff] max-md:h-auto max-md:w-[calc(50%-6px)]' : 'h-[128px] min-w-px flex-1 bg-panel hover:bg-[#eef1f8] max-md:h-auto max-md:min-w-[calc(50%-6px)] max-md:flex-none',
                  )}
                >
                  <span className={cx('flex size-11 items-center justify-center rounded-full', c.iconBg)}>
                    <Icon name={c.icon} size={20} className="text-ink" />
                  </span>
                  <span className="text-[14px] font-bold text-ink">{c.title}</span>
                  <span className="text-[11px] font-medium text-muted">{c.sub}</span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2.5 max-md:flex-wrap">
            <NavyButton icon={active.ctaIcon} onClick={() => (active.to ? navigate(active.to) : setDone(active.key))} className="max-md:h-10 max-md:rounded-[20px] max-md:text-[13px] max-md:pr-4 max-md:pl-3">{active.cta}</NavyButton>
            {done && (
              <span className="inline-flex items-center gap-[5px] rounded-[14px] bg-[#e7f4ee] py-[5px] pr-3 pl-2 text-[12px] font-semibold text-[#127650]">
                <Icon name="check" size={13} />
                {done === 'link' ? 'Link copied' : done === 'pdf' ? 'PDF downloaded' : 'WhatsApp opened'}
              </span>
            )}
          </div>
        </section>

        {/* What happens next */}
        <section className={cx(card, 'flex w-[400px] shrink-0 flex-col gap-3 max-md:!w-full max-md:!shrink max-md:min-w-0 max-md:rounded-[22px] max-md:p-4')}>
          <p className="text-[16px] font-bold text-ink">What happens next</p>
          {nextSteps.map(([t, s], i) => (
            <div key={t} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-panel text-[12px] font-bold text-muted">{i + 1}</span>
              <span className="flex flex-col gap-px">
                <span className="text-[13px] font-bold text-ink">{t}</span>
                <span className="text-[11px] font-medium text-muted">{s}</span>
              </span>
            </div>
          ))}
        </section>
      </div>
    </AppLayout>
  )
}