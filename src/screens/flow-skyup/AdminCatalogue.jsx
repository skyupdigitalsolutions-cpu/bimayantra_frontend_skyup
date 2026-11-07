// Figma 129:15020 · AD1 · SkyUp Admin — Catalogue (product published)
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { AdminLayout, AdminHeader, ACard, ACardHead, HButton, Pill } from '../admin/_parts'
import { catalogueRows } from '../../data/flow-skyup'

export default function AdminCatalogue() {
  const [banner, setBanner] = useState(true)
  const [menu, setMenu] = useState(null)
  return (
    <AdminLayout active="catalogue">
      <AdminHeader
        title="Catalogue"
        subtitle="Verified products every advisor sees. Changes go live after a second admin approves."
        actions={<HButton variant="pink" icon="plus" to="/x/ada-skyup-admin-add-product-reading-brochure">Add product</HButton>}
      />

      {banner && (
        <div className="mt-[31px] flex h-24 items-center gap-4 rounded-[28px] bg-linear-to-b from-[#d4f1e7] to-[#b9e8d7] px-6 shadow-[0px_18px_36px_-12px_rgba(22,132,91,0.2)]">
          <button type="button" onClick={() => setBanner(false)} aria-label="Dismiss" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white">
            <Icon name="check" size={26} className="text-[#127650]" />
          </button>
          <div className="flex flex-1 flex-col gap-[3px]">
            <p className="text-[17px] font-bold text-ink">Activ One MAX is live for all advisors</p>
            <p className="text-[12px] font-medium text-[#2f6b55]">Approved by Arvind Shetty · 27 Oct 2026, 10:12 · now in 1,240 advisors’ Products library and dashboards</p>
          </div>
          <Pill tone="green" icon="bell">Notified 1,240 advisors</Pill>
        </div>
      )}

      <ACard className={cx('flex flex-col gap-2', banner ? 'mt-4' : 'mt-[31px]')}>
        <ACardHead title="Health products" subtitle="7 live · 1 upcoming" />
        {catalogueRows.map((r, i) => (
          <div
            key={r.name}
            className={cx('relative flex items-center gap-3.5 rounded-[18px] p-3.5', r.isNew ? 'h-[72px] border border-[#c7ebda] bg-[#f5fbf8]' : 'h-[70px] bg-panel')}
          >
            <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full" style={{ background: r.tint }}>
              <Icon name="heart" size={18} className="text-ink" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-[14px] font-bold text-ink">{r.name}</p>
              <p className="text-[12px] font-medium text-muted">{r.meta}</p>
            </div>
            {r.isNew && <Pill tone="pink" icon="star">New</Pill>}
            {r.upcoming ? (
              <Pill tone="blue" icon="clock">{r.upcoming}</Pill>
            ) : (
              <Pill tone="green" icon="check">{r.isNew ? 'Live · new today' : 'Live'}</Pill>
            )}
            <button
              type="button"
              aria-label="More"
              onClick={() => setMenu(menu === i ? null : i)}
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]"
            >
              <Icon name="more" size={14.3} className="text-ink" />
            </button>
            {menu === i && (
              <div className="absolute top-[58px] right-3 z-20 flex w-[180px] flex-col rounded-[16px] bg-white p-1.5 shadow-[0px_24px_48px_-10px_rgba(19,41,75,0.2)]">
                {['Edit product', 'New version', 'Withdraw'].map((m) => (
                  <button key={m} type="button" onClick={() => setMenu(null)} className="rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-panel">{m}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </ACard>
    </AdminLayout>
  )
}
