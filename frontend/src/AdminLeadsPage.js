import { useEffect, useState } from 'react';
import { apiEnabled, apiRequest } from './api';
import './App.css';
import './AdminLeadsPage.css';

const statuses = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['discussion', 'Discussion'],
  ['quotation_sent', 'Quotation sent'],
  ['won', 'Won'],
  ['lost', 'Lost']
];

const notificationLabels = {
  pending: 'Pending',
  sending: 'Sending',
  accepted: 'Accepted by email provider',
  failed: 'Failed',
  not_configured: 'Email not configured'
};

function LeadItem({ lead, token, onSaved }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState('');
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await apiRequest('/api/leads/' + encodeURIComponent(lead._id), {
        method: 'PATCH',
        token,
        body: { status, notes }
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const retryEmail = async (audience) => {
    setRetrying(audience);
    setError('');
    try {
      const result = await apiRequest('/api/leads/' + encodeURIComponent(lead._id) + '/notifications/' + audience + '/retry', {
        method: 'POST',
        token
      });
      if (result.status === 'failed' || result.status === 'not_configured') {
        setError(result.status === 'not_configured'
          ? 'Email provider settings are not configured on Render yet.'
          : 'Email provider did not accept this message. Check the email configuration and try again.');
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setRetrying('');
    }
  };

  return (
    <article className="admin-lead">
      <div className="admin-lead-top">
        <div><strong>{lead.name}</strong><p>{lead.email}{lead.phone ? ' · ' + lead.phone : ''}</p></div>
        <span>{new Date(lead.createdAt).toLocaleString()}</span>
      </div>
      <p><b>Service:</b> {lead.serviceId}</p>
      {lead.company && <p><b>Company:</b> {lead.company}</p>}
      {lead.budget && <p><b>Budget:</b> {lead.budget}</p>}
      <div className="admin-lead-brief">{lead.requirements}</div>
      <div className="admin-email-status">
        <strong>EMAIL NOTIFICATIONS</strong>
        {['owner', 'customer'].map((audience) => {
          const status = lead.notifications?.[audience]?.status;
          const canRetry = !status || ['failed', 'not_configured'].includes(status);
          return (
            <div className="admin-email-row" key={audience}>
              <div><span>{audience === 'owner' ? 'BNB owner alert' : 'Customer thank-you'}</span><small>{status ? notificationLabels[status] || status : 'Not yet tracked'}</small></div>
              {canRetry && <button type="button" disabled={Boolean(retrying) || saving} onClick={() => retryEmail(audience)}>{retrying === audience ? 'Sending...' : 'Send / retry'}</button>}
            </div>
          );
        })}
        <p>Email provider acceptance does not guarantee delivery to the recipient's inbox.</p>
      </div>
      <div className="admin-lead-edit">
        <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></label>
        <label>Private notes<textarea rows="3" maxLength="3000" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
        <button type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
    </article>
  );
}

function AdminLeadsPage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;

    const load = async () => {
      setBusy(true);
      setError('');
      try {
        const query = new URLSearchParams({ page: String(page) });
        if (status) query.set('status', status);
        const data = await apiRequest('/api/leads?' + query, { token });
        if (active) {
          setLeads(data.leads || []);
          setPages(data.pages || 0);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setBusy(false);
      }
    };

    load();
    return () => { active = false; };
  }, [token, page, status, refresh]);

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      });

      if (data.role !== 'admin' || !data.token) {
        setError('This account does not have admin access.');
        return;
      }

      setToken(data.token);
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    setToken('');
    setLeads([]);
    setPassword('');
    setError('');
  };

  return (
    <div className="site-shell admin-leads-page">
      <header className="site-header">
        <a className="brand" href="/"><span className="brand-mark">B<span>N</span>B</span><span className="brand-name">BOARD N BYTE</span></a>
        <a className="admin-exit" href="/services">← Back to services</a>
      </header>
      <main className="section-wrap admin-leads-main">
        <div className="eyebrow"><span className="eyebrow-line" /> BNB / PRIVATE OPERATIONS</div>
        <h1>Client enquiries<span>.</span></h1>
        {!apiEnabled && <div className="admin-notice">The backend API URL has not been configured for this deployment. Admin access isn't available yet.</div>}
        {apiEnabled && !token && <form className="admin-login" onSubmit={login}>
          <h2>Admin sign in</h2>
          <p>Use an existing BNB admin account. Credentials are not stored in this browser.</p>
          <label>Email<input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        </form>}
        {apiEnabled && token && <>
          <div className="admin-toolbar">
            <label>Filter by status
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                <option value="">All statuses</option>
                {statuses.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </label>
            <div className="admin-tools"><span>{total} enquiries</span><button type="button" onClick={() => setRefresh((value) => value + 1)}>Refresh</button><button type="button" onClick={logout}>Log out</button></div>
          </div>
          {busy && <p role="status">Loading enquiries...</p>}
          {!busy && leads.length === 0 && !error && <p className="admin-empty">No enquiries found.</p>}
          <div className="admin-lead-grid">{leads.map((lead) => <LeadItem lead={lead} key={lead._id} token={token} onSaved={() => setRefresh((value) => value + 1)} />)}</div>
          <div className="admin-pages"><button type="button" disabled={page <= 1 || busy} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {Math.max(1, pages)}</span><button type="button" disabled={page >= pages || busy} onClick={() => setPage((value) => value + 1)}>Next</button></div>
        </>}
        {error && <p className="admin-error" role="alert">{error}</p>}
      </main>
    </div>
  );
}

export default AdminLeadsPage;
