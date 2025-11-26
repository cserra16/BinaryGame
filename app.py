# app.py
import sqlite3
from flask import Flask, request, jsonify, render_template, g
import os

DATABASE = 'ranking.db'
# Asumimos que game.html estará en una carpeta 'templates' o en la raíz y se ajusta template_folder.
# Para servir game.html desde la raíz (junto a app.py) y archivos estáticos desde 'static':
app = Flask(__name__, template_folder='.', static_folder='static', static_url_path='/static')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db_path = os.path.join(app.root_path, DATABASE)
        db = g._database = sqlite3.connect(db_path)
        db.row_factory = sqlite3.Row # Para acceder a las columnas por nombre
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def create_table_if_not_exists():
    # Asegura que la base de datos se crea en el directorio de la aplicación
    db_path = os.path.join(app.root_path, DATABASE)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    # Sirve game.html. Flask buscará 'game.html' en la carpeta especificada por template_folder.
    # Si template_folder='.', buscará game.html en la raíz del proyecto.
    return render_template('game.html')

@app.route('/api/score', methods=['POST'])
def add_score():
    data = request.get_json()
    name = data.get('name')
    score = data.get('score')

    if not name or score is None:
        return jsonify({'error': 'Nombre y puntuación son requeridos'}), 400

    try:
        score = int(score)
    except ValueError:
        return jsonify({'error': 'La puntuación debe ser un número'}), 400

    db = get_db()
    db.execute('INSERT INTO scores (name, score) VALUES (?, ?)', (name, score))
    db.commit()
    return jsonify({'message': 'Puntuación guardada'}), 201

@app.route('/api/ranking', methods=['GET'])
def get_ranking():
    db = get_db()
    # Ranking de mejores puntuaciones por jugador (Top 10)
    query = '''
        SELECT name, MAX(score) as best_score
        FROM scores
        GROUP BY name
        ORDER BY best_score DESC
        LIMIT 10 
    '''
    cursor = db.execute(query)
    ranking = [dict(row) for row in cursor.fetchall()]
    return jsonify(ranking)

# Crear la tabla al iniciar la aplicación si no existe
# Esto es adecuado para desarrollo/simplicidad. En producción, usarías migraciones.
with app.app_context():
    create_table_if_not_exists()

if __name__ == '__main__':
    # Para Docker, es mejor usar 0.0.0.0
    # debug=True es útil para desarrollo, Flask se reinicia con cambios.
    # Para producción, debug=False.
    app.run(host='0.0.0.0', port=5000, debug=True)
