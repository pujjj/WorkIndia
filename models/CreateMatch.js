const mongoose = require("mongoose");

// Define the schema for a match
const matchSchema = new mongoose.Schema({
  team1: String,
  team2: String,
  date: String,
  venue: String,
});

module.exports = mongoose.model("CreateMatch", matchSchema);

// Save the new match document to the database
const Match = mongoose.model("CreateMatch", matchSchema);
// Request data from your example
const requestData = {
  team1: "India",
  team2: "Australia",
  date: "2023-07-12",
  venue: "Sydney Cricket Ground",
};
const newMatch = new Match(requestData);
newMatch
  .save()
  .then((result) => {
    console.log("Match created successfully");
    console.log("Match ID:", result._id);
  })
  .catch((error) => {
    console.error("Error creating match:", error);
  });
