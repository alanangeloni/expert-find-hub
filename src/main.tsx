import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, hydrate } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();
const prerendered = (window as any).__RQ_STATE__;
const samePath = ((window as any).__PRERENDER_PATH__ || '').replace(/\/+$/, '') === window.location.pathname.replace(/\/+$/, '');
if (prerendered && samePath) hydrate(queryClient, prerendered);

const root = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <BrowserRouter>
      <App queryClient={queryClient} />
    </BrowserRouter>
  </HelmetProvider>
);

// Only hydrate when the root already has real prerendered markup.
// The homepage file also serves as the fallback for unlisted routes (admin,
// sign-in), so hydrate only when the markup was rendered for this exact path.
const normalize = (p: string) => p.replace(/\/+$/, '') || '/';
const hasSSRMarkup =
  normalize((window as any).__PRERENDER_PATH__ || '') === normalize(window.location.pathname) &&
  Array.from(root.childNodes).some((node) => node.nodeType === Node.ELEMENT_NODE);
if (!hasSSRMarkup) root.innerHTML = '';

if (import.meta.env.PROD && hasSSRMarkup) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
