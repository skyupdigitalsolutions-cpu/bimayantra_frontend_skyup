// Figma 48:8102 · S09 · Settings — Export my data
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { SettingsLayout, SCard, SHead, SBtn, SChip } from './_parts'
import { exportSets, exportsList } from '../../data/settings'

export default function ExportData() {
  const [sel, setSel] = useState(exportSets)
  const [otp, setOtp] = useState('4 8 2 7 _ _')
  return (
    <SettingsLayout
      breadcrumb="SETTINGS  /  EXPORT MY DATA"
      title="Export my data"
      subtitle="One ZIP of CSV files with your records. Works in read-only mode too."
      contentClass="gap-[18px]"
    >
      <SCard className="gap-4 p-6">
        <SHead title="New export" subtitle="Choose what to include" />
        <div className="grid grid-cols-[418px_418px] gap-x-2.5 gap-y-2.5">
          {sel.map(([label, on], i) => (
            <button
              key={label}
              type="button"
              onClick={() => setSel((s) => s.map((x, j) => (j === i ? [x[0], !x[1]] : x)))}
              className="flex h-[50px] items-center gap-3 rounded-[16px] bg-panel px-3.5 text-left"
            >
              <span className={cx('flex size-[22px] items-center justify-center rounded-[7px]', on ? 'bg-navy text-white' : 'border border-[#c3ccd8] bg-white')}>
                {on && <Icon name="check" size={14} />}
              </span>
              <span className="text-[13px] font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-end gap-3.5">
          <label className="flex w-[671px] flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink">OTP sent to your mobile</span>
            <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] border-2 border-blue bg-panel px-4">
              <Icon name="lock" size={18} className="text-muted" />
              <input value={otp} onChange={(e) => setOtp(e.target.value)} className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-ink outline-none" />
            </span>
          </label>
          <SBtn size="lg" icon="download" to="/x/ex1-export-ready-to-download">Request export</SBtn>
        </div>
        <div className="flex w-[671px] items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4 py-3 text-[13px] font-semibold text-[#8a5a12]">
          <Icon name="alert" size={16} />
          <span>The file contains your customers’ personal data. Keep it safe. The download link works for 24 hours.</span>
        </div>
      </SCard>

      <SCard className="gap-2.5 p-6">
        <SHead title="Exports" />
        {exportsList.map((x) => (
          <div key={x.when} className="flex items-center gap-3 rounded-[18px] bg-panel p-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[13px] font-bold text-ink">{x.title}</p>
              <p className="text-[12px] font-medium text-muted">{x.when}</p>
            </div>
            <SChip className={x.chipClass}>{x.status}</SChip>
          </div>
        ))}
      </SCard>
    </SettingsLayout>
  )
}
