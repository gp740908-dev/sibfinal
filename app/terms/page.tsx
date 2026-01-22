import { Metadata } from 'next';
import { TermsOfService } from '@/components/legal/TermsOfService';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of service for StayinUBUD villa rentals. Booking conditions, cancellation policy, and guest responsibilities.',
    alternates: {
        canonical: 'https://stayinubud.com/terms',
    },
};

export default function TermsPage() {
    return <TermsOfService />;
}
