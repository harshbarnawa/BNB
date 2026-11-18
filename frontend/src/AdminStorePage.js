import { useEffect, useState } from 'react';
import { apiEnabled, apiRequest } from './api';
import { storeCategories, categoryName, rupees, normalizeStoreProduct } from './storeData';
import { StoreProductImage } from './StoreProductArt';
import './App.css';
import './StorePage.css';
import './AdminStorePage.css';

const blank = {
  name: '', brand: '', description: '', category: 'keyboards',
  imageUrl: '', priceINR: '', compareAtINR: '', mode: 'showcase',
  externalUrl: '', published: false, featured: false, sortOrder: 0
};

function AdminStorePage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [products, setProducts] = useState([]);
  const [fields, setFields] = useState(blank);
  const [editingId, setEditingId] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    setLoading(true);
    apiRequest('/api/store/admin/products', { token })
      .then((response) => { if (active) setProducts(response.products || []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, refresh]);

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST', body: { email, password }
      });
      if (result.role !== 'admin' || !result.token) {
        setError('This account does not have admin access.');
        return;
      }
      setToken(result.token);
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const update = (key, value) => {
    setFields((old) => ({ ...old, [key]: value }));
    setError('');
    setNotice('');
  };

  const edit = (product) => {
    setEditingId(product._id);
    setFields({
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      category: product.category,
      imageUrl: product.imageUrl || '',
      priceINR: product.priceINR == null ? '' : String(product.priceINR),
      compareAtINR: product.compareAtINR == null ? '' : String(product.compareAtINR),
      mode: product.mode,
      externalUrl: product.externalUrl || '',
      published: Boolean(product.published),
      featured: Boolean(product.featured),
      sortOrder: product.sortOrder || 0
    });
    setError('');
    setNotice('');
    document.getElementById('store-edit-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const reset = () => {
    setEditingId('');
    setFields(blank);
    setNotice('');
    setError('');
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    setError('');

    const payload = {
      ...fields,
      priceINR: fields.priceINR === '' ? null : Number(fields.priceINR),
      compareAtINR: fields.compareAtINR === '' ? null : Number(fields.compareAtINR),
      sortOrder: Number(fields.sortOrder),
      externalUrl: fields.mode === 'affiliate' ? fields.externalUrl.trim() : ''
    };

    try {
      await apiRequest(editingId
        ? '/api/store/admin/products/' + encodeURIComponent(editingId)
        : '/api/store/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        token,
        body: payload
      });
      reset();
      setNotice(editingId ? 'Product updated successfully.' : 'Product created successfully. Publish it whenever you are ready.');
      setRefresh((value) => value + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (product) => {
    if (!window.confirm('Permanently delete "' + product.name + '"? This cannot be undone.')) return;
    setBusy(true);
    setError('');
    try {
      await apiRequest('/api/store/admin/products/' + encodeURIComponent(product._id), { method: 'DELETE', token });
      if (editingId === product._id) reset();
      setRefresh((value) => value + 1);
      setNotice('Product deleted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="site-shell shop-admin">
      <header className="site-header">
        <a className="brand" href="/"><img className="brand-logo" src="/brand/bnb-logo.svg" alt="" width="76" height="48" /><span className="brand-name">BOARD N BYTE</span></a>
        <a href="/store" className="header-cta">View Store ↗</a>
      </header>

      <main className="section-wrap shop-admin-main">
        <div className="eyebrow"><span className="eyebrow-line" /> PRIVATE OPERATIONS / BNB TECH STORE</div>
        <div className="shop-admin-heading">
          <div><h1>Store management<span>.</span></h1><p>Add your own product listings, choose how customers contact or purchase, and publish when you're ready. No inventory or checkout setup required.</p></div>
          {token && <button type="button" className="shop-admin-signout" onClick={() => { setToken(''); reset(); setProducts([]); }}>Log out</button>}
        </div>

        {!apiEnabled && <p role="alert" className="shop-admin-alert">The store API is not configured on this deployment.</p>}

        {apiEnabled && !token && (
          <form className="shop-admin-login" onSubmit={login}>
            <h2>Admin sign in</h2>
            <p>Use the existing BNB admin account. Your password stays in this form and is not saved in browser storage.</p>
            <label>Email <input value={email} type="email" autoComplete="username" onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>Password <input value={password} type="password" autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required /></label>
            <button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in to manage store'}</button>
          </form>
        )}

        {token && (
          <div className="shop-admin-layout">
            <form className="shop-admin-form" id="store-edit-form" onSubmit={save}>
              <div className="shop-admin-form-head"><h2>{editingId ? 'Edit product' : 'Add a product'}</h2><span>{editingId ? 'UPDATING LISTING' : 'NEW LISTING'}</span></div>
              <div className="shop-admin-fields">
                <label>Product name *<input value={fields.name} onChange={(event) => update('name', event.target.value)} minLength="3" maxLength="120" required placeholder="e.g. Wireless Mechanical Keyboard" /></label>
                <div className="shop-admin-two"><label>Brand<input value={fields.brand} onChange={(event) => update('brand', event.target.value)} maxLength="60" placeholder="Brand or manufacturer" /></label><label>Category *<select value={fields.category} onChange={(event) => update('category', event.target.value)}>{storeCategories.filter((item) => item.id !== 'all').map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
                <label>Description *<textarea value={fields.description} onChange={(event) => update('description', event.target.value)} rows="4" minLength="10" maxLength="1500" required placeholder="Describe what the product is and what makes it useful." /></label>
                <label>Product image URL (optional)<input type="url" value={fields.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} maxLength="800" placeholder="https://res.cloudinary.com/..." /><small>Use an HTTPS image you own or are permitted to display. If blank, BNB shows a category illustration.</small></label>
                <div className="shop-admin-two"><label>Price ₹ (optional)<input value={fields.priceINR} type="number" min="0" max="10000000" step="1" onChange={(event) => update('priceINR', event.target.value)} placeholder="Price or blank" /></label><label>Compare-at ₹ (optional)<input value={fields.compareAtINR} type="number" min="0" max="10000000" step="1" onChange={(event) => update('compareAtINR', event.target.value)} placeholder="Higher reference price" /></label></div>
                <label>Listing method <select value={fields.mode} onChange={(event) => update('mode', event.target.value)}><option value="showcase">Enquiry only — BNB handles requests</option><option value="affiliate">Affiliate / retailer link — customer buys elsewhere</option></select></label>
                {fields.mode === 'affiliate' && <label>Approved retailer / affiliate link *<input value={fields.externalUrl} type="url" onChange={(event) => update('externalUrl', event.target.value)} maxLength="1200" required placeholder="https://retailer.example/product" /><small>Use only a permitted HTTPS link from a program you've joined. Don't claim stock that isn't yours.</small></label>}
                <div className="shop-admin-two"><label>Display order<input value={fields.sortOrder} type="number" min="0" max="9999" onChange={(event) => update('sortOrder', event.target.value)} /></label><label className="shop-admin-check"><input type="checkbox" checked={fields.featured} onChange={(event) => update('featured', event.target.checked)} /> Featured product</label></div>
                <label className="shop-admin-check shop-admin-publish"><input type="checkbox" checked={fields.published} onChange={(event) => update('published', event.target.checked)} /><span><strong>Publish on the public store</strong><small>Leave unchecked for a draft. Only published products appear publicly.</small></span></label>
              </div>
              <div className="shop-admin-form-actions"><button type="submit" disabled={busy}>{busy ? 'Saving...' : editingId ? 'Save changes ↗' : 'Add product ↗'}</button>{editingId && <button type="button" className="shop-admin-cancel" onClick={reset} disabled={busy}>Cancel edit</button>}</div>
            </form>

            <section className="shop-admin-list" aria-label="Managed product listings">
              <div className="shop-admin-list-header"><div><h2>Your catalogue</h2><p>{products.length} {products.length === 1 ? 'listing' : 'listings'} · {products.filter((item) => item.published).length} published</p></div><button type="button" onClick={() => setRefresh((value) => value + 1)} disabled={busy || loading}>Refresh ↻</button></div>
              {loading && <p className="shop-admin-list-state">Loading products...</p>}
              {!loading && products.length === 0 && <div className="shop-admin-list-state"><h3>No listings yet.</h3><p>Add your first product on the left. The public store already has a clearly labeled demo catalogue until you publish real listings.</p></div>}
              <div className="shop-admin-item-list">{products.map((item) => (
                <article className="shop-admin-item" key={item._id}>
                  <div className="shop-admin-item-art"><StoreProductImage product={normalizeStoreProduct(item)} /></div>
                  <div className="shop-admin-item-info">
                    <span className={item.published ? 'shop-admin-live' : 'shop-admin-draft'}>{item.published ? 'PUBLISHED' : 'DRAFT'} · {categoryName(item.category)}</span>
                    <strong>{item.name}</strong>
                    <p>{item.priceINR == null ? 'Price on request' : rupees(item.priceINR)} · {item.mode === 'affiliate' ? 'Retailer link' : 'Enquiry'}</p>
                    <div><button type="button" onClick={() => edit(item)} disabled={busy}>Edit</button><button type="button" onClick={() => remove(item)} disabled={busy}>Delete</button></div>
                  </div>
                </article>
              ))}</div>
            </section>
          </div>
        )}

        {notice && <p className="shop-admin-success" role="status">{notice}</p>}
        {error && <p className="shop-admin-alert" role="alert">{error}</p>}
        <p className="shop-admin-footnote"><a href="/admin/leads">← Back to lead dashboard</a> · Payments, orders and dropshipping are not enabled. Affiliate programmes require separate approval and must follow partner rules.</p>
      </main>
    </div>
  );
}

export default AdminStorePage;
