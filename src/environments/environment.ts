// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBGt0tGGSM4skm_jRFI5FQszzWVEgj-O3E',
    authDomain: 'rain-report.firebaseapp.com',
    databaseURL: 'https://rain-report.firebaseio.com',
    projectId: 'rain-report',
    storageBucket: 'gs://rain-report.appspot.com/',
    messagingSenderId: '362444977732',
    appId: '1:362444977732:web:5b161f920c5b4573232e11'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
