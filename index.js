require("dotenv").config();
const express = require("express");
var cors = require("cors");
const axios = require("axios");

const server = express();
server.use(express.json());
server.use(cors());

// prcess.env.PORT allows us to use non local deployments. Or use our local port 3000 if using locally on our PC
const PORT = process.env.PORT || 3000;

// Server comes alive and is listening for actions on the specified port.
// Listen for requests.
server.listen(PORT, () => {
  console.log("I'm ALIVE....");
});

const destinations = [];
server.post("/destinations", async (req, res) => {
  console.log("POST /destinations hits");
  // Request Body coming in fromt the front end.
  console.log(req.body);

  // Filter the trash coming in, make sure we only get what we want first
  /* const destination = req.body.destination; */

  // OR destruction obj;
  const { destination, location, description } = req.body;

  if (!destination || !location || destination.length === 0 || location === 0) {
    return res
      .status(400)
      .send({ error: "Destination AND location are BOTH required!" });
  }

  const UnsplashApiUrl = `https://api.unsplash.com/photos/random?query=${location} ${destination}&client_id=${process.env.UNSPLASH_API_KEY}`;

  const { data } = await axios.get(UnsplashApiUrl);

  const photos = data.urls.regular;

  console.log(photos);

  // Create the new object to put in my DB
  const newDest = {
    destination,
    location,
    photo: photos,
    description:
      description && description.length !== 0 ? description : "Another Melvin",
  };

  // Now push this data into my DB
  destinations.push(newDest);
  res.redirect(303, "/destinations");
  console.log("Made to end!");
});

// On get requests sent to the specified endpoint, it has an option to grab a request or send a response.
server.get("/destinations", (req, res) => {
  res.send(destinations);
});

const students = {
  ryan: {
    name: "Ryan",
    age: 28,
    hobbies: ["coding", "videogames", "money"],
  },
  alie: {
    name: "Alie",
    age: 29,
    hobbies: ["not coding", "snacks", "starbucks"],
  },
};

server.get("/students", (req, res) => {
  const { name, age, hobbies } = req.query;

  if (name) {
    const student = students[name.toLowerCase()];

    if (student) {
      return res.send(student);
    }

    return res
      .status(404)
      .send({ error: `Student by the name of ${name} not found` });
  }

  let filteredStudents = Object.values(students);

  if (age) {
    filteredStudents = filteredStudents.filter(
      (student) => student.age === parseInt(age)
    );
  }

  if (hobbies) {
    filteredStudents = filteredStudents.filter((student) =>
      student.hobbies.includes(hobbies.toLowerCase())
    );
  }

  return res.send(filteredStudents);
});

server.get("/students/name/:name", (req, res) => {
  const { name } = req.params;
  if (name) {
    const student = students[name.toLowerCase()];

    if (student) {
      return res.send(student);
    }

    return res
      .status(404)
      .send({ error: `Student by the name of ${name} not found` });
  }
});

server.get("/students/hobbies/:hobbies", (req, res) => {
  const { hobbies } = req.params;
  if (hobbies) {
    const filteredStudents = Object.values(students).filter((student) =>
      student.hobbies.includes(hobbies.toLowerCase())
    );
    return res.send(filteredStudents);
  }

  return res
    .status(404)
    .send({ error: `Student by the name of ${hobbies} not found` });
});

server.get("/students/age/:age", (req, res) => {
  const { age } = req.params;
  if (age) {
    const filteredStudents = Object.values(students).filter(
      (student) => student.age === parseInt(age)
    );
    return res.send(filteredStudents);
  }

  return res
    .status(404)
    .send({ error: `Student by the name of ${hobbies} not found` });
});
