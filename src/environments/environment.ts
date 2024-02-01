// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlService: 'https://api.pre.mapfre.com.pe/legacy/salud/wsGestionMedica/gestionMedica/',
  urlService_cronicos: 'https://api.pre.mapfre.com.pe/legacy/salud/wsGestionMedica/',
  oimHome: 'https://oim.pre.mapfre.com.pe/',
  oimApiPath: 'https://oim.pre.mapfre.com.pe/oim_new_login/',
  logoutPath: 'api/seguridad/acceso/logout',
  urlEventTracker: 'https://api.pre.mapfre.com.pe/legacy/salud/wsGestionMedica/eventTracker',
  // urlEventTracker: 'http://10.160.120.214/oim_peca/api/eventTracker'
  urlVersion: 'https://api.pre.mapfre.com.pe/legacy/salud/wsGestionMedica/gestionMedica/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
