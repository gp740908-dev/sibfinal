
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'StayinUBUD',
        short_name: 'StayinUBUD',
        description: 'Experience the ultimate Bali getaway. Luxury private pool villas in the heart of the Ubud jungle.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F4F1EA',
        theme_color: '#537F5D',
        icons: [
            {
                src: '/imgfavicon/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/imgfavicon/icon1.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/imgfavicon/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {
                src: '/imgfavicon/icon0.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    };
}
