// The category's own product details (productForms.ts on the API): Home asks for covers, property types and perils;
// Motor for cover types, fuel and IDV; Term Life for sum assured and premium payment; Travel for trip types… The form
// comes with the category (GET /my-products/types/:id/template → form).
import { cx } from '../components/ui'
import { Field } from './kit'

/** Same rule as the API (categoryNames.ts): "Health insurance", " HEALTH " and "Health-cover" are one category. */
export function categoryKey(name) {
  const words = String(name ?? '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').split(' ')
    .filter((w) => w && !['insurance', 'insurances', 'cover', 'covers', 'plan', 'plans', 'policy', 'policies'].includes(w))
  return words.join(' ') || String(name ?? '').toLowerCase().trim()
}

const NUMBERISH = new Set(['NUMBER', 'AMOUNT', 'PERCENT', 'YEARS', 'DAYS'])
const UNIT = { AMOUNT: '₹', PERCENT: '%', YEARS: 'years', DAYS: 'days' }

/** Form values (strings from inputs) → the API's `data.details` (numbers, booleans, lists); empty values left out. */
export function detailsBody(form, values) {
  const out = {}
  for (const f of form?.fields ?? []) {
    const v = values[f.key]
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue
    if (NUMBERISH.has(f.type)) { const n = Number(String(v).replace(/[₹,\s%]/g, '')); if (Number.isFinite(n)) out[f.key] = n }
    else if (f.type === 'NUMBER_LIST') out[f.key] = String(v).split(',').map((x) => x.trim()).filter(Boolean).map(Number).filter((n) => Number.isInteger(n))
    else if (f.type === 'YES_NO') out[f.key] = v === true || v === 'yes'
    else out[f.key] = v
  }
  return out
}

/** API values → form values (when values come back from a brochure reading). */
export const detailsFromData = (form, data) => Object.fromEntries((form?.fields ?? []).filter((f) => data?.[f.key] != null).map((f) => [f.key, f.type === 'NUMBER_LIST' ? data[f.key].join(', ') : f.type === 'YES_NO' ? (data[f.key] ? 'yes' : 'no') : data[f.key]]))

export const missingRequired = (form, values) => (form?.fields ?? []).filter((f) => f.required && (values[f.key] === undefined || values[f.key] === '' || (Array.isArray(values[f.key]) && !values[f.key].length)))

export default function ProductDetailsForm({ form, values, onChange, errors = {} }) {
  if (!form?.fields?.length) return null
  const set = (k, v) => onChange({ ...values, [k]: v })
  const err = (k) => errors[`details.${k}`] ?? errors[`data.details.${k}`]
  const sections = [...new Set(form.fields.map((f) => f.section))]
  return (
    <div className="flex flex-col gap-4">
      {sections.map((sec) => (
        <div key={sec} className="flex flex-col gap-3">
          <p className="text-[12px] font-bold tracking-wide text-muted uppercase">{form.label} · {sec}</p>
          <div className="grid grid-cols-2 gap-3">
            {form.fields.filter((f) => f.section === sec).map((f) => {
              const label = `${f.label}${f.required ? ' *' : ''}`
              const v = values[f.key]
              if (f.type === 'CHOICES') {
                const list = Array.isArray(v) ? v : []
                return (
                  <div key={f.key} className="col-span-2 flex flex-col gap-1.5">
                    <span className="text-[13px] font-semibold text-ink">{label}</span>
                    <div className="flex flex-wrap gap-2">
                      {f.options.map((o) => {
                        const on = list.includes(o)
                        return (
                          <button key={o} type="button" aria-pressed={on} onClick={() => set(f.key, on ? list.filter((x) => x !== o) : [...list, o])}
                            className={cx('rounded-[14px] border px-3 py-2 text-[13px] font-semibold transition', on ? 'border-blue bg-[#eef3ff] text-blue' : 'border-line bg-white text-ink hover:bg-panel-2')}>
                            {o}
                          </button>
                        )
                      })}
                    </div>
                    {f.help && <span className="text-[12px] font-medium text-muted">{f.help}</span>}
                    {err(f.key) && <span className="text-[12px] font-semibold text-[#b4323c]">{err(f.key)}</span>}
                  </div>
                )
              }
              if (f.type === 'CHOICE') return <Field key={f.key} label={label} type="select" value={v ?? ''} onChange={(x) => set(f.key, x)} options={[{ value: '', label: '—' }, ...f.options.map((o) => ({ value: o, label: o }))]} error={err(f.key)} hint={f.help ?? undefined} />
              if (f.type === 'YES_NO') return <Field key={f.key} label={label} type="select" value={v ?? ''} onChange={(x) => set(f.key, x)} options={[{ value: '', label: '—' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} error={err(f.key)} hint={f.help ?? undefined} />
              if (f.type === 'NUMBER_LIST') return <Field key={f.key} label={label} value={v ?? ''} onChange={(x) => set(f.key, x)} placeholder="e.g. 5, 10, 15" error={err(f.key)} hint={f.help ?? 'Comma separated'} />
              if (f.type === 'TEXT') return <Field key={f.key} label={label} value={v ?? ''} onChange={(x) => set(f.key, x)} error={err(f.key)} hint={f.help ?? undefined} />
              return <Field key={f.key} label={`${label}${UNIT[f.type] ? ` (${UNIT[f.type]})` : ''}`} type="number" value={v ?? ''} onChange={(x) => set(f.key, x)} error={err(f.key)} hint={f.help ?? (f.min != null && f.max != null ? `${f.min} to ${f.max}` : undefined)} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}