import pandas as pd
import os

def load_from_csv(file_path: str):
    """
    Carga datos desde un archivo CSV a un DataFrame de pandas.

    Args:
        file_path (str): La ruta relativa al archivo CSV.

    Returns:
        pd.DataFrame: Un DataFrame con los datos del archivo.
    """
    # Construye una ruta absoluta para asegurar que el archivo se encuentre
    # sin importar desde dónde se ejecute el script.
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    absolute_path = os.path.join(base_dir, file_path)
    
    if not os.path.exists(absolute_path):
        raise FileNotFoundError(f"El archivo de datos no se encontró en: {absolute_path}")
        
    # Lee el CSV. Pandas maneja la mayoría de los detalles.
    # El parámetro `parse_dates` es útil para convertir columnas de fecha automáticamente.
    df = pd.read_csv(absolute_path, parse_dates=['fecha'])
    
    return df