const router = require("express").Router();
const fs = require("fs");
router.post("/songs", (req, res) => {
  if (req.body.song === "") {
    return res.json({ message: "no songs found" });
  } else {
    fs.readFile("bin/karaoke/data.json", "utf8", (err, data) => {
      if (err) {
        res.json({ error: err.message });
        return;
      } else {
        try {
          console.log(req.body.song);
          const rawData = JSON.parse(data);
          const searchedSong = rawData.filter((song) =>
            song.Song.includes(req.body.song)
          );

          return res.json(searchedSong);
        } catch (error) {
          return res.json(error);
        }
      }
    });
  }
});
module.exports = router;
