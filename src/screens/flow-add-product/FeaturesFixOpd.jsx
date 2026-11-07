// Figma 163:17868 · AP5b · Add product — Fix value (OPD)
import { useState } from 'react'
import { cx } from '../../components/ui'
import { FeaturesStep } from './_steps'
import { FixDrawer, Field, TextInput, R } from './_parts'
import { fixes } from '../../data/flow-add-product'

export default function FeaturesFixOpd() {
  const [inc, setInc] = useState(true)
  return (
    <FeaturesStep
      overlay={
        <FixDrawer kind="features" cancelTo={R.features} saveTo={R.featuresAdding}>
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink">In the Plus variant</span>
            <div className="flex gap-1 self-start rounded-[26px] bg-white p-[5px] shadow-[0px_6px_16px_-8px_rgba(19,41,75,0.1)]">
              {[['Included', true], ['Not included', false]].map(([label, v]) => (
                <button key={label} type="button" onClick={() => setInc(v)} className={cx('h-[34px] rounded-[21px] px-4 text-[13px] font-semibold', inc === v ? 'bg-navy text-white' : 'text-slate hover:bg-panel')}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Field label="Correct value *">
            <TextInput focused defaultValue={fixes.features.value} disabled={!inc} />
          </Field>
        </FixDrawer>
      }
    />
  )
}
