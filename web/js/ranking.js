/**
 * Ranking de puntuaciones.
 *
 * Por defecto se guarda en el navegador (localStorage), así la web funciona en
 * cualquier hosting estático sin backend. Cada navegador tiene su propio ranking.
 *
 * Si quieres un ranking compartido, pon en API_URL la ruta de un backend que
 * implemente `POST {API_URL}/score` y `GET {API_URL}/ranking` (por ejemplo el
 * app.py de Flask de la raíz del repositorio: API_URL = '/api').
 */
const Ranking = (() => {
    const API_URL = null;
    const STORAGE_KEY = 'binarygame.scores.v1';
    const MAX_STORED = 200;

    function readLocal() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function writeLocal(scores) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(-MAX_STORED)));
        } catch (e) {
            // Modo privado o almacenamiento bloqueado: la partida sigue funcionando sin guardar.
        }
    }

    /** Guarda una puntuación. */
    async function add(name, score) {
        if (API_URL) {
            const response = await fetch(`${API_URL}/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, score })
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return;
        }
        const scores = readLocal();
        scores.push({ name, score, date: new Date().toISOString() });
        writeLocal(scores);
    }

    /** Devuelve [{name, best_score}] con la mejor puntuación de cada jugador. */
    async function top(limit = 10) {
        if (API_URL) {
            const response = await fetch(`${API_URL}/ranking`);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        }
        const best = new Map();
        for (const { name, score } of readLocal()) {
            if (!best.has(name) || score > best.get(name)) best.set(name, score);
        }
        return [...best.entries()]
            .map(([name, best_score]) => ({ name, best_score }))
            .sort((a, b) => b.best_score - a.best_score)
            .slice(0, limit);
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /** Pinta el ranking en `element`, resaltando al jugador `currentName`. */
    async function render(element, currentName) {
        element.innerHTML = '<p class="ranking-empty">Cargando ranking...</p>';
        try {
            const ranking = await top();
            if (ranking.length === 0) {
                element.innerHTML = '<p class="ranking-empty">Aún no hay puntuaciones registradas.</p>';
                return;
            }
            let html = '<table class="ranking-table"><thead><tr><th>#</th><th>Jugador</th><th class="num">Puntos</th></tr></thead><tbody>';
            ranking.forEach((player, index) => {
                const current = player.name === currentName ? ' class="current"' : '';
                html += `<tr${current}><td>${index + 1}</td><td>${escapeHtml(player.name)}</td><td class="num">${Number(player.best_score)}</td></tr>`;
            });
            html += '</tbody></table>';
            if (!API_URL) {
                html += '<p class="ranking-note">Ranking guardado en este navegador.</p>';
            }
            element.innerHTML = html;
        } catch (error) {
            console.error('Error al cargar el ranking:', error);
            element.innerHTML = '<p class="ranking-empty" style="color: var(--red)">Error al cargar el ranking.</p>';
        }
    }

    return { add, top, render };
})();
