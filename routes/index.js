const router = require("express").Router();

// - Require custmer model
const custModel = require("../modules/custModel");

// - Require history model
const histModel = require("../modules/histModel");

// ! Home page is there...
router.get("/", (req, res) => {
  res.render("index.html");
});

// ! Add Custmer section is there...
router.get("/createCustmer", (req, res) => {
  res.render("createCustmer.ejs", { msg: "" });
});

router.post("/createCustmer", (req, res, next) => {
  let newCust = new custModel({
    name: req.body.custName,
    email: (req.body.email).toLowerCase(),
    phoneNo: req.body.phoneNo,
    currentBalance: req.body.currentBalance,
  });
  newCust.save((err) => {
    if (err) throw err;
    res.render("createCustmer.ejs", { msg: "Account created succeccfully." });
  });
});

// ! View Custmer section is there...
router.get("/viewCustmers", (req, res, next) => {
  let propData = custModel.find();
  propData.exec((err, data) => {
    if (err) throw err;
    res.render("viewCustmers.ejs", { title: "Custmer Details", props: data });
  });
});

// !  Delete custmer from here...
router.get("/del/:id", (req, res) => {
  let id = req.params.id;
  let del = custModel.findByIdAndDelete(id);
  del.exec((err, data) => {
    if (err) throw err;
    res.redirect("/viewCustmers");
  });
});

// ! Transitions section of {Sender} is there...
router.get("/transitions/:id?", (req, res) => {
  let id = req.params.id;
  var propData = custModel.find({ "_id": id });
  var users = custModel.find({});
  users.exec((err, data) => {
    if (err) throw err;
    propData.exec((err, datas) => {
      if (err) throw err;
      res.render("transitions.ejs", {
        props: datas,
        users: data,
        msg: "",
        type: "success",
      });
    });
  });
});

//! Transitions between sender and receiver is there...
router.post("/sended", (req, res) => {
  // - Get data of receiver...
  const recName = req.body.recName;
  const recEmail = req.body.recEmail;
  const recAmount = req.body.recAmount;
  // - Get data of sender...
  const senderId = req.body.senderId;
  const senderEmail = req.body.senderEmail;
  const senderAmount = req.body.senderAmount;

  if (recEmail === "Email" || recName === "Name" || recEmail === senderEmail) {
    // - if condition true render this...
    var propData = custModel.find({ "_id": senderId });
    var users = custModel.find({});
    users.exec((err, data) => {
      if (err) throw err;
      propData.exec((err, datas) => {
        if (err) throw err;
        res.render("transitions.ejs", {
          users: data,
          props: datas,
          msg: "Invalid credential",
          type: "warning",
        });
      });
    });
  } else {
    // - Else find receiver by email...
    var find = custModel.find({ "email": recEmail });
    find.exec((err, fdata) => {
      if (err) {
        throw err;
      } else {
        // - After finding custmer id update custmer amount details by id...
        fdata.forEach((e) => {
          let recUpdate = custModel.findByIdAndUpdate(e._id, {
            creditBalance: parseInt(recAmount),
            currentBalance: parseInt(e.currentBalance) + parseInt(recAmount),
          });
          recUpdate.exec((err, data) => {
            if (err) throw err;
          });
        });
      }

      // - Updating sender amount details...
      let senderUpdate = custModel.findByIdAndUpdate(senderId, {
        currentBalance: parseInt(senderAmount) - parseInt(recAmount),
        debitBalance: parseInt(recAmount),
      });
      senderUpdate.exec((err, data) => {
        if (err) throw err;
        else {
          // - After updation Sender and Receiver data render {transition} page agin with success message...
          var propData = custModel.find({ "_id": senderId });
          var users = custModel.find({});
          users.exec((err, udata) => {
            if (err) throw err;
            propData.exec((err, uudata) => {
              if (err) throw err;
              res.render("transitions.ejs", {
                props: uudata,
                users: udata,
                msg: "Transitions successfull.",
                type: "success",
              });
            });
          });
        }
      });
    });

    // - Saving history of transitions...
    let newSave = new histModel({
      remail: recEmail,
      semail: senderEmail,
      amount: recAmount,
      date: new Date(),
    });
    newSave.save((err, data) => {
      if (err) throw err;
    });
  }
});

// !  Transitions History is there...
router.get("/transitionHist", (req, res) => {
  let histDB = histModel.find({});
  histDB.exec((err, data) => {
    if (err) throw err;
    res.render("transitionHistory.ejs", { hist: data });
  });
});

// ! Search transitions by email and type of search in transitions...
router.post("/search", (req, res) => {
  let selectSea = req.body.selectSearch;
  let email = (req.body.searchEmail).toLowerCase();
  if (selectSea == "Sender") {
    var semail = histModel.find({ "semail": email });
  } else if (selectSea == "Receiver") {
    var semail = histModel.find({ "remail": email });
  } else {
    var semail = histModel.find({});
  }
  semail.exec((err, data) => {
    if (err) throw err;
    res.render("transitionHistory.ejs", { hist: data });
  });
});

// ! Delete transitions history...
router.get("/delHist/:id", (req, res) => {
  let id = req.params.id;
  let delHist = histModel.findByIdAndDelete(id);
  delHist.exec((err, data) => {
    if (err) throw err;
    res.redirect("/transitionHist");
  });
});

// ! About section is there...
router.get("/about", (req, res) => {
  res.render("about.ejs");
});

module.exports = router;
