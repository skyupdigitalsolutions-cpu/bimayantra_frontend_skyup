// Figma 286:34110 · DL1 · Document — Change label
import { useState } from 'react'
import { SelectCompat } from '../../components/pickers'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { StatusChip, SmallButton, Panel, PanelHead, Scrim, Dialog, DialogButton, Drawer } from '../catalogue/_parts'
import { HolderShell, HOLDER_ACTIONS, SH8 } from './_parts'
import { holderDocuments } from '../../data/states-records'

const LABELS = ['Address proof', 'Aadhaar', 'PAN', 'Passport', 'Voter ID', 'Medical report', 'Other']

function RoundIcon({ icon }) {
  return (
    <button type="button" className="flex size-8 items-center justify-center rounded-full bg-white text-ink shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
      <Icon name={icon} size={13.4} />
    </button>
  )
}

function Version({ tag, title, sub, chip, tone, current }) {
  return (
    <div className={cx('flex items-center gap-3 rounded-[16px] p-3.5', current ? 'border border-[#c9daf8] bg-[#f7f9ff]' : 'bg-panel')}>
      <span className="flex size-10 items-center justify-center rounded-[20px] bg-white text-[12px] font-bold text-ink">{tag}</span>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[13px] font-bold text-ink">{title}</p>
        <p className="text-[11px] font-medium text-muted">{sub}</p>
      </div>
      <StatusChip tone={tone}>{chip}</StatusChip>
      <RoundIcon icon="eye" />
      <RoundIcon icon="download" />
    </div>
  )
}

export default function DocumentChangeLabel() {
  const [label, setLabel] = useState('Address proof')
  return (
    <HolderShell
      tab="documents"
      crumb="DOCUMENTS"
      statusChip={<StatusChip tone="green" icon="check">Active</StatusChip>}
      actions={HOLDER_ACTIONS}
      counts={{ family: 3, documents: 3, quotations: 3, policies: 2, renewals: 1 }}
      overlay={
        <>
          <Scrim to="/x/05c-customer-documents" />
          <Drawer title="Aadhaar · versions" subtitle="Kavya Hegde · never deleted" closeTo="/x/05c-customer-documents">
            <Version current tag="v2" title="Current version" sub="24 Oct 2026 · Priya" chip="Unconfirmed" tone="amber" />
            <Version tag="v1" title="Earlier version" sub="04 Sep 2026 · You" chip="Confirmed" tone="green" />
            <div className="flex items-center gap-3 rounded-[16px] bg-panel p-3.5">
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">Label: Aadhaar</p>
                <p className="text-[11px] font-medium whitespace-nowrap text-muted">Advisor only. Change it if the wrong type was picked.</p>
              </div>
              <SmallButton variant="outline" icon="edit">Change label</SmallButton>
            </div>
            <button type="button" className="flex h-[46px] items-center gap-2 rounded-[24px] bg-navy pl-4 text-[14px] font-semibold text-white shadow-[0px_10px_20px_-6px_rgba(19,41,75,0.3)]">
              <Icon name="upload" size={18} />Upload new version
            </button>
          </Drawer>
          <Scrim to="/x/pd2-document-versions" />
          <Dialog top={140} icon="edit" iconBg="bg-[#e8f0fd]" iconColor="text-blue" title="Change document label" body="The file stays the same. The change is logged against the original upload name.">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-ink">Current label</p>
              <div className="flex h-[50px] items-center rounded-[16px] bg-panel px-4 text-[14px] font-semibold text-ink">Aadhaar</div>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-ink">New label *</span>
              <span className="relative flex h-[50px] items-center rounded-[16px] border-2 border-blue bg-panel px-4">
                <SelectCompat className="min-w-0 flex-1" buttonClassName="h-auto min-h-0 w-full gap-1.5 rounded-none bg-transparent p-0 ring-0 focus-visible:ring-0" value={label} onChange={(e) => setLabel(e.target.value)}>
                  {LABELS.map((l) => <option key={l}>{l}</option>)}
                </SelectCompat>
              </span>
            </label>
            <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3">
              <Icon name="lock" size={16} className="text-blue" />
              <p className="text-[13px] font-semibold text-blue">Advisor only. Assistants can’t change labels.</p>
            </div>
            <div className="flex gap-2.5">
              <DialogButton to="/x/pd2-document-versions">Cancel</DialogButton>
              <DialogButton variant="navy" icon="edit" to="/x/pd2-document-versions">Change label</DialogButton>
            </div>
          </Dialog>
        </>
      }
    >
      <div className="mt-6 flex w-[602px] items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4 py-3">
        <Icon name="alert" size={16} className="text-[#8a5a12]" />
        <p className="text-[13px] font-semibold text-[#8a5a12]">Missing for Shanta Hegde: Aadhaar and PAN. Needed before a proposal that covers her.</p>
      </div>
      <div className="mt-6 flex items-start gap-5">
        <Panel className={cx('flex w-[760px] flex-col gap-3', SH8)}>
          <PanelHead title="Documents" subtitle="Never deleted. A new upload of the same type adds a version." />
          {holderDocuments.map((d, i) =>
            d.group ? (
              <p key={d.group} className="text-[11px] font-bold tracking-[0.4px] text-muted">{d.group}</p>
            ) : (
              <div key={i} className="flex items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
                <span className={cx('flex h-[52px] w-11 items-center justify-center rounded-[12px]', d.bg)}>
                  <Icon name="folder" size={18} className="text-ink" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-ink">{d.title}</p>
                  <p className="text-[12px] font-medium text-muted">{d.sub}</p>
                </div>
                <StatusChip tone={d.tone} icon={d.icon}>{d.chip}</StatusChip>
                {d.check && <SmallButton variant="navy" className="px-3.5">Check values</SmallButton>}
                <SmallButton icon="list" to="/x/pd2-document-versions">Versions</SmallButton>
              </div>
            ),
          )}
        </Panel>
        <div className="flex w-[400px] flex-col items-center gap-3 rounded-[28px] border border-dashed border-[#c3ccd8] bg-white p-7">
          <span className="flex size-[60px] items-center justify-center rounded-[30px] bg-[#e8f0fd]">
            <Icon name="upload" size={26} className="text-blue" />
          </span>
          <p className="text-[16px] font-bold text-ink">Upload a document</p>
          <p className="text-[12px] font-medium text-muted">PDF, JPG or PNG · file or camera</p>
          <div className="flex gap-2">
            <SmallButton variant="navy" icon="folder" to="/x/fd3-add-document-whose-document">Choose file</SmallButton>
            <SmallButton variant="outline" icon="phone" to="/x/fd3-add-document-whose-document">Camera</SmallButton>
          </div>
        </div>
      </div>
    </HolderShell>
  )
}
