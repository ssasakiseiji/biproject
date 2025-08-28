# ssasakiseiji/biproject/biproject-c27025170b497117a48b90ae73651843b5f34964/backend/api/endpoints.py

from fastapi import APIRouter, HTTPException, Body 
from services import dashboard_service, kpi_service
import importlib
import pandas as pd
from typing import List, Dict, Any

router = APIRouter()

@router.get("/dashboards/{client_id}")
async def get_client_dashboards(client_id: str):
    try:
        config_module = importlib.import_module(f"configs.{client_id}_config")
        config = config_module.CONFIG

        dashboards_list = [
            {
                "id": d["dashboardId"],
                "clientId": client_id,
                "name": d["name"],
                "path": f"/dashboard/{d['dashboardId']}",
                "pages": [
                    {"id": p["pageId"], "name": p["name"]} for p in d.get("pages", [])
                ]
            }
            for d in config.get("dashboards", [])
        ]
        return dashboards_list
    except ModuleNotFoundError:
        raise HTTPException(status_code=404, detail=f"Configuración para el cliente '{client_id}' no encontrada.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")

@router.get("/dashboards/{client_id}/{dashboard_id}/{page_id}/config")
async def get_dashboard_page_config(client_id: str, dashboard_id: str, page_id: str):
    try:
        config_module = importlib.import_module(f"configs.{client_id}_config")
        config = config_module.CONFIG

        dashboard_config = next((d for d in config.get("dashboards", []) if d["dashboardId"] == dashboard_id), None)
        if not dashboard_config:
            raise HTTPException(status_code=404, detail=f"Dashboard '{dashboard_id}' no encontrado para el cliente '{client_id}'.")

        page_config = next((p for p in dashboard_config.get("pages", []) if p["pageId"] == page_id), None)
        if not page_config:
            raise HTTPException(status_code=404, detail=f"Página '{page_id}' no encontrada en el dashboard '{dashboard_id}'.")

        return page_config
    except ModuleNotFoundError:
        raise HTTPException(status_code=404, detail=f"Configuración para el cliente '{client_id}' no encontrada.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")

@router.get("/data/{client_id}/{endpoint_id}")
async def get_dashboard_data(client_id: str, endpoint_id: str):
    try:
        data = dashboard_service.get_data_for_endpoint(client_id, endpoint_id)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor.")

@router.post("/kpis/{client_id}")
async def get_client_kpis(client_id: str, data: list):
    """
    Recibe datos (posiblemente filtrados) y devuelve los KPIs calculados.
    """
    try:
        # Convertimos los datos JSON recibidos a un DataFrame de pandas
        df = pd.DataFrame(data)
        # Nos aseguramos que las columnas numéricas sean del tipo correcto
        if 'ingresos' in df.columns:
            df['ingresos'] = pd.to_numeric(df['ingresos'])
        if 'unidadesVendidas' in df.columns:
            df['unidadesVendidas'] = pd.to_numeric(df['unidadesVendidas'])

        kpis = kpi_service.get_kpis_for_client(client_id, df)
        return kpis
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")
    
@router.post("/data/chart/{client_id}")
async def get_chart_data(client_id: str,
                         base_data: List[Dict[str, Any]] = Body(...),
                         group_by: List[str] = Body(...),
                         metric: str = Body(...)):
    """
    Recibe datos, una lista de columnas por las que agrupar y una métrica.
    Devuelve los datos agregados.
    """
    try:
        if not base_data:
            return []

        df = pd.DataFrame(base_data)

        # Asegurarse de que la métrica sea numérica
        if metric in df.columns:
            df[metric] = pd.to_numeric(df[metric])

        # Agrupa por una o más columnas y suma la métrica
        aggregated_df = df.groupby(group_by)[metric].sum().reset_index()
        aggregated_df = aggregated_df.rename(columns={group_by[-1]: "name", metric: "value"})

        return aggregated_df.to_dict(orient='records')

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando datos del gráfico: {e}")