// Figma 246:19933 · PE2 · PAN shown (30 seconds)
import { useEffect, useState } from 'react'
import { OverviewPage } from './_parts'

export default function PanShown() {
  const [secs, setSecs] = useState(28)
  useEffect(() => {
    if (secs == null || secs <= 0) return
    const t = setTimeout(() => setSecs((s) => (s <= 1 ? null : s - 1)), 1000)
    return () => clearTimeout(t)
  }, [secs])
  return <OverviewPage pan={secs} onShowPan={() => setSecs(30)} />
}
