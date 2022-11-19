process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const app = express();
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cookieSession = require("cookie-session");
const cors = require("cors");
const flash = require("connect-flash");
const fetch = require("node-fetch");
const ResourceData = require("./middleware/chapterUpload");
/**
 *
 *
 * cors config
 *
 */
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
//database configuration
require("./database/mongoDB");
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// makes the folder public
app.use("/uploads", express.static("uploads"));
app.use("/data/image", express.static("coursedata/images/"));
app.use("/data/resources", express.static("coursedata/chapters/"));
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
// routes
const streamingRouter = require("./bin/stream");
const authenticationRouter = require("./routes/authentication");
const adminRouter = require("./routes/admins");
const chapterRouter = require("./routes/chapters");
const courseCommentsRouter = require("./routes/courseComments");
const courseRouter = require("./routes/courses");
const invoiceDetailsRouter = require("./routes/invoiceDetails");
const invoiceRouter = require("./routes/invoices");
const productReviewsRouter = require("./routes/productReviews");
const productRouter = require("./routes/products");
const reclamationRouter = require("./routes/reclamations");
const resourceRouter = require("./routes/resources");
const sellerRouter = require("./routes/sellers");
const studentRouter = require("./routes/students");
const teacherRouter = require("./routes/teachers");
const usersRouter = require("./routes/users");
const courseRateRouter = require("./routes/rateCourses");
const karaokeRouter = require("./routes/karaoke");
const payment = require("./routes/payment");
const { sendKaraokeInv } = require("./lib/utils");
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
//passport & session  config
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
require("./middleware/passportAuth")(passport);
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/stream", streamingRouter);
/*
 **
 **
 **
 **
 ***
 ***
 ***
 ***/
//routes
// app.use("/auth", authRouter);
app.use("/karaoke", karaokeRouter);
app.use("/authentication", authenticationRouter);
app.use("/admins", adminRouter);
app.use("/teachers", teacherRouter);
app.use("/students", studentRouter);
app.use("/courses", courseRouter);
app.use("/reclamations", reclamationRouter);
app.use("/products", productRouter);
app.use("/sellers", sellerRouter);
app.use("/product_reviews", productReviewsRouter);
app.use("/invoice_details", invoiceDetailsRouter);
app.use("/invoices", invoiceRouter);
app.use("/chapters", chapterRouter);
app.use("/courseComments", courseCommentsRouter);
app.use("/resources", resourceRouter);
app.use("/chapters", chapterRouter);
app.use("/users", usersRouter);
app.use("/rate-course", courseRateRouter);
app.use("/payment", payment);
app.use("/uploads", express.static("uploads"));
/*
**
**
**
**



***
***
***
***/

/*****
 *
 * daily
 */

const API_KEY = process.env.daily_API_KEY;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY,
};

const createToken = (room) => {
  return fetch("https://api.daily.co/v1/meeting-tokens", {
    method: "POST",
    headers,
    body: JSON.stringify({
      properties: {
        room_name: room,
      },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.log("error:" + err));
};

app.post("/create-token/:roomId", async (req, res) => {
  const room = req.params.roomId;
  const token = await createToken(room);
  if (token) {
    res.status(200).json({ status: true, token: token.token });
  } else {
    res.status(400).json({ status: false, message: "no token provided" });
  }
});

app.post("/karaokeinvi", async (req, res) => {
  const { name, email, token, room } = req.body;
  if (!token || !name || !email || !room) {
    return res
      .status(500)
      .json({ status: false, message: "Unable to send email" });
  } else {
    sendKaraokeInv(name, email, token, room);
    return res
      .status(200)
      .json({ status: true, message: "Invitation sent successfully" });
  }
});

const getRoom = (room) => {
  return fetch(`https://api.daily.co/v1/rooms/${room}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.error("error:" + err));
};

const createRoom = (room) => {
  return fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: room,
      privacy: "private",
      properties: {
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: true,
        start_audio_off: false,
        lang: "en",
      },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.log("error:" + err));
};

app.get("/video-call/:id", async function (req, res) {
  const roomId = req.params.id;
  const room = await getRoom(roomId);
  if (room.error) {
    const newRoom = await createRoom(roomId);
    res.status(200).send(newRoom);
  } else {
    res.status(200).send(room);
  }
});
/********************************
 *
 */
app.use("/", (req, res) => {
  res.status(400).send("404 Not found");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
});

module.exports = app;
