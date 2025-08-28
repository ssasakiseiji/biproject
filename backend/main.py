from fastapi import FastAPI
from api import endpoints
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Plataforma SaaS de BI",
    description="Backend dinámico para servir datos a dashboards configurables.",
    version="1.0.0"
)

# ✅ Actualizamos la configuración de CORS para ser más permisiva en desarrollo
origins = [
    "http://localhost:3000",
    "http://localhost:9002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos
    allow_headers=["*"], # Permite todas las cabeceras
)

app.include_router(endpoints.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "Backend de BI funcionando"}