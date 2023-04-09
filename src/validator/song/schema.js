const Joi = require('joi');

const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  genre: Joi.string().required(),
});

module.exports = {songPayloadSchema};
