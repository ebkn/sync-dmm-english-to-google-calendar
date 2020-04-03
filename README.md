### Sync DMM english to Google Calendar

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

Google App Script for syncing DMM English lesson reservation to Google Calendar.

### Setup
1. clone project
```sh
$ git clone git@github.com:ebkn/sync-dmm-english-to-google-calendar.git
$ cd sync-dmm-english-to-google-calendar
```

2. install packages
```sh
$ npm install
```

3. create GoogleAppScript project and create .clasp.json
```sh
$ cp .clasp.sample.json .clasp.json
# then, edit scriptID in .clasp.json
```

4. deploy
```sh
$ npm run deploy
```

5. add Trigger for this project
`https://script.google.com/u/1/home/projects/<your script id>/triggers?owned_by=1`
