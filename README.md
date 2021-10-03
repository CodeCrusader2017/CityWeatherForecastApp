Udacity FEND (Front End) Capstone Project.

# Overview: Webpack Node/Express App for displaying current and forecast weather information (with an appropriate city image) via API calls to geonames.org, weatherbit.io and pixabay.com. 

# This FEND Capstone project implements the following extra feature: "Instead of just pulling a single day forecast, pull the forecast for multiple days".

# This project consists of: 
- __test__ folder 
    - checkUserInput.test
- dist folder (webpack generated - git excluded)
- node_modules folder (webpack generated - git excluded)
- src folder 
    - client folder
         - index.js 
         - views folder 
                 - index.html 
         - styles folder
                 - Index.scss 
                 - Index_anchor_styling.scss 
                 - Index_layout_styling.scss
         - media folder (empty)
         - js folder
                 - app.js
                 - checkUserInput.js
    - server folder
         - server.js 
- .babelrc
- .env
- .gitignore
- package
- package-lock
- README
- webpack.dev
- webpack.prod

# To set up environment in root, perform the following - in order - on the root command line:

	npm install
	npm install cors
	npm run build-prod
	npm start

# If there are any issues experienced when starting the server (see further below), it might also be worth running the following on root command line: 

	npm install express
	npm install body-parser 

# To get Up and Running
1). In Visual Studio open two split terminals, and in each terminal window navigate to the root project. 
2). In the "Production" terminal, on the command line do (i.e. without quotes) "npm run build-prod"  followed by "npm run start"  (i.e. start script in package.json)
3). In the "DEV" terminal, on the command line do (without quotes) "npm run build-dev" 
4). Note: the "DEV" terminal opens a browser with "localhost:8000", so to interact with the server change to "localhost:4000" (i.e. see: https://knowledge.udacity.com/questions/313437).
5). To run tests in root directory, on the command line run: npm run test
OPTIONAL: To assist with website initial functionality start up, it might be prudent to clear cookies in browser of choice, and repeat where required if testing. 

# This project was tested on Google Chrome and Microsoft Edge browsers only - testing was NOT performed on Firefox browser due to cross browser lockdown security options being enabled.  
  


 

