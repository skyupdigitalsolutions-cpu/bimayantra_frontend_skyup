// Mappers: API objects → the view models the Figma screens already render (same keys as src/data/*.js).
import { avatarClass, avatarHex, fmtDate, fmtMobile, fmtShortWhen, fmtWhen, initials, titleCase, daysFromToday, STATUS_TO_STAGE } from '../api/format'

/* ───────── tasks ───────── */
const TASK_ICON = {
  CALL: ['phone', 'bg-[#d9eafd]'], MEETING: ['users', 'bg-[#d4f1e7]'], FOLLOW_UP: ['clock', 'bg-[#fde8c9]'],
  COLLECT_DOCUMENTS: ['folder', 'bg-[#fde8c9]'], RENEWAL: ['refresh', 'bg-[#e9e3fc]'], OTHER: ['check', 'bg-[#eef1f5]'],
}
export const TASK_TYPE_LABEL = { CALL: 'Call', MEETING: 'Meeting', FOLLOW_UP: 'Follow-up', COLLECT_DOCUMENTS: 'Collect documents', RENEWAL: 'Renewal', OTHER: 'Other' }
export const TASK_TYPE_CODE = Object.fromEntries(Object.entries(TASK_TYPE_LABEL).map(([k, v]) => [v, k]))

export function taskView(t) {
  const done = t.status === 'DONE'
  const type = t.taskType || (t.kind === 'LEAD_FOLLOW_UP' ? 'FOLLOW_UP' : 'OTHER')
  const [icon, iconBg] = done ? ['check', 'bg-[#e7f4ee]'] : t.overdue ? [TASK_ICON[type][0], 'bg-[#fbebec]'] : TASK_ICON[type] || TASK_ICON.OTHER
  const who = t.linked?.name ?? '—'
  return {
    id: t.id, version: t.version, raw: t, done,
    title: t.title, priority: titleCase(t.priority || 'MEDIUM'), icon, iconBg,
    who, whoKind: t.linked ? (t.linked.type === 'LEAD' ? 'Lead' : 'Policy holder') : 'No record',
    initials: initials(who), avBg: avatarClass(who),
    to: t.linked ? (t.linked.type === 'LEAD' ? `/leads/${t.linked.id}` : `/customers/${t.linked.id}`) : '/tasks',
    when: done ? `Done ${fmtDate(t.doneAt, { year: false })}` : fmtWhen(t.dueAt),
    time: fmtShortWhen(t.dueAt),
  }
}

/* ───────── leads ───────── */
const SOURCE_TONE = {
  META_ADS: 'blue', GOOGLE_ADS: 'high', LINKEDIN_ADS: 'blue', WEBSITE: 'violet', WEBSITE_FORM: 'violet', SOCIAL_MEDIA: 'gray',
  REFERRED_BY_CLIENT: 'green', REFERRED_BY_REFERRER: 'green', WALK_IN: 'amber', CAMPAIGN: 'gray', MANUAL_ENTRY: 'gray', OTHER: 'gray',
}
export const sourceTone = (code) => SOURCE_TONE[code] || 'gray'

/** Board card (sales/_parts LeadCard): { id, stage, initials, avatar, name, phone, note, chips, source } */
export function leadCardView(l) {
  const chips = []
  const d = l.nextFollowUpAt ? daysFromToday(l.nextFollowUpAt) : null
  if (d !== null && d < 0 && l.status !== 'CONVERTED' && l.status !== 'LOST') chips.push({ tone: 'red', icon: 'clock', label: `Overdue · ${fmtDate(l.nextFollowUpAt, { year: false })}` })
  else if (daysFromToday(l.createdAt) === 0) chips.push({ tone: 'blue', label: 'New today' })
  chips.push({ tone: l.priority === 'HIGH' ? 'high' : 'gray', label: titleCase(l.priority) })
  return {
    id: l.id, pipeline: l.pipelineId, stage: STATUS_TO_STAGE[l.status], status: l.status, version: l.version,
    initials: initials(l.name), avatar: avatarHex(l.name), name: l.name, phone: fmtMobile(l.mobile),
    note: l.notes || (l.interests?.length ? `Interested in ${l.interests.join(', ')}` : l.number),
    chips, source: { tone: sourceTone(l.sourceCode), label: l.source },
    allowedMoves: l.allowedMoves || [], raw: l,
  }
}

/* ───────── activity (audit actions) ───────── */
const CHIP = { blue: 'bg-[#e8f0fd] text-[#1f5fd6]', green: 'bg-[#e7f4ee] text-[#127650]', violet: 'bg-[#f0ecfb] text-[#5b3fb8]' }
const ACTIVITY = {
  LEAD_CREATED: ['New lead created', 'user-plus', 'bg-[#d9eafd]', ['New', CHIP.blue]],
  LEAD_STATUS_CHANGED: ['Lead status changed', 'refresh', 'bg-[#e9e3fc]'],
  LEAD_REOPENED: ['Lead reopened', 'refresh', 'bg-[#e9e3fc]'],
  LEAD_CONVERTED: ['Lead converted to policy holder', 'users', 'bg-[#d4f1e7]', ['Converted', CHIP.green]],
  LEAD_CONTACT_LOGGED: ['Contact logged', 'phone', 'bg-[#fde8c9]'],
  CUSTOMER_CREATED: ['Policy holder added', 'users', 'bg-[#d4f1e7]'],
  CUSTOMER_DEACTIVATED: ['Policy holder deactivated', 'x', 'bg-[#eef1f5]'],
  CUSTOMER_REACTIVATED: ['Policy holder reactivated', 'refresh', 'bg-[#d4f1e7]'],
  FAMILY_MEMBER_ADDED: ['Family member added', 'user-plus', 'bg-[#e9e3fc]'],
  DOCUMENT_UPLOADED: ['Document uploaded', 'folder', 'bg-[#fde8c9]'],
  DOCUMENT_CONFIRMED: ['Document verified', 'check', 'bg-[#e7f4ee]'],
  VEHICLE_ADDED: ['Vehicle added', 'car', 'bg-[#d9eafd]'],
  VEHICLE_MARKED_SOLD: ['Vehicle marked inactive', 'car', 'bg-[#eef1f5]'],
  VEHICLE_REACTIVATED: ['Vehicle active again', 'car', 'bg-[#d9eafd]'],
  TASK_CREATED: ['Task created', 'calendar', 'bg-[#fde8c9]'],
  TASK_DONE: ['Task completed', 'check', 'bg-[#e7f4ee]'],
  KYC_SUBMITTED: ['KYC submitted', 'shield', 'bg-[#e9e3fc]', ['Submitted', CHIP.violet]],
  KYC_RESUBMITTED_AFTER_VERIFIED: ['KYC resubmitted', 'shield', 'bg-[#e9e3fc]'],
  KYC_VERIFIED: ['KYC verified', 'shield', 'bg-[#d4f1e7]', ['Verified', CHIP.green]],
  KYC_REJECTED: ['KYC rejected', 'alert', 'bg-[#fbebec]'],
  INSURER_MAPPING_ADDED: ['Insurer added', 'shield', 'bg-[#d9eafd]'],
  ASSISTANT_ADDED: ['Assistant added', 'user-plus', 'bg-[#e9e3fc]'],
}
/** GET /dashboard/recent-activity → { activities (grouped, desktop), activitiesCompact } */
export function activityViews(events = []) {
  const rows = events.map((e) => {
    const [title, icon, bg, chip] = ACTIVITY[e.action] || [e.title || titleCase(e.action), 'refresh', 'bg-[#eef1f5]']
    const who = [e.name, e.detail].filter(Boolean).join(' · ') || e.ref || titleCase(e.entity)
    return { title: e.title || title, icon, bg, chip, who, at: e.at }
  })
  const group = (at) => { const d = daysFromToday(at); return d === 0 ? 'TODAY' : d === -1 ? 'YESTERDAY' : 'EARLIER' }
  const activities = []
  let last = null
  for (const r of rows) {
    const g = group(r.at)
    if (g !== last) { activities.push({ group: g }); last = g }
    activities.push({ title: r.title, who: r.who, at: `· ${g === 'EARLIER' ? fmtDate(r.at, { year: false }) : fmtShortWhen(r.at)}`, icon: r.icon, bg: r.bg, chip: r.chip })
  }
  const activitiesCompact = rows.slice(0, 4).map((r) => ({
    icon: r.icon, bg: r.bg, t: `${r.title} · ${r.who}`, ts: fmtShortWhen(r.at), m: r.title, ms: `${r.who} · ${fmtShortWhen(r.at)}`,
  }))
  return { activities, activitiesCompact }
}
/* ───────── customer profile tabs ───────── */
const TAB_PATH = { overview: '', family: '/family', consent: '/consent', documents: '/documents', vehicles: '/vehicles', quotations: '/quotations', policies: '/policies', payments: '/payments', renewals: '/renewals', activities: '/activities' }
/** Path of a customer profile tab (connected pages). */
export const customerTabPath = (id, key) => `/customers/${id}${TAB_PATH[key] ?? ''}`