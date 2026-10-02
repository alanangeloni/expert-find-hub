
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

const root = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Only hydrate when the root already has real SSR markup. The default build
// leaves `<!--app-html-->` in #root, and hydrateRoot against that empty shell
// triggers React #418 / #423 mismatches on auth and layout chrome.
const hasSSRMarkup = Array.from(root.childNodes).some(
  (node) => node.nodeType === Node.ELEMENT_NODE
);

if (import.meta.env.PROD && hasSSRMarkup) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
