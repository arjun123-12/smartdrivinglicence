import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { extractArray, safeArray } from '../utils/apiHelpers';
import { mockFaqs } from '../services/mockData';
import ScrollReveal from '../components/effects/ScrollReveal';
import TiltCard from '../components/effects/TiltCard';
import MagneticButton from '../components/effects/MagneticButton';
import PageHeading from '../components/typography/PageHeading';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIds, setOpenIds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/faqs');
        const list = extractArray(res, mockFaqs);
        setFaqs(list);
        // Default open first 2
        if (list.length > 0) {
          setOpenIds({ [list[0].id]: true, [list[1]?.id]: true });
        }
      } catch (err) {
        console.warn('FAQs load caught error, using fallback:', err);
        setFaqs(mockFaqs);
        if (mockFaqs.length > 0) {
          setOpenIds({ [mockFaqs[0].id]: true, [mockFaqs[1]?.id]: true });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggle = (id) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['all', 'vort', 'lessons', 'packages', 'general'];

  const filtered = safeArray(faqs).filter((f) => {
    if (!f) return false;
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  return (
    <div>
      <PageHeading
        badge="Knowledge Base"
        badgeIcon={HelpCircle}
        liveDot={true}
        title="Frequently Asked Questions"
        highlightWord="Questions"
        subtitle="Find immediate answers regarding South Australian logbooks, VORT testing rules, vehicle requirements, cancellations, and pass criteria."
      />

      <div className="container section">
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`button button-sm ${selectedCategory === cat ? 'button-primary' : 'button-outline'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Questions' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {safeArray(filtered).map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <ScrollReveal key={faq.id} direction="up" distance={20} delay={idx * 0.05}>
                <div className={`accordion-3d-item ${isOpen ? 'is-open' : ''}`} style={{ background: '#ffffff', borderColor: '#e2e8f0' }}>
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    className="accordion-3d-trigger"
                    style={{ color: '#0f172a' }}
                    aria-expanded={isOpen}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <HelpCircle size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 700 }}>{faq.question}</span>
                    </div>
                    <div className="accordion-3d-icon" style={{ background: isOpen ? '#1B6C31' : 'rgba(0,0,0,0.05)', color: isOpen ? '#ffffff' : '#1B6C31' }}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="accordion-3d-content" style={{ color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <p style={{ margin: 0, lineHeight: 1.7 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <ScrollReveal direction="scale" distance={25} delay={0.2}>
          <TiltCard maxTilt={6} scale={1.01}>
            <div className="card glass-panel-3d" style={{ maxWidth: '850px', margin: '3rem auto 0 auto', padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(27, 108, 49, 0.9) 0%, rgba(13, 38, 69, 0.9) 100%)', color: '#ffffff' }}>
              <h3 style={{ color: '#ffffff', fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>Still Have Questions?</h3>
              <p style={{ color: '#e2e8f0', marginBottom: '1.75rem', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto 1.75rem' }}>
                Can't find the answer you're looking for? Chat with our accredited Adelaide booking coordinators.
              </p>
              <MagneticButton as={Link} to="/contact" variant="gold">
                <span>Contact Support Team</span>
                <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>
    </div>
  );
}

