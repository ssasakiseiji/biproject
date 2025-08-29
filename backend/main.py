from fastapi import FastAPI
from api import endpoints
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Plataforma SaaS de BI",
    description="Backend dinámico para servir datos a dashboards configurables.",
    version="1.0.0"
)

# Para desarrollo, permitir todos los orígenes es la opción más sencilla.
# En producción, deberías cambiar "*" por la URL de tu frontend.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "Backend de BI funcionando"}