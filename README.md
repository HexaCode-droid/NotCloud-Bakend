# NotCloud — Backend

Backend de **NotCloud**, una aplicación web para organizar notas, documentos y bases de datos personales desde un solo lugar.

> ⚠️ Este proyecto está en desarrollo y fue creado con fines de aprendizaje.


## ¿De qué trata?

NotCloud es una plataforma de productividad personal que permite a los usuarios crear y gestionar documentos organizados en páginas y espacios de trabajo. El objetivo del proyecto es aprender a construir APIs REST, manejar autenticación y trabajar con bases de datos.

## Estado del proyecto

🚧 **En construcción** — No está listo para producción.

## Tecnologías (planeadas)

- Node.js + Express
- Base de datos (por definir)
- JWT para autenticación

## Arquitectura

Este backend sigue una **Arquitectura Limpia (Clean Architecture)**, organizada por capas para separar responsabilidades y facilitar mantenimiento, pruebas y escalabilidad.

## Estructura de carpetas

```text
src/
  domain/
    entities/
    repositories/
    services/
  application/
    use-cases/
    dtos/
  infrastructure/
    database/
    persistence/
    external-services/
  interfaces/
    http/
      controllers/
      routes/
      middlewares/
  config/
  shared/
    utils/
tests/
  unit/
  integration/
```
