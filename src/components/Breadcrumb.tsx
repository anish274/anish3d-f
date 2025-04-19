import Link from 'next/link';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 mx-1 text-zinc-400" />
            )}
            {item.isCurrent ? (
              <span className="text-sm font-medium text-primary" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};