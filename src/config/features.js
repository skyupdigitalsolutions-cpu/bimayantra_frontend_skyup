// Product switches set at build time (.env: VITE_…). They must match the API's settings.
/** P-56 prepaid WhatsApp wallet. Hidden unless VITE_WHATSAPP_WALLET=true (and WHATSAPP_WALLET=true on the API). */
export const WALLET_ENABLED = import.meta.env.VITE_WHATSAPP_WALLET === 'true'
