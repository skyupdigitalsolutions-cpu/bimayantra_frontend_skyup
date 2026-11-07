// Figma 133:15930 · ADb · SkyUp Admin — Review extracted values
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ACardHead, HButton, SButton, Pill } from '../admin/_parts'
import { AddProductShell, BODY_CARD } from './_parts'
import { extracted } from '../../data/flow-skyup'

const CONF = { High: 'green', Medium: 'amber', Low: 'bg-[#fbebec] text-[#b4323c]' }

function Check({ checked, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx('flex size-6 shrink-0 items-center justify-center rounded-[7px]', checked ? 'bg-navy text-white' : 'border-[1.5px] border-[#c3ccd8] bg-white')}
    >
      {checked && <Icon name="check" size={15} />}
    </button>
  )
}

export default function AddReview() {
  const [rows, setRows] = useState(extracted)
  const [page, setPage] = useState(9)
  const [agree, setAgree] = useState(false)
  const checked = rows.filter((r) => r.ok).length
  const setOk = (i) => setRows(rows.map((r, j) => (j === i ? { ...r, ok: true, value: r.fixed ?? r.value, by: r.fixed ? 'Corrected by Meena Iyer' : undefined } : r)))

  return (
    <AddProductShell subtitle="Verified catalogue · Health · Activ One MAX" step={5}>
      <div className="mt-[35px] flex items-start gap-5">
        <div className={`flex w-[760px] flex-col gap-4 ${BODY_CARD}`}>
          <ACardHead title="5 · Variants" subtitle="3 found in the brochure" right={<Pill tone="violet" icon="sparkle">Auto-filled from brochure</Pill>} />

          <div className="flex flex-col gap-2.5 rounded-[18px] bg-linear-to-r from-[#f0ecfb] to-[#e6dffb] px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
                <Icon name="sparkle" size={17} className="text-violet" />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-[13px] font-bold text-ink">Read by AI from the brochure. Check each value before it reaches 1,240 advisors.</p>
                <p className="text-[12px] font-medium text-violet">Every confirm and fix is saved with your name in the audit log.</p>
              </div>
              <p className="text-[13px] font-bold text-violet">{checked} of {rows.length} checked</p>
            </div>
            <div className="h-1.5 rounded-[3px] bg-white">
              <div className="h-1.5 rounded-[3px] bg-violet transition-all" style={{ width: `${(checked / rows.length) * 100}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={cx(
                  'flex items-center gap-3 rounded-[14px] border px-3',
                  r.ok ? 'h-[68px] border-[#d5eee2] bg-[#f7fbf9]' : 'h-[58px] border-[#f1d9a8] bg-[#fff9ef]',
                )}
              >
                <span className={cx('flex size-[26px] shrink-0 items-center justify-center rounded-full', r.ok ? 'bg-[#e7f4ee] text-[#127650]' : 'bg-[#fbf1e1] text-[#8a5a12]')}>
                  <Icon name={r.ok ? 'check' : 'alert'} size={13} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <p className="text-[11px] font-semibold text-muted">{r.label}</p>
                  <p className="text-[13px] font-bold text-ink">{r.value}</p>
                  {r.ok && <p className="text-[11px] font-medium text-[#127650]">{r.by ?? 'Confirmed by Meena Iyer'}</p>}
                </div>
                <Pill tone={CONF[r.conf]} className="pl-3">{r.conf}</Pill>
                <button
                  type="button"
                  onClick={() => setPage(r.page)}
                  className="flex h-6 shrink-0 items-center gap-1 rounded-[8px] border border-line bg-white px-2 text-[11px] font-bold text-blue"
                >
                  <Icon name="eye" size={12} />p.{r.page}
                </button>
                {r.ok ? (
                  <SButton variant="ghost" icon="check" className="w-[118px]">Confirmed</SButton>
                ) : (
                  <SButton variant="navy" onClick={() => setOk(i)}>Fix</SButton>
                )}
              </div>
            ))}
          </div>

          <span className="h-px bg-line" />
          <div className="flex items-center gap-3">
            <HButton variant="outline" onClick={() => window.history.back()} className="px-5">Back</HButton>
            <label className="flex cursor-pointer items-center gap-2.5" onClick={() => setAgree(!agree)}>
              <Check checked={agree} onChange={setAgree} />
              <span className="text-[13px] font-semibold text-ink">I’ve checked every value on this page</span>
            </label>
            <span className="flex-1" />
            <HButton variant="navy" icon="arrow" to="/x/adc-skyup-admin-review-and-send-for-approval">Next: Features</HButton>
          </div>
        </div>

        <div className={`flex w-[400px] flex-col gap-3 ${BODY_CARD}`}>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[15px] font-bold text-ink">Brochure source</p>
              <p className="text-[11px] font-medium text-muted">activ-one-max-brochure.pdf</p>
            </div>
            <Pill tone="bg-[#eef1f5] text-ink-2">Page {page} of 16</Pill>
          </div>
          <div className="relative h-[420px] rounded-[12px] border border-line bg-white">
            <span className="absolute top-6 left-6 h-2.5 w-[140px] rounded-[4px] bg-[#c9d2df]" />
            {Array.from({ length: 13 }, (_, k) => (
              <span key={k} className="absolute left-6 h-1.5 rounded-[3px] bg-[#e7ebf2]" style={{ top: 52 + k * 26, width: k % 4 === 3 ? 200 : 300 }} />
            ))}
            {page === 9 && (
              <>
                <span className="absolute top-[200px] left-5 h-[120px] w-[312px] rounded-[8px] border-2 border-violet bg-violet/10" />
                <span className="absolute top-[178px] left-5 rounded-[8px] bg-violet px-2 py-[3px] text-[10px] font-bold text-white">Room rent footnote</span>
              </>
            )}
          </div>
        </div>
      </div>
    </AddProductShell>
  )
}
