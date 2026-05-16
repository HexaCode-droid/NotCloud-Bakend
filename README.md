# NotCloud — Backend

Backend de **NotCloud**, una aplicación web para organizar notas, documentos y bases de datos personales desde un solo lugar.

> ⚠️ Este proyecto está en desarrollo y fue creado con fines de aprendizaje.

## ¿De qué trata?

NotCloud es una plataforma de productividad personal que permite a los usuarios crear y gestionar documentos organizados en páginas y espacios de trabajo. El objetivo del proyecto es aprender a construir APIs REST, manejar autenticación y trabajar con bases de datos.

## Estado del proyecto

🚧 **En construcción** — No está listo para producción.

## Tecnologías

- Node.js
- [NestJS](https://nestjs.com/)
- TypeORM + PostgreSQL
- JWT para autenticación
- [pnpm](https://pnpm.io/) como gestor de paquetes

## Requisitos

- Node.js 22+ (recomendado)
- [pnpm](https://pnpm.io/installation) 10.x (vía Corepack, recomendado)
- Docker y Docker Compose (para la base de datos local)

## Instalación

### 1. Activar pnpm (solo la primera vez)

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Base de datos local

```bash
docker compose up -d
```

PostgreSQL quedará disponible en `localhost:5432` con usuario, contraseña y base de datos `postgres` / `notcloud` (ver `docker-compose.yml`).

## Scripts

| Comando           | Descripción                          |
|-------------------|--------------------------------------|
| `pnpm install`    | Instala dependencias                 |
| `pnpm start:dev`  | Arranca en desarrollo (hot reload)   |
| `pnpm build`      | Compila a `dist/`                    |
| `pnpm start:prod` | Ejecuta build de producción          |
| `pnpm lint`       | ESLint (con fix)                     |
| `pnpm format`     | Formatea con Prettier                |

Para añadir paquetes:

```bash
pnpm add <paquete>        # dependencia de producción
pnpm add -D <paquete>     # dependencia de desarrollo
```

## Arquitectura

Este backend sigue una **Arquitectura Limpia (Clean Architecture)**, organizada por capas para separar responsabilidades y facilitar mantenimiento, pruebas y escalabilidad.

```
src/
├── application/   # Casos de uso, servicios, excepciones
└── domain/        # Modelos y puertos (interfaces)
```

## Configuración

El archivo `.npmrc` en la raíz es la configuración de **pnpm** (hoisting para NestJS), no de npm.

Variables de entorno: copia `.env.example` a `.env` cuando esté disponible y ajusta los valores en local. El archivo `.env` no se sube al repositorio.

## Licencia

ISC
