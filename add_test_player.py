import sqlite3
import os

def add_test_player():
    # Conectar a la base de datos
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ranking.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Verificar si la tabla existe, si no, crearla
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                score INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insertar jugador de prueba
        cursor.execute(
            'INSERT INTO scores (name, score) VALUES (?, ?)',
            ('carlos', 100)
        )
        
        # Guardar cambios
        conn.commit()
        print("✅ Jugador de prueba 'carlos' añadido correctamente con 100 puntos.")
        
    except Exception as e:
        print(f"❌ Error al añadir jugador de prueba: {e}")
    finally:
        # Cerrar la conexión
        conn.close()

if __name__ == "__main__":
    add_test_player()
