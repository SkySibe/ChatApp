# ChatApp
**1.** First run the commamd `npm install`.\
**2.** Edit the `.env.sample` name to `.env` and edit the file to the variables you got on firebase and imgur api,\
firebase variables on **console > Settings > Service accounts >Firebase Admin SDK** (if you can't see any press **generate private key**).\
**3.** In Windows click on the run.bat.\
In another OPs run the commamd `node server.js` or `npm start`.\
**4.** Then in the machine that runs the server you can use `http://localhost/` ,\
**5.** On other machines on your LAN you can connect to the server with your machine LAN ip instead of "localhost",\
you can see on the window that popped out the message: `Server running on: <IP>:80`,\
when <IP> is your machine LAN ip address (for example: "http://192.168.1.1/").