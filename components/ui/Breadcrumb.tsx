'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
    items?: { label: string; href: string }[];
    className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
    const pathname = usePathname();

    // Generate crumbs from pathname if no items provided
    const generateCrumbs = () => {
        if (items) return items;

        const asPathWithoutQuery = pathname.split('?')[0];
        const asPathNestedRoutes = asPathWithoutQuery.split('/').filter(v => v.length > 0);

        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
            const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
            const label = subpath.charAt(0).toUpperCase() + subpath.slice(1).replace(/-/g, ' ');
            return { href, label };
        });

        return [{ href: '/', label: 'Home' }, ...crumblist];
    };

    const crumbs = generateCrumbs();

    return (
        <nav aria-label="Breadcrumb" className={`animate-fade-in ${className}`}>
            <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-sans uppercase tracking-widest">
                {crumbs.map((crumb, idx) => {
                    const isLast = idx === crumbs.length - 1;

                    return (
                        <li key={crumb.href} className="flex items-center">
                            {idx > 0 && <ChevronRight size={12} className="text-forest/30 mx-2" />}

                            {isLast ? (
                                <span className="font-bold text-forest border-b border-forest/20 pb-0.5" aria-current="page">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="text-forest/60 hover:text-forest transition-colors flex items-center gap-1"
                                >
                                    {idx === 0 && <Home size={12} className="mb-0.5" />}
                                    {idx !== 0 && crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
