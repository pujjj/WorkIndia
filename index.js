const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const User = require("./models/User");
const Admin = require("./models/Admin");
const CreateMatch = require("./models/CreateMatch");
const MatchSchedule = require("./models/MatchSchedules");

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

// app.get("/addnote", (req, res) => {
//   res.sendFile("pages/index.html", { root: __dirname });
// });

app.get("/matchschedule", async (req, res) => {
  try {
    const matchSchedules = await MatchSchedule.find();
    res.json({ success: true, matches: matchSchedules });
  } catch (error) {
    console.error("Error fetching match schedules:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch match schedules." });
  }
  res.sendFile("pages/index.html", { root: __dirname });
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

app.post("/getnotes", async (req, res) => {
  const { userToken } = req.body;

  let notes = await Note.find({ email: req.body.email }); //Getting notes for that email
  res.status(200).json({ success: true, notes });
});

app.post("/matchschedules", async (req, res) => {
  const { userToken } = req.body;

  let match = await Note.find({ email: req.body.email }); //Getting notes for that email
  res.status(200).json({ success: true, notes });
});

// To add a note
app.post("/addnote", async (req, res) => {
  //   const { userToken } = req.body;
  let note = await MatchSchedule.create(req.body);
  res.status(200).json({ success: true, note });
});

// app.post("/deletenote", async (req, res) => {
//   const { email, title } = req.body;

//   try {
//     // Assuming you have a Note model with an 'email' field
//     // and you want to delete a note based on the email and title
//     const deletedNote = await Note.findOneAndDelete({ email, title });

//     if (deletedNote) {
//       res
//         .status(200)
//         .json({ success: true, message: "Note deleted successfully" });
//     } else {
//       res.status(404).json({ success: false, message: "Note not found" });
//     }
//   } catch (error) {
//     console.error("Error during note deletion:", error);
//     res.status(500).json({ success: false, message: "Note deletion failed." });
//   }
// });

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Login - POST
// app.post("/login", async (req, res) => {
//   let user = await User.findOne(req.body); //Checking database to see if the user exists
//   console.log(user);
//   if (!user) {
//     res
//       .status(200)
//       .json({ success: false, message: "No user found. Please Sign Up!!" });
//   } else {
//     // console.log("User email:", user.get("email"));
//     res.status(200).json({
//       success: true,
//       user: { email: user.email },
//       message: "User Found",
//     });
//   }
// });

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// Sign up - POST
// app.post("/signup", async (req, res) => {
//   const { userToken } = req.body;
//   console.log(req.body);
//   let user = await User.create(req.body); //Await - Waiting for user to be created
//   //   res.sendFile("pages/signup.html", { root: __dirname });
//   res.status(200).json({ success: true, user: user });
// });

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
