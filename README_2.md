# **Ecommerce Vida Mapfre**

Este proyecto ha sido generado con [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

### **Indice del contenido:**

- [**Ecommerce Vida Mapfre**](#ecommerce-vida-mapfre)
    - [**Indice del contenido:**](#indice-del-contenido)
  - [**1. Proyecto**](#1-proyecto)
  - [**2. Entorno de desarrollo**](#2-entorno-de-desarrollo)
    - [**2.1 Generación de componentes y otras directivas**](#21-generaci%c3%b3n-de-componentes-y-otras-directivas)
    - [**2.2 Generación de compilado (build)**](#22-generaci%c3%b3n-de-compilado-build)
    - [**2.3 Ayuda adicional**](#23-ayuda-adicional)
  - [**3. Estructura del proyecto**](#3-estructura-del-proyecto)
    - [**3.1 core**](#31-core)
      - [**3.1.1 guards**](#311-guards)
      - [**3.1.2 interceptors**](#312-interceptors)
      - [**3.1.3 resolvers**](#313-resolvers)
      - [**3.1.4 services**](#314-services)
    - [**3.2 pages**](#32-pages)
      - [**3.2.1 beneficiary**](#321-beneficiary)
      - [**3.2.2 card-payment**](#322-card-payment)
      - [**3.2.3 cession-beneficiary**](#323-cession-beneficiary)
      - [**3.2.4 coverage**](#324-coverage)
      - [**3.2.2 error**](#322-error)
      - [**3.2.2 exclusions**](#322-exclusions)
      - [**3.2.2 home**](#322-home)
      - [**3.2.2 message**](#322-message)
      - [**3.2.2 not-found**](#322-not-found)
      - [**3.2.2 payment**](#322-payment)
      - [**3.2.2 personal-contact-data**](#322-personal-contact-data)
      - [**3.2.2 phd-diagnostics**](#322-phd-diagnostics)
      - [**3.2.2 phd-life**](#322-phd-life)
      - [**3.2.2 phd-occupation**](#322-phd-occupation)
      - [**3.2.2 thank-you**](#322-thank-you)
      - [**3.2.2 thanks-buy**](#322-thanks-buy)
      - [**3.2.2 thanks-request**](#322-thanks-request)
    - [**3.3 shared**](#33-shared)
      - [**3.3.1 components**](#331-components)
      - [**3.3.2 directives**](#332-directives)
      - [**3.3.3 helpers**](#333-helpers)
      - [**3.3.4 models**](#334-models)
      - [**3.3.5 pipes**](#335-pipes)
      - [**3.3.6 services**](#336-services)
  - [**4. Paquetes (package.json)**](#4-paquetes-packagejson)
    - [**4.1 Contenido**](#41-contenido)
    - [**4.1 Dependencias**](#41-dependencias)
      - [**4.1.1 dependencies**](#411-dependencies)
      - [**4.1.2 devDependencies**](#412-devdependencies)

## **1. Proyecto**

E-Commerce Vida de mapfre es un proyecto que abarca.... 

*Pendiente de completar esta información por el Jefe de Proyecto*
****
## **2. Entorno de desarrollo**

Para poner en marcha el proyecto y visualizar la aplicación ejecute `ng serve` con alguna terminal desde la raiz del proyecto. Abra el navegador y navegue a [http://localhost:4200](http://localhost:4200). Si usted realiza cualquier cambio en el proyecto, la aplicación automáticamente se refrescará y podrá visualizar los cambios en el navegador.

### **2.1 Generación de componentes y otras directivas**

- Para generar un nuevo componente ejecute `ng generate component {{ nombre_de_componente }}` 
- Para generar un nuevo pipe ejecute `ng generate pipe {{ nombre_de_pipe }}` 
- Para generar un nuevo servicio ejecute `ng generate service {{ nombre_de_service }}` 
- Para generar un nueva clase ejecute `ng generate class {{ nombre_de_clase }}` 
- Para generar un nuevo guard ejecute `ng generate guard {{ nombre_de_guard }}` 
- Para generar un nueva interfaz ejecute `ng generate interface {{ nombre_de_interfaz }}` 
- Para generar un nuevo enum ejecute `ng generate enum {{ nombre_de_enum }}` 
- Para generar un nuevo modulo ejecute `ng generate module {{ nombre_de_modulo }}` 

### **2.2 Generación de compilado (build)**

Ejecute `ng build` para generar un compilado del proyecto. Los artefactos de compilación se almacenarán en el directorio `dist /`. Use el indicador `--prod` para una compilación de producción.

### **2.3 Ayuda adicional**

Para obtener más ayuda sobre la CLI Angular, use `ng help` o visite el [Angular CLI README] (https://github.com/angular/angular-cli/blob/master/README.md).

## **3. Estructura del proyecto**

La aplicación cuenta con el patrón de diseño **Lazy Load** que consiste en retrasar la carga o inicialización de un objeto hasta el momento de su utilización. Esto significa que obtiene los datos o procesa los objetos solamente cuando se necesitan, no antes. Esto se debe a que si se obtiene todos los datos antes de usarlos puede tener como resultado una mala experiencia de usuario. Toda la carga es del lado del cliente, modularizar y diferir cargas ayuda a la aplicación a enfocarse en un código en especifico.

Todo el desarrollo y contenido propio del proyecto se encuentra dentro de la carpeta source `src`, dentro de ella se encuentra 3 principales directorios:
  
- core
- pages
- shared

### **3.1 core**

En general, el módulo `core` se usa para mantener centralizados todos nuestros `services`, `resolvers`, `guards` e `interceptors` centralizados, como su nombre lo indica es el core del proyecto.

#### **3.1.1 guards**

Los guards en Angular son interfaces que permiten proteger las rutas e indican al enrutador si se permitirá la navegación a una ruta o no.

#### **3.1.2 interceptors**

Los interceptores en Angular, como su nombre lo indica, es una forma simple de poder interceptar y modificar las solicitudes http de la aplicación a nivel global antes de enviarlas al servidor. Eso realmente es útil, ya que nos permite configurar tokens de autenticación , agregar registros de las solicitudes, agregar encabezados personalizados que la aplicación pueda necesitar y mucho más.

#### **3.1.3 resolvers**

Al igual que todo lo importante en Angular, resolver también es una clase. De hecho, tambien es un servicio que es ese código intermedio, que se  ejecuta antes de cargar un componente.

#### **3.1.4 services**

El servicio es una categoría amplia que abarca cualquier valor, función o característica que necesita una aplicación. Un servicio es típicamente una clase con un propósito estrecho y bien definido. El objetivo principal de un servicio es organizar y compartir la lógica de negocios, modelos o datos y funciones con diferentes componentes de una aplicación angular . En esta sección se centraliza los servicios propias de comunicación entre componentes

### **3.2 pages**

En este modulo se centralizará todo el desarrollo propia del negocio,

#### **3.2.1 beneficiary**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 card-payment**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.3 cession-beneficiary**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.4 coverage**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 error**

Componente que se usa para mostrar el detalle de algún error generado dentro de la aplicación.

#### **3.2.2 exclusions**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 home**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 message**

Componente que se usa para mostrar un mensaje de validación o regla de negocio de la aplicación.

#### **3.2.2 not-found**

Componente que se usa para detallar si una ruta (path) no existe dentro de la aplicación.

#### **3.2.2 payment**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 personal-contact-data**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 phd-diagnostics**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 phd-life**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 phd-occupation**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 thank-you**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 thanks-buy**

*Pendiente de completar esta información por el Jefe de Proyecto*

#### **3.2.2 thanks-request**

*Pendiente de completar esta información por el Jefe de Proyecto*

### **3.3 shared**

En este modulo se centraliza todos nuestros `components`, `directives`, `helpers`, `models`, `pipes` y `services` reutilizables.

#### **3.3.1 components**

Los componentes son un código lógico para la aplicación Angular JS. Un componente consta de lo siguiente:

- **Plantilla :** se utiliza para representar la vista de la aplicación. Contiene el HTML que debe representarse en la aplicación. Esta parte también incluye el enlace y las directivas.

- **Clase :** es como una clase definida en cualquier lenguaje como C. Contiene propiedades y métodos. Esto tiene el código que se utiliza para admitir la vista. Está definido en TypeScript.

- **Metadatos :** tiene los datos adicionales definidos para la clase Angular. Se define con un decorador.

#### **3.3.2 directives**

Las directivas de Angular son básicamente funciones que son invocadas cuando el DOM (Document Object Model) es compilado por el framework de Angular. Se podría decir que las directivas están ligadas a sus correspondientes elementos del DOM cuando el documento es cargado.  La finalidad de una directiva es modificar o crear un comportamiento totalmente nuevo.

#### **3.3.3 helpers**

Este directorio contiene un mixtro entre `utils`y `helpers` es un lugar donde puedes colocar pequeños fragmentos que puedes usar en toda la aplicación. Pequeñas funciones para construir cosas más grandes. También de puede almacenar fragmentos de código arquitectónico, cosas esenciales para los componentes de arranque y la ergonomía del desarrollador.

#### **3.3.4 models**

Directorio que centraliza todas nuestras interfaces y clases categorizadas por : `common`, `request`y `response`

#### **3.3.5 pipes**

Los Pipes en Angular son una herramienta que se utiliza para modificar los datos o el formato con que éstos se muestran al usuario final en nuestras aplicaciones. 

#### **3.3.6 services**

Al igual que la descripción anterior pero con la diferencia de que en en esta sección se centraliza los servicios propias de comunicación entre el proyecto y el backend.

## **4. Paquetes (package.json)**

A través de este archivo, finalmente, se puede garantizar la integridad del proyecto. Es decir, podemos asegurar que quienes tengan una copia del mismo, podrán acceder a las mismas propiedades y sincronizar entre múltiples partes cada vez que decidan hacer un cambio. De cierta forma, podemos considerar este package.json como un manifiesto de nuestro proyecto.

Dentro de este archivo se definen y manejan características como:

- Nombre de tu proyecto.
- Versión.
- Dependencias.
- Repositorio.
- Autores.
- Licencia.
- Y más.

### **4.1 Contenido**

```json
{
  "name": "ecommerce-vida-mapfre",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~7.2.0",
    "@angular/cdk": "^7.3.7",
    "@angular/common": "~7.2.0",
    "@angular/compiler": "~7.2.0",
    "@angular/core": "~7.2.0",
    "@angular/forms": "~7.2.0",
    "@angular/material": "^7.3.7",
    "@angular/platform-browser": "~7.2.0",
    "@angular/platform-browser-dynamic": "~7.2.0",
    "@angular/router": "~7.2.0",
    "bootstrap": "^4.3.1",
    "core-js": "^2.5.4",
    "hammerjs": "^2.0.8",
    "jquery": "^3.4.1",
    "moment": "^2.24.0",
    "popper.js": "^1.16.0",
    "rxjs": "~6.3.3",
    "tslib": "^1.9.0",
    "zone.js": "~0.8.26"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~0.13.0",
    "@angular/cli": "~7.3.9",
    "@angular/compiler-cli": "~7.2.0",
    "@angular/language-service": "~7.2.0",
    "@types/bootstrap": "^4.3.1",
    "@types/jasmine": "~2.8.8",
    "@types/jasminewd2": "~2.0.3",
    "@types/jquery": "^3.3.31",
    "@types/node": "~8.9.4",
    "codelyzer": "~4.5.0",
    "jasmine-core": "~2.99.1",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "~4.0.0",
    "karma-chrome-launcher": "~2.2.0",
    "karma-coverage-istanbul-reporter": "~2.0.1",
    "karma-jasmine": "~1.1.2",
    "karma-jasmine-html-reporter": "^0.2.2",
    "protractor": "~5.4.0",
    "ts-node": "~7.0.0",
    "tslint": "~5.11.0",
    "typescript": "~3.2.2"
  }
}
```

### **4.1 Dependencias**

Dentro del manifiesto encontraremos dos categorías de dependencias; `dependencies` y `devDependencies`. La diferencia entre estos dos es que devDependencies son módulos que solo se requieren durante el desarrollo, mientras que las dependencias son módulos que también se requieren en tiempo de ejecución.

#### **4.1.1 dependencies**

A continuación se detallarán las dependencias principales del proyecto:

`@angular/cdk` y `@angular/material` : Componentes de UI oficiales denominada **Material Design** para Angular.  
**Más detalles en:** [Official components for Angular](https://github.com/angular/components#readme)

`hammerjs` : Hammer es una biblioteca de código abierto que puede reconocer gestos hechos por el tacto, el mouse y los eventos de puntero. Este paquete es una dependencia de algunos controles UI de **Material Design**  
**Más detalles en:** [HAMMER.JS](http://hammerjs.github.io/)

`bootstrap` : Bootstrap es un kit de herramientas de código abierto para desarrollar con HTML, CSS y JS. Usada en la aplicación para obtner un diseño responsivo. El correcto funcionamiento de esta herramienta depende de tener también instalado `jquery`y `popper.js`  
**Más detalles en:** [Introduction Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction)

`jquery` : jQuery es una biblioteca de JavaScript rápida, pequeña y rica en funciones. Hace que cosas como el desplazamiento y la manipulación de documentos HTML, el manejo de eventos, la animación y Ajax sean mucho más simples con una API fácil de usar que funciona en una multitud de navegadores. Este paquete es una dependencia de `bootstrap`.  
**Más detalles en:** [jQuery](https://api.jquery.com)

`popper.js` : Popper es una librería de Javascript para añadir tooltips y popovers en elementos HTML. Este paquete es una dependencia de `bootstrap`.  
**Más detalles en:** [POPPER](https://popper.js.org/docs)

`moment` : La manipulación de la fecha y la hora en Javascript siempre ha causado dolores de cabeza a los desarrolladores. Es una de las partes más tediosas del lenguaje. Por suerte han aparecido librerías como momentjs que nos facilitarán enormemente trabajar con el objeto `Date`. Una vez hayas leído este artículo la encontrarás indispensable.  
**Más detalles en:** [Moment.js](https://momentjs.com/docs)

`rxjs` : RxJS es una biblioteca para programación reactiva que utiliza Observables, para facilitar la composición de código asíncrono o basado en devolución de llamada.  
**Más detalles en:** [RxJS](https://github.com/ReactiveX/RxJS)

#### **4.1.2 devDependencies**

`@angular/cli` : Angular CLI es la forma más cómoda para empezar a desarrollar aplicaciones web, móvil con Angular 2, es una herramienta de linea de comandos que facilita la creación, generación, ejecución, testing, deploy.  
**Más detalles en:** [CLI Angular](https://github.com/angular/angular-cli)

`tslint` : TSLint es una herramienta de análisis estático extensible que comprueba el código TypeScript en busca de errores de legibilidad, mantenibilidad y funcionalidad. Es ampliamente compatible con los editores modernos y los sistemas de compilación y se puede personalizar con sus propias reglas, configuraciones y formateadores.  
**Más detalles en:** [TSLint](https://palantir.github.io/tslint/)

`typescript` : TypeScript es el lenguaje principal para el desarrollo de aplicaciones en Angular. Es un superconjunto de JavaScript con soporte en tiempo de diseño para la seguridad de tipos y herramientas.  
**Más detalles en:** [Typescript](https://www.typescriptlang.org/)
