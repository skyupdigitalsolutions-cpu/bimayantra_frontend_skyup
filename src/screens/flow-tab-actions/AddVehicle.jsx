// Figma 247:20759 · PV1 · Add vehicle
import { useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { Drawer, DrawerHead, Btn, InputBox } from '../flow-consent/_parts'
import { VehiclesPage, Field, SelectBox, Chip } from './_parts'

const SLOTS = ['RC', 'Front', 'Rear', 'Left', 'Right', 'Odometer']

export default function AddVehicle() {
  const [f, setF] = useState({ reg: 'KA 01 MX 4521', type: 'Private car', model: 'Hyundai Creta SX', year: '2022' })
  const [done, setDone] = useState({ RC: true, Front: true, Rear: true, Left: true })
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const count = Object.values(done).filter(Boolean).length

  return (
    <VehiclesPage
      overlay={
        <Drawer
          footer={
            <>
              <Btn to="/x/05d-customer-vehicles" className="w-[220px] flex-none">Cancel</Btn>
              <Btn variant="navy" icon="check" to="/x/pv2-vehicle-added">Save vehicle</Btn>
            </>
          }
        >
          <DrawerHead title="Add vehicle" sub="Kavya Hegde" close="/x/05d-customer-vehicles" />
          <div className="flex items-start gap-3">
            <Field label="Registration number *" className="w-[216px]" hint={<p className="text-[12px] font-medium text-muted">Checked against the RC format</p>}>
              <InputBox value={f.reg} onChange={set('reg')} className="border-2 border-blue pl-[18px]" />
            </Field>
            <Field label="Vehicle type *" className="w-[216px]"><SelectBox value={f.type} onChange={set('type')} options={['Private car', 'Two-wheeler', 'Commercial']} /></Field>
          </div>
          <div className="flex gap-3">
            <Field label="Make and model" className="w-[216px]"><InputBox value={f.model} onChange={set('model')} /></Field>
            <Field label="Year" className="w-[216px]"><SelectBox value={f.year} onChange={set('year')} options={['2024', '2023', '2022', '2021', '2020']} /></Field>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-ink">RC and photos *</p>
              <Chip icon="alert" className="bg-[#fbf1e1] text-[#8a5a12]">{count} of 5 added</Chip>
            </div>
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((s) => {
                const on = done[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDone((d) => ({ ...d, [s]: !d[s] }))}
                    className={cx('flex h-[59px] w-[136px] flex-col items-center gap-1.5 rounded-[14px] border p-2.5', on ? 'border-[#c7ebda] bg-[#f5fbf8]' : 'border-dashed border-[#c3ccd8] bg-white')}
                  >
                    <Icon name={on ? 'check' : 'plus'} size={16} className={on ? 'text-[#127650]' : 'text-blue'} />
                    <span className={cx('text-[12px] font-semibold', on ? 'text-ink' : 'text-blue')}>{s}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-[16px] bg-[#e8f0fd] px-4 py-3">
            <Icon name="car" size={16} className="shrink-0 text-blue" />
            <p className="text-[13px] font-semibold text-blue">RC plus at least 4 photos are needed to quote motor insurance.</p>
          </div>
        </Drawer>
      }
    />
  )
}
