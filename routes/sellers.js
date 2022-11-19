var express = require("express");
var router = express.Router();
const Seller = require("../models/seller");
const { auth, issueJWT } = require("../lib/utils");
const { verifyTokenSeller, verifyTokenAdmin } = require("../middleware/verifyToken");
const User = require("../models/user");
const { sellerValidator } = require("../validators/sellerValidator");
const { validationResult } = require("express-validator");
const Product = require("../models/product");
router.post("/register", [auth, sellerValidator], (req, res) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    res.status(500).json({ errors: errors.array() });
  } else {
    const newSeller = new Seller({
      rib: req.body.rib,
      about: req.body.about,
      user: req.user._id,
    });
    Seller.findOne({ user: req.user._id })
      .then((seller) => {
        if (seller) {
          return res
            .status(500)
            .json({ success: false, message: "Account already exists !" });
        } else {
          newSeller.save((err, newSeller) => {
            if (err) {
              res.status(500).json({ success: false, message: err.message });
              return;
            }
            User.findByIdAndUpdate(
              req.user._id,
              { $addToSet: { role: "seller" } },
              { new: true },
              (err, data) => {
                if (err) {
                  return res.status(500).json({ success: false, message: err.message });
                } else {
                  const userToken = issueJWT(data);
                  console.log(newSeller)
                  return res.status(200).json({
                    success: true,
                    message: "Account was registered successfully. We will get back for you",
                    token: userToken.token,
                    id:newSeller._id

                  });
                }
              }
            );
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, message: err });
      });
  }
});

//get connected seller
router.get("/getcurrentseller", [auth, verifyTokenSeller], async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id }).populate("user");
    if (!seller) {
      return res.status(500).json({ seller: null });;
    }
    return res.status(200).json({ seller: seller });
  } catch (error) {
    res.status(500).json(error.message);
  }
});


router.get("/protected", [auth, verifyTokenSeller], (req, res, next) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    msg: "You are successfully authenticated to this route!",
  });
});

router.get("/get-liked-products", async (req, res) => {
  const likedProducts = await Product.find().where("likesCount").gte(0);
  if (likedProducts) {
    res.status(200).json({
      success: true,
      products: likedProducts,
    });
  } else {
    res.status(500).json({
      success: false,
      products: "no products were found",
    });
  }
});
router.get("/get-most-liked-products", async (req, res) => {
  const mostLikedProducts = await Product.find()
    .sort({ likesCount: "desc" })
    .limit(10);
  if (mostLikedProducts) {
    res.status(200).json({
      success: true,
      "most liked products": mostLikedProducts,
    });
  } else {
    res.status(500).json({
      success: false,
      products: "no products were found",
    });
  }
});

router.get("/get-all-sellers", [auth, verifyTokenAdmin], async (req, res) => {
  const sellers = await Seller.find({}).populate("user");
  if (!sellers.length) return res.status(404).json("no sellers found");
  res.json(sellers);
});
module.exports = router;
