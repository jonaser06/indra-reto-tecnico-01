# Prueba técnica

## Requerimientos

1. Docker
2. Cuenta de AWS

El software necesario para ejecutar este proyecto, esta dentro de la imagen de docker, para evitar tener que instalar cosas extras

## Setup

Despues de haber clonado el repositorio, necesitaras obtener credenciales de aws

### credentials

Esto lo obtendas desde IAM en tu cuenta de aws, no necesitas instalar aws cli, la imagen ya lo tiene

```
AWS_ACCESS_KEY_ID="XXXXXXXXXXXXXXXXXXXX"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AWS_SESSION_TOKEN="xxxxxx.......xxxxxxxxx"
```

esto debes de pegarlo en el archivo .env.example de la raiz del proyecto y renombrarlo como .env, tambien debes renombrar el archivo .env.example que esta dentro de la carpeta app

## Arranque

para correr el proyecto tienes que ejecutar el comando

```
make start
```

en este paso, el contenedor se encargara de crear una imagen de node, instalar dependencias, instalar serverless framework asi como aws cli

## Despliegue

para desplegar el proyecto basta con iniciar una terminal de la imagen corriendo y ejecutar el comando de serveless para desplegar

```
sls deploy
```

## Lista de Endpoints

una vez desplegado el proyecto en local o en una cuenta de aws se tendra unos enpoints que se describen a continuacion

| metodo   | url                                                                     | descripción                                                                                                                                                                                                                                                                                                             |
| -------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **get**  | https://p60hkjvt5i.execute-api.us-east-1.amazonaws.com/dev/species/{id} | Este endpoint consulta a la api de swapi por las especies del universo de starwars, una vez obtenido, traduce los atributos de las respuestas, luego las procede a guardar, de tal manera que en la proxima consulta, si es que el id de consulta ya existe la retornara directamente de la base de datos de Dynamodb\* |
| **post** | https://p60hkjvt5i.execute-api.us-east-1.amazonaws.com/dev/species      | Este endpoint registra directamente la especie a la tabla de dynamo, validando siempre si el id ingresado existe previamente, este metodo exige un body json\*\*                                                                                                                                                        |

\*El primer endpoint, avisara si su respuesta es desde el api de swapi o si viene de dynamo

- message: "Species found in SWAPI API"
- message: "Species found in the database"

\*\*Body de ejemplo:

```js
{
    "id": "9",
    "name": "Trandoshan",
    "classification": "reptile",
    "designation": "sentient",
    "average_height": "200",
    "skin_colors": "brown, green",
    "hair_colors": "none",
    "eye_colors": "yellow, orange",
    "average_lifespan": "unknown",
    "homeworld": "https://swapi.py4e.com/api/planets/29/",
    "language": "Dosh",
    "people": [
        "https://swapi.py4e.com/api/people/24/"
    ],
    "films": [
        "https://swapi.py4e.com/api/films/2/"
    ],
    "created": "2014-12-15T13:07:47.704000Z",
    "edited": "2014-12-20T21:36:42.151000Z",
    "url": "https://swapi.py4e.com/api/species/7/"
}
```

## Responses

todos los endpoint tienen un campo "message" en las respuestas, asi como tambien su cabecera con el codigo de respuesta

## Ejecucion de pruebas

el proyecto viene equipado con pruebas unitarias, para ejecutarlas solo basta con abrir una terminar de la iamgen de docker y ejecutar el comando

```
npm run test
```

## Loggers

Tambien se implemento la normalización de registros en una función Lambda de AWS utilizando la biblioteca @aws-lambda-powertools/logger. La normalización de registros garantiza que los registros generados por esta función sigan un formato coherente, lo que facilita su análisis y su integración con herramientas de monitoreo y análisis de registros.
