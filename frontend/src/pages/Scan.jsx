import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Scan() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { user, refresh } = useAuth();
  const code = params.get('code') || '';
  const [state, setState] = useState({ status: 'idle' }); // idle | loading | ok | error
  const ran = useRef(false);

  const kind = code.startsWith('WASTE') ? 'WASTE' : code.startsWith('REWARD') ? 'REWARD' : null;

  async function run() {
    setState({ status: 'loading' });
    try {
      if (kind === 'WASTE') {
        const r = await api.post('/waste-logs/validate', { qrCode: code });
        await refresh();
        setState({ status: 'ok', message: `Validated! +${r.data.log.pointsAwarded} points. New balance: ${r.data.points} pts.` });
      } else if (kind === 'REWARD') {
        const r = await api.post('/redemptions/validate', { qrCode: code });
        setState({ status: 'ok', message: `Redemption validated: ${r.data.reward?.title || '#' + r.data.rewardId} for ${r.data.pointsSpent} pts.` });
      } else {
        setState({ status: 'error', message: 'Unrecognized QR code.' });
      }
    } catch (e) {
      setState({ status: 'error', message: e.response?.data?.error || 'Validation failed.' });
    }
  }

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!code) { setState({ status: 'error', message: 'No code provided.' }); return; }
    if (!user) return; // wait for login prompt
    run();
    // eslint-disable-next-line
  }, [user]);

  if (!code) {
    return <Wrap><div className="error">No QR code in the link.</div></Wrap>;
  }

  if (!user) {
    return (
      <Wrap>
        <p>You need to be logged in to validate this QR code.</p>
        <p style={{ wordBreak: 'break-all' }}><code>{code}</code></p>
        <button onClick={() => { localStorage.setItem('rc_postLoginRedirect', `/scan?code=${encodeURIComponent(code)}`); nav('/login'); }}>Log in</button>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <p style={{ wordBreak: 'break-all' }}><code>{code}</code></p>
      {state.status === 'loading' && <p>Validating…</p>}
      {state.status === 'ok' && <div className="success">{state.message}</div>}
      {state.status === 'error' && <div className="error">{state.message}</div>}
      {kind === 'WASTE' && state.status === 'ok' && (
        <button style={{ marginTop: 12 }} onClick={() => nav('/history')}>View my activity</button>
      )}
      {state.status === 'error' && (
        <button style={{ marginTop: 12 }} onClick={run}>Try again</button>
      )}
    </Wrap>
  );
}

function Wrap({ children }) {
  return (
    <div className="container">
      <div className="card">
        <h2>Scan Result</h2>
        {children}
      </div>
    </div>
  );
}
