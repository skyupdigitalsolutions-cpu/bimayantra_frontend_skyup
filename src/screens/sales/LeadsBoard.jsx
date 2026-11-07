// Figma 8:503 · 02 · Leads — Board
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { PageHeader, cx } from '../../components/ui'
import { LeadCard, PillButton } from './_parts'
import { pipelines, leadStages, leads as seed } from '../../data/sales'
import { matchesQuery, useHeaderSearch, NoMatches } from '../tasks/_filter'

function ViewToggle() {
  return (
    <div className="flex gap-1 rounded-[24px] bg-white p-1 shadow-[0px_6px_18px_-8px_rgba(19,41,75,0.1)]">
      <span className="flex items-center gap-1.5 rounded-[20px] bg-navy px-3.5 py-2 text-[13px] font-semibold text-white">
        <Icon name="columns" size={16} />
        Board
      </span>
      <Link to="/x/02b-leads-list" className="flex items-center gap-1.5 rounded-[20px] px-3.5 py-2 text-[13px] font-semibold text-muted hover:text-ink">
        <Icon name="list" size={16} />
        List
      </Link>
    </div>
  )
}

function Pipelines({ items, value, onChange }) {
  return (
    <div className="flex gap-2.5">
      {items.map((p) => {
        const on = p.key === value
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(p.key)}
            className={cx(
              'flex items-center gap-2.5 rounded-[22px] border py-2.5 pr-2.5 pl-[18px] text-[13px] font-semibold',
              on ? 'border-navy bg-navy py-[9px] text-white' : 'border-line bg-white text-ink hover:bg-tile',
            )}
          >
            {p.label}
            <span className={cx('rounded-[10px] px-[9px] py-0.5 text-[12px] font-bold', on ? 'bg-white/15 text-white' : 'bg-panel text-muted')}>
              {p.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function Column({ stage, items, dragId, setDragId, onDrop }) {
  const [over, setOver] = useState(false)
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(stage.key) }}
      className={cx('flex h-[760px] w-[280px] shrink-0 flex-col items-center gap-3 rounded-[28px] p-3.5 transition', over && 'ring-2 ring-inset')}
      style={{ background: stage.bg, '--tw-ring-color': stage.dash }}
    >
      <div className="flex w-full items-center gap-2 px-1.5 py-1">
        <span className="size-2.5 rounded-full" style={{ background: stage.ink }} />
        <p className="text-[15px] font-bold text-ink">{stage.label}</p>
        <span className="flex-1" />
        <span className="rounded-[10px] bg-white px-2.5 py-[3px] text-[12px] font-bold" style={{ color: stage.ink }}>
          {items.length}
        </span>
      </div>
      {items.map((l) => (
        <LeadCard
          key={l.id}
          lead={l}
          draggable
          dragging={dragId === l.id}
          onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragId(l.id) }}
          onDragEnd={() => setDragId(null)}
        />
      ))}
      <Link
        to="/x/f1-new-lead"
        className="flex h-[46px] w-full shrink-0 items-center justify-center gap-2 rounded-[20px] border border-dashed text-[13px] font-semibold hover:bg-white/40"
        style={{ borderColor: stage.dash, color: stage.ink }}
      >
        <Icon name="plus" size={16} />
        Add lead
      </Link>
    </div>
  )
}

export default function LeadsBoard() {
  const [pipe, setPipe] = useState('health')
  const [items, setItems] = useState(seed)
  const [dragId, setDragId] = useState(null)
  const [q, clearQ] = useHeaderSearch()
  const tabs = pipelines.map((p) => ({ ...p, count: items.filter((l) => l.pipeline === p.key).length }))
  const shown = items.filter((l) => l.pipeline === pipe && matchesQuery(q, l.name, l.phone, l.note, l.source.label, l.chips.map((c) => c.label)))

  const move = (stage) => {
    if (dragId == null) return
    setItems((xs) => xs.map((l) => (l.id === dragId ? { ...l, stage } : l)))
    setDragId(null)
  }

  return (
    <AppLayout active="leads" panelClass="pb-7!">
      <PageHeader
        title="Leads"
        subtitle="Drag a card to an allowed stage. Lost needs a reason."
        actions={
          <>
            <ViewToggle />
            <PillButton variant="pink" icon="plus" to="/x/f1-new-lead">New lead</PillButton>
          </>
        }
      />

      <div className="mt-[30px]">
        <Pipelines items={tabs} value={pipe} onChange={setPipe} />
      </div>

      <div className="mt-[19px]">
        {q.trim() && shown.length === 0 && (
          <NoMatches
            className="mb-4 w-fit min-w-[520px] rounded-[24px] bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]"
            sub={`No ${tabs.find((t) => t.key === pipe).label} leads match “${q.trim()}”.`}
            onClear={clearQ}
          />
        )}
        <div className="flex gap-5">
            {leadStages.map((s) => (
              <Column
                key={s.key}
                stage={s}
                items={shown.filter((l) => l.stage === s.key)}
                dragId={dragId}
                setDragId={setDragId}
                onDrop={move}
              />
            ))}
        </div>
      </div>
    </AppLayout>
  )
}
