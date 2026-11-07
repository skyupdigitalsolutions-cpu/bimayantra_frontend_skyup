// Figma 55:8054 · 05a · Customer — Family
import { useState } from 'react'
import { ProfileShell, FamilyBody } from './_parts'
import { useHeaderSearch } from './_search'

export default function CustomerFamily() {
  const [q, setQ] = useState('')
  useHeaderSearch(setQ)
  return (
    <ProfileShell tab="family" crumb="FAMILY">
      <FamilyBody query={q} onClearQuery={() => setQ('')} />
    </ProfileShell>
  )
}
