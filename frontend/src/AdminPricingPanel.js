import { useEffect, useState } from 'react';
import { apiRequest } from './api';
import { services } from './servicesData';
import './AdminPricingPanel.css';

const rupees = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(value);

function AdminPricingPanel({ token }) {
  const [activeService, setActiveService] = useState(services[0].id);
  const [packages, setPackages] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await apiRequest('/api/packages/admin', { token });
        if (!active) return;
        setPackages(response.packages || []);
        setDrafts(Object.fromEntries((response.packages || []).map((item) => [
          item.serviceId + ':' + item.tierId,
          {
            price: item.draftPriceINR == null ? '' : String(item.draftPriceINR),
            published: Boolean(item.published)
          }
        ])));
      } catch (error) {
        if (active) setFeedback({ type: 'error', message: error.message });
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [token]);

  const updateDraft = (key, changes) => {
    setDrafts((current) => ({
      ...current,
      [key]: { ...current[key], ...changes }
    }));
    setFeedback(null);
  };

  const save = async (item) => {
    const key = item.serviceId + ':' + item.tierId;
    const draft = drafts[key];
    const price = Number(draft?.price);

    if (!Number.isSafeInteger(price) || price < 1000 || price > 50000000) {
      setFeedback({ type: 'error', message: 'Enter a starting price between ₹1,000 and ₹5,00,00,000.' });
      return;
    }

    setSaving(key);
    setFeedback(null);
    try {
      const result = await apiRequest('/api/packages/' + item.serviceId + '/' + item.tierId, {
        method: 'PATCH',
        token,
        body: { startingPriceINR: price, published: Boolean(draft?.published) }
      });

      setPackages(result.packages || []);
      setDrafts(Object.fromEntries((result.packages || []).map((entry) => [
        entry.serviceId + ':' + entry.tierId,
        {
          price: entry.draftPriceINR == null ? '' : String(entry.draftPriceINR),
          published: Boolean(entry.published)
        }
      ])));
      setFeedback({ type: 'success', message: result.message + ' Updates to the public prices are now available.' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setSaving('');
    }
  };

  const current = packages.filter((item) => item.serviceId === activeService && item.editable);

  return (
    <section className="admin-pricing-panel" id="pricing" aria-labelledby="admin-pricing-heading">
      <div className="admin-pricing-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> SERVICE CATALOGUE / PRICING CONTROL</div>
          <h2 id="admin-pricing-heading">Packages & starting prices.</h2>
          <p>Set indicative starting prices for each service. A draft price is never shown publicly until you enable Publish and save it. Custom projects always require a quote.</p>
        </div>
        <a href="/services#packages" target="_blank" rel="noopener noreferrer">Public packages ↗</a>
      </div>

      <div className="admin-pricing-tabs" role="group" aria-label="Choose service category">
        {services.map((service) => (
          <button
            type="button"
            key={service.id}
            className={activeService === service.id ? 'selected' : ''}
            aria-pressed={activeService === service.id}
            onClick={() => { setActiveService(service.id); setFeedback(null); }}
          >
            {service.label}
          </button>
        ))}
      </div>

      {loading && <p role="status" className="admin-pricing-message">Loading pricing...</p>}
      {!loading && current.length === 0 && <p className="admin-pricing-message">No editable packages found.</p>}
      {!loading && current.length > 0 && (
        <div className="admin-pricing-grid">
          {current.map((item) => {
            const key = item.serviceId + ':' + item.tierId;
            const draft = drafts[key] || { price: '', published: false };
            const publicPrice = item.startingPriceINR;
            return (
              <article className="admin-pricing-card" key={key}>
                <div className="admin-pricing-card-top"><span>{item.tierId.toUpperCase()}</span><span className={item.published ? 'admin-price-live' : 'admin-price-draft'}>{item.published ? 'PRICE LIVE' : 'PRICE HIDDEN'}</span></div>
                <h3>{item.title}</h3>
                <p>{item.tagline}</p>
                <label htmlFor={'price-' + key}>Starting price (INR)</label>
                <input
                  id={'price-' + key}
                  type="number"
                  inputMode="numeric"
                  min="1000"
                  max="50000000"
                  step="1"
                  value={draft.price}
                  onChange={(event) => updateDraft(key, { price: event.target.value })}
                  placeholder="Set a starting price"
                />
                <label className="admin-pricing-toggle">
                  <input type="checkbox" checked={draft.published} onChange={(event) => updateDraft(key, { published: event.target.checked })} />
                  <span>Publish this starting price on the website</span>
                </label>
                <p className="admin-pricing-preview">
                  Current public display: <strong>{publicPrice == null ? 'Price on request' : rupees(publicPrice) + ' onwards'}</strong>
                </p>
                <button type="button" onClick={() => save(item)} disabled={Boolean(saving)}>{saving === key ? 'Saving...' : 'Save package pricing'}</button>
              </article>
            );
          })}
        </div>
      )}
      {feedback && <p className={feedback.type === 'error' ? 'admin-pricing-feedback error' : 'admin-pricing-feedback success'} role="status">{feedback.message}</p>}
      <p className="admin-pricing-footnote">Indicative prices are not binding quotations. Never take a payment based solely on the public starting price. Confirm the scope and quote separately.</p>
    </section>
  );
}

export default AdminPricingPanel;
