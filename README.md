# Porter

This is like one of those 6-hours-of-coding-just-because-i-can kind of project I only did because I couldn't be bothered to memorize the proper unix command and grep it to the point of actual utility. This is by no means an example of prod ready code. pls no judge.

Porter is a small electron system tray app utilizing unix LSOF command to show your currently used ports within a certain range. It uses that output to build a list of applications and PIDs utilizing ports on localhost and displays them in a small electron tray app. The app uses electron IPC to communicate that data to the front end.

It works best on mac for now, but will run on linux, I have no clue about windows, sorry.

I originally built the code to get the port usage data using python and served it via a small Flask-based REST API, but that soon became an obsolete pain in the ass so I re-wrote the server in express which was fine but then realized that was useless too because I didn't need a REST api for that data when I could just use IPC through electron. But, if you would like to expose your systems port data as a REST API, you can find the original flask server and python code in `./Porter.py` in the root directory, and you can find the TS Express server in `./electron/PorterServer.ts`. Knock yourself out.

<img src="https://imgur.com/Apt5KoS.jpg" width="45%">
<img src="https://imgur.com/FFOGBHn.jpg" width="40%">

## Running

### Run the following 2 commands in seperate terminals for the dev workflow.

### `yarn dev`

builds the app front end code in the dev mode and serves via dev webserver.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn start`

Compiles and runs the electron app in development mode. Changes to electron code will require you to kill the `yarn start` process and run it again to recompile the TS

## Publish a Release

> Note: you have to create a electron-builder.env file in the root of the project with `GH_TOKEN=<GitHub personal access token>` to publish
> Porter uses electron-builder to build and publish the app to GitHub Releases. [More info on publishing...](https://www.electron.build/configuration/publish)

1. Create a Release draft
1. `yarn build` - Build the React app
1. Commit, tag with semver vX.X.X, and push
1. `yarn release` - Build & publish the Electron app to GH Releases

### `yarn dist`

To build the Electron app locally without publishing, be sure to run `yarn build` first if any of the frontend React code has changed.

## Other scripts

### `yarn run:prod`

Compiles a """"production"""" version of the front end code and builds and runs the electron app. The electron process will still be running in parent console - so this isn't really a true "prod" script. That will follow when I have actual time to figure that out.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
