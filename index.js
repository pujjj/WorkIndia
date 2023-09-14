const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const User = require("./models/User");
const Admin = require("./models/Admin");
const CreateMatch = require("./models/CreateMatch");
const MatchSchedule = require("./models/MatchSchedules");
const Player = require("./models/TeamMember");

const crypto = require("crypto");

const app = express();

// Midddlewares - to parse
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// MongoDB Atlas
// Username - pujasaithandavan
// Password - 65kOoLE3DwPv1J8c
// Added my ip

// Connect mongoose.js to MongoDB - COnnectting the url of cluster from MongoDB Compass
mongoose
  .connect(
    "mongodb+srv://pujasaithandavan:65kOoLE3DwPv1J8c@workindiatask.nux9knf.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  // Error Handling
  .then(() => {
    console.log("Successfully Connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Endpoints for HTML
app.get("/registeradmin", (req, res) => {
  res.sendFile("pages/registeradmin.html", { root: __dirname }); //Transfers the file at the given path , Current file root
});

app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname }); //Transfers the file at the given path , Current file root
});
app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname });
});
app.get("/signup", (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname });
});

app.get("/matchschedules", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

app.get("/addplayer", (req, res) => {
  res.sendFile("pages/addplayer.html", { root: __dirname });
});

// Endpoints for APIs

// 1. Register Admin
app.post("/regadmin", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password with the salt using your custom hashing function
    const hashedPassword = customHash(password, salt);

    // Create a new admin user with the hashed password, salt, and name
    const newAdmin = new Admin({
      name: name, // Store the user's name
      email: email,
      salt: salt,
      password: hashedPassword,
    });

    // Save the admin user to the MongoDB database
    await newAdmin.save();

    // Send a response indicating successful registration
    res.status(200).json({ success: true, admin: newAdmin });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Encryption Function
// In this custom hashing function, we concatenate the password and salt,
// then iterate through each character, updating a hash value using a simple bitwise operation.
// Finally, we convert the hash to a hexadecimal string.
function customHash(password, salt) {
  // Combine the password and salt
  const combined = password + salt;

  // Initialize a hash value
  let hash = 0;

  // Iterate through each character in the combined string
  for (let i = 0; i < combined.length; i++) {
    // Update the hash using a simple bitwise operation
    hash = (hash << 5) - hash + combined.charCodeAt(i);
  }

  // Ensure the hash is a positive number
  if (hash < 0) {
    hash = hash * -1;
  }

  // Convert the hash to a hexadecimal string
  return hash.toString(16);
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// 2. User SignUp and Login
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body; // Add name

  try {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password with the salt using your custom hashing function
    const hashedPassword = customHash(password, salt);

    // Create a new user with the hashed password, salt, and name
    const newUser = new User({
      name: name, // Store the user's name
      email: email,
      salt: salt,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Send a response indicating successful registration
    res.status(200).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Registration failed." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "No user found. Please Sign Up!!" });
    }

    const hashedPassword = customHash(password, user.salt);

    if (hashedPassword === user.password) {
      return res.status(200).json({
        success: true,
        user: { email: user.email, name: user.name }, // Include the user's name
        message: "User Found",
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Invalid password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
});

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Match Schedules
app.post("/matchschedules", async (req, res) => {
  try {
    // Assuming you have a "MatchSchedule" model
    const matchSchedules = await MatchSchedule.find().select(
      "team1 team2 venue date"
    ); // Fetch specific fields

    res.status(200).json({ success: true, matchSchedules });
  } catch (error) {
    console.error("Error fetching match schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching match schedules." });
  }
});

// Add players to Database
app.post("/addplayer", async (req, res) => {
  const { teamname, name, role } = req.body;

  try {
    const newPlayer = new Player({
      teamname: teamname,
      name: name,
      role: role,
    });

    await newPlayer.save(); // Save the new player to the database

    res.status(200).json({ success: true, player: newPlayer });
  } catch (error) {
    console.error("Error during player creation:", error);
    res
      .status(500)
      .json({ success: false, message: "Player creation failed." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
