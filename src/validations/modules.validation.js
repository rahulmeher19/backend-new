const Joi = require('joi');
const { objectId } = require('./custom.validation');


const getModules = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};
module.exports = {
  getModules,
};
