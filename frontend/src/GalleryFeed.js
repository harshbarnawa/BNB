import { useEffect, useMemo, useState } from 'react';
import { services } from './servicesData';
import { galleryConcepts, galleryStyles } from './galleryData';
import './GalleryFeed.css';

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 15 15 5M6 5h9v9" />
  </svg>
);

function GalleryFeed({ compact = false }) {
  const [category, setCategory] = useState('all');
  const [style, setStyle] = useState('All styles');
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState(null);

  const active = galleryConcepts.find((item) => item.id === activeId);
  const visible = useMemo(() => {
    const source = compact
      ? galleryConcepts.filter((item, index, items) => items.findIndex((other) => other.serviceId === item.serviceId) === index)
      : galleryConcepts;

    return source.filter((item) => {
      const matchesCategory = category === 'all' || category === item.serviceId;
      const matchesStyle = style === 'All styles' || style === item.style;
      const term = search.trim().toLowerCase();
      const matchesSearch = !term ||
        [item.title, item.subtitle, item.category, item.style, item.mood].some((value) => value.toLowerCase().includes(term));
      return matchesCategory && matchesStyle && matchesSearch;
    });
  }, [compact, category, style, search]);

  useEffect(() => {
    if (!activeId) return undefined;

    const onEscape = (event) => {
      if (event.key === 'Escape') setActiveId(null);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [activeId]);

  const quoteLink = (item) =>
    '/services?service=' + encodeURIComponent(item.serviceId) +
    '&package=custom&reference=' + encodeURIComponent(item.id) + '#enquiry';

  return (
    <div className={compact ? 'inspo-feed inspo-feed-compact' : 'inspo-feed'}>
      {!compact && (
        <div className="inspo-filters">
          <div className="inspo-tabs" role="group" aria-label="Filter designs by service category">
            <button className={category === 'all' ? 'active' : ''} type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All designs <span>{galleryConcepts.length}</span></button>
            {services.map((service) => (
              <button key={service.id} className={category === service.id ? 'active' : ''} type="button" aria-pressed={category === service.id} onClick={() => setCategory(service.id)}>
                {service.label}
              </button>
            ))}
          </div>
          <div className="inspo-search-row">
            <label className="inspo-search">
              <span className="inspo-sr">Search design ideas</span>
              <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="9" r="6" /><path d="m13.5 13.5 4 4" /></svg>
              <input type="search" value={search} placeholder="Search ideas, styles..." onChange={(event) => setSearch(event.target.value)} />
            </label>
            <label className="inspo-style-control">
              <span className="inspo-sr">Filter by visual style</span>
              <select value={style} onChange={(event) => setStyle(event.target.value)}>{galleryStyles.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <span className="inspo-count">{visible.length} VISUAL CONCEPTS</span>
          </div>
        </div>
      )}

      <div className="inspo-grid">
        {visible.map((item, index) => (
          <button className="inspo-card" key={item.id} type="button" onClick={() => setActiveId(item.id)} aria-label={'Preview ' + item.title + ' ' + item.subtitle}>
            <span className="inspo-card-image">
              <img src={item.image} alt={item.title + ' — ' + item.subtitle + ' concept website preview'} width="1200" height="800" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
              <span className="inspo-image-hover">View design <Arrow /></span>
              <span className="inspo-image-label">DESIGN CONCEPT</span>
            </span>
            <span className="inspo-card-content">
              <span className="inspo-card-meta">{item.category.toUpperCase()} <span>·</span> {item.style.toUpperCase()}</span>
              <span className="inspo-card-title">{item.title} <span aria-hidden="true">↗</span></span>
              <span className="inspo-card-subtitle">{item.subtitle}</span>
              <span className="inspo-swatches" aria-label={'Color palette: ' + item.colors.join(', ')}>
                {item.colors.map((color) => <i key={color} style={{ background: color }} />)}
              </span>
            </span>
          </button>
        ))}
      </div>

      {!visible.length && <div className="inspo-empty">No concepts match those filters. Try another service or style.</div>}

      <p className="inspo-disclaimer">Original BNB design concepts for visual inspiration, not launched client projects or interactive demos. Final design, features and deliverables are agreed per project.</p>

      {compact && (
        <a className="inspo-view-all" href="/gallery">Explore the full design feed <span>12 CONCEPTS / 6 SERVICES</span> <Arrow /></a>
      )}

      {active && (
        <div className="inspo-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveId(null); }}>
          <div className="inspo-modal" role="dialog" aria-modal="true" aria-label={active.title + ' design concept'}>
            <button className="inspo-close" type="button" onClick={() => setActiveId(null)} aria-label="Close design preview">✕</button>
            <div className="inspo-modal-image"><img src={active.image} alt={'Large ' + active.title + ' design concept preview'} width="1200" height="800" /></div>
            <div className="inspo-modal-detail">
              <span className="inspo-modal-label">{active.category.toUpperCase()} / {active.style.toUpperCase()} / VISUAL REFERENCE</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <div className="inspo-modal-palette">{active.colors.map((color) => <span key={color}><i style={{ background: color }} />{color.toUpperCase()}</span>)}</div>
              <a href={quoteLink(active)} className="inspo-modal-cta">Build something like this <Arrow /></a>
              <small>This is a visual direction, not an existing client site or a ready-made template. We'll tailor the final experience to your brand.</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryFeed;
