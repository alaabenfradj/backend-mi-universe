var express = require("express");
const { auth } = require("../lib/utils");
const { verifyTokenAdmin } = require("../middleware/verifyToken");
var router = express.Router();
const Reclamation = require("../models/reclamation");
const User = require("../models/user");
const { sendThankYouEmail } = require("../lib/utils");
router.post("/send-rec", auth, (req, res) => {
  let newRec = new Reclamation({
    sender: req.user._id,
    content: req.body.content,
  });
  newRec
    .save()
    .then((rec) => {
      return res.status(200).json(rec);
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
});
router.get("/get-recs", [auth, verifyTokenAdmin], (req, res) => {
  Reclamation.find()
    .populate("sender")
    .then((recs) => {
      return res.status(200).json(recs);
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
});
router.put("/ok/:id", (req, res) => {
  Reclamation.findByIdAndUpdate(req.params.id, { $set: { status: true } })
    .then((rec) => {
      return res.status(200).json(rec);
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
});

router.put("/send-mail/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  Reclamation.findByIdAndUpdate(req.params.id, { $set: { status: true } })
    .then((rec) => {
      if (user) {
        const { email, firstName } = user;
        sendThankYouEmail(firstName, email);
        return res
          .status(200)
          .json({ reclamation: rec, message: "email sent successfully" });
      } else {
        return res.status(200).json(rec);
      }
    })
    .catch((err) => {
      return res.status(500).json(err.message);
    });
});
module.exports = router;
