# Instalación del Proyecto

## Instalación del código fuente

### 1. Clonar el proyecto

```
$ git clone https://gitlab.agetic.gob.bo/agetic/mdpyep/registro-comercio/mdpyep-seprec-parametricas-frontend.git
```

### 2. Ingresar a la carpeta

```
$ cd mdpyep-seprec-parametricas-frontend
```

### 3. Instalar dependencias del proyecto

> Es necesario que el servidor tenga correctamente configurado los [repositorios](http://repositorio.agetic.gob.bo/).

```
$ npm install
```

### 4. Archivo de configuración

1. Copiar el archivo de configuración de ejemplo.

```
$ cp .env.sample .env
```

3. Revisar el archivo creado `.env` y configurar las variables necesarias. Los ejemplos se encuentran en el archivo `.env.sample` de configuración.

**NOTA**: PARA MAYOR DETALLE REVISAR LA ÚLTIMA VERSIÓN DEL ARCHIVO .env.sample.

**Datos de despliegue**
- NODE_ENV: ambiente de despliegue.
- PORT: Puerto en el que se levantará la aplicación.

## Ejecución manual

- Ejecución en modo desarrollo
```bash
# development
$ npm run start
```
