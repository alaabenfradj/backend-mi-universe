var express = require("express");
var router = express.Router();

const Invoice = require("../models/invoice");
//var InvoiceDetails = require("../routes/invoiceDetails")
var InvoiceDetail = require("../models/invoiceDetails");

router.get("/", (req, res) => {
  Invoice.find((err, invoice) => {
    res.json(invoice);
  });
});
router.get("getinvoices/:id",(req,res)=>{
Invoice.find({user:req.params.id}).then((invoices)=>{
  if(invoices)
  res.json(invoices);
  else
  res.json({msg:'invoices Not found'})
}).catch((err)=>{
  res.json(err.message);
})

})



module.exports = router;
