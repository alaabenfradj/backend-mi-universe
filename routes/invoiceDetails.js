var express = require("express");
var router = express.Router();
const Product = require("../models/product");
const InvoiceDetails = require("../models/invoiceDetails");
const Invoice = require("../models/invoice");
const { multerUpload, auth } = require("../lib/utils");
router.get("/", (req, res) => {
  InvoiceDetails.find((err, invoice_details) => {
    res.json(invoice_details);
  });
});

router.post("/:id",auth, (req, res) => {
  let InvoiceDetail = {};
  let listproducts=req.body.products;
  listproducts.forEach(productid => {
    Product.findById(productid)
    .then((product) => {
      InvoiceDetail.product = product.id;
     
      InvoiceDetail.total =
         product.price;
     
      const InvoiceDetaill = new InvoiceDetails({
        //InvoiceDetail
        product: InvoiceDetail.product,
        total: InvoiceDetail.total,
       
      });

      InvoiceDetaill.save((err, invoice_details) => {
        Inv.total = 0;
      
        invoice_details.map((detail) => {
          Inv.total += detail.total;
         
        });
  
        const newInvoice = new Invoice({
          user: req.user._id,
          total: Inv.total,
         
        });  
  
        newInvoice.save((err, iv) => {
          if (err) {
            res.json(err.message);
          }
          res.json(iv);
        });


      });
    })
    .catch((err) => console.log(err.message));
  });
  
});

// Get total Price
router.get("/total", (req, res)=>{
  Product.find().then((products) => {
    let total = 0;
    let quantity = req.body.quantity;
    products.forEach((product) => {
      total += quantity * product.price;
      res.json(total);
    });
    
  })
  .catch((err) => console.log(err.message));

})

module.exports = router;
