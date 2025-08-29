from typing import Dict, Any
from etl.loaders import csv_loader
from etl.processors import transformations

def get_config() -> Dict[str, Any]:
    """Genera la configuración estandarizada para el Showroom del Cliente A."""
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
                        "layout": {"columns": 4, "rows": 16}, # ✅ Aumentamos el número de filas
                        "visuals": [
                            {
                                "id": "text_intro",
                                "type": "text_block",
                                "grid_position": {"x": 0, "y": 0, "w": 4, "h": 2}, # Posición (fila 0)
                                "content": "# Catálogo de Componentes Visuales\nEsta página muestra todos los componentes disponibles en la plataforma KIN BI, demostrando la flexibilidad y potencia de cada uno."
                            },
                            {
                                "id": "filter_region", "type": "filter_dropdown", "title": "Filtrar por Región",
                                "grid_position": {"x": 0, "y": 2, "w": 1, "h": 2}, # Posición (fila 2)
                                "config": {"filter_key": "region", "source_endpoint": "lista_regiones"}
                            },
                            {
                                "id": "filter_date_range_1", "type": "filter_date_range", "title": "Rango de Fechas",
                                "grid_position": {"x": 1, "y": 2, "w": 2, "h": 2}, # Posición (fila 2)
                                "config": {"filter_key": "fecha"}
                            },
                            {
                                "id": "kpi_card_1", "type": "kpi", "title": "Ingresos Totales",
                                "grid_position": {"x": 0, "y": 4, "w": 1, "h": 1}, # Posición (fila 4)
                                "data_source": "kpis.totalIngresos", "format": "currency"
                            },
                            {
                                "id": "kpi_card_2", "type": "kpi", "title": "Unidades Totales",
                                "grid_position": {"x": 1, "y": 4, "w": 1, "h": 1}, # Posición (fila 4)
                                "data_source": "kpis.totalUnidadesVendidas"
                            },
                            {
                                "id": "interactive_bar_chart_1", "type": "interactive_bar_chart", "title": "Ventas Interactivas por Región",
                                "grid_position": {"x": 0, "y": 5, "w": 2, "h": 4}, # Posición (fila 5)
                                "api_endpoint": "ingresos_por_region", "filter_key": "region"
                            },
                            {
                                "id": "interactive_pie_chart_1", "type": "interactive_pie_chart", "title": "Distribución Interactiva por Categoría",
                                "grid_position": {"x": 2, "y": 5, "w": 2, "h": 4}, # Posición (fila 5)
                                "api_endpoint": "ingresos_por_categoria", "filter_key": "categoria"
                            },
                            {
                                "id": "data_table_1", "type": "data_table", "title": "Tabla de Datos Detallada",
                                "grid_position": {"x": 0, "y": 9, "w": 4, "h": 6}, # Posición (fila 9)
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
            "lista_regiones": {"source": "sales_data", "pipeline": [("etl.processors.transformations.get_unique_values", {"column": "region"})]},
            "ingresos_por_region": {"source": "sales_data", "pipeline": [("etl.processors.transformations.group_and_sum", {"group_by_col": "region", "sum_col": "ingresos"})]},
            "ingresos_por_categoria": {"source": "sales_data", "pipeline": [("etl.processors.transformations.group_and_sum", {"group_by_col": "categoria", "sum_col": "ingresos"})]}
        }
    }
    return config