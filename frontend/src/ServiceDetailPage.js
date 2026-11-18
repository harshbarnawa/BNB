import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getService, services } from './servicesData';
import ServicePackages from './ServicePackages';
import './App.css';
import './ServicesPage.css';
import './ServiceDetailPage.css';

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
);

function ServiceDetailPage() {
  const { category } = useParams();
  const service = getService(category);

  useEffect(() => {
    if (!service) return undefined;
    const previousTitle = document.title;
    document.title = service.label + ' | BNB — Board N Byte';
    window.scrollTo(0, 0);
    return () => { document.title = previousTitle; };
  }, [service]);

  if (!service) return <Navigate to="/services" replace />;

  const briefLink = '/services?service=' + encodeURIComponent(service.id) + '#enquiry';
  const others = services.filter((item) => item.id !== service.id);

  return (
    <div className="site-shell svc-page cat-page">
      <div className="announcement">
        <span className="announcement-dot" />
        <span>BOARD N BYTE / DIGITAL SERVICES</span>
        <a href="/#store">VISIT THE TECH STORE <Arrow /></a>
      </div>

      <header className="site-header svc-header">
        <a className="brand" href="/" aria-label="BNB home">
          <span className="brand-mark">B<span>N</span>B</span>
          <span className="brand-name">BOARD N BYTE</span>
        </a>
        <nav className="svc-top-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/services" aria-current="page">Services</a>
          <a href="/gallery">Design gallery</a>
          <a href="/#store">Tech store</a>
        </nav>
        <a className="header-cta svc-header-cta" href={briefLink}>Start a brief <Arrow /></a>
      </header>

      <main>
        <section className="cat-hero section-wrap">
          <div className="cat-breadcrumb"><a href="/services">ALL SERVICES</a><span>/</span><span>{service.label.toUpperCase()}</span></div>
          <div className="cat-hero-grid">
            <div className="cat-hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> {service.eyebrow}</div>
              <h1>{service.headline}<br /><span>{service.highlight}</span></h1>
              <p>{service.introduction}</p>
              <div className="cat-actions">
                <a className="button button-dark" href={briefLink}>Plan this project <Arrow /></a>
                <a className="text-link" href="#packages">Compare packages <Arrow /></a>
              </div>
            </div>
            <div className="cat-feature" aria-hidden="true">
              <div className="cat-feature-top"><span>BNB / DIGITAL STUDIO</span><span>{service.mark} / 06</span></div>
              <div className="cat-feature-circle" />
              <div className="cat-feature-center">
                <span>{service.eyebrow}</span>
                <strong>{service.label.split(' ').slice(0, -1).join(' ')}<br /><em>{service.label.split(' ').slice(-1)}</em></strong>
              </div>
              <div className="cat-feature-bottom"><span>MADE WITH INTENTION</span><span>✳</span></div>
            </div>
          </div>
        </section>

        <div className="cat-strip">
          <div className="section-wrap cat-strip-inner"><span>{service.label.toUpperCase()}</span><span>✳</span><span>THOUGHTFUL DIGITAL EXPERIENCES</span><span>BNB / BOARD N BYTE</span></div>
        </div>

        <section className="section-wrap cat-possibilities" id="possibilities">
          <div className="cat-section-header">
            <div className="eyebrow"><span className="eyebrow-line" /> THE OPPORTUNITY</div>
            <h2>What could we<br /><span>make possible?</span></h2>
          </div>
          <div className="cat-outcome-grid">
            {service.outcomes.map((outcome, index) => (
              <article className="cat-outcome" key={outcome.title}>
                <span>0{index + 1} / THE VALUE</span>
                <h3>{outcome.title}</h3>
                <p>{outcome.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cat-deliverables">
          <div className="section-wrap cat-deliverables-grid">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> POSSIBLE PROJECT SCOPE</div>
              <h2>Built around<br /><span>what matters.</span></h2>
              <p>These are examples of what a {service.label.toLowerCase()} project can involve. We finalise the exact scope, timeline and deliverables together before starting.</p>
              <a className="button button-dark" href={briefLink}>Discuss your requirements <Arrow /></a>
            </div>
            <div className="cat-deliverable-list">
              {service.deliverables.map((item, index) => (
                <div className="cat-deliverable" key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                  <span className="cat-list-star">✳</span>
                </div>
              ))}
              <p className="cat-note">{service.note}</p>
            </div>
          </div>
        </section>

        <section className="section-wrap cat-audience">
          <div className="cat-section-header">
            <div className="eyebrow"><span className="eyebrow-line" /> WHO THIS IS FOR</div>
            <h2>Built for people<br /><span>moving forward.</span></h2>
          </div>
          <div className="cat-audience-grid">
            {service.audience.map((item, index) => (
              <div key={item}><span>0{index + 1}</span><p>{item}</p></div>
            ))}
          </div>
        </section>

        <ServicePackages serviceId={service.id} />

        <section className="cat-next-step">
          <div className="section-wrap cat-next-step-inner">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> THE NEXT STEP</div>
              <h2>Have an idea?<br /><span>Give it direction.</span></h2>
              <p>Share the essentials in a project brief. We can use it as a starting point to discuss scope and a quotation.</p>
              <div className="cat-honesty">Enquiry submissions work only after the BNB backend is configured. A project brief is not a confirmed booking or quotation.</div>
            </div>
            <a className="button button-light" href={briefLink}>Prepare your {service.label.toLowerCase()} brief <Arrow /></a>
          </div>
        </section>

        <section className="section-wrap cat-more">
          <div className="cat-more-header">
            <div><div className="eyebrow"><span className="eyebrow-line" /> KEEP EXPLORING</div><h2>Other ways<br /><span>we can build.</span></h2></div>
            <a className="text-link" href="/services">All services <Arrow /></a>
          </div>
          <div className="cat-more-list">
            {others.map((item) => (
              <a href={'/services/' + item.id} key={item.id}>
                <span>{item.mark}</span>
                <strong>{item.label}</strong>
                <Arrow />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <a className="brand footer-brand" href="/"><span className="brand-mark">B<span>N</span>B</span><span className="brand-name">BOARD N BYTE</span></a>
          <p>Digital ideas. Real-world tech.<br />Built for what's next.</p>
          <div className="footer-links"><a href="/">Home</a><a href="/services">Services</a><a href="/gallery">Design gallery</a><a href="/#store">Tech store</a></div>
          <button className="back-top cat-back-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>BACK TO TOP ↑</button>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} BNB — BOARD N BYTE</span><span>MADE WITH INTENTION. <b>✳</b></span><span>INDIA</span></div>
      </footer>
    </div>
  );
}

export default ServiceDetailPage;
