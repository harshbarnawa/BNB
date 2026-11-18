import { useState } from 'react';
import GalleryFeed from './GalleryFeed';
import './App.css';

const ArrowUpRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M3.5 10h13M10 3.5l6.5 6.5-6.5 6.5" />
  </svg>
);

const services = [
  { number: '01', title: 'Websites that work harder.', description: 'High-performing websites that make your brand impossible to ignore.', tag: 'WEB DEVELOPMENT', icon: '↗' },
  { number: '02', title: 'E-commerce, made effortless.', description: 'Online stores built to turn curious visitors into happy customers.', tag: 'E-COMMERCE', icon: '▦' },
  { number: '03', title: 'Software without limits.', description: 'Purpose-built web apps and tools for the way your business works.', tag: 'CUSTOM SOFTWARE', icon: '⌘' },
];


function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        <span>Good ideas deserve great execution.</span>
        <a href="/services">LET'S BUILD SOMETHING <ArrowUpRight /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="BNB home" onClick={closeMenu}>
          <img className="brand-logo" src="/brand/bnb-logo.svg" alt="" width="76" height="48" decoding="async" />
          <span className="brand-name">BOARD N BYTE</span>
        </a>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          <span /><span />
        </button>

        <nav className={menuOpen ? 'main-nav nav-open' : 'main-nav'}>
          <a href="/services" onClick={closeMenu}>Services</a>
          <a href="#gallery" onClick={closeMenu}>Design gallery</a>
          <a href="/store" onClick={closeMenu}>Store</a>
          <a href="#about" onClick={closeMenu}>About</a>
        </nav>

        <a className="header-cta" href="/services#enquiry">
          Start a project <ArrowUpRight />
        </a>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT MOVE STARTS HERE</div>
            <h1>Build better.<br /><span>Think bigger.</span></h1>
            <p className="hero-description">A digital studio and tech store for people who are building what’s next. From your first website to your next desk setup — we’ve got you.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#services">Explore BNB <ArrowUpRight /></a>
              <a className="text-link" href="#about">Get to know us <ArrowRight /></a>
            </div>
            <div className="hero-footnote"><span className="status-pulse" /> INDEPENDENT DIGITAL STUDIO <span className="footnote-divider">/</span> BUILT FOR WHAT'S NEXT</div>
          </div>

          <div className="hero-panels">
            <a className="hero-panel panel-services" href="/services">
              <div className="panel-top"><span>01 / DIGITAL SERVICES</span><span className="panel-arrow"><ArrowUpRight /></span></div>
              <div className="service-art" aria-hidden="true">
                <div className="art-window">
                  <div className="art-window-bar"><i /><i /><i /><span>yourbrand.studio</span></div>
                  <div className="art-window-content"><div className="art-kicker">MAKE IT MATTER</div><div className="art-headline">Ideas into<br /><em>experiences.</em></div><div className="art-button">EXPLORE <b>↗</b></div></div>
                </div>
                <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-star">✳</div>
              </div>
              <div className="panel-bottom"><div><h2>Digital Services</h2><p>Websites, software & digital experiences.</p></div><span className="circle-arrow"><ArrowUpRight /></span></div>
            </a>

            <a className="hero-panel panel-store" href="/store">
              <div className="panel-top"><span>02 / TECH STORE</span><span className="panel-arrow"><ArrowUpRight /></span></div>
              <div className="store-art" aria-hidden="true">
                <div className="keyboard">
                  {Array.from({ length: 4 }).map((_, row) => <div className="key-row" key={row}>{Array.from({ length: row === 3 ? 6 : 10 }).map((__, key) => <i key={key} className={(row + key) % 7 === 0 ? 'key key-accent' : 'key'} />)}</div>)}
                </div>
                <div className="mouse-art"><div /></div>
                <div className="store-art-label">SET UP YOUR SPACE<span>CURATED TECH ESSENTIALS</span></div>
                <div className="art-plus">+</div>
              </div>
              <div className="panel-bottom"><div><h2>Tech Store</h2><p>PC accessories & everyday tech.</p></div><span className="circle-arrow"><ArrowUpRight /></span></div>
            </a>
          </div>
        </section>

        <section className="trust-strip">
          <div className="section-wrap trust-inner"><span>ONE BRAND.</span><span className="trust-symbol">✳</span><span>TWO WORLDS.</span><span className="trust-divider" /><span className="trust-muted">DIGITAL THINKING MEETS EVERYDAY TECH.</span></div>
        </section>

        <section className="services-section section-wrap" id="services">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> WHAT WE CAN BUILD</div><h2>Big ideas.<br /><span>Built properly.</span></h2></div>
            <div className="heading-aside"><p>From a sharp online presence to software that solves real problems, we turn ambitious ideas into useful digital experiences.</p><a className="text-link" href="/services#enquiry">Tell us what you're thinking <ArrowRight /></a></div>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <a className="service-row" href={service.number === '01' ? '/services#business' : service.number === '02' ? '/services#commerce' : '/services#custom'} key={service.number}>
                <span className="service-number">{service.number}</span><div className="service-main"><span className="service-tag">{service.tag}</span><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-icon">{service.icon}</span><span className="service-link"><ArrowUpRight /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="gallery-section" id="gallery">
          <div className="section-wrap">
            <div className="section-heading gallery-heading">
              <div><div className="eyebrow"><span className="eyebrow-line" /> THE BNB DESIGN GALLERY</div><h2>Find your look.<br /><span>Let's build it.</span></h2></div>
              <div className="heading-aside"><p>Browse original visual concepts across all six service categories. Pick a style you love and request something tailored to your brand.</p><a className="text-link" href="/gallery">See all design ideas <ArrowRight /></a></div>
            </div>
            <GalleryFeed compact />
          </div>
        </section>

        <section className="store-section section-wrap" id="store" aria-labelledby="store-heading">
          <div className="store-coming-soon">
            <div className="store-coming-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> 02 / THE BNB TECH STORE</div>
              <span className="store-launch-label"><span className="status-pulse" /> STORE EXPERIENCE LIVE</span>
              <h2 id="store-heading">Good gear.<br /><span>Meet your setup.</span></h2>
              <p>Explore our retail-style Tech Store, discover PC parts and peripherals, and try the working shopping experience. Demo items are illustrative; real listings will roll out in phases.</p>
              <div className="store-launch-actions">
                <a className="button button-dark" href="/store">Explore BNB Tech Store <ArrowUpRight /></a>
                <a className="text-link" href="mailto:contact.boardnbyte@gmail.com?subject=BNB%20Tech%20Enquiry">Ask us about tech <ArrowRight /></a>
              </div>
            </div>
            <div className="store-coming-visual" aria-hidden="true">
              <div className="store-orbit-one" /><div className="store-orbit-two" />
              <span className="store-big-symbol">⌘</span>
              <div className="store-visual-label">BOARD N BYTE / TECH STORE <span>READY TO EXPLORE ✳</span></div>
            </div>
          </div>
        </section>

        <section className="about-band" id="about">
          <div className="section-wrap about-inner"><div className="eyebrow"><span className="eyebrow-line" /> A LITTLE ABOUT BNB</div><h2>We like making<br />things <span>make sense.</span></h2><div className="about-bottom"><p>BNB brings digital services and useful technology together under one roof. One team, thoughtful work, and a belief that the details matter.</p><a className="button button-light" href="/services#enquiry">Plan a project <ArrowUpRight /></a></div><div className="about-stamp">BNB<br /><span>BUILD<br />WHAT'S<br />NEXT</span></div></div>
        </section>

        <section className="contact-section section-wrap" id="contact">
          <div><div className="eyebrow"><span className="eyebrow-line" /> HAVE SOMETHING IN MIND?</div><h2>Let's make<br /><span>it happen.</span></h2></div>
          <div className="contact-right"><p>Have a project to build, a question to ask, or just want to say hello? Our inbox is open.</p><a className="contact-direct-link" href="mailto:contact.boardnbyte@gmail.com">contact.boardnbyte@gmail.com <ArrowUpRight /></a><a className="button button-dark" href="/services#enquiry">Send a project enquiry <ArrowUpRight /></a><span>PROJECT ENQUIRIES ARE OPEN</span></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-main"><a className="brand footer-brand" href="#home"><img className="brand-logo" src="/brand/bnb-logo.svg" alt="" width="76" height="48" decoding="async" /><span className="brand-name">BOARD N BYTE</span></a><p>Digital ideas. Real-world tech.<br />Built for what's next.</p><div className="footer-links"><a href="/services">Services</a><a href="#gallery">Design gallery</a><a href="/store">Tech Store</a><a href="#contact">Contact</a><a href="/privacy">Privacy notice</a><a href="mailto:contact.boardnbyte@gmail.com">Email BNB</a></div><a className="back-top" href="#home">BACK TO TOP ↑</a></div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} BNB — BOARD N BYTE</span><span>MADE WITH INTENTION. <b>✳</b></span><span>INDIA</span></div>
      </footer>
    </div>
  );
}

export default App;
