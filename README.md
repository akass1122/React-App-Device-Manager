# Nyansa-2


Device Manager app is written in React for front end and Node.js and MongoDB for backend.

The app is deployed on AWS:
http://devicemanager.us-west-1.elasticbeanstalk.com/

To run it locally:

-	In project folder:   npm i
-	cd to client forder:    npm i
-	Go back to project folder:     npm run dev
-	Go to    http://localhost:3000/

To build to deploy:
-	cd client
-	npm run build
-	Make sure to set your production environment variable NODE_ENV to 'production'

Project files:
- server.js     to run the server
- routes/api/devices.js     to handle GET and POST request from Client. The POST request is for both updating an owner and creating a new device (if later add a feature in front end to add a device). It handles requests to MongoDB.
-  client/src/components/SmallPage.js       is a functional component that takes in array of all devices and columnName and makes a sorted table by that column and show the top 5 devices/rows.
-  client/src/components/MainPage.js    is a class component that shows the main page with a table of all devices, where you can edit an owner. It also calls component SmallPage.js   4 times to show 4 panels of top 5 devices by CPU, Mem, TX, and RX.
-  A Mongo database is used to hold all devices.





