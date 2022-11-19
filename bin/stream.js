/**
 *
 * streaming with dailyCO
 */
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

const fetch = require("node-fetch");
var express = require("express");
var router = express.Router();

const API_KEY_AlAA = process.env.daily_API_KEY_AlAA;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY_AlAA,
};

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
      properties: {
        enable_prejoin_ui: true,
        owner_only_broadcast: true,
        enable_screenshare: true,
        enable_chat: true,
        start_video_off: true,
        start_audio_off: true,
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

const getTokenForAdmin = (roomId, userName) => {
  return fetch("https://api.daily.co/v1/meeting-tokens", {
    method: "POST",
    headers,
    body: JSON.stringify({
      properties: { is_owner: true, room_name: roomId, user_name: userName },
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      return json;
    })
    .catch((err) => console.log("error:" + err));
};

router.get("/video-call/:id/:userName", async function (req, res) {
  const roomId = req.params.id;
  const userName = req.params.userName;

  const room = await getRoom(roomId);

  if (room.error) {
    console.log(userName);
    const token = await getTokenForAdmin(roomId, userName);
    const newRoom = await createRoom(roomId);

    res.status(200).json({ room: newRoom, token: token });
  } else {
    res.status(200).send(room);
  }
});
module.exports = router;
