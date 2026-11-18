const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Vérifie un billet à partir de son code.
 * @param {string} code - Le code alphanumérique du billet
 * @param {AbortSignal} [signal] - Signal d'annulation de requête
 * @returns {Promise<{valid: boolean, event?: object}>}
 */
export async function verifyTicket(code, signal) {
  if (USE_MOCK) {
    await new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }

      const timer = setTimeout(resolve, 600);

      if (signal) {
        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
          },
          { once: true }
        );
      }
    });

    if (code === 'DEMO-VALID') {
      return {
        valid: true,
        event: {
          title: 'Concert Roga',
          date: 'À COMPLÉTER',
          doors: 'À COMPLÉTER',
          venue: 'À COMPLÉTER',
          address: 'À COMPLÉTER',
          artists: 'À COMPLÉTER',
          organizer: 'À COMPLÉTER',
        },
      };
    }

    if (code === 'DEMO-INVALID') {
      return { valid: false };
    }

    if (code === 'DEMO-ERROR') {
      throw new Error('Erreur de connexion simulée');
    }

    return { valid: false };
  }

  const response = await fetch(`${API_URL}/api/verify/${encodeURIComponent(code)}`, { signal });

  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Réponse invalide (JSON attendu)');
  }
}

