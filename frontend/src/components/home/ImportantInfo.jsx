import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../styles/home-sections.css';

const importantCards = [
  {
    id: 1,
    title: 'What do we do? We just make your life easy!',
    content:
      'We are South Australia’s dedicated online test booking platform. Instead of calling individual driving examiners, playing phone tag, or waiting weeks for someone to check their paper diary, we connect you to real-time live calendars across accredited examiners in Adelaide so you can compare prices, choose your test hub, and book in 2 minutes.',
  },
  {
    id: 2,
    title: 'Unlike your mate who ‘knows a guy,’ we literally cannot influence your test result',
    content:
      'Every VORT examiner on our platform is independently accredited, registered with the South Australian Department for Infrastructure and Transport (DIT), and bound by strict regulatory standards. All practical driving tests follow the exact same authorized government marking criteria. There are zero shortcuts—your score is 100% based on your safe driving performance.',
  },
  {
    id: 3,
    title: 'Spoiler alert: If you can’t drive, we can’t magic you a licence.',
    content:
      'To earn your P-plates through a VORT test, you must achieve an overall score of at least 90%, successfully perform all 5 required slow-speed maneuvers (parallel park, angle park, 3-point turn, U-turn, hill start), and commit zero immediate fail items. If you are not test-ready yet, we recommend booking a few driving lessons first!',
  },
  {
    id: 4,
    title: 'Think we can put in a good word for you? No.',
    content:
      'Examiners uphold absolute professional independence and integrity. Attempting to influence an authorized examiner is illegal under South Australian road law. What we can do is provide transparent pricing, easy rescheduling, expert warmup lessons, and test vehicle hire so you step into your assessment calm, prepared, and confident.',
  },
];

export default function ImportantInfo() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="important-info-section">
      <div className="important-info-container">
        <h2 className="important-info-title">Important Information</h2>

        <div className="important-info-list">
          {importantCards.map((card, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={card.id}
                className={`important-info-card ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="important-info-btn"
                  onClick={() => toggleCard(index)}
                  aria-expanded={isOpen}
                >
                  <span>{card.title}</span>
                  <ChevronDown size={20} className="important-info-chevron" />
                </button>

                {isOpen && (
                  <div className="important-info-answer">
                    <p style={{ margin: 0 }}>{card.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

