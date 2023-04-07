const Joi = require('joi');

const albumPayLoadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = {albumPayLoadSchema};
