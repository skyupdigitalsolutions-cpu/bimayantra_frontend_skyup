// Figma 239:19269 · FD6 · Arjun Hegde — documents
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { ProfileShell, FamilyBody, Scrim, Drawer, OverlayHead, PillButton, SChip, Dot } from './_parts'

export default function ArjunDocuments() {
  const navigate = useNavigate()
  return (
    <ProfileShell
      tab="family"
      crumb="FAMILY"
      overlay={
        <>
          <Scrim onClick={() => navigate('/x/05a-customer-family')} />
          <Drawer>
            <OverlayHead
              lead={<Dot initials="AH" bg="#d9eafd" size={48} font={15} />}
              title="Arjun Hegde"
              sub="Spouse · 37 · 2 documents"
              closeTo="/x/05a-customer-family"
            />
            <div className="flex h-10 items-center gap-2.5 rounded-[14px] bg-[#e7f4ee] px-3.5 text-[#127650]">
              <Icon name="check" size={15} />
              <span className="text-[13px] font-bold">Aadhaar card saved to Arjun</span>
            </div>
            <div className="flex h-[78px] items-center gap-3 rounded-[18px] border border-[#c9daf8] bg-[#f7f9ff] p-3.5">
              <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fde8ec] text-ink">
                <Icon name="card" size={17} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">Aadhaar card</p>
                <p className="text-[11px] font-medium text-muted">v1 · just now · Priya</p>
              </div>
              <SChip tone="amber">Unconfirmed</SChip>
            </div>
            <div className="flex h-[76px] items-center gap-3 rounded-[18px] bg-panel p-3.5">
              <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#d4f1e7] text-ink">
                <Icon name="heart" size={17} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">Medical report · thyroid 2025</p>
                <p className="text-[11px] font-medium text-muted">v1 · 06 Sep</p>
              </div>
              <SChip tone="gray">Saved</SChip>
            </div>
            <div className="flex flex-col gap-2 rounded-[16px] border border-[#f1d9a8] bg-[#fff9ef] p-3.5">
              <p className="text-[12px] font-bold text-[#8a5a12]">Still needed for Arjun</p>
              <div className="flex gap-1.5">
                <SChip tone="amber" icon="alert">PAN card</SChip>
              </div>
            </div>
            <div className="sticky bottom-0 z-10 -mx-7 mt-auto shrink-0 bg-white px-7 pt-3 shadow-[0_24px_0_0_#fff]">
              <PillButton variant="navy" icon="upload" className="w-full justify-center" to="/x/fd4-add-document-which-document">Add document for Arjun</PillButton>
            </div>
          </Drawer>
        </>
      }
    >
      <FamilyBody links={false} arjunSaved />
    </ProfileShell>
  )
}
