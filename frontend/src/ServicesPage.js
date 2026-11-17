import { useEffect, useState } from 'react';
import { services } from './servicesData';
import EnquiryForm from './EnquiryForm';
import './App.css';
import './ServicesPage.css';

const process = [
  { number: '01', title: 'Discover', description: 'We understand the business, audience, goals and what success should look like.' },
  { number: '02', title: 'Define', description: 'We agree on scope, deliverables, milestones and a proposal before development.' },
  { number: '03', title: 'Build', description: 'Design and development move forward with feedback at sensible checkpoints.' },
  { number: '04', title: 'Deliver', description: 'We prepare handover, ownership details and an agreed support plan.' }
];

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
);

function ServicesPage() {
  const [selected, setSelected] = useState(() => {
    const serviceId = new URLSearchParams(window.location.search).get('service');
    return services.find((service) => service.id === serviceId)?.label || services[0].label;
  });
  const [requirements, setRequirements] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (!window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) window.requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  const brief = [
    'BNB — PROJECT BRIEF',
    '',
    'Service: ' + selected,
    'Requirements:',
    requirements.trim() || 'To be discussed',
    '',
    'Next step: Discuss scope, timeline and quotation.'
  ].join('\n');

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  const chooseService = (label) => {
    setSelected(label);
    setCopied(false);
    setCopyError(false);
  };

  return (
    <div className="site-shell svc-page">
      <div className="announcement">
        <span className="announcement-dot" />
        <span>DIGITAL SERVICES / BOARD N BYTE</span>
        <a href="/#store">EXPLORE THE TECH STORE <Arrow /></a>
      </div>

      <header className="site-header svc-header">
        <a className="brand" href="/" aria-label="BNB home">
          <span className="brand-mark">B<span>N</span>B</span>
          <span className="brand-name">BOARD N BYTE</span>
        </a>
        <nav className="svc-top-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/services" aria-current="page">Services</a>
          <a href="/#gallery">Design gallery</a>
          <a href="/#store">Tech store</a>
        </nav>
        <a className="header-cta svc-header-cta" href="#brief">Plan a project <Arrow /></a>
      </header>

      <main>
        <section className="svc-hero section-wrap">
          <div className="svc-hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> BNB / THE DIGITAL STUDIO</div>
            <h1>Good ideas.<br /><span>Built to last.</span></h1>
            <p>From your first website to the tools behind your business, we design and build digital experiences with clarity, purpose and room to grow.</p>
            <div className="svc-hero-actions">
              <a className="button button-dark" href="#categories">Explore services <Arrow /></a>
              <a className="text-link" href="#process">How we work <Arrow /></a>
            </div>
            <p className="svc-hero-micro"><span className="status-pulse" /> INDEPENDENT DIGITAL STUDIO · BUILT AROUND YOUR GOALS</p>
          </div>
          <div className="svc-hero-art" aria-hidden="true">
            <div className="svc-art-label">THINK / DESIGN / DEVELOP</div>
            <div className="svc-art-orbit svc-orbit-a" />
            <div className="svc-art-orbit svc-orbit-b" />
            <div className="svc-art-window">
              <div className="svc-art-bar"><span /><span /><span /><small>your-next-idea.studio</small></div>
              <div className="svc-art-content">
                <span>BUILD WHAT'S NEXT</span>
                <strong>Make it<br /><em>matter.</em></strong>
                <i>EXPLORE THE POSSIBILITIES ↗</i>
              </div>
            </div>
            <div className="svc-art-corner">BNB®<br />DIGITAL</div>
          </div>
        </section>

        <div className="svc-ribbon">
          <div className="section-wrap svc-ribbon-inner"><span>ONE STUDIO</span><span className="svc-ribbon-star">✳</span><span>MANY POSSIBILITIES</span><span className="svc-ribbon-end">DESIGNED WITH INTENTION</span></div>
        </div>

        <section className="section-wrap svc-categories" id="categories">
          <div className="svc-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> WHAT WE BUILD</div><h2>Built for your<br /><span>next chapter.</span></h2></div>
            <p>Start with a direction. We will shape the right deliverables around your goals instead of forcing a one-size-fits-all package.</p>
          </div>
          <div className="svc-card-grid">
            {services.map((service) => (
              <article className="svc-card" id={service.id} key={service.id}>
                <div className="svc-card-top"><span>{service.mark} / DIGITAL SERVICES</span><span className="svc-card-plus">✳</span></div>
                <h3>{service.label}</h3>
                <strong>{service.short}</strong>
                <p>{service.description}</p>
                <div className="svc-card-details">{service.details}</div>
                <a href={'/services/' + service.id}>Explore this service <Arrow /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="svc-process" id="process">
          <div className="section-wrap">
            <div className="svc-heading svc-process-heading">
              <div><div className="eyebrow"><span className="eyebrow-line" /> OUR APPROACH</div><h2>Clear steps.<br /><span>Better outcomes.</span></h2></div>
              <p>We keep scope, communication and ownership clear from the first conversation through handover.</p>
            </div>
            <div className="svc-steps">
              {process.map((step) => (
                <div className="svc-step" key={step.number}><span>{step.number} / 04</span><h3>{step.title}</h3><p>{step.description}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-wrap svc-options">
          <div className="svc-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> TWO WAYS TO GET STARTED</div><h2>Your idea.<br /><span>Your way.</span></h2></div>
          </div>
          <div className="svc-option-grid">
            <div className="svc-option"><span>01 / DEFINED SCOPE</span><h3>Ready-made packages</h3><p>For common project types with a clearly agreed scope, deliverables and timeline. Packages and prices will be shared when their details are finalized.</p><a href="#brief">Prepare your brief <Arrow /></a></div>
            <div className="svc-option svc-option-dark"><span>02 / TAILORED SCOPE</span><h3>Custom projects</h3><p>For unique requirements. Tell us what you want to build, then we can work through discovery, quotation, milestones and handover.</p><a href="#brief">Describe your project <Arrow /></a></div>
          </div>
        </section>

        <section className="svc-brief-section" id="brief">
          <div className="section-wrap svc-brief-layout">
            <div className="svc-brief-intro">
              <div className="eyebrow"><span className="eyebrow-line" /> START WITH CLARITY</div>
              <h2>Every build starts<br /><span>with a brief.</span></h2>
              <p>Choose your project type and add a few notes. Copy the brief so you have your requirements ready for a conversation.</p>
              <div className="svc-brief-note">This tool only prepares text in your browser. It does not send or save an enquiry with BNB yet.</div>
            </div>
            <div className="svc-brief-form">
              <label htmlFor="svc-service">Service type</label>
              <select id="svc-service" value={selected} onChange={(event) => chooseService(event.target.value)}>
                {services.map((service) => <option key={service.id} value={service.label}>{service.label}</option>)}
              </select>
              <label htmlFor="svc-requirements">What are you looking to build?</label>
              <textarea id="svc-requirements" value={requirements} onChange={(event) => { setRequirements(event.target.value); setCopied(false); setCopyError(false); }} placeholder="Share the goal, audience, features or any ideas you have..." rows="5" maxLength={1500} />
              <div className="svc-brief-preview-label">YOUR BRIEF PREVIEW</div>
              <pre className="svc-brief-preview">{brief}</pre>
              <button className="svc-copy-button" type="button" onClick={copyBrief}>Copy project brief <Arrow /></button>
              <a className="svc-send-link" href="#enquiry">Want BNB to receive your enquiry? Continue to the enquiry form <Arrow /></a>
              {copied && <p className="svc-feedback" role="status">Brief copied. You can paste it when you're ready to discuss your project.</p>}
              {copyError && <p className="svc-feedback" role="status">Clipboard access is unavailable. You can select and copy the preview above manually.</p>}
            </div>
          </div>
        </section>
        <EnquiryForm
          services={services}
          selectedServiceId={services.find((service) => service.label === selected)?.id || services[0].id}
          onServiceChange={(id) => chooseService(services.find((service) => service.id === id)?.label || services[0].label)}
        />
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <a className="brand footer-brand" href="/"><span className="brand-mark">B<span>N</span>B</span><span className="brand-name">BOARD N BYTE</span></a>
          <p>Digital ideas. Real-world tech.<br />Built for what's next.</p>
          <div className="footer-links"><a href="/">Home</a><a href="/services">Services</a><a href="/#gallery">Design gallery</a><a href="/#store">Tech store</a></div>
          <a className="back-top" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>BACK TO TOP ↑</a>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} BNB — BOARD N BYTE</span><span>MADE WITH INTENTION. <b>✳</b></span><span>INDIA</span></div>
      </footer>
    </div>
  );
}

export default ServicesPage;
