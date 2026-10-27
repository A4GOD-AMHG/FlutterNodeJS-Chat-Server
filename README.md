# FlutterNodeJS-Chat-Server

Servidor backend del proyecto de chat en tiempo real desarrollado por **Alexis Manuel Hurtado Garcia**. Gestiona el registro y la autenticación de usuarios con JWT, el historial de mensajes en MongoDB y la mensajería en tiempo real (envío, edición y borrado) mediante Socket.io. Es el backend de la app móvil [FlutterNodeJS-Chat](https://github.com/A4GOD-AMHG/FlutterNodeJS-Chat).

## Tech Stack

<div style="display: flex; align-items: center;">
  <img src="https://raw.githubusercontent.com/A4GOD-AMHG/Utils-for-repos/refs/heads/main/icons/nodejs/nodejs-original.svg" alt="nodejs" width="65" height="65" />
  <img src="https://raw.githubusercontent.com/A4GOD-AMHG/Utils-for-repos/refs/heads/main/icons/js/javascript-original.svg" alt="javascript" width="65" height="65" />
  <img src="https://raw.githubusercontent.com/A4GOD-AMHG/Utils-for-repos/refs/heads/main/icons/socketio/socketio-original.svg" alt="socketio" width="65" height="65" />
  <img src="https://raw.githubusercontent.com/A4GOD-AMHG/Utils-for-repos/refs/heads/main/icons/mongodb/mongodb-original.svg" alt="mongodb" width="65" height="65" />
  <img src="https://raw.githubusercontent.com/A4GOD-AMHG/Utils-for-repos/refs/heads/main/icons/npm/npm-original-wordmark.svg" alt="npm" width="65" height="65" />
</div>

## Características

- **Autenticación JWT**: registro, login y renovación de token (`x-token`).
- **Contraseñas cifradas**: hash con bcrypt.
- **Mensajería en tiempo real**: Socket.io con una sala por usuario autenticado.
- **Edición y borrado**: solo el autor puede editar o eliminar sus mensajes.
- **Presencia**: el estado `online` del usuario se actualiza al conectar/desconectar.
- **Validación**: entradas validadas con express-validator y errores JSON consistentes (`{ ok: false, msg }`).

## Dependencias

### Dependencias Principales

- `express`: servidor HTTP y rutas REST.
- `socket.io`: comunicación en tiempo real.
- `mongoose`: modelos y conexión a MongoDB.
- `jsonwebtoken`: generación y verificación de JWT.
- `bcryptjs`: cifrado de contraseñas.
- `express-validator`: validación de peticiones.
- `cors`: habilita CORS.
- `morgan`: logs de peticiones HTTP.
- `dotenv`: carga de variables de entorno.

### Dependencias de Desarrollo

- `nodemon`: recarga automática en desarrollo.

## Cómo usar

```bash
git clone https://github.com/A4GOD-AMHG/FlutterNodeJS-Chat-Server.git
cd FlutterNodeJS-Chat-Server
npm install
cp example.env .env   # y edita los valores
npm run start:dev     # desarrollo
npm start             # producción
```

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servidor (por defecto `3000`) |
| `DB_CNN` | Cadena de conexión de MongoDB (si existe `LOCAL_DB`, tiene prioridad) |
| `JWT_KEY` | Secreto para firmar los JWT |

## API

Las rutas protegidas requieren la cabecera `x-token`.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login/new` | No | Registro `{ name, email, password }` → `{ ok, user, token }` |
| POST | `/api/login` | No | Login `{ email, password }` → `{ ok, user, token }` |
| GET | `/api/login/renew` | Sí | Renueva el token → `{ ok, user, token }` |
| GET | `/api/users?since=0` | Sí | Lista de usuarios (20 por página) |
| GET | `/api/messages?from=<uid>&limit=30` | Sí | Historial con un usuario (más recientes primero) |
| POST | `/api/messages` | Sí | Envía `{ to, message }` → mensaje creado `{ uid, from, to, message, createdAt, updatedAt }` |
| PUT | `/api/messages/edit` | Sí | Edita `{ _id, message }` de un mensaje propio |
| DELETE | `/api/messages/delete/:id` | Sí | Elimina un mensaje propio |

### Eventos de Socket.io

Conexión autenticada con la cabecera `x-token` en el handshake.

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `personal-message` | `{ uid, to, message }` | Reenvía el mensaje nuevo al destinatario |
| `edit-message` | `{ _id, to, message }` | Notifica la edición al destinatario |
| `delete-message` | `{ id, to }` | Notifica el borrado (el destinatario recibe el `id`) |

## Estructura del Proyecto

```
├── controllers/        # Lógica de auth, usuarios, mensajes y presencia
├── database/config.js  # Conexión a MongoDB
├── helpers/jwt.js      # Generación y verificación de JWT
├── middlewares/        # Validación de campos y de JWT
├── models/             # Esquemas User y Message
├── public/index.html   # Página estática por defecto
├── routes/             # Rutas /api/login, /api/users, /api/messages
├── sockets/socket.js   # Eventos de Socket.io
├── example.env         # Plantilla de variables de entorno
└── index.js            # Punto de entrada (Express + Socket.io)
```

## Licencia

ISC

## Autor

**Alexis Manuel Hurtado Garcia** - [GitHub](https://github.com/A4GOD-AMHG)
