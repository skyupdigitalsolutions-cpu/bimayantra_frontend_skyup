// Figma 246:20161 · PF1 · Change default nominee
import { useState } from 'react'
import { cx } from '../../components/ui'
import { Dialog, DialogIcon, Btn, Radio } from '../flow-consent/_parts'
import { FamilyPage, Avatar } from './_parts'

const OPTIONS = [
  { key: 'arjun', initials: 'AH', av: '#d9eafd', name: 'Arjun Hegde', sub: 'Spouse · current' },
  { key: 'anya', initials: 'AH', av: '#d4f1e7', name: 'Anya Hegde', sub: 'Daughter · under 18, needs appointee', warn: true },
  { key: 'shanta', initials: 'SH', av: '#fde8c9', name: 'Shanta Hegde', sub: 'Mother' },
  { key: 'none', initials: '—', av: '#eef1f5', name: 'No default nominee' },
]

export default function ChangeDefaultNominee() {
  const [sel, setSel] = useState('arjun')
  return (
    <FamilyPage
      overlay={
        <Dialog top={110}>
          <DialogIcon icon="users" bg="#e8f0fd" color="#1f5fd6" />
          <p className="text-[21px] font-bold tracking-[-0.2px] text-ink">Change default nominee</p>
          <p className="text-[13px] leading-5 font-medium text-muted">Suggested on new proposals only. Existing policies keep their nominees.</p>
          {OPTIONS.map((o) => {
            const on = sel === o.key
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setSel(o.key)}
                className={cx('flex h-[60px] items-center gap-3 rounded-[16px] px-3 text-left', on ? 'h-[62px] border border-blue bg-[#f3f7ff]' : 'bg-panel')}
              >
                <Radio on={on} />
                <Avatar initials={o.initials} bg={o.av} />
                <span className="flex flex-col gap-px">
                  <span className="text-[13px] font-bold text-ink">{o.name}</span>
                  {o.sub && <span className={cx('text-[11px] font-medium', o.warn ? 'text-[#8a5a12]' : 'text-muted')}>{o.sub}</span>}
                </span>
              </button>
            )
          })}
          <div className="flex gap-2.5">
            <Btn to="/x/05a-customer-family">Cancel</Btn>
            <Btn variant="navy" icon="check" to="/x/05a-customer-family">Save</Btn>
          </div>
        </Dialog>
      }
    />
  )
}
