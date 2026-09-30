/**
 * Utilidad compartida: crea una fila de bits clicables dentro de `container`.
 *
 * @param {HTMLElement} container - Elemento donde se insertan los bits.
 * @param {number} size - Número de bits (el de la izquierda es el más significativo).
 * @param {function(number, string): void} onChange - Se llama con (valorDecimal, cadenaBinaria)
 *        cada vez que cambia un bit o se reinicia la fila.
 * @param {object} [options]
 * @param {function(): boolean} [options.canToggle] - Si devuelve false se ignoran los clics.
 * @returns {{reset: function, getValue: function, setEnabledBits: function}}
 */
function createBitRow(container, size, onChange, options = {}) {
    const canToggle = options.canToggle || (() => true);
    const states = new Array(size).fill(false); // índice = posición del bit (0 = LSB)
    const elements = [];
    let enabledBits = size;

    for (let position = size - 1; position >= 0; position--) {
        const bit = document.createElement('div');
        bit.className = 'bit';
        bit.setAttribute('role', 'button');
        bit.setAttribute('aria-pressed', 'false');
        bit.setAttribute('aria-label', `Bit de valor ${2 ** position}`);
        bit.innerHTML = `<span class="bit-value">0</span><span class="bit-label">${2 ** position}</span>`;

        // Con `touch-action: manipulation` en el CSS basta el evento click tanto
        // con ratón como en pantallas táctiles, sin disparos dobles.
        bit.addEventListener('click', () => {
            if (position >= enabledBits || !canToggle()) return;
            states[position] = !states[position];
            render(position);
            notify();
        });

        elements[position] = bit;
        container.appendChild(bit);
    }

    function render(position) {
        const bit = elements[position];
        bit.classList.toggle('on', states[position]);
        bit.classList.toggle('disabled', position >= enabledBits);
        bit.setAttribute('aria-pressed', String(states[position]));
        bit.querySelector('.bit-value').textContent = states[position] ? '1' : '0';
    }

    function getValue() {
        return states.reduce((sum, on, position) => (on && position < enabledBits ? sum + 2 ** position : sum), 0);
    }

    function getBinary() {
        return states.slice(0, enabledBits).reverse().map(on => (on ? '1' : '0')).join('');
    }

    function notify() {
        onChange(getValue(), getBinary());
    }

    function reset() {
        states.fill(false);
        for (let p = 0; p < size; p++) render(p);
        notify();
    }

    /** Deja activos sólo los `count` bits de menor peso; el resto se muestran deshabilitados. */
    function setEnabledBits(count) {
        enabledBits = Math.max(1, Math.min(size, count));
        reset();
    }

    notify();
    return { reset, getValue, setEnabledBits };
}
