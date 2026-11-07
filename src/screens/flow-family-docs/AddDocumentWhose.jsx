// Figma 239:18072 · FD3 · Add document — Whose document
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cx } from '../../components/ui'
import { ProfileShell, FamilyBody, Scrim, ModalBox, OverlayHead, PillButton, Dot, DocSteps } from './_parts'
import { docPeople } from '../../data/customer-tabs'

export default function AddDocumentWhose() {
  const navigate = useNavigate()
  const [who, setWho] = useState('arjun')
  return (
    <ProfileShell
      tab="family"
      crumb="FAMILY"
      overlay={
        <>
          <Scrim onClick={() => navigate('/x/05a-customer-family')} />
          <ModalBox>
            <OverlayHead title="Add document" sub="Every document is stored with one person" closeTo="/x/05a-customer-family" />
            <DocSteps step={1} />
            <p className="text-[14px] font-bold text-ink">Whose document is this?</p>
            {docPeople.map((p) => {
              const on = p.key === who
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setWho(p.key)}
                  className={cx(
                    'flex items-center gap-3.5 rounded-[18px] p-3.5 text-left',
                    on ? 'h-[71px] border-[1.5px] border-blue bg-[#f3f7ff]' : 'h-[68px] bg-panel hover:bg-chip',
                  )}
                >
                  <span className={cx('size-[22px] shrink-0 rounded-full bg-white', on ? 'border-[6px] border-navy' : 'border-[1.5px] border-[#c3ccd8]')} />
                  <Dot initials={p.initials} bg={p.bg} size={40} font={13} />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-bold text-ink">{p.name}</span>
                    <span className={cx('text-[12px] font-medium', p.warn ? 'text-[#b4323c]' : 'text-muted')}>{p.sub}</span>
                  </span>
                </button>
              )
            })}
            <div className="flex items-center justify-between">
              <PillButton variant="outline" className="px-5" to="/x/05a-customer-family">Cancel</PillButton>
              <PillButton variant="navy" icon="arrow" to="/x/fd4-add-document-which-document">Next: Which document</PillButton>
            </div>
          </ModalBox>
        </>
      }
    >
      <FamilyBody links={false} />
    </ProfileShell>
  )
}
