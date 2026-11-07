// Figma 239:18868 · FD5 · Add document — Upload
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { ProfileShell, FamilyBody, Scrim, ModalBox, OverlayHead, PillButton, SChip, Note, DocSteps } from './_parts'
import { aadhaarRead } from '../../data/customer-tabs'

function SideCard({ side, file }) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 rounded-[18px] border border-[#c7ebda] bg-[#f5fbf8] p-3.5">
      <div className="flex h-8 items-center justify-center rounded-[12px] border border-line bg-white">
        <Icon name="card" size={30} className="text-[#7fa894]" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <p className="text-[13px] font-bold text-ink">{side}</p>
          <p className="text-[11px] font-medium text-[#127650]">{file}</p>
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center rounded-[18px] px-3.5 text-[13px] font-semibold text-ink hover:bg-panel">
          Replace
          <input type="file" className="hidden" />
        </label>
      </div>
    </div>
  )
}

export default function AddDocumentUpload() {
  const navigate = useNavigate()
  const [done, setDone] = useState(() => aadhaarRead.map((r) => r.action === 'Confirmed'))
  return (
    <ProfileShell
      tab="family"
      crumb="FAMILY"
      overlay={
        <>
          <Scrim onClick={() => navigate('/x/05a-customer-family')} />
          <ModalBox>
            <OverlayHead title="Add document" sub="Arjun Hegde · Aadhaar card" closeTo="/x/05a-customer-family" />
            <DocSteps step={3} />
            <div className="flex gap-3">
              <SideCard side="Front" file="aadhaar-front.jpg" />
              <SideCard side="Back" file="aadhaar-back.jpg" />
            </div>
            <div className="flex flex-col gap-2.5 rounded-[18px] bg-linear-to-r from-[#f0ecfb] to-[#e6dffb] p-4">
              <div className="flex items-center gap-2">
                <Icon name="sparkle" size={15} className="text-[#5b3fb8]" />
                <span className="text-[13px] font-bold text-ink">Read by AI · check each value</span>
              </div>
              {aadhaarRead.map((r, i) => (
                <div key={r.label} className="flex h-14 items-center gap-2.5 rounded-[12px] bg-white px-3 py-2.5">
                  <div className="flex min-w-0 flex-1 flex-col gap-px">
                    <p className="text-[11px] font-medium text-muted">{r.label}</p>
                    <p className="text-[13px] font-bold text-ink">{r.value}</p>
                  </div>
                  <SChip tone={r.conf[0]}>{r.conf[1]}</SChip>
                  <PillButton
                    variant="ghost"
                    size="sm"
                    icon="check"
                    onClick={() => setDone((d) => d.map((x, j) => (j === i ? true : x)))}
                  >
                    {r.action === 'Check' && !done[i] ? 'Check' : r.action === 'Check' ? 'Confirmed' : r.action}
                  </PillButton>
                </div>
              ))}
            </div>
            <Note icon="lock" bg="#e8f0fd" color="#1f5fd6">Saved to Arjun only. The number is stored encrypted and always shown masked.</Note>
            <div className="flex items-center justify-between">
              <PillButton variant="outline" className="px-5" to="/x/fd4-add-document-which-document">Back</PillButton>
              <PillButton variant="navy" icon="check" to="/x/fd6-arjun-hegde-documents">Save document</PillButton>
            </div>
          </ModalBox>
        </>
      }
    >
      <FamilyBody links={false} />
    </ProfileShell>
  )
}
