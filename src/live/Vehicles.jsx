// Batch 5 · Vehicles on the live API (P-54): PV1 add vehicle (RC + photos) · PV2 added (toast) · VH1 mark sold / active again.
import { useState } from 'react'
import { api } from '../api'
import { useAuth } from '../auth/AuthProvider'
import Icon from '../components/Icon'
import { ActionDialog, Field, useAct } from './kit'

function FileBox({ text, fileId, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="flex h-[46px] items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink">
        <Icon name={fileId ? 'check' : 'folder'} size={16} className={fileId ? 'text-[#127650]' : 'text-muted'} />
        <span className="flex-1 truncate">{busy ? 'Uploading…' : fileId ? 'Attached' : text}</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return
          setBusy(true); setErr(null)
          try { onChange((await api.files.upload(f, 'CUSTOMER_DOCUMENT')).data.id) } catch (x) { setErr(x.message) } finally { setBusy(false) }
        }} />
      </span>
      {err && <span className="text-[12px] font-medium text-[#b4323c]">{err}</span>}
    </label>
  )
}

const TYPES = ['Private car', 'Two-wheeler', 'Commercial vehicle']
const FUELS = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']

export function AddVehicleDialog({ customer, rules, tooFewPhotosMessage, onClose }) {
  const { reference } = useAuth()
  // Rules come with the vehicles list (CFG-154 minimum photos, CFG-155 slots); reference is the fallback.
  const slots = rules?.slots ?? reference?.vehiclePhotoSlots ?? []
  const minPhotos = rules?.minPhotos ?? 0
  const [f, setF] = useState({ registration: '', vehicleType: TYPES[0], make: '', model: '', year: '', fuel: FUELS[0] })
  const [rc, setRc] = useState(null)
  const [photos, setPhotos] = useState({})
  const { act, busy, error, fieldErrors } = useAct()
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const photoCount = Object.values(photos).filter(Boolean).length
  const save = () => act(() => api.customers.addVehicle(customer.id, {
    ...f, registration: f.registration.trim(), make: f.make.trim(), model: f.model.trim(), year: Number(f.year), rcFileId: rc,
    photos: Object.entries(photos).filter(([, id]) => id).map(([slot, fileId]) => ({ slot, fileId })),
  }), { invalidates: ['vehicles', 'activity'], quiet: true, onDone: onClose })
  return (
    <ActionDialog title="Add vehicle" icon="car" confirm="Add vehicle" busy={busy} error={error} onConfirm={save} onClose={onClose} width={640}
      disabled={!f.registration.trim() || !f.make.trim() || !f.model.trim() || !f.year || !rc || photoCount < minPhotos}>
      <div className="flex gap-3">
        <Field label="Registration number *" value={f.registration} onChange={set('registration')} placeholder="KA01AB1234" error={fieldErrors.registration} />
        <Field label="Vehicle type *" type="select" value={f.vehicleType} onChange={set('vehicleType')} options={TYPES} error={fieldErrors.vehicleType} />
      </div>
      <div className="flex gap-3">
        <Field label="Make *" value={f.make} onChange={set('make')} error={fieldErrors.make} />
        <Field label="Model *" value={f.model} onChange={set('model')} error={fieldErrors.model} />
      </div>
      <div className="flex gap-3">
        <Field label="Year of manufacture *" type="number" value={f.year} onChange={set('year')} error={fieldErrors.year} />
        <Field label="Fuel *" type="select" value={f.fuel} onChange={set('fuel')} options={FUELS} error={fieldErrors.fuel} />
      </div>
      <div className="flex flex-col gap-2"><span className="text-[13px] font-semibold text-ink">RC (registration certificate) *</span><FileBox text="Choose the RC file" fileId={rc} onChange={setRc} /></div>
      {fieldErrors.rcFileId && <p className="text-[12px] font-semibold text-[#b4323c]">{fieldErrors.rcFileId}</p>}
      {slots.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="flex items-baseline justify-between text-[13px] font-semibold text-ink">
            {minPhotos > 0 ? `Photos * (at least ${minPhotos})` : 'Photos (optional)'}
            {minPhotos > 0 && <span className={photoCount >= minPhotos ? 'text-[12px] text-[#127650]' : 'text-[12px] text-muted'}>{photoCount} of {minPhotos} added</span>}
          </span>
          <div className="grid grid-cols-2 gap-2">{slots.map((s) => <div key={s} className="flex flex-col gap-1"><span className="text-[11px] font-semibold text-muted">{s}</span><FileBox text="Add photo" fileId={photos[s]} onChange={(id) => setPhotos((p) => ({ ...p, [s]: id }))} /></div>)}</div>
          {(fieldErrors.photos || (photoCount < minPhotos && tooFewPhotosMessage && rc)) && <p className="text-[12px] font-semibold text-[#b4323c]">{fieldErrors.photos || tooFewPhotosMessage}</p>}
        </div>
      )}
    </ActionDialog>
  )
}

/** VH1: mark sold (INACTIVE) or active again. */
export function VehicleStatusDialog({ vehicle, onClose }) {
  const sold = vehicle.status === 'ACTIVE'
  const { act, busy, error } = useAct()
  const run = () => act(() => api.vehicles.setStatus(vehicle.id, { version: vehicle.version, status: sold ? 'INACTIVE' : 'ACTIVE' }), { invalidates: ['vehicles', 'activity'], quiet: true, onDone: onClose })
  return (
    <ActionDialog title={sold ? 'Mark vehicle as sold?' : 'Make vehicle active again?'} icon="car" tone={sold ? 'danger' : 'navy'} confirm={sold ? 'Mark sold' : 'Make active'} busy={busy} error={error} onConfirm={run} onClose={onClose}
      body={sold ? 'It leaves the active list. Its documents stay.' : 'It returns to the active list, if no other active vehicle has the same registration.'} />
  )
}
