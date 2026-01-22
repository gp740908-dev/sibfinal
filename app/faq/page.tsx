import { Metadata } from 'next';
import { FAQ } from '@/components/faq/FAQ';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about booking, amenities, and your stay at our Ubud villas. Check-in times, cancellation policy, and more.',
    alternates: {
        canonical: 'https://stayinubud.com/faq',
    },
    openGraph: {
        title: 'FAQ | StayinUBUD',
        description: 'Common questions about StayinUBUD villas.',
        url: 'https://stayinubud.com/faq',
    },
};

// FAQ data for schema (matches the component data)
const FAQ_DATA = {
    General: [
        {
            question: "Where is StayinUBUD located?",
            answer: "Our collection of villas is scattered across the most serene parts of Ubud. Some are nestled in the rice terraces of Tegallalang, while others are hidden in the jungle canopy of Sayan. Precise location details are provided upon booking to ensure the privacy of our guests."
        },
        {
            question: "What are the check-in and check-out times?",
            answer: "Check-in begins at 14:00 (2 PM) and check-out is at 11:00 (11 AM). We are happy to accommodate early check-ins or late check-outs subject to availability."
        },
        {
            question: "Is StayinUBUD suitable for families?",
            answer: "While many of our villas are designed as romantic sanctuaries for couples, we do have specific estates (like the Estate of Zen) that are perfect for families. Please check the guest capacity on the villa details page."
        }
    ],
    'Villa Amenities': [
        {
            question: "Is breakfast included in the rate?",
            answer: "Yes. Every morning, a curated breakfast is prepared by your private villa staff. You may choose between Western, Balinese, or Healthy options, served in the privacy of your dining area or as a floating breakfast in the pool."
        },
        {
            question: "Is the internet connection reliable?",
            answer: "Absolutely. We understand the needs of modern travelers. All villas are equipped with high-speed fiber optic Wi-Fi (up to 100Mbps), ensuring you can stay connected even in the heart of the jungle."
        },
        {
            question: "Do the villas have air conditioning?",
            answer: "Yes, all bedrooms are fully air-conditioned to ensure a comfortable night's sleep. Living areas are often designed as open-air spaces to embrace the natural breeze, but are equipped with ceiling fans."
        }
    ],
    'Booking & Payment': [
        {
            question: "Do you offer airport transfers?",
            answer: "Yes. We provide complimentary round-trip airport transfers for stays of 3 nights or more. For shorter stays, we can arrange a private luxury car transfer for an additional fee."
        },
        {
            question: "What is your cancellation policy?",
            answer: "To offer flexibility, we allow free cancellation up to 14 days before arrival. Cancellations made within 14 days of arrival will be charged 50% of the total booking. No-shows are charged 100%."
        },
        {
            question: "How do I make a reservation?",
            answer: "You can request a booking directly through our website using the 'Check Availability' widget. Alternatively, you can contact our concierge via WhatsApp for a personalized booking experience."
        }
    ]
};

export default function FAQPage() {
    // Flatten all FAQ items for schema
    const allFaqItems = Object.values(FAQ_DATA).flat();

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

    return (
        <>
            <JsonLd data={faqSchema} />
            <FAQ />
        </>
    );
}
