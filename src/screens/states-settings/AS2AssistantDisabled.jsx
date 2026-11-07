// Figma 287:38648 · AS2 · Assistant — Disabled
import { AssistantsPage, Toast } from './_parts'

export default function AS2AssistantDisabled() {
  return <AssistantsPage disabled overlay={<Toast>Priya K disabled · all sessions ended</Toast>} />
}
