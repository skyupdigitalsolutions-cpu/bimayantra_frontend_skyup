// Figma 291:38031 · OC1 · Add product — Brochure reading failed
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { IconButton, cx } from '../../components/ui'
import { SBtn, SChip } from '../settings/_parts'

const card = 'rounded-[28px] bg-white shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'
const STEPS = ['Category', 'Company', 'Brochure', 'Product', 'Variants', 'Features', 'Review']
const CURRENT = 2
const PROGRESS = [
  { label: 'Uploaded', state: 'done' },
  { label: 'Reading pages', state: 'done' },
  { label: 'Extracting', state: 'on' },
  { label: 'Ready to review', state: 'todo' },
]
const PREVIEW = [
  ['Category', 'Health'],
  ['Company', 'Star Health', true],
  ['Product', 'Arogya Plus', true],
  ['Variants', '2 · Classic, Plus', true],
  ['Features', '6 of 8', true],
]

function Stepper() {
  return (
    <div className={cx(card, 'flex items-start px-7 py-5')}>
      {STEPS.map((s, i) => {
        const done = i < CURRENT
        const on = i === CURRENT
        return (
          <Fragment key={s}>
            <div className="flex w-[86.5px] shrink-0 flex-col items-center gap-2">
              <span
                className={cx(
                  'flex size-[34px] items-center justify-center rounded-full text-[13px] font-bold',
                  done && 'bg-navy text-white',
                  on && 'border-2 border-blue bg-white text-blue shadow-[0px_0px_0px_5px_rgba(31,95,214,0.2)]',
                  !done && !on && 'bg-panel text-muted',
                )}
              >
                {done ? <Icon name="check" size={16} /> : i + 1}
              </span>
              <span className={cx('text-[12px] whitespace-nowrap', on ? 'font-bold text-ink' : done ? 'font-semibold text-ink-2' : 'font-semibold text-muted')}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <span className={cx('mt-4 h-[2px] flex-1 rounded-[1px]', i < CURRENT ? 'bg-navy' : 'bg-line')} />}
          </Fragment>
        )
      })}
    </div>
  )
}

export default function BrochureReadingFailed() {
  const navigate = useNavigate()
  return (
    <AppLayout active="products">
      <header className="flex items-start justify-between max-xl:flex-col max-xl:gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre max-xl:whitespace-pre-wrap text-muted">PRODUCTS  /  ADD MY PRODUCT</p>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">Add my product</h1>
            <SChip tone="red" icon="x">Reading failed</SChip>
          </div>
          <p className="text-[14px] font-medium text-muted">Health</p>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <IconButton icon="bell" iconSize={18.5} />
          <SBtn variant="white" size="lg" icon="download">Save and exit</SBtn>
        </div>
      </header>

      <div className="mt-[21px] flex flex-col gap-[35px]">
        <Stepper />
        <div className="flex items-start gap-5">
          <section className={cx(card, 'flex w-[760px] flex-col gap-[18px] p-6')}>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]">
                <p className="text-[17px] font-bold text-ink">3 · Reading the brochure</p>
                <p className="text-[12px] font-medium text-muted">Usually under a minute. You can leave this page; we’ll notify you.</p>
              </div>
              <SChip tone="red" icon="x">Failed</SChip>
            </div>

            <div className="flex flex-col gap-2.5 rounded-[22px] border border-[#f2c4c8] bg-[#fff7f7] p-5">
              <div className="flex items-center gap-2.5 text-[#b4323c]">
                <Icon name="alert" size={18} />
                <p className="text-[15px] font-bold">We couldn’t read this brochure</p>
              </div>
              <p className="text-[13px] leading-5 font-medium text-[#b4323c]">The PDF is a scanned image with low resolution. Try a clearer file, or fill in the details yourself.</p>
              <div className="flex gap-2.5">
                <SBtn icon="refresh" to="/x/ap2c-add-product-reading-brochure">Try again</SBtn>
                <label className="cursor-pointer">
                  <input type="file" accept="application/pdf" className="hidden" />
                  <span className="inline-flex h-9 items-center gap-2 rounded-[18px] border border-line bg-white pr-3.5 pl-3 text-[13px] font-semibold text-ink">
                    <Icon name="upload" size={16} />Upload another file
                  </span>
                </label>
                <SBtn variant="ghost" icon="edit" className="bg-transparent text-ink" to="/x/ap3-add-product-product">Fill in manually</SBtn>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {PROGRESS.map((p, i) => (
                <Fragment key={p.label}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cx(
                        'flex size-[26px] items-center justify-center rounded-full text-[11px] font-bold',
                        p.state === 'done' && 'bg-navy text-white',
                        p.state === 'on' && 'border-2 border-[#5b3fb8] bg-white text-[#5b3fb8]',
                        p.state === 'todo' && 'bg-panel text-muted',
                      )}
                    >
                      {p.state === 'done' ? <Icon name="check" size={13} /> : p.state === 'on' ? <Icon name="clock" size={13} /> : i + 1}
                    </span>
                    <span className={cx('text-[12px] font-semibold', p.state === 'todo' ? 'text-muted' : 'text-ink')}>{p.label}</span>
                  </div>
                  {i < PROGRESS.length - 1 && <span className={cx('h-[2px] flex-1', i < 2 ? 'bg-navy' : 'bg-line')} />}
                </Fragment>
              ))}
            </div>

            <span className="h-px bg-line" />
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('/x/ap2b-add-product-brochure-premium')} className="h-[46px] rounded-[24px] border border-line bg-white px-5 text-[14px] font-semibold text-ink">
                Back
              </button>
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
                <Icon name="check" size={16} className="text-[#127650]" />Draft saved
              </span>
              <span className="flex-1" />
              <SBtn size="lg" icon="arrow" to="/x/ap3-add-product-product">Review filled details</SBtn>
            </div>
          </section>

          <aside className="flex w-[400px] flex-col gap-3.5 rounded-[28px] bg-linear-to-b from-[#fbd3dc] to-[#f6b3c3] p-6 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]">
                <p className="text-[17px] font-bold text-ink">Your product</p>
                <p className="text-[12px] font-medium text-muted">How it will look in the library</p>
              </div>
              <SChip className="bg-[#fde8ec] text-[#b4325a]">Draft</SChip>
            </div>
            <div className="flex flex-col gap-3 rounded-[20px] bg-white/80 p-4">
              {PREVIEW.map(([k, v, ai]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span className="flex-1 text-[12px] font-medium text-rose-ink">{k}</span>
                  {ai && <Icon name="sparkle" size={13} className="text-[#5b3fb8]" />}
                  <span className="text-[13px] font-bold text-ink">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-[12px] font-medium text-rose-ink">Published only in your account as soon as you save.</p>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
