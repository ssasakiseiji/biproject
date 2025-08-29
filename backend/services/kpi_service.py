import importlib
from etl.processors import transformations
import pandas as pd

def get_kpis_for_client(client_id: str, base_data: pd.DataFrame):
    """
    Orquesta el cálculo de KPIs para un cliente utilizando su configuración.
    """
    try:
        config_module = importlib.import_module(f"configs.{client_id}_config")
        config = config_module.get_config()

        kpi_defs = config.get("kpi_definitions", [])
        if not kpi_defs:
            return {}

        kpi_results = transformations.calculate_kpis(base_data, kpi_defs)
        return kpi_results

    except ModuleNotFoundError:
        raise ValueError(f"Configuración para el cliente '{client_id}' no encontrada.")
    except Exception as e:
        print(f"Error procesando KPIs: {e}")
        raise