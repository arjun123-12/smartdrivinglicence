import React from 'react';
import { Star } from 'lucide-react';
import '../../styles/vort-and-reviews.css';

const topStories = [
  {
    id: 1,
    name: 'Manpreet',
    suburb: 'Clearview',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    quote:
      '“My instructor told me to book with his examiner but they were booked out for weeks. I tried to find somewhere who could do sooner and eventually found LicenceMate and just booked my test for 5 days later.”',
    passed: 'Passed: April 2024',
  },
  {
    id: 2,
    name: 'Sujal',
    suburb: 'Glenelg',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    quote:
      '“I was looking around to book a test directly and most schools I called didn’t have someone who spoke Hindi which I really wanted. I saw LicenceMate and found Satish and was really easy to book after that.”',
    passed: 'Passed: May 2024',
  },
  {
    id: 3,
    name: 'Priyanka',
    suburb: 'Adelaide',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quote:
      '“I was looking for a female examiner but I called around and couldn’t find anyone for a month. On LicenceMate, I found a few and just went ahead and booked for the following weekend.”',
    passed: 'Passed: May 2024',
  },
];

const bottomStory = {
  id: 4,
  name: 'Leon',
  suburb: 'Henley Beach',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  quote:
    '“Got a few quotes from some schools around me which quoted around $350 to $450. Had a look on LicenceMate and compared prices and got one for $300.”',
  passed: 'Passed: June 2024',
};

function StoryCard({ story, isSingle = false }) {
  return (
    <div className={`student-story-card ${isSingle ? 'student-story-card-single' : ''}`}>
      <div className="student-story-img-wrap">
        <img
          src={story.image}
          alt={`${story.name} from ${story.suburb}`}
          className="student-story-img"
          loading="lazy"
        />
      </div>

      <div className="student-story-body">
        <h3 className="student-story-name">{story.name}</h3>
        <span className="student-story-suburb">{story.suburb}</span>

        <div className="student-story-stars" aria-label="5 stars rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#ffb52e" color="#ffb52e" />
          ))}
        </div>

        <p className="student-story-quote">{story.quote}</p>
        <span className="student-story-passed">{story.passed}</span>
      </div>
    </div>
  );
}

export default function StudentStories() {
  return (
    <section className="student-stories-section">
      <div className="student-stories-container">
        <h2 className="student-stories-title">Real Success Stories from Our Students</h2>

        {/* Top 3 Cards */}
        <div className="student-stories-grid-top">
          {topStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Bottom Centered Card */}
        <div className="student-stories-grid-bottom">
          <StoryCard story={bottomStory} isSingle />
        </div>

        {/* Bottom Trust Subtitle */}
        <div className="student-stories-footer">
          Based on verified reviews from real students · <strong>4.9/5 average rating</strong>
        </div>
      </div>
    </section>
  );
}

