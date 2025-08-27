from fastapi import FastAPI
from api import endpoints
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Plataforma SaaS de BI",
    description="Backend dinámico para servir datos a dashboards configurables.",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde el frontend de Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:9002"], # Origen de tu app Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "Backend de BI funcionando"}