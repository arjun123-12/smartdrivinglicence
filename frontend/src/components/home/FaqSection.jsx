import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import '../../styles/home-sections.css';

const defaultFaqs = [
  {
    id: 1,
    question: 'Can I use my own car?',
    answer:
      'Yes, you can use your own vehicle for the VORT test provided it is roadworthy, currently registered, insured, clean, and equipped with properly functioning seatbelts and mirrors. Alternatively, you can opt to use your instructor’s dual-controlled vehicle for maximum safety and comfort.',
  },
  {
    id: 2,
    question: 'What if I need to reschedule?',
    answer:
      'You can easily reschedule your booking through your student dashboard or by reaching out to our support team. In compliance with South Australian DIT guidelines, appointments rescheduled at least 48 hours prior to test time incur no penalty.',
  },
  {
    id: 3,
    question: 'How do I book a VORT test?',
    answer:
      'Booking takes under 2 minutes: select your preferred Adelaide test location or hub (Thebarton, Port Adelaide, Marion, etc.), choose your date and time slot from real-time live availability, select any warmup lesson or vehicle hire options, and confirm securely online.',
  },
  {
    id: 4,
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards (Visa, MasterCard, American Express) through our secure Stripe-encrypted gateway, as well as digital wallets like Apple Pay and Google Pay. All payments are encrypted and PCI-DSS compliant.',
  },
];

export default function FaqSection({ faqs = defaultFaqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="faq-section-modern">
      <div className="faq-container-modern">
        <h2 className="faq-title-modern">Frequently Asked Questions</h2>

        <div className="faq-list-modern">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || index}
                className={`faq-card-modern ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={19} className="faq-chevron" />
                </button>

                {isOpen && (
                  <div className="faq-answer-wrap">
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="faq-actions-modern">
          <Link to="/faqs" className="faq-view-all-btn">
            View All FAQs
          </Link>

          <Link to="/book-test" className="prevort-cta-btn">
            Find My VORT Slot Now
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

