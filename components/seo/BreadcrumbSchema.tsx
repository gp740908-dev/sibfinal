'use client';

import { JsonLd } from './JsonLd';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbSchemaProps {
    items: BreadcrumbItem[];
}

/**
 * BreadcrumbSchema - Generates JSON-LD BreadcrumbList for Google Search
 * 
 * Usage:
 * <BreadcrumbSchema items={[
 *   { name: 'Home', url: 'https://stayinubud.com' },
 *   { name: 'Villas', url: 'https://stayinubud.com/villas' },
 *   { name: 'Villa Niskala', url: 'https://stayinubud.com/villas/123' },
 * ]} />
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return <JsonLd data={breadcrumbSchema} />;
}

// Helper function to generate breadcrumb items
export function generateBreadcrumbs(
    path: string,
    currentPageName: string,
    baseUrl: string = 'https://stayinubud.com'
): BreadcrumbItem[] {
    const segments = path.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ name: 'Home', url: baseUrl }];

    let currentPath = '';

    // Add intermediate segments
    segments.slice(0, -1).forEach((segment) => {
        currentPath += `/${segment}`;
        const name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        items.push({ name, url: `${baseUrl}${currentPath}` });
    });

    // Add current page
    if (segments.length > 0) {
        items.push({
            name: currentPageName,
            url: `${baseUrl}${path}`,
        });
    }

    return items;
}
