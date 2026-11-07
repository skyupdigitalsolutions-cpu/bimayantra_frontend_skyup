// Figma 55:8652 · 05c · Customer — Documents
import { Fragment, useState } from 'react'
import Icon from '../../components/Icon'
import { cx } from '../../components/ui'
import { ProfileShell, PillButton, SChip, Head, Note, CARD_SHADOW } from './_parts'
import { documentGroups } from '../../data/customer-tabs'
import { useHeaderSearch, matches, NoMatches } from './_search'

export default function CustomerDocuments() {
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  const groups = documentGroups
    .map((g) => ({ ...g, docs: g.docs.filter((d) => matches(q, g.owner, d.title, d.sub, d.chip[2])) }))
    .filter((g) => g.docs.length)
  return (
    <ProfileShell tab="documents" crumb="DOCUMENTS">
      <Note icon="alert" bg="#fbf1e1" color="#8a5a12">
        Missing for Shanta Hegde: Aadhaar and PAN. Needed before a proposal that covers her.
      </Note>

      <div className="mt-6 flex items-start gap-5">
        <section className={cx('flex w-[760px] flex-col gap-3 rounded-[28px] bg-white p-6', CARD_SHADOW)}>
          <Head title="Documents" sub="Never deleted. A new upload of the same type adds a version." />
          {groups.map((g) => (
            <Fragment key={g.owner}>
              <p className="text-[11px] font-bold tracking-[0.4px] text-muted">{g.owner}</p>
              {g.docs.map((d) => (
                <div key={d.title} className="flex h-20 items-center gap-3.5 rounded-[18px] bg-panel p-3.5">
                  <span className="flex h-[52px] w-11 shrink-0 items-center justify-center rounded-[12px] text-ink" style={{ background: d.bg }}>
                    <Icon name="folder" size={18} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5 whitespace-nowrap">
                    <p className="text-[14px] font-bold text-ink">{d.title}</p>
                    <p className="text-[12px] font-medium text-muted">{d.sub}</p>
                  </div>
                  <SChip tone={d.chip[0]} icon={d.chip[1]}>{d.chip[2]}</SChip>
                  {d.check && <PillButton variant="navy" size="sm" className="px-3.5" to="/x/pd1-check-document-values">Check values</PillButton>}
                  <PillButton variant="ghost" size="sm" icon="list" to="/x/pd2-document-versions">Versions</PillButton>
                </div>
              ))}
            </Fragment>
          ))}
          {!groups.length && <NoMatches label={`No documents match “${q}”`} onClear={() => setQ('')} />}
        </section>

        <section className="flex w-[400px] flex-col items-center gap-3 rounded-[28px] border border-dashed border-[#c3ccd8] bg-white p-7">
          <span className="flex size-[60px] items-center justify-center rounded-full bg-[#e8f0fd] text-blue">
            <Icon name="upload" size={26} />
          </span>
          <p className="text-[16px] font-bold text-ink">Upload a document</p>
          <p className="text-[12px] font-medium text-muted">PDF, JPG or PNG · file or camera</p>
          <div className="flex gap-2">
            <PillButton variant="navy" size="sm" icon="folder" to="/x/fd3-add-document-whose-document">Choose file</PillButton>
            <PillButton variant="outline" size="sm" icon="phone" to="/x/fd3-add-document-whose-document">Camera</PillButton>
          </div>
        </section>
      </div>
    </ProfileShell>
  )
}
