import { useEffect, useState } from 'react';
import { apiEnabled, apiRequest } from './api';
import { services } from './servicesData';
import './ServicePackages.css';

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
);

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

function ServicePackages({ serviceId, defaultServiceId }) {
  const [activeService, setActiveService] = useState(serviceId || defaultServiceId || services[0].id);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!apiEnabled) {
        setError('Packages are temporarily unavailable. Please use the project enquiry form.');
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest('/api/packages');
        if (active) {
          setPackages(Array.isArray(data.packages) ? data.packages : []);
          setError('');
        }
      } catch {
        if (active) setError('We could not load package details right now. Please request a custom quotation instead.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const selectedService = serviceId || activeService;
  const chosenPackages = packages.filter((item) => item.serviceId === selectedService);
  const quoteLink = (tierId) =>
    '/services?service=' + encodeURIComponent(selectedService) +
    '&package=' + encodeURIComponent(tierId) + '#enquiry';

  return (
    <section className="pkg-section" id="packages" aria-labelledby="pkg-heading">
      <div className="section-wrap">
        <div className="pkg-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> TRANSPARENT OPTIONS / FLEXIBLE SCOPE</div>
            <h2 id="pkg-heading">Simple options.<br /><span>Clear next steps.</span></h2>
          </div>
          <p>Choose a service and compare two packages. For something different, request a custom quote. We confirm the final scope and price before work begins.</p>
        </div>

        {!serviceId && (
          <div className="pkg-service-tabs" role="group" aria-label="Select service for packages">
            {services.map((service) => (
              <button
                type="button"
                key={service.id}
                className={activeService === service.id ? 'pkg-tab selected' : 'pkg-tab'}
                aria-pressed={activeService === service.id}
                onClick={() => setActiveService(service.id)}
              >
                {service.label}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="pkg-state" role="status">Loading service options...</p>}
        {!loading && error && (
          <div className="pkg-state" role="status">{error} <a href={quoteLink('custom')}>Prepare an enquiry <Arrow /></a></div>
        )}
        {!loading && !error && chosenPackages.length === 0 && <p className="pkg-state">No packages are currently available for this service.</p>}

        {!loading && !error && chosenPackages.length > 0 && (
          <>
            <div className="pkg-grid">
              {chosenPackages.filter((item) => item.tierId !== 'custom').map((item, index) => (
                <article className={index === 1 ? 'pkg-card pkg-card-featured' : 'pkg-card'} key={item.serviceId + item.tierId}>
                  <div className="pkg-card-top">
                    <span>0{index + 1} / PACKAGE</span>
                    {index === 1 && <span className="pkg-popular">MORE FEATURES ✳</span>}
                  </div>
                  <h3>{item.title}</h3>
                  <p className="pkg-tagline">{item.tagline}</p>
                  <div className="pkg-price">
                    {item.startingPriceINR != null ? (
                      <>
                        <span>STARTING FROM</span>
                        <strong>{money.format(item.startingPriceINR)}</strong>
                      </>
                    ) : (
                      <>
                        <span>PRICE ON REQUEST</span>
                        <strong>Let's talk.</strong>
                      </>
                    )}
                  </div>
                  <div className="pkg-audience">BEST FOR <strong>{item.bestFor}</strong></div>
                  <div className="pkg-features">
                    <span>WHAT'S INCLUDED IN A TYPICAL PROJECT</span>
                    <ul>
                      {item.scope.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}
                    </ul>
                  </div>
                  <a className="pkg-quote-link" href={quoteLink(item.tierId)}>
                    Request this package <Arrow />
                  </a>
                </article>
              ))}
            </div>
            <div className="pkg-custom-strip">
              <div>
                <span>NEED SOMETHING DIFFERENT?</span>
                <h3>Custom project? We've got you.</h3>
                <p>Tell us what you need. We'll discuss the scope and share a personal quote.</p>
              </div>
              <a href={quoteLink('custom')}>Get a custom quote <Arrow /></a>
            </div>
          </>
        )}
        <p className="pkg-disclaimer">No instant checkout or automatic payment. Every project requires scope confirmation and an agreed written quotation.</p>
      </div>
    </section>
  );
}

export default ServicePackages;
