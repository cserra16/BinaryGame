/**
 * Traduccions del Joc Binari (català per defecte, anglès).
 *
 * - Els textos fixos de l'HTML porten `data-i18n="clau"` (se'n substitueix el text)
 *   o `data-i18n-attr="atribut:clau;atribut2:clau2"` (se'n substitueixen atributs).
 * - Els textos generats per JavaScript fan servir `I18n.t('clau', {variables})`
 *   i es tornen a pintar amb `I18n.onChange(...)` quan es canvia d'idioma.
 * - Els botons amb `data-lang="ca|en"` canvien l'idioma, que es recorda al navegador.
 *   També es pot forçar amb `?lang=en` a l'adreça.
 *
 * Per afegir un idioma nou n'hi ha prou d'afegir un bloc a STRINGS i un botó data-lang.
 */
const I18n = (() => {
    const STORAGE_KEY = 'binarygame.lang';
    const DEFAULT_LANG = 'ca';

    const STRINGS = {
        ca: {
            'lang.group': 'Idioma',
            'nav.menu': '← Menú',

            'index.title': 'Joc Binari',
            'index.description': 'Jocs per aprendre a convertir nombres decimals a binari i adreces IP.',
            'index.heading': 'Joc Binari',
            'index.tagline': '01001010 01000010',
            'index.game.title': 'Repte contrarellotge',
            'index.game.text': "Converteix nombres decimals a binari abans que s'acabi el temps. Puja de nivell i desbloqueja bits.",
            'index.bits.title': 'Pràctica: 1 byte',
            'index.bits.text': "Encén i apaga 8 bits lliurement i observa'n el valor decimal (0 - 255).",
            'index.ip.title': 'Pràctica: adreça IP',
            'index.ip.text': 'Construeix una adreça IPv4 bit a bit amb els seus quatre octets.',

            'bit.aria': 'Bit de valor {value}',

            'bits.title': 'Joc Binari - 8 bits',
            'bits.instruction': 'Toca els cercles per canviar els bits. Els valors posicionals apareixen quan el bit està encès.',
            'bits.decimal': 'Decimal:',
            'bits.range': 'Rang: 0 - 255 (1 byte)',

            'ip.title': 'Joc Binari - Adreça IP',
            'ip.instruction': "Toca els cercles per canviar els bits de cada octet. Els valors posicionals apareixen quan el bit està encès. L'adreça IP resultant es mostra a sota.",
            'ip.octet': 'Octet {n}:',
            'ip.result': 'Adreça IP resultant:',

            'game.title': 'Joc Binari - Repte contrarellotge',
            'game.welcome': 'Et donem la benvinguda al Joc Binari!',
            'game.intro': 'Escriu el teu nom per començar a jugar i entrar al rànquing.',
            'game.namePlaceholder': 'El teu nom',
            'game.nameRequired': 'Escriu el teu nom per continuar.',
            'game.start': 'Comença a jugar',
            'game.showRanking': 'Mostra el rànquing',
            'game.ranking': '🏆 Rànquing',
            'game.level': 'NIVELL',
            'game.points': 'PUNTS',
            'game.target': 'CONVERTEIX A BINARI',
            'game.time': 'TEMPS',
            'game.reset': 'Reinicia',
            'game.check': 'Verifica',
            'game.skip': 'Salta (-1)',
            'game.shortcuts': 'Dreceres: Enter / Espai = verificar · Esc = saltar',
            'game.correct': 'Correcte! +1',
            'game.incorrect': 'Incorrecte -1',
            'game.skipped': 'Saltat -1',
            'game.levelUp': 'NIVELL COMPLETAT!',
            'game.newBit': 'Nou bit desbloquejat',
            'game.over': 'Fi de la partida!',
            'game.finalScore': 'Puntuació final: {score} (nivell {level})',
            'game.rankingBox': '🏆 Rànquing 🏆',
            'game.playAgain': 'Torna a jugar',
            'game.changePlayer': 'Canvia de jugador',

            'ranking.loading': 'Carregant el rànquing...',
            'ranking.empty': 'Encara no hi ha puntuacions.',
            'ranking.player': 'Jugador',
            'ranking.points': 'Punts',
            'ranking.local': 'Rànquing desat en aquest navegador.',
            'ranking.error': "No s'ha pogut carregar el rànquing."
        },
        en: {
            'lang.group': 'Language',
            'nav.menu': '← Menu',

            'index.title': 'Binary Game',
            'index.description': 'Games to learn how to convert decimal numbers to binary and build IP addresses.',
            'index.heading': 'Binary Game',
            'index.tagline': '01000010 01000111',
            'index.game.title': 'Time challenge',
            'index.game.text': 'Convert decimal numbers to binary before time runs out. Level up to unlock more bits.',
            'index.bits.title': 'Practice: 1 byte',
            'index.bits.text': 'Turn 8 bits on and off freely and see their decimal value (0 - 255).',
            'index.ip.title': 'Practice: IP address',
            'index.ip.text': 'Build an IPv4 address bit by bit with its four octets.',

            'bit.aria': 'Bit worth {value}',

            'bits.title': 'Binary Game - 8 bits',
            'bits.instruction': 'Tap the circles to flip the bits. Place values appear when a bit is on.',
            'bits.decimal': 'Decimal:',
            'bits.range': 'Range: 0 - 255 (1 byte)',

            'ip.title': 'Binary Game - IP address',
            'ip.instruction': 'Tap the circles to flip the bits of each octet. Place values appear when a bit is on. The resulting IP address is shown below.',
            'ip.octet': 'Octet {n}:',
            'ip.result': 'Resulting IP address:',

            'game.title': 'Binary Game - Time challenge',
            'game.welcome': 'Welcome to the Binary Game!',
            'game.intro': 'Enter your name to start playing and join the ranking.',
            'game.namePlaceholder': 'Your name',
            'game.nameRequired': 'Enter your name to continue.',
            'game.start': 'Start playing',
            'game.showRanking': 'Show ranking',
            'game.ranking': '🏆 Ranking',
            'game.level': 'LEVEL',
            'game.points': 'POINTS',
            'game.target': 'CONVERT TO BINARY',
            'game.time': 'TIME',
            'game.reset': 'Reset',
            'game.check': 'Check',
            'game.skip': 'Skip (-1)',
            'game.shortcuts': 'Shortcuts: Enter / Space = check · Esc = skip',
            'game.correct': 'Correct! +1',
            'game.incorrect': 'Wrong -1',
            'game.skipped': 'Skipped -1',
            'game.levelUp': 'LEVEL COMPLETE!',
            'game.newBit': 'New bit unlocked',
            'game.over': 'Game over!',
            'game.finalScore': 'Final score: {score} (level {level})',
            'game.rankingBox': '🏆 Ranking 🏆',
            'game.playAgain': 'Play again',
            'game.changePlayer': 'Change player',

            'ranking.loading': 'Loading ranking...',
            'ranking.empty': 'No scores yet.',
            'ranking.player': 'Player',
            'ranking.points': 'Points',
            'ranking.local': 'Ranking saved in this browser.',
            'ranking.error': 'Could not load the ranking.'
        }
    };

    const listeners = [];
    let lang = DEFAULT_LANG;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved in STRINGS) lang = saved;
    } catch (e) {
        // Sense accés a localStorage: es fa servir l'idioma per defecte.
    }
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl in STRINGS) lang = fromUrl;

    /** Retorna el text de `key` a l'idioma actual, substituint {variables}. */
    function t(key, vars = {}) {
        const text = STRINGS[lang][key] ?? STRINGS[DEFAULT_LANG][key] ?? key;
        return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
    }

    /** Tradueix tots els elements marcats amb data-i18n / data-i18n-attr. */
    function apply() {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            el.dataset.i18nAttr.split(';').forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s.trim());
                if (attr && key) el.setAttribute(attr, t(key));
            });
        });
        document.querySelectorAll('[data-lang]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
        });
    }

    function setLang(next) {
        if (!(next in STRINGS) || next === lang) return;
        lang = next;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // No es pot recordar l'idioma, però el canvi s'aplica igualment.
        }
        apply();
        listeners.forEach(fn => fn(lang));
    }

    /** Registra una funció que es crida cada cop que canvia l'idioma. */
    function onChange(fn) {
        listeners.push(fn);
    }

    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', () => setLang(button.dataset.lang));
    });
    apply();

    return { t, setLang, onChange, get lang() { return lang; } };
})();
