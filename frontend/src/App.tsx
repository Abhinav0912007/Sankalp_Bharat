import AppRouter from './router';
import './index.css';

// ============================================================
// CarbonLens — App Entry Point
// ============================================================
// All routing, auth state, and layout are handled by AppRouter.
// index.css loads the global design system.
// ============================================================

export default function App() {
  return <AppRouter />;
}
