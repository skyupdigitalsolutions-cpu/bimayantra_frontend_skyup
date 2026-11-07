// Figma 246:21202 · PD1 · Check document values
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Drawer, DrawerHead, Btn, SmallBtn } from '../flow-consent/_parts'
import { DocumentsPage, Chip } from './_parts'
import { aadhaarValues } from '../../data/flow-tab-actions'

export default function CheckDocumentValues() {
  const [ok, setOk] = useState(() => aadhaarValues.map((v) => v.conf === 'High'))
  return (
    <DocumentsPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/x/05c-customer-documents" className="w-[220px] flex-none">Cancel</Btn>
              <Btn variant="navy" icon="check" to="/x/05c-customer-documents">Confirm values</Btn>
            </>
          }
        >
          <DrawerHead title="Check Aadhaar values" sub="Kavya Hegde · v2 · uploaded by Priya" close="/x/05c-customer-documents" />
          <div className="flex h-[150px] items-center justify-center rounded-[16px] border border-line bg-panel-2 text-faint">
            <Icon name="card" size={44} />
          </div>
          {aadhaarValues.map((v, i) => {
            const high = v.conf === 'High'
            return (
              <div key={v.label} className={cx('flex h-[58px] items-center gap-2.5 rounded-[14px] border px-3', high ? 'border-[#d5eee2] bg-[#f7fbf9]' : 'border-[#f1d9a8] bg-[#fff9ef]')}>
                <span className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="text-[11px] font-medium text-muted">{v.label}</span>
                  <span className="text-[13px] font-bold text-ink">{v.value}</span>
                </span>
                <Chip className={high ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbf1e1] text-[#8a5a12]'}>{v.conf}</Chip>
                {high ? (
                  <SmallBtn icon={ok[i] ? 'check' : undefined} onClick={() => setOk((s) => s.map((x, j) => (j === i ? !x : x)))} className="pr-3.5">
                    {ok[i] ? 'Confirmed' : 'Confirm'}
                  </SmallBtn>
                ) : (
                  <SmallBtn icon="edit" className="pr-3.5">Edit</SmallBtn>
                )}
              </div>
            )
          })}
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3">
            <Icon name="alert" size={16} className="shrink-0 text-blue" />
            <p className="text-[13px] font-semibold text-blue">Confirmed values replace the ones on Kavya’s record. Version 1 stays in history.</p>
          </div>
        </Drawer>
      }
    />
  )
}
