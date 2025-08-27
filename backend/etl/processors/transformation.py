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