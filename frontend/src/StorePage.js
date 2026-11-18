import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiEnabled, apiRequest } from './api';
import { demoProducts, storeCategories, categoryName, rupees, normalizeStoreProduct } from './storeData';
import { StoreProductArt, StoreProductImage } from './StoreProductArt';
import './App.css';
import './StorePage.css';

const Arrow = () => (
  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z" /></svg>
);

function ProductCard({ product, onOpen, saved, onSave, onAdd }) {
  const discount = product.priceINR != null && product.compareAtINR > product.priceINR
    ? Math.round((1 - product.priceINR / product.compareAtINR) * 100)
    : null;

  return (
    <article className="shop-product">
      <button className="shop-product-photo" type="button" onClick={() => onOpen(product)} aria-label={'View ' + product.name + ' details'}>
        <StoreProductImage product={product} />
        <span className="shop-product-quick">View details <Arrow /></span>
      </button>
      <button type="button" className={'shop-save' + (saved ? ' is-saved' : '')} onClick={() => onSave(product)} aria-label={saved ? 'Remove ' + product.name + ' from saved items' : 'Save ' + product.name}>
        <HeartIcon filled={saved} />
      </button>
      {product.isDemo && <span className="shop-sample-mark">DEMO</span>}
      {discount != null && discount > 0 && <span className="shop-discount">-{discount}%</span>}
      <div className="shop-product-information">
        <div className="shop-product-eyebrow">{product.brand || 'BNB'} / {categoryName(product.category)}</div>
        <button className="shop-product-title" type="button" onClick={() => onOpen(product)}>{product.name}</button>
        <p className="shop-product-desc">{product.description}</p>
        <div className="shop-product-prices">
          <strong>{product.priceINR != null ? rupees(product.priceINR) : 'Get a quote'}</strong>
          {product.compareAtINR > product.priceINR && product.priceINR != null && <del>{rupees(product.compareAtINR)}</del>}
        </div>
        {product.isDemo && <span className="shop-demo-price-note">Illustrative price · not for sale</span>}
        {!product.isDemo && product.mode === 'affiliate' ? (
          <a className="shop-product-action" target="_blank" rel="sponsored noopener noreferrer" href={product.externalUrl}>View at retailer <Arrow /></a>
        ) : product.isDemo ? (
          <button className="shop-product-action" type="button" onClick={() => onAdd(product)}>Add to demo bag <span>+</span></button>
        ) : (
          <a className="shop-product-action" href={'mailto:contact.boardnbyte@gmail.com?subject=' + encodeURIComponent('BNB product enquiry: ' + product.name)}>Enquire about product <Arrow /></a>
        )}
      </div>
    </article>
  );
}

function StorePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [savedOnly, setSavedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saved, setSaved] = useState([]);
  const [cart, setCart] = useState({});
  const [bagOpen, setBagOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catalogueError, setCatalogueError] = useState('');
  const [viewDemo, setViewDemo] = useState(false);
  const [params, setParams] = useSearchParams();

  useEffect(() => {
    let active = true;
    if (!apiEnabled) {
      setLoading(false);
      setCatalogueError('Live catalogue is not connected. You are viewing the store UI demonstration.');
      return undefined;
    }
    apiRequest('/api/store/products')
      .then((response) => {
        if (!active) return;
        setProducts(Array.isArray(response.products) ? response.products.map(normalizeStoreProduct) : []);
        setCatalogueError('');
      })
      .catch(() => {
        if (active) setCatalogueError('Live products are temporarily unavailable. Showing our demo store instead.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const hasRealProducts = products.length > 0;
  const demoMode = viewDemo || !hasRealProducts;
  const catalogue = useMemo(() => demoMode
    ? demoProducts.map(normalizeStoreProduct)
    : products, [demoMode, products]);

  const result = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const subset = catalogue.filter((item) =>
      (category === 'all' || item.category === category) &&
      (!needle || [item.name, item.brand, item.description, categoryName(item.category)].some((value) => String(value || '').toLowerCase().includes(needle))) &&
      (item.priceINR == null || item.priceINR <= maxPrice) &&
      (!savedOnly || saved.includes(item.id))
    );
    return [...subset].sort((a, b) => {
      if (sort === 'low') return (a.priceINR ?? Infinity) - (b.priceINR ?? Infinity);
      if (sort === 'high') return (b.priceINR ?? -1) - (a.priceINR ?? -1);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [catalogue, query, category, sort, maxPrice, savedOnly, saved]);

  const current = catalogue.find((p) => p.id === params.get('product'));
  const totalCartItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const totalCartPrice = demoProducts.reduce((total, item) => total + (item.priceINR || 0) * (cart[item.id] || 0), 0);

  const closeProduct = () => setParams((currentParams) => {
    const updated = new URLSearchParams(currentParams);
    updated.delete('product');
    return updated;
  }, { replace: true });

  const openProduct = (product) => setParams((currentParams) => {
    const updated = new URLSearchParams(currentParams);
    updated.set('product', product.id);
    return updated;
  });

  const toggleSave = (product) => {
    setSaved((items) => items.includes(product.id) ? items.filter((id) => id !== product.id) : [...items, product.id]);
  };

  const addToBag = (product) => {
    if (!product.isDemo) return;
    setCart((previous) => ({ ...previous, [product.id]: (previous[product.id] || 0) + 1 }));
    setBagOpen(true);
  };

  const changeBag = (id, delta) => setCart((previous) => {
    const next = { ...previous };
    next[id] = Math.max(0, (next[id] || 0) + delta);
    if (!next[id]) delete next[id];
    return next;
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setParams((values) => {
          const updated = new URLSearchParams(values);
          updated.delete('product');
          return updated;
        }, { replace: true });
        setBagOpen(false);
      }
    };
    if (current || bagOpen) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [current, bagOpen, setParams]);

  return (
    <div className="site-shell shop-page">
      <div className="shop-announcement"><span>✳</span> BNB TECH STORE <b>·</b> CURATED GEAR FOR THE EVERYDAY BUILDER <span>✳</span></div>
      <header className="shop-header">
        <div className="shop-header-inner">
          <a className="brand shop-brand" href="/" aria-label="BNB home"><img className="brand-logo" src="/brand/bnb-logo.svg" alt="" width="76" height="48" /><span className="brand-name">BOARD N BYTE</span></a>
          <label className="shop-search">
            <span className="shop-visually-hidden">Search tech products</span>
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search keyboards, graphics cards, monitors..." type="search" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </label>
          <div className="shop-header-actions">
            <button type="button" className={savedOnly ? 'shop-header-control active' : 'shop-header-control'} onClick={() => { setSavedOnly(!savedOnly); document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' }); }} aria-pressed={savedOnly} title="Saved items"><HeartIcon filled={savedOnly} /><span>Saved</span></button>
            <button type="button" className="shop-header-control" onClick={() => setBagOpen(true)} title="Demo shopping bag"><svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" aria-hidden="true"><path d="M4 8h16l-1.6 13H5.6L4 8ZM9 9V6a3 3 0 0 1 6 0v3"/></svg><span>Demo bag</span>{totalCartItems > 0 && <em>{totalCartItems}</em>}</button>
          </div>
        </div>
      </header>
      <nav className="shop-category-nav" aria-label="Store category navigation">
        <div className="shop-category-nav-inner">
          {storeCategories.map((item) => (
            <button type="button" key={item.id} className={category === item.id ? 'selected' : ''} onClick={() => { setCategory(item.id); document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' }); }} aria-pressed={category === item.id}>{item.name}</button>
          ))}
          <a href="/services">Digital Services ↗</a>
        </div>
      </nav>

      <main>
        <section className="shop-retail-promo shop-container" aria-label="Explore BNB tech">
          <div className="shop-retail-promo-copy">
            <span className="shop-eyebrow">BOARD N BYTE / YOUR TECH DESTINATION</span>
            <h1>Tech for every setup<span>.</span></h1>
            <p>PC components, peripherals, laptops and more — discover your next upgrade.</p>
          </div>
          <a href="#shop-products" className="shop-retail-promo-link">Browse the collection <Arrow /></a>
          <div className="shop-retail-decoration" aria-hidden="true"><span>BNB</span><i>✳</i></div>
        </section>

        <section className="shop-shortcuts shop-container" aria-label="Quick shop by category">
          <div className="shop-shortcuts-heading"><strong>Shop by category</strong><span>Explore tech essentials</span></div>
          <div className="shop-shortcuts-scroll">
            {storeCategories.filter((item) => item.id !== 'all').map((item) => (
              <button className={category === item.id ? 'shop-shortcut selected' : 'shop-shortcut'} type="button" key={item.id}
                onClick={() => { setCategory(item.id); setSavedOnly(false); document.getElementById('shop-products')?.scrollIntoView({ behavior: 'smooth' }); }}
                aria-pressed={category === item.id}>
                <span className="shop-shortcut-icon" aria-hidden="true">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="shop-market" id="shop-products" aria-labelledby="shop-products-heading">
          <div className="shop-container">
            <div className="shop-section-header shop-market-header">
              <div><span className="shop-eyebrow">SHOP BNB / PRODUCT CATALOGUE</span><h2 id="shop-products-heading">Explore products<span>.</span></h2></div>
              <a href="/services?service=commerce&package=custom#enquiry">Want a storefront like this? <Arrow /></a>
            </div>

            <div className="shop-catalogue-status" role="status">
              <span className="shop-live-indicator" />
              {loading
                ? 'Checking published store listings...'
                : demoMode
                  ? 'STORE DEMONSTRATION — Sample products and illustrative prices only. No real orders or payments are accepted.'
                  : 'LIVE CATALOGUE — BNB-listed products. External partner purchases or enquiries only; no on-site checkout.'}
            </div>
            {catalogueError && <p className="shop-api-note">{catalogueError}</p>}
            {hasRealProducts && (
              <div className="shop-catalogue-switch" role="group" aria-label="Choose store catalogue">
                <button type="button" className={!viewDemo ? 'selected' : ''} aria-pressed={!viewDemo} onClick={() => { setViewDemo(false); setCategory('all'); }}>Published products</button>
                <button type="button" className={viewDemo ? 'selected' : ''} aria-pressed={viewDemo} onClick={() => { setViewDemo(true); setCategory('all'); }}>Explore demo storefront</button>
              </div>
            )}

            <button type="button" className="shop-filter-toggle" aria-expanded={filtersOpen} aria-controls="shop-filter-options"
              onClick={() => setFiltersOpen((open) => !open)}>
              <span>☷ &nbsp; Filters &amp; price</span><span>{filtersOpen ? 'Hide −' : 'Show +'}</span>
            </button>
            <div className="shop-market-layout">
              <aside id="shop-filter-options" className={filtersOpen ? 'shop-filter-panel is-open' : 'shop-filter-panel'}>
                <div className="shop-filter-head"><h3>Filters</h3><button type="button" onClick={() => { setCategory('all'); setSavedOnly(false); setMaxPrice(100000); setQuery(''); }}>Clear all</button></div>
                <div className="shop-filter-section"><h4>Categories</h4>
                  {storeCategories.map((item) => (
                    <button type="button" className={category === item.id ? 'selected' : ''} key={item.id} onClick={() => setCategory(item.id)}>
                      <span>{item.name}</span><span>{item.id === 'all' ? catalogue.length : catalogue.filter((p) => p.category === item.id).length}</span>
                    </button>
                  ))}
                </div>
                <div className="shop-filter-section shop-price-filter">
                  <h4>Price ceiling</h4>
                  <span>{maxPrice >= 100000 ? 'All prices' : 'Up to ' + rupees(maxPrice)}</span>
                  <input type="range" min="1000" max="100000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum product price" />
                  <div className="shop-range-ends"><span>₹1,000</span><span>₹1,00,000+</span></div>
                </div>
                <label className="shop-saved-toggle"><input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} /> Saved items only</label>
                <div className="shop-filter-help"><strong>Need help choosing?</strong><p>Tell BNB what you're looking for.</p><a href="mailto:contact.boardnbyte@gmail.com?subject=BNB%20Tech%20Enquiry">Ask the team ↗</a></div>
              </aside>
              <div className="shop-results">
                <div className="shop-results-tools">
                  <div><strong>{result.length}</strong> {result.length === 1 ? 'product' : 'products'} {category !== 'all' ? 'in ' + categoryName(category) : ''}</div>
                  <label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Recommended</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select></label>
                </div>
                {result.length ? (
                  <div className="shop-product-grid">
                    {result.map((product) => <ProductCard key={product.id} product={product} onOpen={openProduct} saved={saved.includes(product.id)} onSave={toggleSave} onAdd={addToBag} />)}
                  </div>
                ) : (
                  <div className="shop-no-results"><span>⌕</span><h3>No matching products.</h3><p>Try another category, search or price range.</p><button type="button" onClick={() => { setQuery(''); setSavedOnly(false); setCategory('all'); setMaxPrice(100000); }}>Show all products <Arrow /></button></div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="shop-bottom-banner shop-container">
          <div>
            <span className="shop-eyebrow">BNB / DIGITAL SERVICES</span>
            <h2>Love this shopping experience?<br /><span>Let's build yours.</span></h2>
            <p>From polished product pages to search, filters and real checkout flows—we build stores around your brand and actual business requirements.</p>
          </div>
          <a href="/services?service=commerce&package=custom#enquiry">Request an e-commerce quote <Arrow /></a>
        </section>
      </main>

      <footer className="shop-footer">
        <div className="shop-container shop-footer-inner">
          <div><a href="/"><img src="/brand/bnb-logo.svg" alt="BNB — Board N Byte" width="92" height="56" /></a><p>Digital experiences. Everyday tech.<br />Built for what's next.</p></div>
          <div><strong>Explore BNB</strong><a href="/">Home</a><a href="/services">Digital Services</a><a href="/gallery">Design Gallery</a><a href="/store">Tech Store</a></div>
          <div><strong>Contact</strong><a href="mailto:contact.boardnbyte@gmail.com">contact.boardnbyte@gmail.com</a><a href="/privacy">Privacy Notice</a><span>Store checkouts are not enabled.</span></div>
        </div>
        <div className="shop-container shop-footer-bottom">© {new Date().getFullYear()} BOARD N BYTE <span>BUILT WITH INTENTION ✳</span></div>
      </footer>

      {current && (
        <div className="shop-modal-cover" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeProduct(); }}>
          <div className="shop-product-dialog" role="dialog" aria-modal="true" aria-label={current.name}>
            <button className="shop-modal-close" type="button" aria-label="Close product details" onClick={closeProduct}>×</button>
            <div className="shop-dialog-art"><StoreProductImage product={current} /></div>
            <div className="shop-dialog-body">
              <span className="shop-eyebrow">{categoryName(current.category).toUpperCase()} / {current.isDemo ? 'DEMO PRODUCT' : 'BNB CATALOGUE'}</span>
              <h2>{current.name}</h2>
              <span className="shop-dialog-brand">{current.brand || 'BNB Tech'}</span>
              <p>{current.description}</p>
              <div className="shop-dialog-price">{current.priceINR == null ? 'Price on enquiry' : rupees(current.priceINR)}{current.compareAtINR > current.priceINR && current.priceINR != null && <del>{rupees(current.compareAtINR)}</del>}</div>
              {current.isDemo ? <p className="shop-dialog-disclaimer">This is a design-preview product, not an offer for sale. The price and features are illustrative.</p> : <p className="shop-dialog-disclaimer">Prices and availability must be confirmed with the seller or BNB before a purchase.</p>}
              {current.isDemo ? (
                <button type="button" className="shop-dialog-cta" onClick={() => addToBag(current)}>Add to demo bag <span>+</span></button>
              ) : current.mode === 'affiliate' ? (
                <a className="shop-dialog-cta" href={current.externalUrl} target="_blank" rel="sponsored noopener noreferrer">Visit retailer ↗</a>
              ) : (
                <a className="shop-dialog-cta" href={'mailto:contact.boardnbyte@gmail.com?subject=' + encodeURIComponent('BNB product enquiry: ' + current.name)}>Enquire about availability ↗</a>
              )}
              {!current.isDemo && current.mode === 'affiliate' && <small className="shop-affiliate-disclosure">Partner link: BNB may earn a commission on qualifying purchases at no extra cost to you. Ordering, payment and returns are handled by the retailer.</small>}
              <button type="button" className="shop-dialog-save" onClick={() => toggleSave(current)}><HeartIcon filled={saved.includes(current.id)} /> {saved.includes(current.id) ? 'Saved to your list' : 'Save for later'}</button>
            </div>
          </div>
        </div>
      )}

      {bagOpen && (
        <div className="shop-bag-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBagOpen(false); }}>
          <aside className="shop-bag-drawer" role="dialog" aria-modal="true" aria-label="Demo shopping bag">
            <div className="shop-bag-header"><div><span>BNB / SHOPPING EXPERIENCE</span><h2>Your demo bag</h2></div><button type="button" aria-label="Close demo bag" onClick={() => setBagOpen(false)}>×</button></div>
            <p className="shop-bag-notice">Interaction preview only. These items cannot be ordered or paid for through BNB.</p>
            {totalCartItems === 0 ? <div className="shop-bag-empty"><span>⌁</span><p>Your demo bag is empty.</p><button type="button" onClick={() => setBagOpen(false)}>Explore products <Arrow /></button></div> : (
              <>
                <div className="shop-bag-items">{demoProducts.filter((item) => cart[item.id]).map((item) => (
                  <div className="shop-bag-line" key={item.id}>
                    <div className="shop-bag-item-art"><StoreProductArt product={item} /></div>
                    <div><strong>{item.name}</strong><span>{item.priceINR == null ? 'Quote only' : rupees(item.priceINR)}</span><div className="shop-quantity"><button type="button" aria-label={'Remove one ' + item.name} onClick={() => changeBag(item.id, -1)}>−</button><span>{cart[item.id]}</span><button type="button" aria-label={'Add one ' + item.name} onClick={() => changeBag(item.id, 1)}>+</button></div></div>
                  </div>
                ))}</div>
                <div className="shop-bag-summary"><div><span>Illustrative subtotal</span><strong>{rupees(totalCartPrice)}</strong></div><p>Demo prices only · no checkout, shipping or payment collection.</p><a href="/services?service=commerce&package=custom#enquiry">Want a store like this? Request a quote <Arrow /></a><button type="button" onClick={() => setCart({})}>Clear demo bag</button></div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default StorePage;
