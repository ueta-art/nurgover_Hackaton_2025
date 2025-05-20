# nurgover_Hackaton_2025

### DESPLIEGUE EN:
https://app.ueta-art.com/ 

(alojado provisionalmente en un subdominio de mi web)

### DESCRIPCIÓN DEL PROYECTO ###

Aplicación full stack con: React, Node.js, Express, MongoDB - y Clerk. 

Mi aplicación permitirá a profesionales ofrecer sus servicios y gestionar su disponibilidad mediante reglas semanales y excepciones (como vacaciones o ausencias). 
Los usuarios pueden navegar perfiles, seguir a profesionales, visualizar horarios disponibles en tiempo real y solicitar reservas adaptadas al tipo de servicio: por hora, día o mes, descargar sus horarios y reservas, etc.

La he empezado desde cero, po lo que, esto es lo que me ha dado tiempo en una semana. El caso es que: "continuara..." su realización, en mis ratos libres. 

## 🔧 Características principales:
Autenticación Clerk (luego hablaré de los problemas que me ha dado el condenado).
Distinción clara entre clientes y profesionales mediante roles.
Sistema completo de gestión de disponibilidad, la idea es que sea súper flexible.
Excepciones (festivos, vacaciones, ausencias parciales).
Slots dinámicos de descanso generados en bloques de 5 minutos - próximamente
Posibilidad de escoger la disponibilidad según tu proyecto sea: por horas, por jornada, mensual. 
Se acoplan los slots de horas / horas por día / días por mes a la disponibilidad establecida por cada profesional.
Posibilidad de modificar reservas (con la validación de ambas partes) o cancelarlas.
Gestión de reservas con seguimiento de estado (pendiente, confirmada, cancelada) y posibilidad de modificación.
Valoraciones y reseñas tras cada servicio.
Componentes para: 
- Creación y edición de servicios
- Creación y edición de horarios
- Visualización de calendarios interactivos
- Navegación de semanas y filtrado avanzado
- Catagolación por "etiquetas" - próximamente.
- Integración futura con Google Calendar y subida de imágenes
- ... 

## 🛠️ Frameworks y herramientas usadas
> Frontend: React (Vite) + TypeScript + TailwindCSS
> Dependencias:
@clerk/clerk-react (auth y hooks y roles) 
react-router-dom (nav entre pags.) 
tailwindcss + @tailwindcss/vite + postcss + autoprefixer 
i18next (idiomas-proximamente)+ react-i18next 
@hello-pangea/dnd
framer-motion
react-day-picker 

>Backend: Node.js + Express + Mongoose Dependencias (no dev & dev): @clerk/express express mongoose cors dotenv multer validator moment date-fns typescript @types/express @types/node @types/cors ts-node nodemon

/backend
├── src
│   ├── controllers
│   │   ├── user.controller.ts
│   │   ├── service.controller.ts
│   │   ├── availability.controller.ts
│   │   └── booking.controller.ts
│   ├── models
│   │   ├── user.schema.ts
│   │   ├── service.schema.ts
│   │   ├── availabilityRule.schema.ts
│   │   └── booking.schema.ts
│   │   └── availabilityException.schema.ts
│   ├── routes
│   │   ├── user.routes.ts
│   │   ├── service.routes.ts
│   │   ├── availability.routes.ts
│   │   └── booking.routes.ts
│   ├── middlewares
│   │   ├── auth.ts (el getAuth de clerk aquí en el backend me ha dado una de problemas... al final lo he quitado.)
│   ├── app.ts
│   ├── server.ts
│   └── config
│       ├── db.ts
│      
├── package.json
├── tsconfig.json
└── .env

> Autenticación: Clerk.

> Infraestructura: Servidor Linux, NGINX con proxy inverso, dominio personalizado y base de datos en mongodb (comunity server).


## 🎯 Público objetivo
Freelancers y profesionales que quieren una forma fácil y muy flexible de ofrecer servicios. 
Clientes que desean reservar servicios personalizados.

## CLERK
Clerk se ha empleado para la autenticación de usuarios de forma rápida, completa y segura. Además se ha implementado en la base de datos, eso sí, todavía no he conseguido que funcione como desearía porque algo sucede con el validador de los tokens de clerk y no ha habido manera humana de que me valide los tockens de la sesión de los usuarios.

✅ Funcionalidades implementadas con Clerk:
- Registro y login de usuarios.
- Identificación por clerkId sincronizada con la datos MongoDB.
- Protección de rutas frontend y backend usando: requireAuth() y getAuth() de Clerk. (aunque estos son los que me han dado problemas de todo tipo en la db)
- Obtención de información del usuario activo para asociar acciones privadas.

🔄 Integración personalizada con mi base de datos
Si  bien Clerk gestiona la autenticación externa, todos los datos personalizados (como rol, nick, disponibilidad o servicios) se almacenan en MongoDB. Por eso he decidido que al crear una cuenta en Clerk, se genere también un usuario propio en mi base de datos. De este modo, Clerk actúa como pasarela de identidad, pero los datos clave se manejan internamente.

🔧 Transición hacia autenticación propia con JWT
Temporalmente, he tenido que mover el sistema de autenticación a uno personalizado porque Clerk me daba problemas para validar los tokens.

## 🔎 DISCLAIMERS
Todavía hay demasiado por hacer, por ejemplo, no he tenido tiempo de trabajar en la versión de móbil.
Muchas funcionalidades las estaba  manejando con getAuth() pero como no ha funcionado hoy he tenido que cambiar todo el código que empleaba esa funcionalidad para que algunas de las funcionalidades de la web en producción se pudiesen usar, porque tal y como lo tenía con el getAuth() de clerk solamente funcionaba en el development mode y ha sido un agobio impresionante tener que cambiarlo todo ahora. 
