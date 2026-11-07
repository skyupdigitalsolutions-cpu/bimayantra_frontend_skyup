// Figma 45:6025 · R2 · Proposal — Declarations
import { useState } from 'react'
import { Btn, Note, Segmented, Field, TextBox } from '../flow-policy/_kit'
import { declarationPeople, declarationQuestions, initialDeclarations, initialCondition, R } from '../../data/flow-proposal'
import { ProposalWizard } from './_parts'

export default function Declarations() {
  const [person, setPerson] = useState('Arjun')
  const [answers, setAnswers] = useState(initialDeclarations)
  const [cond, setCond] = useState(initialCondition)
  const a = answers[person]
  const set = (k, v) => setAnswers((s) => ({ ...s, [person]: { ...s[person], [k]: v } }))

  return (
    <ProposalWizard
      step={1}
      title="Declarations"
      sub="Answer for each person. A Yes needs details."
      backTo={R.members}
      next={<Btn icon="arrow" to={R.nominees}>Next: Nominees</Btn>}
    >
      <Segmented items={declarationPeople} value={person} onChange={setPerson} />
      {declarationQuestions.map((q) => (
        <div key={q.key} className="contents">
          <div className="flex h-[68px] items-center gap-3 rounded-[18px] bg-panel px-4">
            <p className="flex-1 text-[14px] font-semibold text-ink">{q.label}</p>
            <Segmented className="self-center" items={["No", "Yes"]} value={a[q.key]} onChange={(v) => set(q.key, v)} />
          </div>
          {q.key === 'ped' && a.ped === 'Yes' && (
            <div className="flex gap-3 rounded-[18px] bg-[#f3f7ff] p-3.5">
              <Field label="Condition *"><TextBox bg="white" value={person === 'Arjun' ? cond.condition : ''} onChange={(e) => setCond({ ...cond, condition: e.target.value })} /></Field>
              <Field label="Since when *"><TextBox bg="white" value={person === 'Arjun' ? cond.since : ''} onChange={(e) => setCond({ ...cond, since: e.target.value })} /></Field>
              <Field label="Current treatment"><TextBox bg="white" value={person === 'Arjun' ? cond.treatment : ''} onChange={(e) => setCond({ ...cond, treatment: e.target.value })} /></Field>
            </div>
          )}
        </div>
      ))}
      <Note tone="amber" icon="alert">Declaring a condition can change the insurer’s decision. Hiding one can void a claim.</Note>
    </ProposalWizard>
  )
}
