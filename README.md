# Proyecto: Urbano

**Nota**: utilice `yarn` para instalar las dependencias del proyecto.

## Frontend

- **Migración de CRACO a Vite**  
  El proyecto fue migrado de CRACO (Create React App Configuration Override, obsoleto) a Vite, parar mejorar el rendimiento de la compilación. El puerto por defecto para el front ahora es 5173.

- **Actualización de dependencias**  
  Se actualizaron todas las dependencias del proyecto a las versiones más recientes para asegurar la compatibilidad y mejorar la seguridad y el rendimiento.

## Backend

- **Creación de carpeta `common` y archivo `base.entity.ts`**  
  Se ha creado una carpeta `common` y un archivo `base.entity.ts` para centralizar la gestión de entidades comunes. Ahora todas las entidades pueden heredar propiedades como fecha de creación, fecha de actualización y uuid de este archivo base.

- **Actualización en la interacción con la base de datos**  
  Se ha cambiado la forma en que se interactúa con la base de datos. Antes, se accedía directamente a las entidades utilizando métodos estáticos. Ahora, se utiliza el patrón de repositorio de TypeORM, lo que facilita la gestión de las operaciones de la base de datos, haciendo el código más limpio y modular. Además, permite la inyección de repositorios en los servicios mediante `@InjectRepository()`.

## Operaciones (Ops)

- **Modificación del archivo `docker-compose.yml`**  
  Se añadieron los puertos necesarios en el archivo `docker-compose.yml` para el despliegue de los servicios en contenedores.

- **Configuración de puertos en el frontend**  
  El frontend ahora se ejecuta por defecto en el puerto `5173`, que es el puerto predeterminado utilizado por Vite para el desarrollo.

- **Modificación del archivo `nginx.conf`**  
  Se actualizó la ruta de configuración Nginx con los nuevos parametros que ofrece Vite.
