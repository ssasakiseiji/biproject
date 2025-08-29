import importlib
import pandas as pd

def get_data_for_endpoint(client_id: str, endpoint_id: str, filters: dict = None):
    """
    Orquesta la obtención y procesamiento de datos para un endpoint, aplicando filtros.
    """
    try:
        config_module = importlib.import_module(f"configs.{client_id}_config")
        config = config_module.get_config()

        endpoint_config = config["endpoints"][endpoint_id]
        source_config = config["data_sources"][endpoint_config["source"]]

        loader_func = source_config["loader"]
        df = loader_func(file_path=source_config["path"])

        # Aquí se podrían aplicar los filtros si fuera necesario antes del pipeline

        for step in endpoint_config.get("pipeline", []):
            if isinstance(step, tuple):
                processor_func_path, args = step
                module_path, func_name = processor_func_path.rsplit('.', 1)
                module = importlib.import_module(module_path)
                processor_func = getattr(module, func_name)
                df = processor_func(df, **args)
            else:
                module_path, func_name = step.rsplit('.', 1)
                module = importlib.import_module(module_path)
                processor_func = getattr(module, func_name)
                df = processor_func(df)

        return df.to_dict(orient='records')

    except ModuleNotFoundError:
        raise ValueError(f"Configuración para el cliente '{client_id}' no encontrada.")
    except KeyError:
        raise ValueError(f"Endpoint '{endpoint_id}' no encontrado para el cliente '{client_id}'.")
    except Exception as e:
        print(f"Error procesando la petición: {e}")
        raise