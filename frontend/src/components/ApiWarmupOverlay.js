import React, { useEffect, useMemo, useState } from 'react';
import '../Styles/ApiWarmupOverlay.css';

export default function ApiWarmupOverlay() {
  const [inflight, setInflight] = useState(0);
  const [slowActive, setSlowActive] = useState(false);

  useEffect(() => {
    const onInflight = (e) => {
      const count = e?.detail?.count;
      if (typeof count === 'number') setInflight(count);
    };
    const onSlow = (e) => {
      const active = e?.detail?.active;
      if (typeof active === 'boolean') setSlowActive(active);
    };

    window.addEventListener('api:inflight', onInflight);
    window.addEventListener('api:slow', onSlow);
    return () => {
      window.removeEventListener('api:inflight', onInflight);
      window.removeEventListener('api:slow', onSlow);
    };
  }, []);

  const show = inflight > 0 && slowActive;

  const message = useMemo(() => {
    // Render free tier cold starts can be 30-40s.
    return 'Waking up the server… This can take 30–40 seconds on free hosting.';
  }, []);

  if (!show) return null;

  return (
    <div className="api-warmup" role="status" aria-live="polite" aria-label="Loading">
      <div className="api-warmup__card">
        <div className="api-warmup__spinner" aria-hidden="true" />
        <div className="api-warmup__content">
          <div className="api-warmup__title">Please wait</div>
          <div className="api-warmup__text">{message}</div>
          <div className="api-warmup__hint">Tip: once it’s awake, pages load normally.</div>
        </div>
        <div className="api-warmup__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
