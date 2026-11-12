// Figma 290:37622 · AA7 · Advisor — Suggest correction
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SegTabs, Pill, ACard, ACardHead, SButton, HButton, BellButton } from '../admin/_parts'
import { AField, AInput, ASelect, DialogButtons, NavyButton, ADrawer, DrawerFoot, PanelScrim } from './_parts'
import { pdFeatures, pdEligibility } from '../../data/states-admin'

function HeroStat({ k, v }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[18px] bg-white/80 px-[18px] py-3">
      <p className="text-[12px] font-semibold text-rose-ink">{k}</p>
      <p className="text-[17px] font-bold whitespace-nowrap text-ink">{v}</p>
    </div>
  )
}

const VARIANTS = [{ key: 'silver', label: 'Silver' }, { key: 'gold', label: 'Gold' }, { key: 'platinum', label: 'Platinum' }, { key: 'senior', label: 'Senior 60+' }]

export default function SuggestCorrection() {
  const [variant, setVariant] = useState('gold')
  const [drawer, setDrawer] = useState(true)
  const vLabel = VARIANTS.find((v) => v.key === variant)?.label
  return (
    <AppLayout active="products">
      <header className="flex items-start justify-between max-xl:flex-col max-xl:gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-semibold tracking-[0.2px] whitespace-pre max-xl:whitespace-pre-wrap text-muted">PRODUCTS  /  CAREFIRST FAMILY</p>
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] md:text-[30px] font-bold tracking-[-0.6px] text-ink">CareFirst Family</h1>
            <Pill tone="green" icon="check">Verified by SkyUp</Pill>
          </div>
          <p className="text-[14px] font-medium text-muted">Niva Bupa · UIN NBHHLIP00001V012526 · Health</p>
        </div>
        <div className="mt-1 flex items-center gap-3">
          <BellButton />
          <HButton variant="outline" icon="edit" onClick={() => setDrawer(true)}>Suggest correction</HButton>
          <HButton variant="outline" icon="compare" to="/x/10b-products-compare-variants">Add to compare</HButton>
          <HButton variant="navy" icon="quote" to="/x/q1-quotation-customer">New quotation</HButton>
        </div>
      </header>

      <div className="mt-[13px] flex h-[116px] items-center gap-5 rounded-[32px] bg-pink-hero px-7 shadow-[0px_18px_36px_-12px_rgba(232,137,156,0.3)]">
        <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-white">
          <Icon name="heart" size={32} className="text-[#b4325a]" />
        </span>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-[22px] font-bold tracking-[-0.2px] text-ink">Niva Bupa CareFirst Family</p>
          <div className="flex gap-2">
            <Pill tone="green" icon="check">Can quote</Pill>
            <Pill tone="pink">4 variants</Pill>
            <Pill tone="bg-[#eef1f5] text-ink-2">Agent code NB-77421</Pill>
          </div>
        </div>
        <HeroStat k="From" v="₹11,420/yr" />
        <HeroStat k="Sum insured" v="₹3 L – 1 Cr" />
        <HeroStat k="Claims settled" v="91.2%" />
      </div>

      <div className="mt-[22px] flex items-center gap-3">
        <p className="text-[13px] font-semibold text-muted">Variant</p>
        <SegTabs
          value={variant}
          onChange={setVariant}
          items={VARIANTS}
        />
      </div>

      <div className="mt-5 flex items-start gap-5">
        <ACard className="flex w-[760px] flex-col gap-3.5">
          <ACardHead title={`Features · ${vLabel}`} subtitle="✓ included · ✗ not included" right={<SButton variant="ghost" icon="list" to="/x/10d-feature-table-health-all">Feature table</SButton>} />
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {pdFeatures.map(([t, s, ok]) => (
              <div key={t} className="flex h-14 items-center gap-3 rounded-[16px] bg-panel px-3.5">
                <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-full', ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-chip text-faint')}>
                  <Icon name={ok ? 'check' : 'x'} size={14} />
                </span>
                <div className="flex flex-col gap-px">
                  <p className={cx('text-[13px] font-bold', ok ? 'text-ink' : 'text-muted')}>{t}</p>
                  <p className="text-[12px] font-medium text-muted">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </ACard>

        <div className="flex w-[400px] flex-col gap-4">
          <ACard className="flex flex-col gap-3">
            <ACardHead title={`Eligibility · ${vLabel}`} />
            {pdEligibility.map(([k, v]) => (
              <div key={k} className="flex justify-between text-[13px]">
                <span className="font-medium text-muted">{k}</span>
                <span className="font-bold text-ink">{v}</span>
              </div>
            ))}
          </ACard>
          <ACard className="flex flex-col gap-3">
            <ACardHead title="Pricing" subtitle="Rate table PV-3 · from 01 Jul 2026" />
            <div className="flex items-end gap-1.5">
              <p className="text-[26px] font-bold tracking-[-0.3px] text-ink">₹14,900</p>
              <p className="pb-[3px] text-[12px] font-medium text-muted">from / year + GST</p>
            </div>
            <div className="flex gap-2">
              <Pill tone="bg-[#eef1f5] text-ink-2">Daily hospital cash rider</Pill>
              <Pill tone="bg-[#eef1f5] text-ink-2">Maternity rider</Pill>
            </div>
            <Link to="/x/pv1-product-my-price-versions" className="flex w-fit items-center gap-1.5 text-[13px] font-bold text-blue">
              My price versions<Icon name="arrow" size={14} />
            </Link>
          </ACard>
          <div className="flex flex-col gap-2 rounded-[28px] bg-linear-to-b from-[#1a3460] to-[#0e1f3b] p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-[15px] font-bold text-white">My commercials</p>
              <span className="flex items-center gap-[5px] rounded-[12px] bg-white/10 px-2.5 py-[5px] text-[11px] font-semibold text-white">
                <Icon name="lock" size={12} className="text-pink-300" />Only you
              </span>
            </div>
            <p className="text-[22px] font-bold text-white">15% commission</p>
            <p className="text-[12px] font-medium text-[#c9d6ea]">On premium before tax. Copied to each policy.</p>
          </div>
        </div>
      </div>

      {drawer && (
        <PanelScrim onClose={() => setDrawer(false)}>
          <ADrawer>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-[3px]">
                <p className="text-[20px] font-bold tracking-[-0.2px] text-ink">Suggest a correction</p>
                <p className="text-[12px] font-medium text-muted">CareFirst Family · Gold · verified by SkyUp</p>
              </div>
              <Link to="/products/1" aria-label="Close" className="flex size-9 items-center justify-center rounded-full bg-panel">
                <Icon name="x" size={16} className="text-ink" />
              </Link>
            </div>
            <AField label="What’s wrong *"><ASelect options={['Network hospitals', 'Room rent', 'Co-pay', 'Claims settled', 'Something else']} /></AField>
            <AField label="Shown now"><AInput value="10,200" /></AField>
            <AField label="Correct value *"><AInput value="10,650" focus autoFocus /></AField>
            <AField label="Source *"><AInput value="Insurer website, 20 Oct 2026" /></AField>
            <AField label="Proof (optional)"><AInput leading="folder" value="screenshot.png" /></AField>
            <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3">
              <Icon name="clock" size={16} className="shrink-0 text-blue" />
              <p className="w-[386px] text-[13px] font-semibold text-blue">SkyUp reviews it. You’ll see Accepted or Rejected with a reason.</p>
            </div>
            <span className="flex-1" />
            <DrawerFoot>
              <DialogButtons cancelTo="/products/1">
                <NavyButton to="/products/1" icon="send">Send suggestion</NavyButton>
              </DialogButtons>
            </DrawerFoot>
          </ADrawer>
        </PanelScrim>
      )}
    </AppLayout>
  )
}
