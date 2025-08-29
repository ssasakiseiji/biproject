import pandas as pd
import numpy as np # ✅ Importamos numpy para la conversión

def group_and_sum(df: pd.DataFrame, group_by_col: str, sum_col: str):
    """
    Agrupa un DataFrame por una columna y suma los valores de otra.
    """
    if group_by_col not in df.columns or sum_col not in df.columns:
        raise ValueError("Las columnas para agrupar o sumar no existen en el DataFrame.")
    aggregated_df = df.groupby(group_by_col)[sum_col].sum().reset_index()
    aggregated_df = aggregated_df.rename(columns={group_by_col: "name", sum_col: "value"})
    return aggregated_df

def get_unique_values(df: pd.DataFrame, column: str):
    """
    Obtiene los valores únicos de una columna para los filtros.
    """
    if column not in df.columns:
        raise ValueError(f"La columna '{column}' no existe en el DataFrame.")
    unique_values = df[column].unique()
    return pd.DataFrame({'value': unique_values, 'label': unique_values})

def calculate_kpis(df: pd.DataFrame, kpi_definitions: list):
    """
    Calcula un conjunto de KPIs basado en una lista de definiciones.
    """
    results = {}
    for kpi in kpi_definitions:
        kpi_id = kpi.get("id")
        op = kpi.get("operation")
        col = kpi.get("column")

        if col and col not in df.columns:
            results[kpi_id] = 0
            continue

        value = 0 # Valor por defecto
        if op == "sum":
            value = df[col].sum()
        elif op == "count":
            value = len(df.index)
        elif op == "average":
            value = df[col].mean()

        # ✅ CORRECCIÓN CLAVE: Convertimos el resultado a un tipo nativo de Python
        if isinstance(value, (np.integer, np.int64)):
            results[kpi_id] = int(value)
        elif isinstance(value, (np.floating, np.float64)):
            results[kpi_id] = float(value)
        else:
            results[kpi_id] = value

    return results