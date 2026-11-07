// Figma 55:8353 · 05b · Customer — Consent
import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ProfileShell, PillButton, SChip, Dot, Head, CARD_SHADOW } from './_parts'
import { consentRows, consentHistory } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'

const COLS = ['WhatsApp', 'Email', 'SMS']

function ConsentCell({ c }) {
  const navigate = useNavigate()
  const chip =
    c.kind === 'given' ? (
      <Link to={c.chipTo} onClick={(e) => e.stopPropagation()}><SChip tone="green" icon="check">Given</SChip></Link>
    ) : c.kind === 'withdrawn' ? (
      <SChip tone="red" icon="x">Withdrawn</SChip>
    ) : (
      <SChip tone="gray">Not recorded</SChip>
    )
  return (
    <div onClick={() => navigate(c.to)} className="group flex w-[160px] shrink-0 cursor-pointer flex-col items-start gap-1">
      {chip}
      <span className="text-[11px] font-bold text-blue group-hover:underline">{c.kind === 'given' ? 'Withdraw' : 'Record'}</span>
    </div>
  )
}

export default function CustomerConsent() {
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const rows = consentRows.filter((r) => matches(q, r.name, r.rel))
  return (
    <ProfileShell tab="consent" crumb="CONSENT">
      <div className="flex h-[92px] items-center gap-4 rounded-[28px] bg-linear-to-r from-[#d4f1e7] to-[#b9e8d7] px-6 py-5">
        <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-white text-[#127650]">
          <Icon name="lock" size={24} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[16px] font-bold text-ink">Consent to store personal data: given</p>
          <p className="text-[12px] font-medium text-[#2f6b55]">02 Sep 2026 · signed form · by you · allows PAN, Aadhaar and identity documents</p>
        </div>
        <PillButton variant="danger" size="sm" className="px-3.5" to="/x/cs6-withdraw-personal-data-consent">Withdraw</PillButton>
      </div>

      <div className="mt-6 flex items-start gap-5">
        <section className={cx('w-[760px] overflow-hidden rounded-[28px] bg-white', CARD_SHADOW)}>
          <div className="flex gap-3 px-[22px] py-[18px] text-[12px] font-semibold text-muted">
            <span className="w-[220px] shrink-0">Person</span>
            {COLS.map((c) => <span key={c} className="w-[160px] shrink-0">{c}</span>)}
          </div>
          {rows.map((r) => (
            <Fragment key={r.name}>
              <div className="h-px bg-line" />
              <div className="flex h-[71px] items-center gap-3 px-[22px]">
                <div className="flex w-[220px] shrink-0 items-center gap-2.5">
                  <Dot initials={r.initials} bg={r.bg} size={36} font={12} />
                  <div className="flex flex-col gap-px whitespace-nowrap">
                    <p className="text-[13px] font-bold text-ink">{r.name}</p>
                    <p className="text-[11px] font-medium text-muted">{r.rel}</p>
                  </div>
                </div>
                {r.cells.map((c, i) => <ConsentCell key={i} c={c} />)}
              </div>
            </Fragment>
          ))}
          {!rows.length && <div className="px-[22px] pb-[18px]"><NoMatches label={`No one matches “${q}”`} onClear={() => setQ('')} /></div>}
        </section>

        <section className={cx('flex w-[400px] flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="History" sub="Who changed what, and how" />
          {consentHistory.map(([t, s]) => (
            <div key={t} className="flex items-center gap-2.5">
              <span className="size-2.5 shrink-0 rounded-full bg-[#5b3fb8]" />
              <div className="flex flex-col gap-px whitespace-nowrap">
                <p className="text-[13px] font-bold text-ink">{t}</p>
                <p className="text-[11px] font-medium text-muted">{s}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </ProfileShell>
  )
}
