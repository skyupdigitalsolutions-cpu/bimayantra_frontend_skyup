// Figma 287:36946 · EX1 · Export — Ready to download
import { useState } from 'react'
import { SettingsPage, SCard, CardHead, Check, Field, TextInput, Btn, SmallBtn, Note, Chip, Toast } from './_parts'
import { exportOptions } from '../../data/states-settings'

export default function EX1ExportReadyToDownload() {
  const [opts, setOpts] = useState(exportOptions.map((o) => o.on))
  return (
    <SettingsPage
      nav="export"
      crumb="SETTINGS  /  EXPORT MY DATA"
      title="Export my data"
      subtitle="One ZIP of CSV files with your records. Works in read-only mode too."
      overlay={<Toast>Your export is ready · link works for 24 hours</Toast>}
    >
      <SCard className="gap-4">
        <CardHead title="New export" sub="Choose what to include" />
        <div className="grid w-[846px] grid-cols-2 gap-2.5">
          {exportOptions.map((o, i) => (
            <label key={o.label} className="flex h-[50px] cursor-pointer items-center gap-3 rounded-[16px] bg-panel p-3.5">
              <Check checked={opts[i]} onChange={(v) => setOpts((s) => s.map((x, j) => (j === i ? v : x)))} />
              <span className="text-[13px] font-semibold text-ink">{o.label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-end gap-3.5">
          <Field label="OTP sent to your mobile" className="flex-1"><TextInput focus leading="lock" defaultValue="4 8 2 7 _ _" /></Field>
          <Btn icon="download">Request export</Btn>
        </div>
        <Note icon="alert" tone="amber" className="w-[671px]">
          The file contains your customers’ personal data. Keep it safe. The download link works for 24 hours.
        </Note>
      </SCard>
      <SCard>
        <CardHead title="Exports" />
        <div className="flex h-16 items-center gap-3 rounded-[18px] bg-panel p-3.5">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-bold text-ink">All</p>
            <p className="text-[12px] font-medium text-muted">26 Oct, 11:02</p>
          </div>
          <Chip tone="green" icon="check">Ready</Chip>
          <SmallBtn variant="navy" icon="download" className="pr-3.5">Download ZIP</SmallBtn>
        </div>
        <div className="flex h-[61px] items-center gap-3 rounded-[18px] bg-panel p-3.5">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-bold text-ink">All</p>
            <p className="text-[12px] font-medium text-muted">02 Oct, 18:00</p>
          </div>
          <Chip tone="gray">Link expired</Chip>
        </div>
      </SCard>
    </SettingsPage>
  )
}
