import GalleryFeed from './GalleryFeed';
import './App.css';
import './GalleryPage.css';

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
);

function GalleryPage() {
  return (
    <div className="site-shell svc-page gallery-page">
      <div className="announcement">
        <span className="announcement-dot" />
        <span>VISUAL IDEAS / REAL PROJECT POSSIBILITIES</span>
        <a href="/services#enquiry">START YOUR PROJECT <Arrow /></a>
      </div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="BNB home">
          <span className="brand-mark">B<span>N</span>B</span>
          <span className="brand-name">BOARD N BYTE</span>
        </a>
        <nav className="gallery-top-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/gallery" aria-current="page">Design gallery</a>
          <a href="/#store">Tech store</a>
        </nav>
        <a className="header-cta" href="/services#enquiry">Start a project <Arrow /></a>
      </header>

      <main>
        <section className="section-wrap gallery-intro">
          <div className="gallery-intro-top">
            <div className="eyebrow"><span className="eyebrow-line" /> DESIGN DIRECTIONS / CURATED BY BNB</div>
            <span className="gallery-intro-index">12 CONCEPTS — 06 SERVICES</span>
          </div>
          <div className="gallery-intro-grid">
            <h1>Find the look.<br /><span>Build your own.</span></h1>
            <div className="gallery-intro-aside">
              <p>Explore website styles, layouts and color palettes across all six services. Pick a direction you like, and we'll shape a real website around your business.</p>
              <a href="/services#enquiry">Already have a brief? Let's talk <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="gallery-feed-section section-wrap" aria-label="Explore BNB design concepts">
          <GalleryFeed />
        </section>

        <section className="gallery-cta-band">
          <div className="section-wrap gallery-cta-inner">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> YOUR BRAND. YOUR STYLE.</div>
              <h2>See a direction you like?<br /><span>Make it yours.</span></h2>
              <p>These concepts are starting points, not pre-built products. Tell us what you love and what your business actually needs.</p>
            </div>
            <a className="button button-light" href="/services#enquiry">Request a custom quote <Arrow /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <a className="brand footer-brand" href="/"><span className="brand-mark">B<span>N</span>B</span><span className="brand-name">BOARD N BYTE</span></a>
          <p>Digital ideas. Real-world tech.<br />Built for what's next.</p>
          <div className="footer-links"><a href="/">Home</a><a href="/services">Services</a><a href="/gallery">Design gallery</a><a href="/#store">Tech store</a></div>
          <a className="back-top" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>BACK TO TOP ↑</a>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} BNB — BOARD N BYTE</span><span>DESIGN WITH INTENTION. <b>✳</b></span><span>INDIA</span></div>
      </footer>
    </div>
  );
}

export default GalleryPage;
