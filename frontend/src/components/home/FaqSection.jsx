import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import ScrollReveal from '../effects/ScrollReveal';
import '../../styles/home-sections.css';

const defaultFaqs = [
  {
    id: 1,
    question: 'Can I use my own car for the VORT test?',
    answer:
      'Yes, you can use your own vehicle provided it is roadworthy, registered, insured, clean, and equipped with a working handbrake and rear-view mirrors. However, most students choose our dual-controlled instructor car to avoid any compliance disqualification on test day.',
  },
  {
    id: 2,
    question: 'What happens during a VORT driving test?',
    answer:
      'The VORT consists of two main parts: five slow-speed manoeuvres (3-point turn, reverse parallel park, angle park, straight line reverse, kerb stop) and a comprehensive road assessment measuring observation, signalling, speed control, vehicle positioning, and hazard perception across Adelaide roads.',
  },
  {
    id: 3,
    question: 'How do I reschedule if my plans change?',
    answer:
      'Rescheduling is self-serve through your Student Dashboard. Under South Australian DIT guidelines, requests made with at least 48 hours notice incur zero penalties and allow you to select a new appointment slot instantly.',
  },
  {
    id: 4,
    question: 'Are your driving instructors DIT accredited?',
    answer:
      'Yes. 100% of instructors and examiners on A1 Smart Driving hold current Motor Driving Instructor (MDI) authorisations issued by the South Australian Department for Infrastructure and Transport, alongside valid Working with Children Checks (WWCC).',
  },
  {
    id: 5,
    question: 'How does the online payment work?',
    answer:
      'We use bank-grade 256-bit Stripe encryption. Your payment is securely reserved with immediate confirmation. We support Visa, Mastercard, AMEX, and digital wallets.',
  },
];

export default function FaqSection({ faqs = defaultFaqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const displayFaqs = Array.isArray(faqs) && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="faq-section-modern scene-perspective-container">
      <div className="faq-container-modern" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <ScrollReveal direction="up" distance={30}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge-3d" style={{ marginBottom: '0.75rem' }}>
              <HelpCircle size={14} /> Clear Answers
            </span>
            <h2 className="faq-title-modern">Frequently Asked Questions</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: '0.5rem auto 0', maxWidth: '600px' }}>
              Everything you need to know about Adelaide driving lessons, VORT testing, and booking procedures.
            </p>
          </div>
        </ScrollReveal>

        <div className="faq-3d-list">
          {displayFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={faq.id || index} direction="up" distance={20} delay={index * 0.08}>
                <div className={`accordion-3d-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="accordion-3d-trigger"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <div className="accordion-3d-icon">
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="accordion-3d-content">
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal direction="up" distance={20} delay={0.4}>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/faqs" className="button button-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>View Full FAQ Knowledge Base</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
