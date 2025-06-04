# Joc Binari - Aprenentatge de nombres binaris i adreces IP

Aquest projecte és un joc interactiu dissenyat per ajudar a entendre els nombres binaris, el seu ús en les adreces IP, i ara inclou un sistema de rànquing global. **Aquesta versió està preparada per ser desplegada fàcilment mitjançant Docker.**

El joc principal (`game.html`) permet als jugadors:
- Convertir nombres decimals a binaris.
- Competir per temps i puntuació.
- Registrar el seu nom i enviar la seva puntuació a un rànquing global.
- Veure el rànquing global dins del joc i al finalitzar la partida.

El projecte original també inclou:
- **Conversor Binari Bàsic** (`index.html`): Visualitza la representació binària d'un byte.
- **Simulador d'Adreces IP** (`ip.html`): Representa una adreça IPv4 completa.

## Característiques del Joc Principal (`game.html`)

- Sistema de nivells amb dificultat incremental.
- Temporitzador i sistema de puntuació.
- Desbloqueig progressiu de bits per a l'aprenentatge.
- Interfície d'usuari moderna, interactiva i responsive.
- Backend en Python (Flask) per gestionar les puntuacions.
- Base de dades SQLite (`ranking.db`) per emmagatzemar el rànquing de forma persistent.
- **Contenidor Docker** per a un desplegament senzill, aïllat i consistent en diferents entorns.

## Com utilitzar-ho (Desplegament amb Docker - Recomanat)

Aquesta és la forma recomanada per executar el joc amb el sistema de rànquing.

**Requisits previs:**
- Tenir [Docker](https://www.docker.com/get-started) instal·lat al vostre sistema.

**Instruccions:**

1.  **Clona el repositori** (si encara no ho has fet):
    ```bash
    git clone <URL_DEL_REPOSITORI_A_GITHUB>
    cd joc-binari
    ```
    *(Reemplaça `<URL_DEL_REPOSITORI_A_GITHUB>` amb la URL real del teu repositori Git)*

2.  **Navega al directori del projecte**:
    Si ja tens el projecte descarregat, assegura't que ets al directori arrel (`joc-binari`).

3.  **Construeix la imatge Docker**:
    Obre un terminal en el directori arrel del projecte i executa:
    ```bash
    docker build -t juego-binari-ranking .
    ```

4.  **Executa el contenidor Docker**:
    ```bash
    docker run -d -p 5000:5000 -v "<RUTA_ABSOLUTA_AL_TEU_PROJECTE_joc-binari>:/app" --name mi-juego-binari juego-binari-ranking
    ```
    **Important sobre el volum (`-v`):**
    *   Reemplaça `<RUTA_ABSOLUTA_AL_TEU_PROJECTE_joc-binari>` amb la **ruta absoluta** al directori `joc-binari` al teu ordinador.
        *   Exemple Linux/macOS (estant dins del directori del projecte): `docker run -d -p 5000:5000 -v "$(pwd):/app" --name mi-juego-binari juego-binari-ranking`
        *   Exemple Windows PowerShell (estant dins del directori del projecte): `docker run -d -p 5000:5000 -v "${PWD}:/app" --name mi-juego-binari juego-binari-ranking`
        *   Exemple Windows CMD (estant dins del directori del projecte): `docker run -d -p 5000:5000 -v "%CD%:/app" --name mi-juego-binari juego-binari-ranking`
    *   Aquest muntatge de volum permet que els canvis que facis al codi local (com a `game.html` o `app.py`) es reflecteixin dins del contenidor sense necessitat de reconstruir la imatge per a cada canvi de codi font (només caldrà reconstruir per canvis al `Dockerfile` o `requirements.txt`). La base de dades `ranking.db` també persistirà localment gràcies a aquest volum.

5.  **Accedeix al joc**:
    Obre el teu navegador web i ves a: `http://localhost:5000`
    Això et portarà directament al joc de conversió binària amb el sistema de rànquing.

**Per aturar i eliminar el contenidor (si cal):**
```bash
docker stop mi-juego-binari
docker rm mi-juego-binari
```

## Ús alternatiu (Accés directe als fitxers HTML - Sense Rànquing Persistent)

Si només vols explorar els components HTML individuals sense el backend del rànquing o Docker:

1. Obre el fitxer `game.html` en un navegador web modern per accedir al joc de conversió binaria (el rànquing no funcionarà correctament ja que depèn del backend Flask que s'executa dins del contenidor).
2. Obre el fitxer `index.html` per al conversor binari bàsic.
3. Obre el fitxer `ip.html` per al simulador d'adreces IP.

## Tecnologies utilitzades

- **Frontend**: HTML5, CSS3, JavaScript pur
- **Backend**: Python, Flask
- **Base de dades**: SQLite
- **Contenerització**: Docker

## Requisits (per a desenvolupament o ús alternatiu)

- Qualsevol navegador web modern (Chrome, Firefox, Safari, Edge).
- Per al backend i el sistema de rànquing (si no s'usa Docker): Python 3.x, Flask.
- Per al desplegament recomanat: Docker.

## Llicència

Aquest projecte està sota la llicència [MIT](LICENSE).

## Autor

cserra16

---

Fet amb ❤️ per a l'aprenentatge de sistemes informàtics, xarxes i desenvolupament d'aplicacions web.
