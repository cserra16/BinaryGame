# Dockerfile
# Usa una imagen base de Python
FROM python:3.9-slim

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo de dependencias primero para aprovechar el cache de Docker
COPY requirements.txt requirements.txt

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de los archivos de la aplicación al directorio de trabajo
# Esto incluirá app.py, game.html (y la carpeta static/ si la tienes)
COPY . .

# Flask buscará game.html en la carpeta especificada por 'template_folder' en app.py.
# Si game.html está en la raíz (junto con app.py), y template_folder='.', se encontrará.
# Si tienes una carpeta 'templates', asegúrate de que app.py esté configurado para ello.

# La base de datos SQLite (ranking.db) se creará en WORKDIR (/app) por app.py si no existe.

# Expone el puerto en el que Flask se ejecutará
EXPOSE 5000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["python", "app.py"]
