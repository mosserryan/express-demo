const express = require("express");

const server = express();

const PORT = 3000;

// Server comes alive and is listening for actions on the specified port.
server.listen(PORT, () => {
  console.log("I'm ALIVE....");
});

// On get requests sent to the specified endpoint, it has an option to grab a request or send a response.
server.get("/heading", (req, res) => {
  res.send("<h1>This is a H1 heading</h1>");
});
