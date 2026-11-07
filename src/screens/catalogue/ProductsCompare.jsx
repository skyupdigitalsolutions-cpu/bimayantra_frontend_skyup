// Figma 53:8333 · 10b · Products — Compare variants
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton } from './_parts'
import { comparePackages, compareFeatures } from '../../data/catalogue'

function Package({ p, onRemove }) {
  const dark = p.best
  return (
    <div
      className={cx(
        'flex h-[694px] w-[380px] flex-col gap-4 rounded-[32px] px-[26px] pt-[26px] pb-6',
        dark ? 'bg-rail shadow-[0px_30px_60px_-16px_rgba(19,41,75,0.3)]' : 'bg-white shadow-[0px_10px_28px_-12px_rgba(19,41,75,0.1)]',
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cx('flex size-11 items-center justify-center rounded-[22px]', dark ? 'bg-white/10' : p.iconBg)}>
          <Icon name="heart" size={20} className={dark ? 'text-[#f7b9c4]' : 'text-ink'} />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className={cx('text-[12px] font-semibold', dark ? 'text-[#c9d6ea]' : 'text-muted')}>{p.insurer}</p>
          <p className={cx('text-[18px] font-bold tracking-[-0.2px]', dark ? 'text-white' : 'text-ink')}>{p.name}</p>
        </div>
        {dark ? (
          <span className="flex items-center gap-[5px] rounded-[12px] bg-linear-to-r from-[#f9c6d0] to-[#f29db0] px-3 py-[5px] text-[11px] font-bold text-navy">
            <Icon name="star" size={12} />Best value
          </span>
        ) : (
          <button type="button" aria-label="Remove option" onClick={onRemove} className="flex size-7 items-center justify-center rounded-[14px] bg-panel text-muted hover:text-ink">
            <Icon name="x" size={13} />
          </button>
        )}
      </div>
      <button type="button" className={cx('flex h-[46px] items-center gap-2 rounded-[16px] px-3.5 text-left', dark ? 'bg-white/10' : 'bg-panel')}>
        <div className="flex flex-1 flex-col gap-px">
          <span className={cx('text-[10px] font-semibold', dark ? 'text-[#c9d6ea]' : 'text-muted')}>Variant</span>
          <span className={cx('text-[13px] font-bold', dark ? 'text-white' : 'text-ink')}>{p.variant}</span>
        </div>
        <Icon name="chev-down" size={18} className={dark ? 'text-[#c9d6ea]' : 'text-muted'} />
      </button>
      <div className="flex items-end gap-1.5">
        <p className={cx('text-[38px] leading-[48px] font-bold tracking-[-0.8px]', dark ? 'text-white' : 'text-ink')}>{p.price}</p>
        <p className={cx('text-[13px] font-medium', dark ? 'text-[#c9d6ea]' : 'text-muted')}>/ year incl. GST</p>
      </div>
      <p className={cx('text-[12px] font-medium', dark ? 'text-[#c9d6ea]' : 'text-muted')}>For 3 people · ₹10 lakh sum insured</p>
      <span className={cx('h-px w-full', dark ? 'bg-white/10' : 'bg-line')} />
      <div className="flex flex-col gap-3">
        {compareFeatures.map((f, i) => {
          const ok = p.has[i]
          return (
            <div key={f} className="flex items-center gap-3">
              <span
                className={cx(
                  'flex size-6 items-center justify-center rounded-[12px]',
                  ok ? (dark ? 'bg-[#f7b9c4] text-navy' : 'bg-[#e7f4ee] text-[#127650]') : dark ? 'bg-white/10 text-[#7f8faa]' : 'bg-chip text-faint',
                )}
              >
                <Icon name={ok ? 'check' : 'x'} size={13} />
              </span>
              <p className={cx('text-[13px] whitespace-nowrap', ok ? cx('font-semibold', dark ? 'text-white' : 'text-ink') : cx('font-medium', dark ? 'text-[#7f8faa]' : 'text-faint'))}>{f}</p>
            </div>
          )
        })}
      </div>
      <Link
        to="/x/q6-quotation-details"
        className={cx(
          'flex h-[46px] items-center justify-center gap-2 rounded-[24px] text-[14px] font-semibold',
          dark ? 'bg-linear-to-r from-[#f9c6d0] to-[#f29db0] text-navy shadow-[0px_10px_20px_-6px_rgba(232,137,156,0.3)]' : 'bg-navy text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]',
        )}
      >
        <Icon name="quote" size={18} />Create quotation
      </Link>
    </div>
  )
}

export default function ProductsCompare() {
  const [pkgs, setPkgs] = useState(comparePackages)
  return (
    <AppLayout active="products">
      <Header
        search={false}
        breadcrumb={'PRODUCTS  /  COMPARE'}
        title={`Compare ${pkgs.length} options`}
        subtitle="Health · Family floater · priced for Kavya (34), Arjun (37), Anya (5) at ₹10 lakh"
        actions={
          <>
            <HeadButton variant="white" icon="plus" to="/products">Add option</HeadButton>
            <HeadButton variant="white" icon="target" to="/best-fit">Run Best fit</HeadButton>
            <HeadButton icon="quote" to="/x/cq2-comparison-type">Create comparison quotation</HeadButton>
          </>
        }
      />
      <div className="mt-[31px] flex gap-5">
        {pkgs.map((p, i) => <Package key={p.variant} p={p} onRemove={() => setPkgs((xs) => xs.filter((_, j) => j !== i))} />)}
      </div>
      <div className="absolute top-[925px] left-10 flex items-center gap-[18px]">
        <div className="flex items-center gap-2">
          <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-[#e7f4ee] text-[#127650]"><Icon name="check" size={12} /></span>
          <span className="text-[12px] font-semibold text-ink-2">Included</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex size-[22px] items-center justify-center rounded-[11px] bg-chip text-faint"><Icon name="x" size={12} /></span>
          <span className="text-[12px] font-semibold text-ink-2">Not included</span>
        </div>
        <span className="text-[12px] font-medium text-muted">Same people and sum insured for every option. Feature data is sample.</span>
      </div>
    </AppLayout>
  )
}
