// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBHnh-u9rUwYdWbHVm4j9uVp58rdD5mloU',
    authDomain: 'attendmanager-c8784.firebaseapp.com',
    databaseURL: 'https://attendmanager-c8784.firebaseio.com',
    projectId: 'attendmanager-c8784',
    storageBucket: 'attendmanager-c8784.appspot.com',
    messagingSenderId: '769641726969',
    appId: '1:769641726969:web:58bf3148cd63dde1f37328',
    measurementId: 'G-J82MBM5ZWH',
  },
  // algoliaの連携情報を追加（algolia管理画面から取得）
  algolia: {
    appId: 'PBJ3SLBZU1',
    searchKey: 'dd5074173d20b3765b3045baa3a7e7ff',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
