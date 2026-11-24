import React from 'react';
import { Star, Quote, Award } from 'lucide-react';
import TiltCard from '../effects/TiltCard';
import ScrollReveal from '../effects/ScrollReveal';
import '../../styles/vort-and-reviews.css';

const stories = [
  {
    id: 1,
    name: 'Manpreet',
    suburb: 'Clearview',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    quote:
      '“My instructor told me examiners were booked out for 6 weeks across Adelaide. On A1 Smart Driving, I found an immediate Saturday morning slot in Thebarton and passed with zero critical errors!”',
    passed: 'Passed: April 2024',
  },
  {
    id: 2,
    name: 'Sujal',
    suburb: 'Glenelg',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    quote:
      '“I specifically needed an instructor who spoke Hindi for clear terminology. Found Satish on A1 Smart Driving — patient, thorough, and his dual-controlled car made reverse parallel parking second nature.”',
    passed: 'Passed: May 2024',
  },
  {
    id: 3,
    name: 'Priyanka',
    suburb: 'Adelaide CBD',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quote:
      '“The online booking system showed real-time calendar availability without the back-and-forth phone calls. Upgraded to the PreVORT warmup bundle and felt 100% prepared on test day.”',
    passed: 'Passed: May 2024',
  },
];

export default function StudentStories() {
  return (
    <section className="student-stories-section scene-perspective-container">
      <div className="student-stories-container">
        <ScrollReveal direction="up" distance={35}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge-3d" style={{ marginBottom: '0.75rem' }}>
              <Award size={14} /> 4.9 ★ Average Adelaide Rating
            </span>
            <h2 className="student-stories-title">Real Success Stories From Our Students</h2>
            <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
              Read verified testimonials from South Australian learner drivers who secured their licence with A1 Smart Driving.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {stories.map((story, index) => (
            <ScrollReveal key={story.id} direction="up" distance={40} delay={index * 0.15}>
              <TiltCard maxTilt={10} scale={1.02} style={{ height: '100%' }}>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <img
                      src={story.image}
                      alt={`${story.name} from ${story.suburb}`}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #22c55e',
                        boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
                      }}
                      loading="lazy"
                    />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>{story.name}</h3>
                      <span style={{ fontSize: '0.85rem', color: '#86efac' }}>{story.suburb} (SA)</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }} aria-label="5 stars rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>

                  <p style={{ margin: '0 0 1.25rem 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, flex: 1, fontStyle: 'italic' }}>
                    {story.quote}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {story.passed}
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
