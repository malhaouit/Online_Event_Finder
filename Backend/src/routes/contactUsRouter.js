// src/routes/contactUsRouter.js
const express = require('express');
const router = express.Router();
const { submitContactUs } = require('../controllers/contactUsController');

router.post('/contact-us', submitContactUs);

module.exports = router;
