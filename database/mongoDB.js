const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATA_BASE_URL)
  .then(() => {
    console.log("DataBase connected Successfully");
  })
  .catch(() => {
    console.log("Error connecting to DataBase");
  });
