const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const logValidation = require('../../validations/log.validation');
const logController = require('../../controllers/log.controller');

const router = express.Router();

router
  .route('/log-details')
  .get(validate(auth(), logValidation.logSearch), logController.logSearch);

module.exports = router;
