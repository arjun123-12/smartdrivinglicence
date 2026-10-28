import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIds, setOpenIds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/faqs');
        setFaqs(res.data.data);
        // Default open first 2
        if (res.data.data.length > 0) {
          setOpenIds({ [res.data.data[0].id]: true, [res.data.data[1]?.id]: true });
        }
      } catch {
        // Fallback
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

  const filtered = faqs.filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  return (
    <div>
      <section className="page-header">
        <div className="container">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
            Knowledge Base
          </span>
          <h1>Frequently Asked Questions</h1>
          <p>
            Find immediate answers regarding South Australian logbooks, VORT testing rules, vehicle requirements, cancellations, and pass criteria.
          </p>
        </div>
      </section>

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
          {filtered.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div key={faq.id} className="card" style={{ overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? 'var(--color-surface-subtle)' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'var(--color-primary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <HelpCircle size={18} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: '#ffffff', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, color: 'var(--color-text)' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="card" style={{ maxWidth: '850px', margin: '3rem auto 0 auto', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-primary-light)' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Still Have Questions?</h3>
          <p style={{ color: 'var(--color-text)', marginBottom: '1.25rem', fontSize: 'var(--font-size-sm)' }}>
            Can't find the answer you're looking for? Chat with our Adelaide booking coordinators.
          </p>
          <Link to="/contact" className="button button-primary">
            Contact Support Team <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

