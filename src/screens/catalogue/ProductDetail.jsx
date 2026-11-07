// Figma 89:10753 · 10c · Product detail
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Header, HeadButton, SmallButton, SegTabs, StatusChip, Panel, PanelHead } from './_parts'
import { productDetail as d } from '../../data/catalogue'

const SH8 = 'shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]'

function Mini({ k, v }) {
  return (
    <div className="flex shrink-0 flex-col gap-0.5 rounded-[18px] bg-white/80 px-[18px] py-3">
      <p className="text-[12px] font-semibold text-rose-ink">{k}</p>
      <p className="text-[17px] font-bold whitespace-nowrap text-ink">{v}</p>
    </div>
  )
}

export default function ProductDetail() {
  const [variant, setVariant] = useState('gold')
  const vLabel = d.variants.find((v) => v.key === variant).label
  return (
    <AppLayout active="products">
      <Header
        search={false}
        breadcrumb={'PRODUCTS  /  CAREFIRST FAMILY'}
        title="CareFirst Family"
        titleExtra={<StatusChip tone="green" icon="check">Verified by SkyUp</StatusChip>}
        subtitle="Niva Bupa · UIN NBHHLIP00001V012526 · Health"
        actions={
          <>
            <HeadButton variant="white" icon="edit" to="/x/aa7-advisor-suggest-correction">Suggest correction</HeadButton>
            <HeadButton variant="white" icon="compare" to="/x/10b-products-compare-variants">Add to compare</HeadButton>
            <HeadButton variant="navy" icon="quote" to="/x/q1-quotation-customer">New quotation</HeadButton>
          </>
        }
      />

      <section className="mt-[13px] flex h-[116px] w-[1180px] items-center gap-5 rounded-[32px] bg-pink-hero px-7 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
        <span className="flex size-[72px] items-center justify-center rounded-[36px] bg-white">
          <Icon name="heart" size={32} className="text-[#b4325a]" />
        </span>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">Niva Bupa CareFirst Family</p>
          <div className="flex gap-2">
            <StatusChip tone="green" icon="check">Can quote</StatusChip>
            <StatusChip tone="pink" className="bg-[#fde8ec] text-[#b4325a]">4 variants</StatusChip>
            <StatusChip tone="neutral">Agent code NB-77421</StatusChip>
          </div>
        </div>
        <Mini k="From" v="₹11,420/yr" />
        <Mini k="Sum insured" v="₹3 L – 1 Cr" />
        <Mini k="Claims settled" v="91.2%" />
      </section>

      <div className="mt-[22px] flex items-center gap-3">
        <p className="text-[13px] font-semibold text-muted">Variant</p>
        <SegTabs items={d.variants} value={variant} onChange={setVariant} />
      </div>

      <div className="mt-5 flex items-start gap-5">
        <Panel className={cx('flex w-[760px] flex-col gap-3.5', SH8)}>
          <PanelHead
            title={`Features · ${vLabel}`}
            subtitle="✓ included · ✗ not included"
            right={<SmallButton icon="list" to="/x/10d-feature-table-health-all">Feature table</SmallButton>}
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {d.features.map((f) => (
              <div key={f.t} className="flex h-14 items-center gap-3 rounded-[16px] bg-panel px-3.5">
                <span className={cx('flex size-7 items-center justify-center rounded-[14px]', f.ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-chip text-faint')}>
                  <Icon name={f.ok ? 'check' : 'x'} size={14} />
                </span>
                <div className="flex flex-col gap-px">
                  <p className={cx('text-[13px] font-bold', f.ok ? 'text-ink' : 'text-muted')}>{f.t}</p>
                  <p className="text-[12px] font-medium text-muted">{f.s}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="flex w-[400px] flex-col gap-4">
          <Panel className={cx('flex flex-col gap-3', SH8)}>
            <PanelHead title={`Eligibility · ${vLabel}`} />
            {d.eligibility.map(([k, v]) => (
              <div key={k} className="flex items-center text-[13px]">
                <span className="flex-1 font-medium text-muted">{k}</span>
                <span className="font-bold text-ink">{v}</span>
              </div>
            ))}
          </Panel>
          <Panel className={cx('flex flex-col gap-3', SH8)}>
            <PanelHead title="Pricing" subtitle="Rate table PV-3 · from 01 Jul 2026" />
            <div className="flex items-end gap-1.5">
              <p className="text-[26px] font-bold tracking-[-0.3px] text-ink">₹14,900</p>
              <p className="pb-1 text-[12px] font-medium text-muted">from / year + GST</p>
            </div>
            <div className="flex gap-2">
              <StatusChip tone="neutral">Daily hospital cash rider</StatusChip>
              <StatusChip tone="neutral">Maternity rider</StatusChip>
            </div>
            <Link to="/x/pv1-product-my-price-versions" className="flex items-center gap-1.5 text-[13px] font-bold text-blue">
              My price versions<Icon name="arrow" size={14} />
            </Link>
          </Panel>
          <div className={cx('flex flex-col gap-2 rounded-[28px] bg-rail p-6', SH8)}>
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[15px] font-bold text-white">My commercials</p>
              <span className="flex items-center gap-[5px] rounded-[12px] bg-white/10 px-2.5 py-[5px] text-[11px] font-semibold text-white">
                <Icon name="lock" size={12} className="text-[#f7b9c4]" />Only you
              </span>
            </div>
            <p className="text-[22px] font-bold text-white">15% commission</p>
            <p className="text-[12px] font-medium text-[#c9d6ea]">On premium before tax. Copied to each policy.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
