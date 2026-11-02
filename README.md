# API REST de Películas y Series

API REST desarrollada en **Node.js**, **Express** y **MongoDB Atlas** para gestionar un catálogo de películas y series. Permite administrar cinco módulos: **Género, Director, Productora, Tipo y Media**.

**Autor:** Jhan Moreno Delgado
**Asignatura:** Proyecto Integrado II – Desarrollo de Aplicaciones Web (IU Digital de Antioquia)

---

## Tecnologías

| Tecnología    | Uso                                      |
| ------------- | ---------------------------------------- |
| Node.js       | Entorno de ejecución                     |
| Express       | Servidor y rutas HTTP                    |
| Mongoose      | Modelos y conexión a MongoDB             |
| MongoDB Atlas | Base de datos en la nube                 |
| dotenv        | Variables de entorno                     |
| cors          | Permitir peticiones desde otros orígenes |
| Postman       | Pruebas de los endpoints                 |

---

## Requisitos previos

- [Node.js](https://nodejs.org) versión LTS (incluye npm).
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) con un cluster creado.
- [Postman](https://www.postman.com) (app de escritorio o web con Desktop Agent).

---

## Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd peliculas-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar MongoDB Atlas

1. En **Security → Database Access**, crear un usuario con permiso _Read and write to any database_.
2. En **Security → Network Access**, agregar la IP actual o `0.0.0.0/0` (acceso desde cualquier lugar).
3. En **Clusters → Connect → Drivers**, copiar la cadena de conexión.

### 4. Crear el archivo `.env`

Copiar `.env.example` con el nombre `.env` y completar los datos:

```env
PORT=3000
MONGO_URI=mongodb+srv://USUARIO:CLAVE@CLUSTER.mongodb.net/peliculas_db?retryWrites=true&w=majority
```

> El archivo `.env` contiene credenciales y está excluido en `.gitignore`. Nunca debe subirse al repositorio.

### 5. Iniciar el servidor

```bash
npm start
```

Para desarrollo, con reinicio automático al guardar cambios:

```bash
npm run dev
```

Si todo está bien, la terminal muestra:

```
Conectado a MongoDB
API de películas escuchando en http://localhost:3000
```

---

## Endpoints

URL base: `http://localhost:3000`

Cada módulo tiene operaciones CRUD:

| Módulo     | Ruta           |
| ---------- | -------------- |
| Género     | `/generos`     |
| Director   | `/directores`  |
| Productora | `/productoras` |
| Tipo       | `/tipos`       |
| Media      | `/medias`      |

| Método   | Ruta            | Acción                     |
| -------- | --------------- | -------------------------- |
| `GET`    | `/<modulo>`     | Listar todos los registros |
| `GET`    | `/<modulo>/:id` | Obtener un registro por ID |
| `POST`   | `/<modulo>`     | Crear un registro          |
| `PUT`    | `/<modulo>/:id` | Actualizar un registro     |
| `DELETE` | `/<modulo>/:id` | Eliminar un registro       |

### Campos de cada módulo

- **Género:** `nombre`, `estado`, `descripcion`
- **Director:** `nombres`, `estado`
- **Productora:** `nombre`, `estado`, `slogan`, `descripcion`
- **Tipo:** `nombre`, `descripcion`
- **Media:** `serial`, `titulo`, `sinopsis`, `url`, `imagen`, `anioEstreno`, `genero`, `director`, `productora`, `tipo`

Todos los registros guardan automáticamente `fechaCreacion` y `fechaActualizacion`.

### Ejemplo: crear una Media

`POST /medias`

```json
{
  "serial": "MED-001",
  "titulo": "El caballero de la noche",
  "sinopsis": "Batman enfrenta al Joker.",
  "url": "https://ejemplo.com/el-caballero-de-la-noche",
  "imagen": "https://ejemplo.com/portada.jpg",
  "anioEstreno": 2008,
  "genero": "<id_del_genero>",
  "director": "<id_del_director>",
  "productora": "<id_de_la_productora>",
  "tipo": "<id_del_tipo>"
}
```

La respuesta devuelve el género, director, productora y tipo con sus datos completos, no solo el ID.

### Códigos de respuesta

| Código                      | Significado                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| `200 OK`                    | Consulta o actualización exitosa                                              |
| `201 Created`               | Registro creado                                                               |
| `404 Not Found`             | El registro no existe                                                         |
| `409 Conflict`              | Ya existe un registro con el mismo valor único (por ejemplo, el mismo nombre) |
| `500 Internal Server Error` | Error del servidor o de conexión                                              |

---

## Pruebas con Postman

La carpeta `postman/` contiene una colección lista para importar.

1. En Postman, usar **Import** y elegir el archivo `.json` de la carpeta `postman/`.
2. Si se usa Postman web, seleccionar **Desktop Agent** en la barra inferior para que pueda llegar a `localhost`.
3. Ejecutar las peticiones en este orden:
   1. **Crear Género**, **Crear Director**, **Crear Productora** y **Crear Tipo**. Cada una guarda su ID en las variables de la colección (`generoId`, `directorId`, `productoraId`, `tipoId`).
   2. **Crear Media**, que usa esos cuatro IDs.
   3. Listar, obtener por ID y actualizar en cada módulo.
   4. Las eliminaciones al final, para no romper las referencias de Media.

---

## Estructura del proyecto

```
peliculas-api/
├── postman/            Colección de Postman
├── src/
│   ├── config/
│   │   └── db.js       Conexión a MongoDB
│   ├── app.js          Configuración de Express y rutas
│   └── server.js       Punto de entrada: carga .env, conecta y levanta el servidor
├── .env.example        Plantilla de variables de entorno
├── .gitignore
├── GUION_VIDEO.md      Guion para el video de sustentación
├── package.json
└── README.md
```

---

## Pasos seguidos en el desarrollo

1. **Análisis del caso de estudio.** Se identificaron las cinco entidades (Género, Director, Productora, Tipo y Media) y la relación principal: cada Media pertenece a un género, un director, una productora y un tipo.
2. **Configuración del proyecto.** Se inició el proyecto con npm y se instalaron Express, Mongoose, dotenv y cors.
3. **Conexión a la base de datos.** Se creó `src/config/db.js` para conectar con MongoDB Atlas mediante la variable `MONGO_URI`, de modo que las credenciales no queden en el código.
4. **Modelos de datos.** Se definieron los esquemas de Mongoose con campos obligatorios, valores únicos donde corresponde y fechas de creación y actualización automáticas. En Media, los campos de relación guardan referencias a los otros modelos.
5. **Rutas y lógica CRUD.** Se implementaron los endpoints para crear, listar, consultar por ID, actualizar y eliminar en cada módulo.
6. **Validaciones y manejo de errores.** La API responde con códigos HTTP claros: `409` ante registros duplicados, `404` cuando no existe el registro y mensajes de error en formato JSON.
7. **Relaciones en Media.** Al consultar o crear una Media, la API devuelve los datos completos de sus entidades relacionadas.
8. **Pruebas.** Se armó una colección de Postman con variables y scripts que guardan los IDs creados, para probar todo el flujo en orden.
9. **Seguridad básica.** Las credenciales viven en `.env`, que está excluido del repositorio con `.gitignore`. Se incluye `.env.example` como plantilla.
