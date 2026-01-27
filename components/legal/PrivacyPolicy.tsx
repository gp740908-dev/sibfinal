import React from 'react';
import { LegalLayout } from './LegalLayout';

export const PrivacyPolicy: React.FC = () => {
  const toc = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'info-collection', label: '2. Information We Collect' },
    { id: 'usage', label: '3. How We Use Data' },
    { id: 'sharing', label: '4. Data Sharing' },
    { id: 'cookies', label: '5. Cookies & Tracking' },
    { id: 'rights', label: '6. Your Rights' },
    { id: 'contact', label: '7. Contact Us' },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="We value your privacy and are committed to protecting your personal data when you book your sanctuary with us."
      lastUpdated="March 15, 2024"
      toc={toc}
    >
      <section id="introduction">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">1. Introduction</h2>
        <p>
          Welcome to StayinUBUD. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you as to how we look after your personal data when you visit our website
          (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
        </p>
      </section>

      <section id="info-collection">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">2. Information We Collect</h2>
        <p className="mb-4">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Identity Data:</strong> includes first name, maiden name, last name, username or similar identifier, title, date of birth and gender.</li>
          <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
          <li><strong>Financial Data:</strong> includes bank account and payment card details (processed securely via our payment providers).</li>
          <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
          <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
        </ul>
      </section>

      <section id="usage">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">3. How We Use Your Data</h2>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking a villa).</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal or regulatory obligation.</li>
        </ul>
      </section>

      <section id="sharing">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">4. Data Sharing</h2>
        <p>
          We may share your personal data with the parties set out below for the purposes set out in the table above.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>Service providers acting as processors who provide IT and system administration services.</li>
          <li>Professional advisers acting as processors or joint controllers including lawyers, bankers, auditors and insurers.</li>
          <li>Regulators and other authorities acting as processors or joint controllers who require reporting of processing activities in certain circumstances.</li>
        </ul>
      </section>

      <section id="cookies">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">5. Cookies & Tracking</h2>
        <p>
          You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
        </p>
      </section>

      <section id="rights">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">6. Your Rights</h2>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
        </p>
      </section>

      <section id="contact">
        <h2 className="text-2xl md:text-3xl font-serif text-forest-dark mb-6">7. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact our Data Privacy Manager in the following ways:
        </p>
        <p className="mt-4">
          Email address: privacy@stayinubud.com<br />
          Postal address: Jl. Raya Ubud No. 88, Gianyar, Bali, Indonesia 80571.
        </p>
      </section>

    </LegalLayout>
  );
};