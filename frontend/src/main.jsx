import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global CSS Architecture - Mandatory Section 12
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/navbar.css';
import './styles/hero.css';
import './styles/comparison.css';
import './styles/passwall.css';
import './styles/footer.css';
import './styles/vort-and-reviews.css';
import './styles/home-sections.css';
import './styles/first-lesson.css';
import './styles/packages-page.css';
import './styles/mock-test.css';

// 3D Global & Interactive Design System
import './styles/3d-global.css';
import './styles/3d-components.css';
import './styles/3d-responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

