import React from 'react';
import { LegalLayout } from './LegalLayout';

export const TermsOfService: React.FC = () => {
  const toc = [
    { id: 'agreement', label: '1. Agreement to Terms' },
    { id: 'bookings', label: '2. Bookings & Payments' },
    { id: 'cancellation', label: '3. Cancellation Policy' },
    { id: 'conduct', label: '4. Guest Conduct' },
    { id: 'liability', label: '5. Liability' },
    { id: 'law', label: '6. Governing Law' },
  ];

  return (
    <LegalLayout 
      title="Terms of Service" 
      subtitle="Please read these terms carefully before booking your stay with StayinUBUD."
      lastUpdated="January 10, 2024"
      toc={toc}
    >
      <section id="agreement">
        <h2 className="text-2xl md:text-3xl font-serif text-forest mb-6">1. Agreement to Terms</h2>
        <p>
          These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and StayinUBUD (“we,” “us” or “our”), concerning your access to and use of our services and villa rentals.
        </p>
      </section>

      <section id="bookings">
        <h2 className="text-2xl md:text-3xl font-serif text-forest mb-6">2. Bookings & Payments</h2>
        <p>
          <strong>Reservation Confirmation:</strong> A booking is considered confirmed only upon receipt of a 50% deposit of the total rental amount. The remaining balance is due 14 days prior to arrival.
        </p>
        <p className="mt-4">
          <strong>Payment Methods:</strong> We accept major credit cards (Visa, Mastercard, Amex) and bank transfers. All payments must be made in Indonesian Rupiah (IDR) or USD equivalent at the daily exchange rate.
        </p>
      </section>

      <section id="cancellation">
        <h2 className="text-2xl md:text-3xl font-serif text-forest mb-6">3. Cancellation Policy</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>More than 30 days before arrival:</strong> Full refund of the deposit, minus a 5% processing fee.</li>
          <li><strong>14-30 days before arrival:</strong> 50% of the deposit is refundable.</li>
          <li><strong>Less than 14 days before arrival:</strong> No refund; the full booking amount is charged.</li>
        </ul>
      </section>

      <section id="conduct">
        <h2 className="text-2xl md:text-3xl font-serif text-forest mb-6">4. Guest Conduct</h2>
        <p>
          Guests are expected to treat the property and staff with respect. Loud parties, illegal drugs, and unregistered guests are strictly prohibited. We reserve the right to evict guests without refund if these rules are violated or if there is damage to the property.
        </p>
      </section>

      <section id="liability">
        <h2 className="text-2xl md:text-3xl font-serif text-forest mb-6">5. Limitation of Liability</h2>
        <p>
          StayinUBUD is not responsible for any accidents, injuries, or illness that occur while on the premises or its facilities. StayinUBUD is not responsible for the loss of personal belongings or valuables of the guest.
        </p>
      </section>

      <section id="law">
        <h2 className="text-2xl md:text-3xl font-serif text-forest mb-6">6. Governing Law</h2>
        <p>
          These Terms shall be governed by and defined following the laws of Indonesia. StayinUBUD and yourself irrevocably consent that the courts of Indonesia shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
        </p>
      </section>

    </LegalLayout>
  );
};