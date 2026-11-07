// Figma 45:6259 · R3 · Proposal — Nominees
import { useState } from 'react'
import Icon from '../../components/Icon'
import { Btn, Field, SelectBox, TextBox } from '../flow-policy/_kit'
import { nomineePeople, relationships, initialNominees, R } from '../../data/flow-proposal'
import { ProposalWizard } from './_parts'

const initials = (n) => n.split(' ').map((w) => w[0]).join('')

export default function Nominees() {
  const [rows, setRows] = useState(initialNominees)
  const total = rows.reduce((s, r) => s + (parseFloat(r.share) || 0), 0)
  const upd = (id, k, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)))
  const ok = total === 100

  return (
    <ProposalWizard
      step={2}
      title="Nominees"
      sub="For this policy only. Pre-filled from the default nominee."
      backTo={R.declarations}
      next={<Btn icon="arrow" to={R.kyc}>Next: KYC check</Btn>}
    >
      {rows.map((r, i) => (
        <div key={r.id} className="flex flex-col gap-3.5 rounded-[22px] bg-panel p-[18px]">
          <div className="flex h-10 items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#d9eafd] text-[13px] font-bold text-navy">{initials(r.person)}</span>
            <p className="flex-1 text-[15px] font-bold text-ink">Nominee {i + 1}</p>
            <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} className="flex h-9 items-center gap-2 rounded-[18px] pr-3.5 pl-3 text-[13px] font-semibold text-ink hover:bg-white">
              <Icon name="x" size={16} />Remove
            </button>
          </div>
          <div className="flex gap-3.5">
            <Field label="Person *"><SelectBox bg="white" options={nomineePeople} value={r.person} onChange={(e) => upd(r.id, 'person', e.target.value)} /></Field>
            <Field label="Relationship *"><SelectBox bg="white" options={relationships} value={r.relationship} onChange={(e) => upd(r.id, 'relationship', e.target.value)} /></Field>
            <Field label="Share % *"><TextBox bg="white" prefix="%" inputMode="numeric" value={r.share} onChange={(e) => upd(r.id, 'share', e.target.value.replace(/[^\d.]/g, ''))} /></Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        disabled={rows.length >= 4}
        onClick={() => setRows((rs) => [...rs, { id: Date.now(), person: nomineePeople[rs.length % 4], relationship: relationships[1], share: '0' }])}
        className="flex h-[46px] items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#c3ccd8] text-[13px] font-semibold text-muted hover:bg-panel-2 disabled:opacity-50"
      >
        <Icon name="plus" size={16} />Add nominee (up to 4)
      </button>
      <div className={`flex h-[46px] items-center gap-3 rounded-[18px] px-[18px] ${ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbf1e1] text-[#8a5a12]'}`}>
        <Icon name={ok ? 'check' : 'alert'} size={18} />
        <p className="text-[14px] font-bold">Shares total {total}%</p>
      </div>
    </ProposalWizard>
  )
}
