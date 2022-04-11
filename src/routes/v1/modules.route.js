const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const modulesValidation = require('../../validations/modules.validation');
const modulesController = require('../../controllers/modules.controller');

const router = express.Router();

router
  .route('/:modules_id/permissions')
  .get(validate(auth(), modulesValidation.getModules), modulesController.getModules);

module.exports = router;