# MFA-AUTH-APP

Autenticación multifactor con NestJS y MongoDB usando Google Authenticator y JWT.

## 🚀 Características

- 📦 Basado en [NestJS](https://nestjs.com/)
- 🔐 Autenticación con JWT
- 🔐 Soporte para MFA (Google Authenticator / TOTP)
- 🍃 MongoDB como base de datos (vía Mongoose)
- 🔧 Configuración por entorno con **.env**
- 📁 Arquitectura modular (`auth`, `users`, `config`, etc.)

## 🛠️ Tecnologías

- **NestJS**
- **MongoDB**
- **Mongoose**
- **Passport.js** (local, JWT y Google OAuth)
- **Speakeasy** y **qrcode** (MFA / TOTP)
- **Docker** + **Docker Compose**
- **JWT** (para sesiones)

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/AJ-Derteano/mfa-auth-app
cd mfa-auth-app
```

2. Copia variables de entorno

```bash
cp .env.development .env
```

| Ajusta los valores según tu entorno (DB_HOST, DB_USER, JWT_SECRET, etc.).

3. Levanta MongoDB con Docker:

```bash
docker-compose up -d
```

4. Instala dependencias:

```bash
# npm, yarn o pnpm
pnpm install
```

5. Ejecuta la aplicación en modo desarrollo:

```bash
npm run start:dev

```

📁 Estructura del proyecto

```bash
src/
├── auth/ # Módulo de autenticación (JWT, local, Google OAuth, MFA)
├── users/ # Módulo de usuarios (esquema, servicio, controlador)
├── config/ # Configuración global y cargado de variables de entorno
├── dtos/ # Data Transfer Objects
├── schemas/ # Esquemas de Mongoose
├── common/ # Pipes, guards y filtros globales
├── app.module.ts # Módulo raíz
└── main.ts # Punto de entrada
```

🔐 Flujo de autenticación

1. Registro: usuario + contraseña (bcrypt) → JWT (primer factor).

2. Configuración MFA: generar y escanear QR TOTP con Google Authenticator.

3. Login: usuario + contraseña → JWT → envío de código TOTP → verificación → acceso.

4. SSO con Google: redirección OAuth → callback → creación/búsqueda de usuario → emisión de JWT.

☁️ Despliegue
Puedes desplegar tu aplicación de varias maneras:

Despliegue con Docker Compose

1. Asegúrate de tener Docker y Docker Compose instalados.

2. Define en .env las variables necesarias (MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, etc.).

3. Ejecuta:

```bash
docker-compose up -d --build
```

4. La API estará disponible en http://localhost:3000/v1 (o el puerto configurado).
