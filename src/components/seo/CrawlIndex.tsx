import { Link } from "react-router-dom";

export interface CrawlIndexItem {
  href: string;
  label: string;
}

interface CrawlIndexProps {
  title: string;
  items: CrawlIndexItem[];
}

/** Visible, crawlable list of in-app links. Survives JS rendering unlike "Load more" buttons. */
export const CrawlIndex = ({ title, items }: CrawlIndexProps) => {
  if (!items.length) return null;
  return (
    <details className="crawl-index">
      <summary>
        {title} ({items.length})
      </summary>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link to={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default CrawlIndex;
