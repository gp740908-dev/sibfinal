
import React from 'react';
import { JsonLd } from './JsonLd';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbsSchemaProps {
    items: BreadcrumbItem[];
}

export const BreadcrumbsSchema: React.FC<BreadcrumbsSchemaProps> = ({ items }) => {
    const breadcrumbListSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `https://stayinubud.com${item.url}`,
        })),
    };

    return <JsonLd data={breadcrumbListSchema} />;
};
