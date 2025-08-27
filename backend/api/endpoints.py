from fastapi import APIRouter, HTTPException
from services import dashboard_service

router = APIRouter()

@router.get("/data/{client_id}/{endpoint_id}")
async def get_dashboard_data(client_id: str, endpoint_id: str):
    try:
        data = dashboard_service.get_data_for_endpoint(client_id, endpoint_id)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor.")