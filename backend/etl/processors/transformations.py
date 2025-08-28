import pandas as pd

def group_and_sum(df: pd.DataFrame, group_by_col: str, sum_col: str):
    """
    Agrupa un DataFrame por una columna y suma los valores de otra.
    Renombra las columnas para que coincidan con lo que espera el frontend ('name', 'value').
    """
    if group_by_col not in df.columns or sum_col not in df.columns:
        raise ValueError("Las columnas para agrupar o sumar no existen en el DataFrame.")

    aggregated_df = df.groupby(group_by_col)[sum_col].sum().reset_index()
    aggregated_df = aggregated_df.rename(columns={group_by_col: "name", sum_col: "value"})

    return aggregated_df

# ✅ NUEVA FUNCIÓN GENÉRICA
def get_unique_values(df: pd.DataFrame, column: str):
    """
    Obtiene los valores únicos de una columna y los devuelve en un formato
    compatible con los selectores del frontend.
    """
    if column not in df.columns:
        raise ValueError(f"La columna '{column}' no existe en el DataFrame.")

    unique_values = df[column].unique()
    # El frontend espera objetos con 'value' y 'label' para los dropdowns
    return pd.DataFrame({
        'value': unique_values,
        'label': unique_values
    })

def calculate_kpis(df: pd.DataFrame, kpi_definitions: list):
    """
    Calcula un conjunto de KPIs basado en una lista de definiciones.
    """
    results = {}
    for kpi in kpi_definitions:
        kpi_id = kpi.get("id")
        op = kpi.get("operation")
        col = kpi.get("column")

        if op == "sum":
            results[kpi_id] = df[col].sum()
        elif op == "count":
            results[kpi_id] = len(df.index)
        elif op == "average":
            results[kpi_id] = df[col].mean()
        # Puedes añadir más operaciones como 'median', 'max', 'min', etc.

    return results