import { useState } from 'react';
import { apiEnabled, apiRequest } from './api';
import './EnquiryForm.css';

const initialFields = {
  name: '',
  email: '',
  phone: '',
  company: '',
  budget: '',
  requirements: '',
  website: '',
  consent: false
};

export default function EnquiryForm({ services, selectedServiceId, onServiceChange }) {
  const [fields, setFields] = useState(initialFields);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const update = (field, value) => {
    setFields((previous) => ({ ...previous, [field]: value }));
    setResult(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!apiEnabled || submitting) return;

    if (fields.requirements.trim().length < 20) {
      setResult({ type: 'error', message: 'Please describe your project in at least 20 characters.' });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const payload = await apiRequest('/api/leads', {
        method: 'POST',
        body: { ...fields, serviceId: selectedServiceId }
      });
      setResult({
        type: 'success',
        message: 'Enquiry submitted successfully. Reference: ' + payload.reference
      });
      setFields(initialFields);
    } catch (error) {
      setResult({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="enquiry-section" id="enquiry" aria-labelledby="enquiry-heading">
      <div className="section-wrap enquiry-layout">
        <div className="enquiry-intro">
          <div className="eyebrow"><span className="eyebrow-line" /> LET'S TALK ABOUT YOUR PROJECT</div>
          <h2 id="enquiry-heading">A real project<br /><span>starts here.</span></h2>
          <p>Tell us a little about what you are building. When submissions are enabled, your enquiry is saved securely for follow-up by BNB.</p>
          <div className="enquiry-info">
            <strong>What happens next?</strong>
            <p>We'll review the brief, discuss requirements, then share a proposal and quotation where appropriate. Sending an enquiry is not a paid booking.</p>
          </div>
        </div>

        <form className="enquiry-form" onSubmit={submit}>
          <div className="enquiry-form-heading"><span>PROJECT ENQUIRY</span><span>BNB / DIGITAL STUDIO</span></div>
          <div className="enquiry-fields-two">
            <div className="enquiry-field"><label htmlFor="enquiry-name">Your name *</label><input id="enquiry-name" value={fields.name} onChange={(e) => update('name', e.target.value)} minLength="2" maxLength="100" autoComplete="name" required placeholder="Full name" /></div>
            <div className="enquiry-field"><label htmlFor="enquiry-email">Email address *</label><input id="enquiry-email" type="email" value={fields.email} onChange={(e) => update('email', e.target.value)} maxLength="254" autoComplete="email" required placeholder="you@example.com" /></div>
          </div>
          <div className="enquiry-fields-two">
            <div className="enquiry-field"><label htmlFor="enquiry-phone">Phone (optional)</label><input id="enquiry-phone" type="tel" value={fields.phone} onChange={(e) => update('phone', e.target.value)} maxLength="30" autoComplete="tel" placeholder="+91 ..." /></div>
            <div className="enquiry-field"><label htmlFor="enquiry-company">Company (optional)</label><input id="enquiry-company" value={fields.company} onChange={(e) => update('company', e.target.value)} maxLength="100" autoComplete="organization" placeholder="Company or brand" /></div>
          </div>
          <div className="enquiry-field"><label htmlFor="enquiry-service">Service *</label><select id="enquiry-service" value={selectedServiceId} onChange={(e) => onServiceChange(e.target.value)} required>{services.map((service) => <option value={service.id} key={service.id}>{service.label}</option>)}</select></div>
          <div className="enquiry-field"><label htmlFor="enquiry-budget">Estimated budget (optional)</label><input id="enquiry-budget" value={fields.budget} onChange={(e) => update('budget', e.target.value)} maxLength="80" placeholder="Your range, or leave blank" /></div>
          <div className="enquiry-field"><label htmlFor="enquiry-requirements">Project requirements *</label><textarea id="enquiry-requirements" rows="5" value={fields.requirements} onChange={(e) => update('requirements', e.target.value)} minLength="20" maxLength="3000" required placeholder="What would you like to build, and what should it help you achieve?" /></div>
          <div className="enquiry-honeypot" aria-hidden="true"><label htmlFor="enquiry-website">Website</label><input id="enquiry-website" value={fields.website} onChange={(e) => update('website', e.target.value)} tabIndex="-1" autoComplete="off" /></div>
          <label className="enquiry-consent"><input type="checkbox" checked={fields.consent} onChange={(e) => update('consent', e.target.checked)} required /><span>I agree to BNB storing my contact information and project details to respond to this enquiry. *</span></label>
          {!apiEnabled && <div className="enquiry-not-live" role="status">Online enquiry submissions are being configured. You can still prepare and copy a project brief above.</div>}
          <button className="enquiry-submit" type="submit" disabled={!apiEnabled || submitting}>{submitting ? 'Submitting...' : 'Send project enquiry'} <span aria-hidden="true">↗</span></button>
          {result && <p className={result.type === 'success' ? 'enquiry-result success' : 'enquiry-result error'} role="status">{result.message}</p>}
          <p className="enquiry-fine">We don't request passwords, card details or advance payments through this form.</p>
        </form>
      </div>
    </section>
  );
}
