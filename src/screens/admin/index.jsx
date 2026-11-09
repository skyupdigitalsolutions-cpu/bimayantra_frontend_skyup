import { lazy } from 'react'
import { Route } from 'react-router-dom'

const SA = lazy(() => import('./SA'))
const SP = lazy(() => import('./SP'))  
const SK = lazy(() => import('./SK'))
const SI = lazy(() => import('./SI'))
const SC = lazy(() => import('./SC'))
const SX = lazy(() => import('./SX'))
const SF = lazy(() => import('./SF'))
const ST = lazy(() => import('./ST'))
const SL = lazy(() => import('./SL'))
const SW = lazy(() => import('./SW'))
const SS = lazy(() => import('./SS'))
const SU = lazy(() => import('./SU'))
const SG = lazy(() => import('./SG'))
const SY = lazy(() => import('./SY'))
const SN = lazy(() => import('./SN'))
const SZ = lazy(() => import('./SZ'))

export default [
  <Route index element={<SA />} />,
  <Route path="products/*" element={<SP />} />,
  <Route path="kyc/*" element={<SK />} />,
  <Route path="insurers/*" element={<SI />} />,
  <Route path="categories/*" element={<SC />} />,
  <Route path="taxes/*" element={<SX />} />,
  <Route path="flags/*" element={<SF />} />,
  <Route path="templates/*" element={<ST />} />,
  <Route path="plans/*" element={<SL />} />,
  <Route path="wallets/*" element={<SW />} />,
  <Route path="support/*" element={<SS />} />,
  <Route path="users/*" element={<SU />} />,
  <Route path="config/*" element={<SG />} />,
  <Route path="audit/*" element={<SY />} />,
  <Route path="notifications/*" element={<SN />} />,
  <Route path="auth/*" element={<SZ />} />,
]
