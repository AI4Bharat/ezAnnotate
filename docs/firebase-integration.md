## Steps to connect to Firebase for Authentication and Emails

1) Create a Project on [Firebase console](https://console.firebase.google.com/)
2) Enable the authentication providers on Firebase console as [in here](https://cloud.google.com/appengine/docs/standard/python3/building-app/adding-firebase#adding_firebase_to_your_gcp_project)
3) Changing the Firebase SDK config.
    * Copy the config snippet from the Firebase SDK snippet pane in your firebase project settings page.
    * Replace your new config in [config.js file](bazaar/src/config.js) on line 17.
4) Changing the Service account JSON.
    * Download the firebase service JSON by clicking on the "Generate New Private Key" button at the bottom of the Firebase Admin SDK section of the Service Accounts tab in the Project settings page.
    * Replace the contents of the [dataturksFirebase.json](hope/keys/dataturksFirebase.json) file from the downloaded service JSON.
