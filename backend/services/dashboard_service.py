import importlib
import pandas as pd

def get_data_for_endpoint(client_id: str, endpoint_id: str):
    """
    Orquesta la obtención y procesamiento de datos para un endpoint específico de un cliente.
    """
    try:
        config_module = importlib.import_module(f"configs.{client_id}_config")
        config = config_module.CONFIG
        
        endpoint_config = config["endpoints"][endpoint_id]
        source_config = config["data_sources"][endpoint_config["source"]]
        
        # Cargar los datos usando el loader especificado
        loader_func = source_config["loader"]
        # Pasamos la ruta del archivo en lugar de credenciales y query
        df = loader_func(file_path=source_config["path"])

        # El pipeline de procesamiento funciona exactamente igual que antes
        for step in endpoint_config.get("pipeline", []):
            if isinstance(step, tuple):
                processor_func, args = step
                df = processor_func(df, **args)
            else:
                processor_func = step
                df = processor_func(df)
        
        return df.to_dict(orient='records')

    except ModuleNotFoundError:
        raise ValueError(f"Configuración para el cliente '{client_id}' no encontrada.")
    except KeyError:
        raise ValueError(f"Endpoint '{endpoint_id}' no encontrado para el cliente '{client_id}'.")
    except Exception as e:
        print(f"Error procesando la petición: {e}")
        raise