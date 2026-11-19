# Cafetería · Angular + Node.js + MySQL + Ollama / Gemma 3

Proyecto fullstack de ejemplo basado en el backend educativo proporcionado (se adaptó su lógica de chatbot a la cafetería). **Todos los datos del negocio** se consultan desde MySQL por medio de Node.js; Angular no se conecta directamente a la base de datos.

## Estructura

```text
cafeteria-fullstack/
├── frontend/                Angular 19: página pública, servicios, menú, contacto, chat
│   └── src/app/             componentes, modelos y servicio HTTP
├── backend/
│   ├── src/config/          conexión a MySQL
│   ├── src/models/          consultas SQL parametrizadas
│   ├── src/controllers/     lógica y chatbot adaptado de Guerra del Chaco
│   ├── src/middleware/      autenticación administrativa
│   ├── src/app.js           endpoints, límites, manejo de errores
│   ├── database/            esquema SQL y datos iniciales
│   └── tests/               pruebas automáticas
└── postman/                 colección para probar API
```

## 1. Requisitos

- Node.js 20 o posterior, npm.
- MySQL 8+ (también puede usarse MySQL de XAMPP).
- Ollama instalado; descargar modelo con `ollama pull gemma3:4b`.
- En una terminal dejar Ollama activo con `ollama serve` (si ya se ejecuta en segundo plano, no abras otro proceso).

## 2. Base de datos (XAMPP/MySQL)

En phpMyAdmin → pestaña **SQL**, importa primero `backend/database/schema.sql` y después **una sola vez** `backend/database/seed.sql`. También puedes usar:

```powershell
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/seed.sql
```

El seed proporciona **datos ficticios**: nombre, productos, precios, horarios, teléfono y dirección. Personalízalos antes de publicar. No lo ejecutes dos veces: los productos se duplicarían.

Tablas: `site_settings` (título/hero/video), `about` (historia y contacto), `services`, `categories`, `products`, `gallery`, `social_links`, `contact_messages`.

## 3. Backend Node.js

En PowerShell, desde `backend`:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Edita `.env` con tus credenciales MySQL, `ADMIN_API_KEY` larga y secreta y `OLLAMA_MODEL=gemma3:4b`. Prueba: http://localhost:3000/api/health y http://localhost:3000/api/content.

## 4. Frontend Angular

En otra terminal, desde `frontend`:

```powershell
npm install
npm start
```

Visita http://localhost:4200. Angular envía las peticiones `/api/*` a Node.js en el puerto 3000 mediante `proxy.conf.json`. Si publicas frontend y backend en dominios distintos, configura la URL de la API en un proxy del servidor web o adapta `api.service.ts` y `FRONTEND_ORIGIN`.

## 5. Video en bucle de Pexels

La web tiene un `<video autoplay muted loop playsinline>`. En [Pexels](https://www.pexels.com/video/barista-pouring-milk-on-coffee-6602227/) descarga un MP4 y guárdalo como `frontend/public/assets/cafeteria.mp4`. El campo `site_settings.hero_video_url` usa `/assets/cafeteria.mp4` y puede cambiarse desde MySQL o API. Se muestra una foto de respaldo mientras no exista el archivo. No se incluye el video binario en el ZIP. Comprueba las condiciones de uso del recurso elegido.

## 6. Actualización de datos en tiempo real de consulta

Angular carga `/api/content` al abrir/recargar la página. Todo título, precio, producto y contenido se extrae de MySQL. Por ejemplo, en phpMyAdmin:

```sql
USE cafeteria;
UPDATE site_settings SET hero_title='¡Bienvenidos a Café Bolivia!' WHERE id=1;
UPDATE products SET price=20.00 WHERE id=2;
```

Recarga la web para ver ambos cambios: **no es actualización instantánea por WebSocket**, sino datos nuevos en cada petición/carga.

**API administrativa:** requiere encabezado `x-admin-key` igual al secreto del `.env` (nunca lo pongas en Angular). Ejemplos:

```http
GET /api/admin/products
POST /api/admin/products
Content-Type: application/json
x-admin-key: TU_CLAVE

{"category_id":1,"name":"Mocaccino","description":"Café y chocolate","price":24,"image_url":"https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"}
```

```http
PUT /api/admin/site/1
Content-Type: application/json
x-admin-key: TU_CLAVE

{"hero_title":"Café recién hecho para ti"}
```

El campo de video, dirección, teléfono, historia, servicios y fotos también se administra por API. Para producción, sustituye la clave compartida por cuentas con permisos, restringe CORS, añade validación granular y utiliza HTTPS.

## 7. Chatbot Gemma 3

POST `/api/chatbot` con `{ "message": "¿Cuánto cuesta el capuchino?" }`. Node.js consulta MySQL, prepara un contexto con precios/dirección/horarios reales y lo envía a `http://localhost:11434/api/generate`. Angular solo conversa con Node.js. Si Ollama está apagado devuelve HTTP 503. En tu PC con RTX 4070 8 GB, `gemma3:4b` es una opción ligera para comenzar.

## 8. Pruebas con Postman

Importa `postman/Cafeteria.postman_collection.json`. Configura variables `baseUrl=http://localhost:3000` y `adminKey` con tu clave. Ejecuta Health, Contenido, Contacto, Chatbot, Productos admin y Cambiar título. Revisa los códigos 200, 201, 400, 401 y 503 según corresponda. Pruebas automáticas adicionales:

```powershell
cd backend
npm test
```

## 9. GitHub

Se recomienda un repositorio `cafeteria-fullstack` con las carpetas `frontend` y `backend`, o dos repositorios independientes. Desde la carpeta raíz:

```powershell
git init
git add .
git commit -m "Proyecto cafetería Angular Node MySQL Gemma3"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cafeteria-fullstack.git
git push -u origin main
```

Crea antes el repositorio vacío en GitHub. **No subas** `.env`, `node_modules`, bases de datos privadas ni claves. El proyecto no está publicado automáticamente en tu cuenta de GitHub.
