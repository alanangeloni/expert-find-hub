import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, hydrate } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();
const prerendered = (window as any).__RQ_STATE__;
if (prerendered) hydrate(queryClient, prerendered);

const root = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App queryClient={queryClient} />
    </BrowserRouter>
  </HelmetProvider>
);

// Only hydrate when the root already has real prerendered markup.
const hasSSRMarkup = Array.from(root.childNodes).some(
  (node) => node.nodeType === Node.ELEMENT_NODE
);

if (import.meta.env.PROD && hasSSRMarkup) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
