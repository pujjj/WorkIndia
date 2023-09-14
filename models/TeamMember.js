const mongoose = require("mongoose");

// Define the schema for a match
const PlayerSchema = new mongoose.Schema({
  teamname: String,
  name: String,
  role: String,
});

module.exports = mongoose.model("AddPlayer", PlayerSchema);

// Save the new match document to the database
// const Player = mongoose.model("AddPlayer", PlayerSchema);
// // Request data from your example
// const requestData = {
//   teamname: "India",
//   name: "Rishabh Pant",
//   role: "Wicket-Keeper",
// };
// const newPlayer = new Player(requestData);
// newPlayer
//   .save()
//   .then((result) => {
//     console.log("Match created successfully");
//     console.log("Match ID:", result._id);
//   })
//   .catch((error) => {
//     console.error("Error creating match:", error);
//   });
