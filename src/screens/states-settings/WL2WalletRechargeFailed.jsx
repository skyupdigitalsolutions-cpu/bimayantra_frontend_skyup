// Figma 287:37475 · WL2 · Wallet — Recharge failed
import { WalletPage, Toast } from './_parts'

export default function WL2WalletRechargeFailed() {
  return <WalletPage failed overlay={<Toast>Recharge failed. Nothing was charged.</Toast>} />
}
