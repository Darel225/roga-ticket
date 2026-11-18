import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="notfound-container">
      <div className="notfound-card">
        <h1>404</h1>
        <p>Page introuvable</p>
        <Link to="/" className="notfound-link">Retour à l'accueil</Link>
      </div>
    </main>
  );
}

