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
        .about-us__read-more{background:none;border:none;color:var(--primary-color);font-weight:600;cursor:pointer;padding:0}
        .about-us__read-more:focus{outline:2px solid rgba(79,70,229,.6);outline-offset:2px;border-radius:4px}
      `}</style>

      <div className="about-us__container">
        <h2 id="about-us-heading" className="about-us__heading">About Us</h2>
        <p className="about-us__intro">We are a small, purpose-driven team building delightful experiences for our community.</p>

        <div className="about-us__grid">
          {/* Card 1 - swap placeholders below */}
          <article className="about-us__card" tabIndex={0}>
            <div className="about-us__image-wrap">
              {/* {{IMAGE_URL}} */}
              <img className="about-us__image" src="{{IMAGE_URL}}" alt="{{NAME}} profile headshot" loading="lazy" />
            </div>
            <div className="about-us__content">
              {/* {{NAME}} / {{ROLE}} */}
              <h3 className="about-us__name">{{NAME}}</h3>
              <p className="about-us__role">{{ROLE}}</p>
              {/* {{BIO}} */}
              <p className="about-us__bio" data-readmore>{{BIO}}</p>
              <button className="about-us__read-more" type="button" data-readmore-toggle aria-expanded="false">Read more</button>
              <nav className="about-us__social" aria-label="Social links">
                {/* {{TWITTER_URL}} */}
                <a className="about-us__social-link" href="{{TWITTER_URL}}" target="_blank" rel="noopener noreferrer" aria-label="Follow on Twitter">
                  <span className="visually-hidden">Twitter</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.5-1.6.8-2.4 1C18 4.7 17 4.3 16 4.3c-2.1 0-3.8 1.8-3.8 4 0 .3 0 .6.1.9-3.1-.2-5.9-1.8-7.7-4.2-.3.6-.5 1.2-.5 1.9 0 1.3.6 2.4 1.5 3.2-.6 0-1.1-.2-1.6-.4v.1c0 1.9 1.3 3.5 3 3.9-.3.1-.7.2-1 .2-.2 0-.5 0-.7-.1.5 1.6 2 2.7 3.7 2.7-1.4 1.2-3.1 1.9-5 1.9-.3 0-.6 0-.8 0 1.8 1.2 3.9 1.9 6.1 1.9 7.3 0 11.3-6.4 11.3-12 0-.2 0-.3 0-.5.8-.6 1.4-1.3 2-2.1z"/></svg>
                </a>
                {/* {{LINKEDIN_URL}} */}
                <a className="about-us__social-link" href="{{LINKEDIN_URL}}" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
                  <span className="visually-hidden">LinkedIn</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.1h.1c.5-1 1.9-2.1 3.9-2.1 4.2 0 5 2.8 5 6.5V23h-4v-6.5c0-1.6 0-3.7-2.2-3.7s-2.5 1.7-2.5 3.6V23h-4V8z"/></svg>
                </a>
                {/* {{INSTAGRAM_URL}} */}
                <a className="about-us__social-link" href="{{INSTAGRAM_URL}}" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
                  <span className="visually-hidden">Instagram</span>
                  <svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 13 5.51 5.51 0 0012 7.5zm0 2A3.5 3.5 0 1115.5 13 3.5 3.5 0 0112 9.5zm5.8-3.5a1 1 0 10.2 2 1 1 0 00-.2-2z"/></svg>
                </a>
              </nav>
            </div>
          </article>

          {/* Card 2 - duplicate with different details */}
          <article className="about-us__card" tabIndex={0}>
            <div className="about-us__image-wrap">
              <img className="about-us__image" src="{{IMAGE_URL}}" alt="{{NAME}} profile headshot" loading="lazy" />
            </div>
            <div className="about-us__content">
              <h3 className="about-us__name">{{NAME}}</h3>
              <p className="about-us__role">{{ROLE}}</p>
              <p className="about-us__bio" data-readmore>{{BIO}}</p>
              <button className="about-us__read-more" type="button" data-readmore-toggle aria-expanded="false">Read more</button>
              <nav className="about-us__social" aria-label="Social links">
                <a className="about-us__social-link" href="{{TWITTER_URL}}" target="_blank" rel="noopener noreferrer" aria-label="Follow on Twitter"><span className="visually-hidden">Twitter</span><svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.5-1.6.8-2.4 1C18 4.7 17 4.3 16 4.3c-2.1 0-3.8 1.8-3.8 4 0 .3 0 .6.1.9-3.1-.2-5.9-1.8-7.7-4.2-.3.6-.5 1.2-.5 1.9 0 1.3.6 2.4 1.5 3.2-.6 0-1.1-.2-1.6-.4v.1c0 1.9 1.3 3.5 3 3.9-.3.1-.7.2-1 .2-.2 0-.5 0-.7-.1.5 1.6 2 2.7 3.7 2.7-1.4 1.2-3.1 1.9-5 1.9-.3 0-.6 0-.8 0 1.8 1.2 3.9 1.9 6.1 1.9 7.3 0 11.3-6.4 11.3-12 0-.2 0-.3 0-.5.8-.6 1.4-1.3 2-2.1z"/></svg></a>
                <a className="about-us__social-link" href="{{LINKEDIN_URL}}" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn"><span className="visually-hidden">LinkedIn</span><svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.1h.1c.5-1 1.9-2.1 3.9-2.1 4.2 0 5 2.8 5 6.5V23h-4v-6.5c0-1.6 0-3.7-2.2-3.7s-2.5 1.7-2.5 3.6V23h-4V8z"/></svg></a>
                <a className="about-us__social-link" href="{{INSTAGRAM_URL}}" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram"><span className="visually-hidden">Instagram</span><svg className="about-us__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 13 5.51 5.51 0 0012 7.5zm0 2A3.5 3.5 0 1115.5 13 3.5 3.5 0 0112 9.5zm5.8-3.5a1 1 0 10.2 2 1 1 0 00-.2-2z"/></svg></a>
              </nav>
            </div>
          </article>
        </div>

        {/* Optional: small JS to toggle Read more */}
        <script dangerouslySetInnerHTML={{__html: `
          document.querySelectorAll('[data-readmore-toggle]').forEach(btn => {
            btn.addEventListener('click', () => {
              const card = btn.closest('.about-us__card');
              const bio = card && card.querySelector('[data-readmore]');
              if (!bio) return;
              const expanded = btn.getAttribute('aria-expanded') === 'true';
              btn.setAttribute('aria-expanded', String(!expanded));
              if (expanded) {
                bio.style.display='-webkit-box'; bio.style.webkitLineClamp='2'; bio.style.webkitBoxOrient='vertical'; bio.style.overflow='hidden'; btn.textContent='Read more';
              } else {
                bio.style.display='block'; bio.style.webkitLineClamp='unset'; bio.style.webkitBoxOrient='unset'; bio.style.overflow='visible'; btn.textContent='Show less';
              }
            });
          });
          document.querySelectorAll('[data-readmore]').forEach(bio => { bio.style.display='-webkit-box'; bio.style.webkitLineClamp='2'; bio.style.webkitBoxOrient='vertical'; bio.style.overflow='hidden'; });
        `}} />
      </div>
    </section>
  );
};

export default AboutUs;


