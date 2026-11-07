// Screens for this section. Each entry: { id, name, figma, path, Component }
import AddFamilyMember from './AddFamilyMember'
import FamilyMemberAdded from './FamilyMemberAdded'
import AddDocumentWhose from './AddDocumentWhose'
import AddDocumentWhich from './AddDocumentWhich'
import AddDocumentUpload from './AddDocumentUpload'
import ArjunDocuments from './ArjunDocuments'

export default [
  { id: 'fd1', name: 'FD1 · Add family member', figma: '238:17768', path: '/x/fd1-add-family-member', Component: AddFamilyMember },
  { id: 'fd2', name: 'FD2 · Family — member added', figma: '238:18135', path: '/x/fd2-family-member-added', Component: FamilyMemberAdded },
  { id: 'fd3', name: 'FD3 · Add document — Whose document', figma: '239:18072', path: '/x/fd3-add-document-whose-document', Component: AddDocumentWhose },
  { id: 'fd4', name: 'FD4 · Add document — Which document', figma: '239:18427', path: '/x/fd4-add-document-which-document', Component: AddDocumentWhich },
  { id: 'fd5', name: 'FD5 · Add document — Upload', figma: '239:18868', path: '/x/fd5-add-document-upload', Component: AddDocumentUpload },
  { id: 'fd6', name: 'FD6 · Arjun Hegde — documents', figma: '239:19269', path: '/x/fd6-arjun-hegde-documents', Component: ArjunDocuments },
]
