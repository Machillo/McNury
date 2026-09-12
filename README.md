# Mac Nury

Aplicación de pedidos para recoger, ventas, inventario y control diario de **Mac Nury Comidas Rápidas**.

La base incluye:

- Menú responsive basado en el menú actual del negocio.
- Personalización de productos, extras y observaciones.
- Carrito y confirmación de pedidos para recoger.
- Pantalla de seguimiento del pedido.
- Panel del negocio adaptado para celular y computadora.
- Estados de cocina: nuevo, preparando, listo y entregado.
- Inventario con alertas y ajustes rápidos.
- Resumen diario y cierre de caja demostrativo.
- API FastAPI con cálculo inicial de precios recomendados.
- Esquema inicial para Supabase.
- Configuración de Capacitor para Android y iOS.

## Probar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`. El enlace **Negocio** abre el panel administrativo.

## Probar el backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

En Windows Git Bash, la activación es:

```bash
source .venv/Scripts/activate
```

La documentación de la API queda en `http://127.0.0.1:8000/docs`.

## Estado actual

Esta primera entrega es una demo funcional con datos locales. Todavía no procesa pagos reales ni guarda pedidos en Supabase. Eso permite validar primero la experiencia con el negocio antes de contratar o conectar servicios externos.
