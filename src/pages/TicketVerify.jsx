import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyTicket } from '../api';
import './TicketVerify.css';

export default function TicketVerify() {
  const { code } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'valid' | 'invalid' | 'error'
  const [ticketData, setTicketData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    document.title = 'Vérification du billet';
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setTicketData(null);

    verifyTicket(code, controller.signal)
      .then((data) => {
        if (data && data.valid === true) {
          setTicketData(data);
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setStatus('error');
      });

    return () => {
      controller.abort();
    };
  }, [code, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (status === 'loading') {
    return (
      <main className="verify-page state-loading" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p className="loading-text">Vérification en cours...</p>
      </main>
    );
  }

  if (status === 'valid') {
    const event = ticketData?.event || {};

    return (
      <main className="verify-page state-valid" role="status" aria-live="polite">
        <section className="verify-card card-valid">
          <div className="icon-circle icon-circle-valid" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="verify-title">Billet certifié</h1>
          <p className="verify-subtitle">{event.title}</p>

          <dl className="info-grid">
            <div className="info-item">
              <dt className="info-label">DATE</dt>
              <dd className="info-value">{event.date}</dd>
            </div>

            <div className="info-item">
              <dt className="info-label">OUVERTURE DES PORTES</dt>
              <dd className="info-value">{event.doors}</dd>
            </div>

            <div className="info-item">
              <dt className="info-label">LIEU</dt>
              <dd className="info-value">{event.venue}</dd>
            </div>

            <div className="info-item">
              <dt className="info-label">ADRESSE</dt>
              <dd className="info-value">{event.address}</dd>
            </div>

            <div className="info-item info-item-full">
              <dt className="info-label">ARTISTES À L'AFFICHE</dt>
              <dd className="info-value">{event.artists}</dd>
            </div>

            <div className="info-item info-item-full">
              <dt className="info-label">ORGANISATION</dt>
              <dd className="info-value">{event.organizer}</dd>
            </div>
          </dl>

          <footer className="card-footer">
            <p>Présentez cet écran au point de contrôle à l'entrée.</p>
          </footer>
        </section>
      </main>
    );
  }

  if (status === 'invalid') {
    return (
      <main className="verify-page state-invalid" role="status" aria-live="polite">
        <section className="verify-card card-invalid">
          <div className="icon-circle icon-circle-invalid" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="none"
              stroke="#dc2626"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 className="verify-title">Billet non reconnu</h1>
          <p className="card-message">
            Ce billet n'a pas pu être vérifié. Adressez-vous à l'accueil du concert.
          </p>
        </section>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="verify-page state-error" role="status" aria-live="assertive">
        <section className="verify-card card-error">
          <h1 className="verify-title">Connexion impossible</h1>
          <p className="card-message">
            Vérifiez votre connexion internet puis réessayez.
          </p>
          <button type="button" className="retry-button" onClick={handleRetry}>
            Réessayer
          </button>
        </section>
      </main>
    );
  }

  return null;
}

