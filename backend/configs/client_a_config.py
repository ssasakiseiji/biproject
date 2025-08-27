# Importa el nuevo loader y los procesadores que vamos a usar
from etl.loaders import csv_loader
from etl.processors import transformations

# Configuración actualizada para usar CSV
CONFIG = {
    "data_sources": {
        "sales_data_csv": {
            "loader": csv_loader.load_from_csv,
            "path": "data/sales.csv"  # Ruta relativa desde la raíz del proyecto backend
        }
    },
    "endpoints": {
        # Para los endpoints de agregación, el backend ahora hará el trabajo
        # que antes haría la base de datos (GROUP BY, SUM).
        "ingresos_por_categoria": {
            "source": "sales_data_csv",
            "pipeline": [
                (transformations.group_and_sum, {"group_by_col": "categoria", "sum_col": "ingresos"}),
            ]
        },
        "ingresos_por_region": {
            "source": "sales_data_csv",
            "pipeline": [
                (transformations.group_and_sum, {"group_by_col": "region", "sum_col": "ingresos"}),
            ]
        },
        "detalle_transacciones": {
            "source": "sales_data_csv",
            "pipeline": [] # Sin procesamiento adicional por ahora
        }
    }
}