// Shared bits for Flow · Comparison (Figma C2 42:5439 / C3 42:5644).
import AppLayout from '../../components/AppLayout'
import { PageHeader } from '../../components/ui'
import { Pill } from '../flow-comparative/_parts'
import { COMPARISON_NO } from '../../data/comparison'
import { useHeaderSearch } from '../customer-tabs/_search'

export { Btn, Pill, card } from '../flow-comparative/_parts'

export default function ComparisonPage({ chip, subtitle, actions, children }) {
  useHeaderSearch() // Ctrl/Cmd+K focuses the header search pill
  return (
    <AppLayout active="quotations">
      <PageHeader breadcrumb={`QUOTATIONS  /  ${COMPARISON_NO}`} title={COMPARISON_NO} titleExtra={chip} subtitle={subtitle} actions={actions} />
      {children}
    </AppLayout>
  )
}

export const SharedChip = () => <Pill tone="blue" icon="send">Shared</Pill>
