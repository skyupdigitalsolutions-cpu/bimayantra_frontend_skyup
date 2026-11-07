// Figma 247:21303 · PP1 · Edit policy nominees
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Drawer, DrawerHead, Btn, InputBox } from '../flow-consent/_parts'
import { PoliciesPage, Field, SelectBox } from './_parts'

const PEOPLE = ['Arjun Hegde', 'Anya Hegde', 'Shanta Hegde']

export default function EditPolicyNominees() {
  const [rows, setRows] = useState([{ who: 'Arjun Hegde', share: '60' }, { who: 'Anya Hegde', share: '40' }])
  const [appointee, setAppointee] = useState('Arjun Hegde')
  const [ref, setRef] = useState('END-2026-0412')
  const [from, setFrom] = useState('26-10-2026')
  const total = rows.reduce((s, r) => s + (Number(r.share) || 0), 0)
  const upd = (i, k) => (v) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)))

  return (
    <PoliciesPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/x/05f-customer-policies" className="w-[220px] flex-none">Cancel</Btn>
              <Btn variant="navy" icon="check" to="/x/05f-customer-policies">Save as version 2</Btn>
            </>
          }
        >
          <DrawerHead title="Edit nominees" sub="FamilySure · 2245/88/26/0001842" close="/x/05f-customer-policies" />
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#fbf1e1] px-4 py-3">
            <Icon name="alert" size={16} className="shrink-0 text-[#8a5a12]" />
            <p className="text-[13px] font-semibold text-[#8a5a12]">Change nominees on the insurer side first, then record the endorsement here.</p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[16px] bg-panel p-3.5">
            {rows.map((r, i) => (
              <div key={i} className="flex gap-2.5">
                <Field label="Nominee" className="w-[203px]"><SelectBox value={r.who} onChange={upd(i, 'who')} options={PEOPLE} className="bg-white" /></Field>
                <Field label="Share %" className="w-[203px]">
                  <InputBox value={r.share} onChange={upd(i, 'share')} className="bg-white" leading={<span className="text-[14px] font-semibold text-muted">%</span>} />
                </Field>
              </div>
            ))}
            <Field label="Appointee for Anya (under 18) *"><SelectBox value={appointee} onChange={setAppointee} options={PEOPLE} className="bg-white" /></Field>
          </div>
          <div className={`flex h-9 items-center gap-2 rounded-[14px] px-3.5 ${total === 100 ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbebec] text-[#b4323c]'}`}>
            <Icon name={total === 100 ? 'check' : 'alert'} size={14} />
            <span className="text-[13px] font-bold">Shares total {total}%</span>
          </div>
          <div className="flex gap-3">
            <Field label="Endorsement reference *" className="w-[216px]"><InputBox value={ref} onChange={setRef} /></Field>
            <Field label="Effective from *" className="w-[216px]"><InputBox value={from} onChange={setFrom} trailing="calendar" /></Field>
          </div>
        </Drawer>
      }
    />
  )
}
