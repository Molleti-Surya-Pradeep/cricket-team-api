const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "cricketTeam.db");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
let db = null;
const instalizeserveranddatabase = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running Succesfully");
    });
  } catch (e) {
    console.log(`Error Message ${e.messsage}`);
    process.exit(1);
  }
};

instalizeserveranddatabase();

function conversnakecasetocamelcase(dataobject) {
  return {
    playerId: dataobject.player_id,
    playerName: dataobject.player_name,
    jerseyNumber: dataobject.jersey_number,
    role: dataobject.role,
  };
}

// Api 1

app.get("/players/", async (request, response) => {
  const getplayersQuery = "Select * from cricket_team;";

  const playersarray = await db.all(getplayersQuery);
  response.send(
    playersarray.map((eachplayer) => conversnakecasetocamelcase(eachplayer))
  );
});

//Api 2

app.post("/players/", async (request, response) => {
  const playerdetails = request.body;
  const { playerName, jerseyNumber, role } = playerdetails;

  const addplayerQuery = `
    INSERT INTO cricket_team (player_name,
        jersey_number,
        role) VALUES (
            '${playerName}',
           '${jerseyNumber}',
            '${role}');`;

  const added = await db.run(addplayerQuery);
  const player_id = added.lastID;
  response.send(`Player Added to Team`);
});

// Api 3

app.get("/players/:playerid/", async (request, response) => {
  const { playerid } = request.params;
  const playerdetails = `
    SELECT * FROM cricket_team WHERE player_id = '${playerid}';`;

  const playerarray = await db.get(playerdetails);
  response.send(conversnakecasetocamelcase(playerarray));
});

//Api 4

app.put("/players/:playerid/", async (request, response) => {
  const { playerid } = request.params;
  const playerdetails = request.body;
  const { playerName, jerseyNumber, role } = playerdetails;
  const updatequery = `
     UPDATE cricket_team 
     SET 
     player_name = '${playerName}',
     jersey_number = '${jerseyNumber}',
     role = '${role}' 
     WHERE player_id = ${playerid};
    `;
  await db.run(updatequery);
  response.send("Player Details Updated");
});

// Api 5

app.delete("/players/:playerid/", async (request, response) => {
  const { playerid } = request.params;
  const deletequery = `
    DELETE FROM cricket_team WHERE player_id =${playerid};`;
  await db.run(deletequery);
  response.send("Player Removed");
});

module.exports = app;
