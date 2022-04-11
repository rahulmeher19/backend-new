const Joi = require('joi');
const {objectId } = require('./custom.validation');

const logSearch = {
  query: Joi.object().keys({
    action: Joi.string(),
    category: Joi.string(),
    createdBy: Joi.string(),
    createdAt: Joi.string(),
    user_id: Joi.string().custom(objectId),
    actionOn: Joi.string(),
  }),
};

module.exports = {
    logSearch,

};
