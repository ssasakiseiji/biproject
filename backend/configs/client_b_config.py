# backend/configs/client_b_config.py
from etl.loaders import csv_loader
from etl.processors import transformations

CONFIG = {
    "dashboards": [
        {
            "dashboardId": "financials",
            "name": "Demo Completa",
            "pages": [
                {
                    "pageId": "summary",
                    "name": "Resumen Financiero",
                    "base_endpoint": "resumen_financiero",
                    "grid": {"columns": 4, "rows": 6}, # Grid más grande para la demo
                    "visuals": [
                        # Fila 1: Bloque de Texto y Filtros
                        {
                            "id": "text_intro",
                            "type": "text_block",
                            "grid_position": {"x": 0, "y": 0, "w": 4, "h": 1},
                            "content": """
# Bienvenido al Dashboard de Demostración
Este es un ejemplo de un bloque de texto que soporta **Markdown**.
- Puedes usar listas
- **Negrita** e *itálica*.
Utiliza los filtros a continuación para explorar los datos.
                            """
                        },
                        {
                            "id": "filter_region", "type": "filter_dropdown", "title": "Filtrar por Región",
                            "grid_position": {"x": 0, "y": 1, "w": 1, "h": 1},
                            "config": {"filter_key": "region", "source_endpoint": "lista_regiones"}
                        },
                        {
                            "id": "filter_categoria", "type": "filter_selector", "title": "Seleccionar Categoría",
                            "grid_position": {"x": 1, "y": 1, "w": 1, "h": 1},
                            "config": {"filter_key": "categoria", "source_endpoint": "lista_categorias"}
                        },
                        {
                            "id": "filter_fecha", "type": "filter_date_range", "title": "Rango de Fechas",
                            "grid_position": {"x": 2, "y": 1, "w": 2, "h": 1},
                            "config": {"filter_key": "fecha"}
                        },
                        # Fila 2: KPIs
                        {"id": "kpi_ingresos", "type": "kpi", "title": "Ingresos Totales", "data_source": "kpis.totalIngresos", "grid_position": {"x": 0, "y": 2, "w": 1, "h": 1}, "format": "currency"},
                        {"id": "kpi_unidades", "type": "kpi", "title": "Unidades Totales", "data_source": "kpis.totalUnidadesVendidas", "grid_position": {"x": 1, "y": 2, "w": 1, "h": 1}},
                        {"id": "kpi_promedio", "type": "kpi", "title": "Venta Promedio", "data_source": "kpis.promedioVenta", "grid_position": {"x": 2, "y": 2, "w": 1, "h": 1}, "format": "currency"},
                        {"id": "kpi_transacciones", "type": "kpi", "title": "Transacciones", "data_source": "kpis.totalTransacciones", "grid_position": {"x": 3, "y": 2, "w": 1, "h": 1}},
                        # Fila 3: Gráficos
                        {"id": "chart_ingresos_categoria", "type": "interactive_pie_chart", "title": "Ingresos por Categoría", "api_endpoint": "ingresos_por_categoria", "grid_position": {"x": 0, "y": 3, "w": 2, "h": 2}, "filter_key": "categoria"},
                        {"id": "chart_ingresos_region", "type": "interactive_bar_chart", "title": "Ingresos por Región", "api_endpoint": "ingresos_por_region", "grid_position": {"x": 2, "y": 3, "w": 2, "h": 2}, "filter_key": "region"},
                        # Fila 4: Tabla
                        {"id": "table_detalle", "type": "data_table", "title": "Detalle de Transacciones", "api_endpoint": "detalle_financiero", "grid_position": {"x": 0, "y": 5, "w": 4, "h": 2}}
                    ]
                }
            ]
        }
    ],
    "data_sources": {
        "financial_data": {"loader": csv_loader.load_from_csv, "path": "data/client_b_financials.csv"}
    },
    "endpoints": {
        "detalle_financiero": {"source": "financial_data", "pipeline": []},
        "ingresos_por_categoria": {"source": "financial_data", "pipeline": [(transformations.group_and_sum, {"group_by_col": "categoria", "sum_col": "ingresos"})]},
        "ingresos_por_region": {"source": "financial_data", "pipeline": [(transformations.group_and_sum, {"group_by_col": "region", "sum_col": "ingresos"})]},
        "lista_regiones": {"source": "financial_data", "pipeline": [(transformations.get_unique_values, {"column": "region"})]},
        "lista_categorias": {"source": "financial_data", "pipeline": [(transformations.get_unique_values, {"column": "categoria"})]}
    }
}