// Figma 246:20502 · PF2 · Link a policy holder
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Dialog, DialogIcon, Btn, InputBox } from '../flow-consent/_parts'
import { FamilyPage, Avatar, Field, SelectBox } from './_parts'
import { matches } from '../customer-tabs/_search'

const RESULTS = [
  { key: 'sr', initials: 'SR', av: '#e9e3fc', name: 'Shanthi Rao', sub: 'CU-000322 · already linked', linked: true },
  { key: 'sp', initials: 'SP', av: '#d4f1e7', name: 'Shankar Patil', sub: 'CU-000331 · Mysuru' },
  { key: 'rk', initials: 'RK', av: '#d9eafd', name: 'Ramesh Kulkarni', sub: 'CU-000287 · Hubballi' },
  { key: 'lh', initials: 'LH', av: '#fde8c9', name: 'Lakshmi Hegde', sub: 'CU-000301 · Udupi' },
  { key: 'vn', initials: 'VN', av: '#fde8ec', name: 'Vikram Nair', sub: 'CU-000340 · Bengaluru' },
]

export default function LinkPolicyHolder() {
  const [q, setQ] = useState('Shan')
  const [sel, setSel] = useState('sp')
  const [rel, setRel] = useState('Father-in-law')
  const results = RESULTS.filter((r) => matches(q, r.name, r.sub))
  return (
    <FamilyPage
      overlay={
        <Dialog top={100}>
          <DialogIcon icon="link" bg="#e8f0fd" color="#1f5fd6" />
          <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">Link another policy holder</p>
          <p className="text-[13px] leading-5 font-medium text-muted">Link someone who has their own record, like a parent with separate policies.</p>
          <Field label="Search policy holders">
            <InputBox value={q} onChange={setQ} className="border-2 border-blue pl-[18px]" leading={<Icon name="search" size={18} className="text-muted" />} />
          </Field>
          <div className="flex flex-col gap-0.5 rounded-[16px] border border-line bg-white p-1.5">
            {!results.length && (
              <p className="flex h-[54px] items-center gap-2 px-2.5 text-[13px] font-semibold text-muted">
                No policy holders match “{q}”
                <button type="button" onClick={() => setQ('')} className="text-[12px] font-bold text-blue hover:underline">Clear</button>
              </p>
            )}
            {results.map((r) => {
              const on = sel === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  disabled={r.linked}
                  onClick={() => setSel(r.key)}
                  className={cx('flex h-[54px] items-center gap-2.5 rounded-[12px] px-2.5 text-left', on && 'bg-[#f3f7ff]')}
                >
                  <Avatar initials={r.initials} bg={r.av} size={34} text={11} />
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[13px] font-bold text-ink">{r.name}</span>
                    <span className="text-[11px] font-medium text-muted">{r.sub}</span>
                  </span>
                  {on && <span className="flex size-5 items-center justify-center rounded-full bg-navy text-white"><Icon name="check" size={11} /></span>}
                </button>
              )
            })}
          </div>
          <Field label="Relationship to Kavya *">
            <SelectBox value={rel} onChange={setRel} options={['Father-in-law', 'Mother-in-law', 'Parent', 'Sibling', 'Other']} />
          </Field>
          <div className="flex gap-2.5">
            <Btn to="/x/05a-customer-family">Cancel</Btn>
            <Btn variant="navy" icon="link" to="/x/05a-customer-family">Link</Btn>
          </div>
        </Dialog>
      }
    />
  )
}
