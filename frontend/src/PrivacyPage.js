import './App.css';
import './PrivacyPage.css';

function PrivacyPage() {
  return (
    <div className="site-shell privacy-page">
      <div className="announcement"><span className="announcement-dot" /><span>BOARD N BYTE / DIGITAL SERVICES</span></div>
      <header className="site-header">
        <a className="brand" href="/" aria-label="BNB home">
          <img className="brand-logo" src="/brand/bnb-logo.svg" alt="" width="76" height="48" decoding="async" />
          <span className="brand-name">BOARD N BYTE</span>
        </a>
        <a className="header-cta" href="/services#enquiry">Start a project ↗</a>
      </header>
      <main className="section-wrap privacy-content">
        <div className="eyebrow"><span className="eyebrow-line" /> HOW WE HANDLE ENQUIRIES</div>
        <h1>Privacy <span>notice.</span></h1>
        <p className="privacy-intro">Board N Byte (BNB) respects the information you share when asking about a project. This page explains how our website handles service enquiries.</p>
        <p className="privacy-date">Last updated: 18 November 2026</p>

        <section>
          <h2>What information we collect</h2>
          <p>When you submit an enquiry, we collect your name, email address, selected service, project requirements and consent. You may also provide a phone number, company name, budget and preferred package or design reference. Our server may use technical information such as your IP address to help limit spam and abuse.</p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>We use this information to read your request, contact you, discuss the scope, prepare a quotation where appropriate and manage follow-ups. We do not use an enquiry as permission to send unrelated promotional messages.</p>
        </section>
        <section>
          <h2>Where it goes</h2>
          <p>Enquiry details are stored in our application database and can be accessed by authorised BNB administrators. We use service providers for website and server hosting, database storage and transactional email delivery. Enquiry confirmation and notification emails may include details from your submission.</p>
        </section>
        <section>
          <h2>How long we keep it</h2>
          <p>We keep enquiry records while they are needed to manage your request, follow-up discussions and reasonable business records. If you would like to request access, a correction or deletion, email us. We will review the request, subject to applicable record-keeping requirements.</p>
        </section>
        <section>
          <h2>External links</h2>
          <p>Links to third-party websites have their own privacy practices. The BNB Tech Store is currently marked Coming Soon; it does not accept orders or collect payments on this website.</p>
        </section>
        <section>
          <h2>Questions or requests?</h2>
          <p>Contact <a href="mailto:contact.boardnbyte@gmail.com">contact.boardnbyte@gmail.com</a>. We may update this notice as the website and services evolve.</p>
        </section>
        <div className="privacy-actions">
          <a className="button button-dark" href="/services#enquiry">Send a project enquiry ↗</a>
          <a className="text-link" href="/">Back to BNB ↗</a>
        </div>
      </main>
      <footer className="site-footer">
        <div className="section-wrap footer-main">
          <a className="brand footer-brand" href="/"><img className="brand-logo" src="/brand/bnb-logo.svg" alt="" width="76" height="48" decoding="async" /><span className="brand-name">BOARD N BYTE</span></a>
          <p>Digital Services now open.<br />Tech Store coming soon.</p>
          <div className="footer-links">
            <a href="/services">Services</a>
            <a href="/gallery">Design gallery</a>
            <a href="/privacy">Privacy notice</a>
            <a href="mailto:contact.boardnbyte@gmail.com">Contact BNB</a>
          </div>
        </div>
        <div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} BNB — BOARD N BYTE</span><span>INDIA</span></div>
      </footer>
    </div>
  );
}

export default PrivacyPage;
