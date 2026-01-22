import { Metadata } from 'next';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy policy for StayinUBUD. Learn how we collect, use, and protect your personal information.',
    alternates: {
        canonical: 'https://stayinubud.com/privacy',
    },
};

export default function PrivacyPage() {
    return <PrivacyPolicy />;
}
