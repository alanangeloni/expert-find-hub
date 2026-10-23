import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import App from './App';

// Query results shared across every prerendered route, so the full advisor
// list (and other shared data) is fetched once per build instead of per page.
const sharedResults = new Map<string, Promise<unknown>>();

const MAX_PASSES = 4;

/**
 * Renders a route to HTML with its data loaded. Pages fetch through React
 * Query; on the server those queries are registered but never fetched, so we
 * render, fetch whatever is pending, and render again until nothing is left.
 */
export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });

  const tree = (helmetContext: any) => (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App queryClient={queryClient} />
      </StaticRouter>
    </HelmetProvider>
  );

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    ReactDOMServer.renderToString(tree({}));
    const pending = queryClient
      .getQueryCache()
      .getAll()
      .filter((q) => q.state.status === 'pending' && q.state.fetchStatus === 'idle' && q.options.queryFn);
    if (!pending.length) break;
    await Promise.allSettled(
      pending.map(async (q) => {
        let result = sharedResults.get(q.queryHash);
        if (!result) {
          result = q.fetch().then(() => {
            if (q.state.status !== 'success') throw new Error('query failed');
            return q.state.data;
          });
          sharedResults.set(q.queryHash, result);
          result.catch(() => sharedResults.delete(q.queryHash));
          await result;
        } else {
          queryClient.setQueryData(q.queryKey, await result);
        }
      })
    );
  }

  const helmetContext: any = {};
  const appHtml = ReactDOMServer.renderToString(tree(helmetContext));
  const helmet = helmetContext.helmet;
  // Head metadata comes from seo-lib; only structured data is taken from the page.
  const scriptTags = helmet?.script?.toString?.() || '';
  const state = dehydrate(queryClient);

  return { appHtml, scriptTags, state };
}
