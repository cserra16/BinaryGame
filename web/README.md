# Juego Binario – versión web estática

Versión 100 % HTML/CSS/JS del juego, sin Flask ni base de datos. Se puede
alojar en cualquier servidor de ficheros estáticos o abrir directamente con
doble clic en `index.html`.

```
web/
├── index.html   Menú principal
├── game.html    Reto contrarreloj (decimal → binario, niveles, ranking)
├── bits.html    Práctica libre con 1 byte
├── ip.html      Práctica de direcciones IPv4
├── css/style.css
└── js/
    ├── bits.js     Fila de bits reutilizable
    ├── ranking.js  Ranking (localStorage o API opcional)
    └── game.js     Lógica del reto
```

## Cómo alojarlo

Todas las rutas son relativas, así que funciona tanto en la raíz de un dominio
como en una subcarpeta (`https://servidor/binario/`).

- **Probar en local:** `python3 -m http.server 8000 -d web` y abrir <http://localhost:8000>.
- **Apache / Nginx / IIS:** copiar el contenido de `web/` a la carpeta pública
  (`/var/www/html/binario`, `htdocs`, …).
- **Docker (Nginx):**
  ```sh
  docker run -d -p 8080:80 -v "$PWD/web":/usr/share/nginx/html:ro nginx:alpine
  ```
- **GitHub Pages / Netlify / Moodle:** subir la carpeta `web/` tal cual.

## Ranking

Por defecto el ranking se guarda en el `localStorage` del navegador: cada
equipo o navegador tiene su propio ranking y no hace falta servidor.

Para tener un ranking compartido por toda la clase, cambia `API_URL` en
`js/ranking.js` por la ruta de un backend que implemente
`POST /score` y `GET /ranking`. El `app.py` de la raíz del repositorio expone
esas rutas en `/api` (`API_URL = '/api'` si `web/` se sirve desde el mismo
dominio que Flask).
