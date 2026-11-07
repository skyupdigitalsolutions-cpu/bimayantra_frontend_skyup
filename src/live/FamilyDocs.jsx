// Batch 3 / 3b · Family and documents on the live API.
//   FD1/PF3 add + edit family member · FM1 deactivate/activate · FD2 member added (toast)
//   FD3–FD5 add document (whose → which → upload) · PD1 check values (Verify and Confirm, P-18) · DL1 change label · PD2 versions
//   PF1 default nominee (B-01) · PF2 link a policy holder (B-01)
// Every flow is a dialog on the Family / Documents tab, so the page behind it refreshes by itself.
import { useEffect, useMemo, useState } from 'react'
import { api, useQuery } from '../api'
import { fmtDateTime } from '../api/format'
import { useAuth } from '../auth/AuthProvider'
import Icon from '../components/Icon'
import { ActionDialog, ErrorNote, Field, label, useAct } from './kit'

const CUSTOMER_CHANGED = ['customer', 'customers', 'consents', 'documents', 'document', 'links', 'default-nominee', 'activity']
const toApi = (v) => v || null

/* ═════════════ FD1 / PF3 · Add or edit a family member ═════════════ */
export function FamilyDialog({ customerId, member, onClose }) {
  const { reference } = useAuth()
  const editing = !!member
  const [f, setF] = useState(() => ({
    name: member?.name ?? '', relationship: member?.relationship ?? '', dob: member?.dob?.slice(0, 10) ?? '', gender: member?.gender ?? '',
    mobile: member?.mobile ?? '', email: member?.email ?? '', anniversary: member?.anniversary?.slice(0, 10) ?? '',
  }))
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }))
  const { act, busy, error, fieldErrors } = useAct()
  const save = () => {
    const body = {
      name: f.name.trim(), relationship: f.relationship, dob: toApi(f.dob), gender: toApi(f.gender),
      mobile: f.mobile.replace(/\D/g, '').slice(-10) || null, email: f.email.trim() || null, anniversary: toApi(f.anniversary),
    }
    return act(
      () => (editing ? api.customers.updateFamily(customerId, member.id, { ...body, version: member.version }) : api.customers.addFamily(customerId, body)),
      { invalidates: CUSTOMER_CHANGED, onDone: onClose, quiet: true },
    )
  }
  return (
    <ActionDialog title={editing ? `Edit ${member.name}` : 'Add family member'} icon="user-plus" confirm={editing ? 'Save changes' : 'Add member'} busy={busy} error={error} onConfirm={save} onClose={onClose} width={600}
      disabled={!f.name.trim() || !f.relationship}>
      <div className="flex gap-3">
        <Field label="Full name *" value={f.name} onChange={set('name')} error={fieldErrors.name} />
        <Field label="Relationship *" type="select" value={f.relationship} onChange={set('relationship')} error={fieldErrors.relationship} options={['', ...(reference?.relationships ?? [])].map((r) => ({ value: r, label: r || 'Choose' }))} />
      </div>
      <div className="flex gap-3">
        <Field label="Date of birth" type="date" value={f.dob} onChange={set('dob')} error={fieldErrors.dob} />
        <Field label="Gender" type="select" value={f.gender} onChange={set('gender')} error={fieldErrors.gender} options={['', ...(reference?.genders ?? [])].map((g) => ({ value: g, label: g ? label(g) : 'Not given' }))} />
      </div>
      <div className="flex gap-3">
        <Field label="Mobile" value={f.mobile} onChange={set('mobile')} placeholder="10-digit number" error={fieldErrors.mobile} hint={editing && member.mobile !== (f.mobile || null) ? 'Changing the number resets WhatsApp and SMS consent for this person.' : undefined} />
        <Field label="Email" value={f.email} onChange={set('email')} error={fieldErrors.email} />
      </div>
      <Field label="Wedding anniversary" type="date" value={f.anniversary} onChange={set('anniversary')} error={fieldErrors.anniversary} />
    </ActionDialog>
  )
}

/* ═════════════ FM1 · Deactivate / activate a member ═════════════ */
export function FamilyStatusDialog({ customerId, member, onClose }) {
  const active = member.status === 'ACTIVE'
  const { act, busy, error } = useAct()
  const run = () => act(
    () => (active ? api.customers.deactivateFamily(customerId, member.id, { version: member.version }) : api.customers.activateFamily(customerId, member.id, { version: member.version })),
    { invalidates: CUSTOMER_CHANGED, onDone: onClose, quiet: true },
  )
  return (
    <ActionDialog title={active ? `Make ${member.name} inactive?` : `Make ${member.name} active again?`} icon={active ? 'x' : 'refresh'} tone={active ? 'danger' : 'navy'}
      body={active ? 'Greetings for them stop. Their documents and consent history stay. You can make them active again.' : 'They appear in the household again and can be added to quotations.'}
      confirm={active ? 'Make inactive' : 'Make active'} busy={busy} error={error} onConfirm={run} onClose={onClose} />
  )
}

/* ═════════════ FD3–FD5 + PD1 · Add a document, then check what was read ═════════════ */
const VERIFY = ['Aadhaar', 'PAN', 'Old policy']

export function AddDocumentDialog({ customer, people, presetPersonKey, onClose }) {
  const { reference } = useAuth()
  const accountTypes = useQuery('document-types', () => api.documents.accountTypes())
  const [f, setF] = useState({ personKey: presetPersonKey ?? people[0]?.key ?? '', type: '', name: '', saveAsType: false })
  const [file, setFile] = useState(null)
  const [saved, setSaved] = useState(null) // the document just uploaded → verify step
  const { act, busy, error, fieldErrors } = useAct()
  const types = (reference?.documentTypes ?? []).filter((t) => !(reference?.vehicleDocumentTypes ?? []).includes(t))
  const saved_ = (accountTypes.data ?? []).map((t) => t.name)
  const aadhaarTip = f.type === 'Aadhaar'

  const upload = () => act(async () => {
    const up = await api.files.upload(file, 'CUSTOMER_DOCUMENT')
    return api.documents.upload({ customerId: customer.id, personKey: f.personKey, type: f.type, name: f.type === 'Other' ? f.name.trim() : undefined, fileId: up.data.id, saveAsType: f.type === 'Other' ? f.saveAsType : undefined })
  }, { invalidates: ['documents', 'document-types', 'activity'], quiet: true, onDone: (r) => { if (r?.data?.verify) setSaved(r.data); else onClose() } })

  if (saved) return <VerifyDialog documentId={saved.id} customerId={customer.id} onClose={onClose} />
  return (
    <ActionDialog title="Add document" icon="upload" confirm="Upload" busy={busy} error={error} onConfirm={upload} onClose={onClose} width={600}
      disabled={!f.personKey || !f.type || !file || (f.type === 'Other' && !f.name.trim())}
      body="Choose whose document it is, what it is, then the file. Documents are never deleted: uploading again adds a new version.">
      <Field label="Whose document *" type="select" value={f.personKey} onChange={(v) => setF({ ...f, personKey: v })} options={people.map((p) => ({ value: p.key, label: `${p.name} · ${p.relationship}` }))} />
      <Field label="Which document *" type="select" value={f.type} onChange={(v) => setF({ ...f, type: v })} error={fieldErrors.type}
        options={['', ...types].map((t) => ({ value: t, label: t || 'Choose a document type' }))} />
      {f.type === 'Other' && (
        <>
          <Field label="Document name *" value={f.name} onChange={(v) => setF({ ...f, name: v })} error={fieldErrors.name} placeholder="e.g. Marriage certificate" />
          {saved_.length > 0 && <div className="flex flex-wrap gap-2">{saved_.map((n) => <button key={n} type="button" onClick={() => setF({ ...f, name: n })} className="rounded-[12px] bg-panel px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-tile">{n}</button>)}</div>}
          <Field type="checkbox" label="Keep this name to pick again next time" value={f.saveAsType} onChange={(v) => setF({ ...f, saveAsType: v })} />
        </>
      )}
      {aadhaarTip && <p className="rounded-[14px] bg-[#fbf1e1] px-3.5 py-3 text-[12px] font-semibold text-[#8a5a12]">Upload only a masked Aadhaar copy, with the first 8 digits hidden. Do not upload full Aadhaar numbers.</p>}
      <label className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-ink">File *</span>
        <span className="flex h-[50px] items-center gap-2.5 rounded-[16px] bg-panel px-4 text-[13px] font-semibold text-ink">
          <Icon name={file ? 'check' : 'folder'} size={16} className={file ? 'text-[#127650]' : 'text-muted'} />
          <span className="flex-1 truncate">{file ? file.name : 'Choose a file (PDF, JPG, PNG)'}</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </span>
        {fieldErrors.file && <span className="text-[12px] font-medium text-[#b4323c]">{fieldErrors.file}</span>}
      </label>
    </ActionDialog>
  )
}

const VERIFY_FIELDS = {
  Aadhaar: [['name', 'Name as printed *'], ['aadhaar', 'Aadhaar number (12 digits) *'], ['dob', 'Date of birth', 'date'], ['gender', 'Gender', 'gender']],
  PAN: [['name', 'Name as printed *'], ['pan', 'PAN *'], ['fatherName', "Father's name"], ['dob', 'Date of birth', 'date']],
  'Old policy': [['insurerId', 'Insurer *', 'insurer'], ['policyNumber', 'Policy number *'], ['productName', 'Product name'], ['startDate', 'Start date', 'date'], ['endDate', 'End date', 'date'], ['sumInsured', 'Sum insured (₹)', 'number'], ['premium', 'Premium (₹)', 'number']],
}

/** PD1 · Check document values. Reading runs in the background (CFG-38); if it fails the values are typed by hand (DOC-10). */
export function VerifyDialog({ documentId, customerId, onClose }) {
  const q = useQuery(['document', documentId], () => api.documents.get(documentId))
  const insurers = useQuery('insurer-catalogue', () => api.myInsurers.catalogue({}))
  const d = q.data
  // The reading is still running: ask again every 2 seconds until it is done or has failed.
  useEffect(() => {
    if (d?.readStatus !== 'PENDING') return undefined
    const t = setInterval(() => q.refetch(), 2000)
    return () => clearInterval(t)
  }, [d?.readStatus, q])
  const [vals, setVals] = useState(null)
  const [done, setDone] = useState(null)
  const { act, busy, error, fieldErrors } = useAct()
  const fields = VERIFY_FIELDS[d?.type] ?? []
  const current = useMemo(() => vals ?? (d ? Object.fromEntries(Object.entries(d.readValues ?? {}).map(([k, v]) => [k, v ?? ''])) : {}), [vals, d])
  const set = (k) => (v) => setVals({ ...current, [k]: v })

  if (!d) return <ActionDialog title="Check the document" icon="file" body={q.error ? q.error.message : 'Opening the document…'} onClose={onClose} />
  if (done) {
    return (
      <ActionDialog title={`${label(d.type)} confirmed`} icon="check" body="The checked values are saved with this version." onClose={onClose}>
        {done.identity?.copied && <p className="rounded-[14px] bg-[#e7f4ee] px-3.5 py-3 text-[12px] font-semibold text-[#127650]">The {done.identity.field === 'PAN' ? 'PAN' : 'Aadhaar number'} was also saved on the customer (shown masked).</p>}
        {done.identity?.differs && <p className="rounded-[14px] bg-[#fbf1e1] px-3.5 py-3 text-[12px] font-semibold text-[#8a5a12]">This document shows {done.identity.fromDocument}, but the customer already has {done.identity.current}. The customer was not changed. Use Edit details › identity if the customer’s number is wrong.</p>}
      </ActionDialog>
    )
  }
  const reading = d.readStatus === 'PENDING'
  const body = {}
  for (const [k, , kind] of fields) {
    const v = current[k]
    if (v === '' || v === undefined || v === null) continue
    body[k] = kind === 'number' ? Number(v) : v
  }
  if (d.type === 'Aadhaar' && body.aadhaar) body.aadhaar = String(body.aadhaar).replace(/\s/g, '')
  const confirm = () => act(() => api.documents.confirm(documentId, { rev: d.rev, values: body }), {
    invalidates: ['documents', 'document', 'customer', 'customers', 'activity'], quiet: true, onDone: (r) => setDone(r.data),
  })
  return (
    <ActionDialog title={`Check the ${label(d.type)} values`} icon="file" confirm="Confirm values" busy={busy || reading} error={error} onConfirm={confirm} onClose={onClose} width={640} disabled={reading}
      body={reading ? 'Reading the document… this takes a few seconds. You can also wait here.' : d.message}>
      {d.file && <a href={api.files.url(d.file.id)} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] font-semibold text-blue"><Icon name="file" size={15} />Open the uploaded file</a>}
      <div className="grid grid-cols-2 gap-3">
        {fields.map(([k, lbl, kind]) => (
          <Field key={k} label={lbl} value={current[k] ?? ''} onChange={set(k)} error={fieldErrors[k]} disabled={reading}
            type={kind === 'date' ? 'date' : kind === 'number' ? 'number' : kind ? 'select' : 'text'}
            options={kind === 'gender' ? ['', ...(['MALE', 'FEMALE', 'TRANSGENDER', 'PREFER_NOT_TO_SAY'])].map((g) => ({ value: g, label: g ? label(g) : 'Not given' }))
              : kind === 'insurer' ? [{ value: '', label: 'Choose an insurer' }, ...((insurers.data ?? []).map((i) => ({ value: i.id, label: i.name })))] : undefined} />
        ))}
      </div>
      <p className="text-[12px] font-medium text-muted">Nothing read from a document is used anywhere until you confirm it.</p>
    </ActionDialog>
  )
}

/* ═════════════ DL1 + PD2 · Versions of one document and label change ═════════════ */
export function DocumentVersionsDialog({ group, onClose, canRelabel = true }) {
  const [editing, setEditing] = useState(null) // the version whose label is being changed
  const [text, setText] = useState('')
  const { act, busy, error, fieldErrors } = useAct()
  const rename = () => act(() => api.documents.setLabel(editing.id, { rev: editing.rev, label: text.trim() }), { invalidates: ['documents', 'document', 'activity'], quiet: true, onDone: () => setEditing(null) })
  return (
    <ActionDialog title={`${group.name || label(group.type)} · ${group.personName}`} icon="folder" body="Every upload is kept as its own version. Nothing is replaced or deleted." onClose={onClose} width={640}>
      <div className="flex flex-col gap-2">
        {group.versions.map((v) => (
          <div key={v.id} className="flex items-center gap-3 rounded-[16px] bg-panel p-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-[13px] font-bold text-ink">Version {v.version} · {v.label}</p>
              <p className="truncate text-[12px] font-medium text-muted">{v.originalName} · uploaded {fmtDateTime(v.uploadedAt)} · {label(v.status)}</p>
            </div>
            {v.file && <a href={api.files.url(v.file.id)} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-blue">Open</a>}
            {canRelabel && <button type="button" className="text-[12px] font-semibold text-ink underline" onClick={() => { setEditing(v); setText(v.label) }}>Change label</button>}
          </div>
        ))}
      </div>
      {editing && (
        <div className="flex flex-col gap-3 rounded-[16px] border border-line p-3.5">
          <Field label={`New label for version ${editing.version}`} value={text} onChange={setText} error={fieldErrors.label} />
          <ErrorNote error={error && !fieldErrors.label ? error : null} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(null)} className="h-[38px] flex-1 rounded-[20px] border border-line text-[13px] font-semibold text-ink">Cancel</button>
            <button type="button" disabled={busy || !text.trim()} onClick={rename} className="h-[38px] flex-1 rounded-[20px] bg-navy text-[13px] font-semibold text-white disabled:opacity-60">{busy ? 'Saving…' : 'Save label'}</button>
          </div>
        </div>
      )}
    </ActionDialog>
  )
}

export const needsCheck = (v) => v && v.status === 'UNCONFIRMED' && VERIFY.includes(v.type)

/* ═════════════ PF1 · Default nominee ═════════════ */
export function DefaultNomineeDialog({ customer, onClose }) {
  const { reference } = useAuth()
  const q = useQuery(['default-nominee', customer.id], () => api.customers.defaultNominee(customer.id))
  const n = q.data?.defaultNominee
  const [f, setF] = useState(null)
  const cur = f ?? { name: n?.name ?? '', relationship: n?.relationship ?? '', dob: n?.dob?.slice(0, 10) ?? '', appointeeName: n?.appointee?.name ?? '', appointeeDob: n?.appointee?.dob?.slice(0, 10) ?? '' }
  const set = (k) => (v) => setF({ ...cur, [k]: v })
  const { act, busy, error, fieldErrors } = useAct()
  const save = (remove) => act(() => api.customers.setDefaultNominee(customer.id, {
    version: q.data.version,
    nominee: remove ? null : { name: cur.name.trim(), relationship: cur.relationship, dob: cur.dob, appointeeName: cur.appointeeName.trim() || null, appointeeDob: cur.appointeeDob || null },
  }), { invalidates: ['default-nominee', 'customer', 'customers', 'activity'], quiet: true, onDone: onClose })
  if (!q.data) return <ActionDialog title="Default nominee" icon="user" body={q.error ? q.error.message : 'Loading…'} onClose={onClose} />
  return (
    <ActionDialog title="Default nominee" icon="user" confirm="Save default nominee" busy={busy} error={error} onConfirm={() => save(false)} onClose={onClose} width={600}
      disabled={!cur.name.trim() || !cur.relationship || !cur.dob}
      body={`New proposals for ${customer.name} start with this nominee at 100%. You can still change them on each proposal.`}>
      <div className="flex gap-3">
        <Field label="Nominee name *" value={cur.name} onChange={set('name')} error={fieldErrors['nominee.name']} />
        <Field label="Relationship *" type="select" value={cur.relationship} onChange={set('relationship')} options={['', ...(reference?.relationships ?? [])].map((r) => ({ value: r, label: r || 'Choose' }))} />
      </div>
      <Field label="Date of birth *" type="date" value={cur.dob} onChange={set('dob')} error={fieldErrors['nominee.dob']} />
      <div className="flex gap-3">
        <Field label="Appointee name (if nominee is a minor)" value={cur.appointeeName} onChange={set('appointeeName')} error={fieldErrors['nominee.appointeeName']} />
        <Field label="Appointee date of birth" type="date" value={cur.appointeeDob} onChange={set('appointeeDob')} error={fieldErrors['nominee.appointeeDob']} />
      </div>
      {n && <button type="button" onClick={() => save(true)} disabled={busy} className="self-start text-[13px] font-semibold text-[#b4323c] underline">Remove the default nominee</button>}
    </ActionDialog>
  )
}

/* ═════════════ PF2 · Link a policy holder ═════════════ */
export function LinkHolderDialog({ customer, onClose }) {
  const { reference } = useAuth()
  const [search, setSearch] = useState('')
  const found = useQuery(['customers', 'link-search', search], () => api.customers.list({ search, status: 'ACTIVE', limit: 8 }), { enabled: search.trim().length >= 2 })
  const [picked, setPicked] = useState(null)
  const [relationship, setRelationship] = useState('')
  const { act, busy, error, fieldErrors } = useAct()
  const rows = (found.data ?? []).filter((c) => c.id !== customer.id)
  const link = () => act(() => api.customers.addLink(customer.id, { linkedCustomerId: picked.id, relationship }), { invalidates: ['links', 'activity'], quiet: true, onDone: onClose })
  return (
    <ActionDialog title="Link a policy holder" icon="users" confirm="Link" busy={busy} error={error} onConfirm={link} onClose={onClose} disabled={!picked || !relationship}
      body={`Link another policy holder of yours to ${customer.name}, for example a spouse who has their own policies. Nothing is shared between the two records.`}>
      <Field label="Search by name, mobile or number" value={search} onChange={(v) => { setSearch(v); setPicked(null) }} />
      {rows.length > 0 && !picked && (
        <div className="flex flex-col gap-1.5">
          {rows.map((c) => (
            <button key={c.id} type="button" onClick={() => setPicked(c)} className="flex items-center gap-3 rounded-[14px] bg-panel px-3.5 py-2.5 text-left hover:bg-tile">
              <span className="flex-1 text-[13px] font-bold text-ink">{c.name}</span><span className="text-[12px] font-medium text-muted">{c.number}</span>
            </button>
          ))}
        </div>
      )}
      {search.trim().length >= 2 && !found.loading && !rows.length && !picked && <p className="text-[12px] font-medium text-muted">No active policy holder matches.</p>}
      {picked && <p className="rounded-[14px] bg-[#e7f4ee] px-3.5 py-2.5 text-[13px] font-semibold text-[#127650]">{picked.name} · {picked.number}</p>}
      <Field label={`${picked?.name ?? 'They'} is ${customer.name}’s … *`} type="select" value={relationship} onChange={setRelationship} error={fieldErrors.relationship}
        options={['', ...(reference?.relationships ?? [])].map((r) => ({ value: r, label: r || 'Choose a relationship' }))} />
      {fieldErrors.linkedCustomerId && <p className="text-[12px] font-semibold text-[#b4323c]">{fieldErrors.linkedCustomerId}</p>}
    </ActionDialog>
  )
}

export function UnlinkButton({ customer, link }) {
  const { act, busy } = useAct()
  return (
    <button type="button" disabled={busy} className="text-[12px] font-semibold text-[#b4323c] underline"
      onClick={() => act(() => api.customers.removeLink(customer.id, link.id), { invalidates: ['links', 'activity'] })}>Remove link</button>
  )
}

