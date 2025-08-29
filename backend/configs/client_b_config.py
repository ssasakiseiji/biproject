from typing import Dict, Any
from etl.loaders import csv_loader
from etl.processors import transformations

def get_config() -> Dict[str, Any]:
    """Genera la configuración estandarizada para el Cliente A."""
    config = {
        "dashboards": [
            {
                "dashboardId": "showroom",
                "name": "Showroom de Componentes",
                "pages": [
                    {
                        "pageId": "summary",
                        "name": "Catálogo de Visuales",
                        "base_endpoint": "sales_summary",
                        "layout": {"columns": 4, "rows": 12},
                        "visuals": [
                            {
                                "id": "text_intro",
                                "type": "text_block",
                                "grid_position": {"w": 4, "h": 1},
                                "content": "# Catálogo de Componentes Visuales\nEsta página muestra todos los componentes disponibles."
                            },
                            {
                                "id": "kpi_card_1",
                                "type": "kpi",
                                "title": "Ingresos Totales",
                                "grid_position": {"w": 1, "h": 1},
                                "data_source": "kpis.totalIngresos",
                                "format": "currency"
                            },
                             {
                                "id": "kpi_card_2",
                                "type": "kpi",
                                "title": "Unidades Totales",
                                "grid_position": {"w": 1, "h": 1},
                                "data_source": "kpis.totalUnidadesVendidas"
                            },
                            {
                                "id": "filter_dropdown_1",
                                "type": "filter_dropdown",
                                "title": "Filtrar por Región",
                                "grid_position": {"w": 1, "h": 1},
                                "config": {"filter_key": "region", "source_endpoint": "lista_regiones"}
                            },
                            {
                                "id": "filter_date_range_1",
                                "type": "filter_date_range",
                                "title": "Rango de Fechas",
                                "grid_position": {"w": 2, "h": 1},
                                "config": {"filter_key": "fecha"}
                            },
                            {
                                "id": "data_table_1",
                                "type": "data_table",
                                "title": "Tabla de Datos",
                                "grid_position": {"w": 4, "h": 4},
                                "api_endpoint": "sales_summary"
                            }
                        ]
                    }
                ]
            }
        ],
        "data_sources": {
            "sales_data": {"loader": csv_loader.load_from_csv, "path": "data/client_a_sales.csv"}
        },
        "kpi_definitions": [
            {"id": "totalIngresos", "operation": "sum", "column": "ingresos"},
            {"id": "totalUnidadesVendidas", "operation": "sum", "column": "unidadesVendidas"},
            {"id": "promedioVenta", "operation": "average", "column": "ingresos"},
            {"id": "totalTransacciones", "operation": "count"}
        ],
        "endpoints": {
            "sales_summary": {"source": "sales_data", "pipeline": []},
            "lista_regiones": {"source": "sales_data", "pipeline": [(transformations.get_unique_values, {"column": "region"})]}
        }
    }
    return config