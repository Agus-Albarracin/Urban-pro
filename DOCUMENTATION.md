//back
Cambiar la version de node, ya que contienen configuraciones antiguas, utilizamos node v16


//front
Se migro el proyecto de craco a vite.
Se actualizaron las dependencias.


//back
Se creo la carpeta common y el archivo base.entity.ts, para heredar desde ella, como fecha de creacion, actualización y el uuid en cada registro.

El siguiente paso fue hacer que la entidades extendieran BaseEntity. Esto hace que Course herede las propiedades id, createdAt, y updatedAt.

usamos fowardRef para solucionar los problemas de dependencias entre course y content.

Inyección de repositorio: Se inyecta el repositorio de Content usando @InjectRepository(Content).
import { InjectRepository } from '@nestjs/typeorm';

Antiguo: Se accede directamente a la entidad utilizando métodos estáticos (.create().save() y .find()).

Cambio: Ahora, en el código nuevo, se usa el patrón de repositorio de TypeORM para manejar las interacciones con la base de datos. Esto facilita el control de las operaciones de base de datos y hace que el código sea más limpio y modular. Además, permite inyectar los repositorios en el servicio mediante @InjectRepository().

Métodos de repositorio: Se usa this.contentRepository.create(), this.contentRepository.save(), this.contentRepository.find(), this.contentRepository.findOne(), y this.contentRepository.remove() en lugar de los métodos directos de la clase Content.

Se cambio el metodo delete por remove.

//ops
el archivo yml contiene credenciales dentro, para evitar su exposición lo moveremos a un archivo .env
se añadio una red para controlar mejor la comunicación entre contenedores.
Se añadio un volumen para que en caso de detener los contenedores no se pierdan los datos de la DB.
Se modifico el archivo ngix.conf, ya que tenia una ruta sin definir, var/www a /usr/share/nginx/html
Se añadio express y webpack que no se encuentran en el archivo package.json


