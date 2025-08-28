# backend/configs/client_a_config.py
from etl.loaders import csv_loader
from etl.processors import transformations

CONFIG = {
    "dashboards": [
        {
            "dashboardId": "sales",
            "name": "Ventas",
            "pages": [
                {
                    "pageId": "overview",
                    "name": "Resumen General",
                    "base_endpoint": "detalle_transacciones",
                    "grid": {"columns": 4, "rows": 5},
                    "visuals": [
                        {"id": "kpi_ingresos", "type": "kpi", "title": "Ingresos Totales", "data_source": "kpis.totalIngresos", "grid_position": {"x": 0, "y": 0, "w": 1, "h": 1}, "format": "currency"},
                        {"id": "kpi_unidades", "type": "kpi", "title": "Unidades Totales", "data_source": "kpis.totalUnidadesVendidas", "grid_position": {"x": 1, "y": 0, "w": 1, "h": 1}},
                        {
    "id": "chart_ingresos_categoria",
    "type": "interactive_pie_chart",
    "title": "Ingresos por Categoría",
    "api_endpoint": "ingresos_por_categoria",
    "grid_position": {"x": 0, "y": 1, "w": 2, "h": 2},
    "filter_key": "categoria",
    "drill_down_levels": ["producto"] # ✅ Añadimos la jerarquía
},
{
    "id": "chart_ingresos_region",
    "type": "interactive_bar_chart",
    "title": "Ingresos por Región",
    "api_endpoint": "ingresos_por_region",
    "grid_position": {"x": 2, "y": 1, "w": 2, "h": 2},
    "filter_key": "region",
    "drill_down_levels": ["categoria", "producto"] # ✅ Múltiples niveles
},
                        {"id": "table_transacciones", "type": "data_table", "title": "Detalle de Transacciones", "api_endpoint": "detalle_transacciones", "grid_position": {"x": 0, "y": 3, "w": 4, "h": 2}}
                    ]
                }
            ]
        }
    ],
    "data_sources": {
        "sales_data": {
            "loader": csv_loader.load_from_csv,
            "path": "data/client_a_sales.csv"
        }
    },
     "kpi_definitions": [
        {"id": "totalIngresos", "operation": "sum", "column": "ingresos"},
        {"id": "totalUnidadesVendidas", "operation": "sum", "column": "unidadesVendidas"},
        {"id": "promedioVenta", "operation": "average", "column": "ingresos"},
        {"id": "totalTransacciones", "operation": "count"}
    ],
    "endpoints": {
        "ingresos_por_categoria": {"source": "sales_data", "pipeline": [(transformations.group_and_sum, {"group_by_col": "categoria", "sum_col": "ingresos"})]},
        "ingresos_por_region": {"source": "sales_data", "pipeline": [(transformations.group_and_sum, {"group_by_col": "region", "sum_col": "ingresos"})]},
        "detalle_transacciones": {"source": "sales_data", "pipeline": []}
    }
}