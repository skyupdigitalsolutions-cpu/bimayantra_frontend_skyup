// Figma 239:18427 · FD4 · Add document — Which document
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ProfileShell, FamilyBody, Scrim, ModalBox, OverlayHead, PillButton, Note, DocSteps, FieldBox, INPUT } from './_parts'
import { docTypes } from '../../data/customer-tabs'

export default function AddDocumentWhich() {
  const navigate = useNavigate()
  const [type, setType] = useState('aadhaar')
  const [other, setOther] = useState('')
  return (
    <ProfileShell
      tab="family"
      crumb="FAMILY"
      overlay={
        <>
          <Scrim onClick={() => navigate('/x/05a-customer-family')} />
          <ModalBox>
            <OverlayHead title="Add document" sub="For Arjun Hegde" closeTo="/x/05a-customer-family" />
            <DocSteps step={2} />
            <p className="text-[14px] font-bold text-ink">Which document?</p>
            <div className="flex flex-wrap gap-2.5">
              {docTypes.map((t) => {
                const on = t.key === type
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setType(t.key)}
                    className={cx(
                      'flex w-[228px] items-center gap-2.5 rounded-[16px] p-3 text-left',
                      on ? 'h-16 border-2 border-blue bg-[#f3f7ff]' : 'h-[62px] border border-line bg-white hover:bg-panel',
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink" style={{ background: t.bg }}>
                      <Icon name={t.icon} size={16} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-px whitespace-nowrap">
                      <span className="text-[13px] font-bold text-ink">{t.title}</span>
                      <span className="text-[10px] font-medium text-muted">{t.sub}</span>
                    </span>
                    {on && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                        <Icon name="check" size={11} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-2.5 rounded-[16px] border border-dashed border-[#9db8ee] bg-[#f7f9ff] p-3.5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-white text-blue">
                  <Icon name="plus" size={13} />
                </span>
                <span className="text-[13px] font-bold text-ink">Other document</span>
                <span className="text-[12px] font-medium text-muted">· saved as a new type you can reuse</span>
              </div>
              <div className="flex items-end gap-2.5">
                <FieldBox label="Document name" className="flex-1 [&>span:last-child]:bg-white">
                  <input value={other} onChange={(e) => setOther(e.target.value)} placeholder="e.g. Disability certificate" className={INPUT} />
                </FieldBox>
                <PillButton variant="outline" size="sm" icon="check" onClick={() => other && setType('other')}>Use this</PillButton>
              </div>
            </div>
            <Note icon="check" bg="#e7f4ee" color="#127650">Aadhaar and PAN need personal-data consent. Given on 02 Sep 2026.</Note>
            <div className="flex items-center justify-between">
              <PillButton variant="outline" className="px-5" to="/x/fd3-add-document-whose-document">Back</PillButton>
              <PillButton variant="navy" icon="arrow" to="/x/fd5-add-document-upload">Next: Upload</PillButton>
            </div>
          </ModalBox>
        </>
      }
    >
      <FamilyBody links={false} />
    </ProfileShell>
  )
}
