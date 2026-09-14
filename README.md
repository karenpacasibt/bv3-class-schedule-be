# Scaffolding backend (Express + Sequelize)

## Estructura

```
src/
├── index.js                          # Entrypoint: instancia Server y escucha
├── server.js                         # Clase Server: middlewares base, rutas, prepare()
├── config/config.js                  # Lectura de .env
├── db/
│   ├── connection.js                 # Instancia de Sequelize
│   ├── createDatabase.js             # Crea la DB si no existe
│   ├── runSqlFiles.js                # Ejecuta los .sql pendientes de una carpeta
│   ├── runMigrations.js              # npm run migrate
│   ├── runSeeders.js                 # npm run seed
│   ├── migrations/                   # .sql que crean y modifican tablas
│   └── seeders/                      # .sql con datos iniciales (usuario demo)
├── models/
│   ├── index.js                      # Autocarga de modelos + asociaciones
│   └── user.model.js                 # Modelo de ejemplo
├── routes/
│   ├── index.routes.js               # Router raiz montado en /api
│   └── user.routes.js                # Rutas de user
├── controllers/
│   ├── user.controller.js            # Logica: me()
│   └── user.controller.test.js       # Test co-locado (node:test)
├── decorators/user.decorator.js      # Shape de la respuesta (DTO)
└── utils/hashPassword.js             # Helper bcrypt
```

## Ciclo de vida del request

```
Request → Express → Route → Controller → Decorator → Response
```

Cuando se agregue autenticacion, se intercala antes del Route:

```
Request → Express → authMiddleware.verifyToken → role.middleware → Route → ...
```

## Arranque

### 1. Enciende MySQL

Necesitas MySQL corriendo en tu computadora. Puedes usar **Laragon** o **XAMPP**:

- **Laragon**: abre Laragon y presiona **Iniciar todo**.
- **XAMPP**: abre el Panel de Control y presiona **Start** en **MySQL**.

Los dos usan el puerto `3306`, el usuario `root` y vienen sin contrasena.

> No tienes que crear la base de datos a mano. `npm run migrate` la crea si
> todavia no existe.

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea tu archivo `.env`

```bash
cp .env.example .env
```

Si usas Laragon o XAMPP no tienes que cambiar nada. Si tu MySQL tiene
contrasena o usa otro puerto, cambia `DB_PASSWORD` o `DB_PORT`.

### 4. Crea las tablas y carga los datos iniciales

```bash
npm run db:setup
```

Crea la base de datos (`DB_NAME`) si no existe y ejecuta las migraciones y los
seeders. Si todo sale bien vas a ver algo asi:

```
migrations: 20260914_10_00_00_create_users_table.sql
Migrations complete
seeders: 20260914_11_00_00_seed_demo_user.sql
Seeders complete
```

Solo hace falta volver a correrlo cuando se agrega una migracion o un seeder
nuevo. Ver [Migraciones y seeders](#migraciones-y-seeders).

### 5. Arranca el proyecto

```bash
npm run dev
```

```
Database connected
Server running on port 3000
```

El servidor solo se conecta: **no crea ni modifica tablas**. Las tablas salen de
los archivos de `src/db/migrations/`, no de los modelos.

### Problemas comunes

**`ECONNREFUSED 127.0.0.1:3306`**
MySQL no esta encendido. Abre Laragon o XAMPP y enciende MySQL.

**`Unknown database` o `Table '...' doesn't exist`**
Faltan las migraciones. Corre `npm run db:setup`.

**`Access denied for user 'root'`**
La contrasena no coincide. Revisa `DB_PASSWORD` en tu `.env` (con Laragon o
XAMPP va vacia).

**Uso WSL y MySQL esta en Windows**
Dentro de WSL, `127.0.0.1` no llega a Windows. Lo mas facil es correr el
proyecto desde una terminal de Windows (PowerShell o la terminal de VS Code).

## Migraciones y seeders

| Comando | Que hace |
|---|---|
| `npm run migrate` | Crea la DB si no existe y ejecuta las migraciones pendientes |
| `npm run seed` | Ejecuta los seeders pendientes |
| `npm run db:setup` | Los dos, en ese orden |

- Los archivos se ejecutan en orden de nombre: `AAAAMMDD_HH_MM_SS_<descripcion>.sql`.
  Una tabla con FK hacia otra tiene que ir despues.
- Cada archivo ejecutado queda anotado en la tabla `migrations` (o `seeders`) y
  no se vuelve a correr.
- Si un archivo falla, se corta ahi y no queda anotado: se corrige y se vuelve a
  correr.
- **Nunca edites una migracion que ya corrio.** Para cambiar una tabla, crea un
  archivo nuevo (`..._add_<columna>_on_<tabla>_table.sql`).
- Una tabla por archivo: MySQL no deshace un `CREATE TABLE` si falla una
  sentencia posterior del mismo archivo.
- Los seeders usan `INSERT IGNORE` con IDs fijos, asi no fallan sobre una base
  que ya tiene esos datos.
- El modelo de Sequelize tiene que tener las mismas columnas que la migracion:
  el modelo no crea la tabla, solo la usa.

## Convenciones

- **IDs**: ULID (paquete `ulid`), string de 26 chars, no autoincremental.
- **Tablas**: snake_case plural (`users`), timestamps `created_at` / `updated_at`,
  borrado logico con `paranoid: true` y `deleted_at`.
- **Decorators**: funciones puras que transforman la instancia de Sequelize en la
  respuesta del API. El controller nunca devuelve el modelo crudo — asi el
  `password` jamas se filtra.
- **Tests**: co-locados como `*.controller.test.js`, con `node:test` + `assert/strict`.
  Los modelos se mockean sobreescribiendo `require.cache`.

## Endpoint de ejemplo

```
GET /api/user/me
```

```json
{
  "data": {
    "id": "01JYQZ8K3M4N5P6Q7R8S9T0V1W",
    "firstname": "User",
    "lastname": "Admin",
    "email": "user@admin.com"
  }
}
```

Sin middleware de auth no hay `req.user`, por lo que el controller resuelve al
primer usuario de la tabla (el del seeder). El TODO en
`src/controllers/user.controller.js` marca la linea exacta a cambiar por
`User.findByPk(req.user.id)` cuando se sume `verifyToken`.

## Usuario del seeder

| Campo | Valor |
|---|---|
| id | `01JYQZ8K3M4N5P6Q7R8S9T0V1W` |
| firstname | User |
| lastname | Admin |
| email | user@admin.com |
| password | `Admin123!` (se guarda hasheada con bcrypt) |

## Agregar una entidad nueva

1. `src/db/migrations/<AAAAMMDD_HH_MM_SS>_create_<tabla>_table.sql` + `npm run migrate`.
2. `src/models/<entidad>.model.js` — el `index.js` la autocarga.
3. `src/decorators/<entidad>.decorator.js`
4. `src/controllers/<entidad>.controller.js`
5. `src/routes/<entidad>.routes.js` + registrarla en `index.routes.js`
6. `src/controllers/<entidad>.controller.test.js`
