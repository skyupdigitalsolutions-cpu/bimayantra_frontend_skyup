// Figma 238:18135 · FD2 · Family — member added
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { ProfileShell, FamilyBody } from './_parts'

export default function FamilyMemberAdded() {
  return (
    <ProfileShell
      tab="family"
      crumb="FAMILY"
      counts={{ family: 4 }}
      panelClass="min-h-[1071px]"
      overlay={
        <Link
          to="/x/fd3-add-document-whose-document"
          data-overlay="toast"
          role="status"
          className="fixed bottom-[52px] left-[536px] z-30 flex h-12 items-center gap-2.5 rounded-[18px] bg-navy px-4 py-3 shadow-[0px_16px_30px_-8px_rgba(19,41,75,0.3)]"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-[#16845b] text-white">
            <Icon name="check" size={13} />
          </span>
          <span className="text-[13px] font-semibold text-white">Rohan Hegde added to the household</span>
          <span className="text-[13px] font-bold text-[#f7b9c4]">Add document</span>
        </Link>
      }
    >
      <FamilyBody links={false} added />
    </ProfileShell>
  )
}
