import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="about-us" aria-labelledby="about-us-heading">
      {/* Scoped styles; inherits your site's variables if available */}
      <style>{`
        @import url("https://YOUR_SITE_URL/style.css");
        .about-us { --primary-color: var(--primary-color, #4f46e5); --accent: var(--accent, #8b5cf6); --radius: var(--radius, 14px); --text: var(--text-primary-color, #1e293b); --muted: var(--text-secondary-color, #64748b); --card: var(--card-background-color, #ffffff); --bg: var(--background-color, #f8fafc); --shadow: 0 6px 20px rgba(0,0,0,0.08); --shadow-hover: 0 12px 28px rgba(0,0,0,0.12); background: var(--bg); color: var(--text); padding: 2rem 1rem; }
        .about-us__container{max-width:1100px;margin:0 auto}
        .about-us__heading{margin:0 0 1rem;font-size:clamp(1.5rem,2vw + 1rem,2.25rem);font-weight:800;letter-spacing:-.02em;text-align:center}
        .about-us__intro{margin:0 auto 2rem;max-width:48rem;text-align:center;color:var(--muted);line-height:1.6}
        .about-us__grid{display:grid;grid-template-columns:1fr;gap:1.25rem}
        @media(min-width:820px){.about-us__grid{grid-template-columns:repeat(2,1fr)}}
        .about-us__card{background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:1.25rem;display:grid;grid-template-columns:auto 1fr;gap:1rem;align-items:center;transition:transform .25s ease, box-shadow .25s ease;outline:none}
        @media (prefers-reduced-motion:no-preference){.about-us__card:hover,.about-us__card:focus{transform:translateY(-4px);box-shadow:var(--shadow-hover)}}
        @media (prefers-reduced-motion:reduce){.about-us__card{transition:none}}
        .about-us__image-wrap{width:84px;height:84px;border-radius:50%;overflow:hidden;flex-shrink:0;border:3px solid rgba(79,70,229,.25)}
        .about-us__image{width:100%;height:100%;object-fit:cover;display:block}
        .about-us__name{margin:0 0 .25rem;font-size:1.125rem;font-weight:700;letter-spacing:-.01em}
        .about-us__role{margin:0 0 .5rem;color:var(--primary-color);font-weight:600}
        .about-us__bio{margin:0 0 .75rem;color:var(--muted);line-height:1.6}
        .about-us__social{display:flex;align-items:center;gap:.5rem}
        .about-us__social-link{--size:40px;width:var(--size);height:var(--size);display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(79,70,229,.08);color:var(--primary-color);transition:background .2s ease, color .2s ease, transform .2s ease;outline:none;border:2px solid transparent}
        .about-us__social-link:hover,.about-us__social-link:focus{background:rgba(79,70,229,.16);transform:translateY(-1px)}
        .about-us__social-link:focus{border-color:rgba(139,92,246,.6)}
        .about-us__icon{width:20px;height:20px}
        .visually-hidden{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap;clip-path:inset(50%);border:0;padding:0;margin:-1px}
      `}</style>

      <div className="about-us__container">
        <h2 id="about-us-heading" className="about-us__heading">About Us</h2>
        <p className="about-us__intro">We are a small, purpose-driven team building delightful experiences for our community.</p>

        <div className="about-us__grid">
          {/* Card 1 - Riyadh */}
          <article className="about-us__card" tabIndex={0}>
            <div className="about-us__image-wrap">
              {/* Swap with your image URL if needed */}
              <img className="about-us__image" src="https://lh3.googleusercontent.com/a/ACg8ocKi7kpqXGL99jYZUmCMZlRwqO01Im6Mw5ZhV9ipwN7mUT4y768=s200-c" alt="Riyadh profile headshot" loading="lazy" />
            </div>
            <div className="about-us__content">
              <h3 className="about-us__name">Riyadh</h3>
              <p className="about-us__role">Front-end Developer & Idea Owner (UK)</p>
              <p className="about-us__bio">no need, I'm just better</p>
              <nav className="about-us__social" aria-label="Social links">
                <a className="about-us__social-link" href="https://instagram.com/r1y1d" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
                  <span className="visually-hidden">Instagram</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 13 5.51 5.51 0 0012 7.5zm0 2A3.5 3.5 0 1115.5 13 3.5 3.5 0 0112 9.5zm5.8-3.5a1 1 0 10.2 2 1 1 0 00-.2-2z"/></svg>
                </a>
                {/* Email (optional) */}
                <a className="about-us__social-link" href="mailto:r44chr@gmail.com" aria-label="Email Riyadh">
                  <span className="visually-hidden">Email</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              </nav>
            </div>
          </article>

          {/* Card 2 - Zeyd */}
          <article className="about-us__card" tabIndex={0}>
            <div className="about-us__image-wrap">
              <img className="about-us__image" src="https://lh3.googleusercontent.com/a/ACg8ocInLHAH46quPSJE_Kgbe8so7DJYBqXkpvA2m55XXW7cn7aBtDQ=s200-c" alt="Zeyd profile headshot" loading="lazy" />
            </div>
            <div className="about-us__content">
              <h3 className="about-us__name">Zeyd</h3>
              <p className="about-us__role">Back-end Developer</p>
              <p className="about-us__bio">who needs bio when I'm just up</p>
              <nav className="about-us__social" aria-label="Social links">
                <a className="about-us__social-link" href="https://www.instagram.com/xzaid_endx/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
                  <span className="visually-hidden">Instagram</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 13 5.51 5.51 0 0012 7.5zm0 2A3.5 3.5 0 1115.5 13 3.5 3.5 0 0112 9.5zm5.8-3.5a1 1 0 10.2 2 1 1 0 00-.2-2z"/></svg>
                </a>
                <a className="about-us__social-link" href="mailto:ammizaidghost@gmail.com" aria-label="Email Zeyd">
                  <span className="visually-hidden">Email</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              </nav>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;


