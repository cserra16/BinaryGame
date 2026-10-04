# Joc Binari - Aprenentatge de nombres binaris i adreces IP

## Jugar en local (sense instal·lar res)

La carpeta [`web/`](web/) conté una versió del joc feta només amb HTML, CSS i
JavaScript. No necessita Python, Docker ni connexió a Internet.

1. Descarrega el projecte: botó **Code → Download ZIP** de GitHub (o
   `git clone`).
2. Descomprimeix-lo i obre `web/index.html` amb doble clic.

Inclou el repte contrarellotge, la pràctica amb 1 byte i la pràctica d'adreces
IP, en català (per defecte) i anglès. El rànquing es desa al navegador.

Per publicar-la en un servidor (Apache, Nginx, GitHub Pages, Moodle…) n'hi ha
prou de copiar el contingut de `web/`. Més detalls a [`web/README.md`](web/README.md).

## Versió amb servidor (Flask + rànquing compartit)

L'`app.py` de l'arrel serveix el joc original amb un rànquing comú en SQLite.

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
