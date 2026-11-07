// Figma 292:38117 · INV · Status and screen inventory
// Documentation board rendered as a real page: every status/badge per entity, with screen codes linking to their routes.
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { entities, entityLinks, inventoryIntro, inventoryTitle, legend, screenLinks } from '../../data/inventory'

const COLS = ['STATUS / BADGE', 'WHAT TRIGGERS IT', 'CAN CHANGE TO', 'SCREENS']

function ScreenCodes({ entity, value }) {
  const codes = value.split(/,\s*/)
  return (
    <p className="w-[228px] text-[12px] leading-[18px] font-bold text-[#1f5fd6]">
      {codes.map((code, i) => {
        const to = entityLinks[entity]?.[code] ?? screenLinks[code]
        return (
          <Fragment key={code + i}>
            {i > 0 && ', '}
            {to ? <Link to={to} className="hover:underline">{code}</Link> : code}
          </Fragment>
        )
      })}
    </p>
  )
}

function Row({ entity, row }) {
  const detail = !!row.detail
  return (
    <div className="relative flex min-h-[42px] items-center gap-3 border-t border-[#e8ecf3] py-2">
      <div className={detail ? 'relative w-[250px] shrink-0' : 'w-[260px] shrink-0'}>
        <span
          className="inline-flex max-w-[250px] items-center rounded-[14px] px-3 py-[5px] text-[12px] leading-[15px] font-semibold whitespace-nowrap"
          style={{ backgroundColor: row.bg, color: row.fg }}
          title={row.detail}
        >
          {row.status}
        </span>
        {detail && (
          <p className="absolute top-[29px] left-0 w-[250px] text-[11px] font-medium text-[#7a8699]">{row.detail}</p>
        )}
      </div>
      <p className="w-[380px] shrink-0 pr-2.5 text-[13px] leading-[18px] font-medium text-[#44526a]">{row.trigger}</p>
      <p className="w-[260px] shrink-0 pr-2.5 text-[13px] leading-[18px] font-semibold text-[#172b4d]">{row.next}</p>
      <ScreenCodes entity={entity} value={row.screens} />
    </div>
  )
}

function EntityCard({ entity }) {
  return (
    <section className="flex w-[1200px] flex-col gap-1.5 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
      <h2 className="text-[20px] leading-[25px] font-bold tracking-[-0.2px] text-[#172b4d]">{entity.title}</h2>
      <>
        <div className="flex gap-3 py-2">
          {COLS.map((c, i) => (
            <p key={c} className={['w-[260px]', 'w-[380px]', 'w-[260px]', 'w-[228px]'][i] + ' shrink-0 text-[10px] leading-[13px] font-bold tracking-[0.4px] text-[#7a8699]'}>
              {c}
            </p>
          ))}
        </div>
        {entity.rows.map((row, i) => <Row key={i} entity={entity.title} row={row} />)}
      </>
    </section>
  )
}

export default function Inventory() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] p-12">
      <div className="flex flex-col gap-7">
        <header className="flex max-w-[1600px] flex-col gap-2">
          <h1 className="text-[40px] leading-[50px] font-bold tracking-[-0.8px] text-[#172b4d]">{inventoryTitle}</h1>
          <p className="text-[16px] leading-[24px] font-medium text-[#7a8699]">{inventoryIntro}</p>
        </header>

        <div className="flex max-w-[2424px] flex-wrap items-start gap-6">
          {entities.map((e) => <EntityCard key={e.title} entity={e} />)}
        </div>

        <section className="flex max-w-[2424px] flex-col gap-2 rounded-[28px] bg-white p-6 shadow-[0px_8px_24px_-10px_rgba(19,41,75,0.1)]">
          <h2 className="text-[20px] leading-[25px] font-bold text-[#172b4d]">Screen code groups</h2>
          {legend.map((l) => (
            <div key={l.codes} className="flex items-center gap-4">
              <p className="w-[520px] shrink-0 pr-2.5 text-[13px] leading-[16px] font-bold text-[#1f5fd6]">{l.codes}</p>
              <p className="text-[13px] leading-[16px] font-medium text-[#44526a]">{l.text}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
