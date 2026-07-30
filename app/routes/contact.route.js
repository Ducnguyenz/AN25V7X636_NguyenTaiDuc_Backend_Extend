const express = require("express");
const contacts = require("../controllers/contact.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/")
    .get(auth, contacts.findAll)
    .post(auth, contacts.create)
    .delete(auth, contacts.deleteAll);



router.route("/:id")
    .get(auth, contacts.findOne)
    .put(auth, contacts.update)
    .delete(auth, contacts.delete);

module.exports = router;