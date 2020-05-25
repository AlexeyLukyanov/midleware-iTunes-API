Hi everyone! This is my learning project - midleware iTunes API.

The app accepts HTTP request from a client, checks the local data base, and if the result is found, sends response (artist's albums whith songs and song's time) to the client. If the result is not found in local data base, app requests the information from iTunes API, then saves the information to local data base and then sends response to the client.

The Html page is rendered on server side. I use EJS for it.

----------------------------------------------------------------------------------------------------------------------------------

To deploy a project locally, do the following:

1. Download the repository from GitHub using -git clone-;

2. Install node_modules using -npm install- ( you can also use yarn );

3. Install locally PostgrersSQL (www.postgresql.org). Using package manager is preferable.

4. Create the data base (you can use psql in terminal -createdb dbname-  or check another methods in documentation www.postgresql.org)

5. Enter params (username, password, database, host, port) to config/config.json file. App uses this information for connection with data base.

6. Start server using -npm run start- ( you can also use yarn );

Server starts and listens to on port 3000.

You can open window in browser (http://localhost:3000/), enter singer name and then you get all singer's albums with songs and song's time in responce.

----------------------------------------------------------------------------------------------------------------------------------
API:

- GET http://localhost:3000/ - redirect to music page (/music);

- GET http://localhost:3000/music - get the singer's form for entering singer name;

- GET http://localhost:3000/music/singer?singer=singerName - get artist's albums with songs and song's time. Artist name is sent in a query params
 (?singer=singerName);