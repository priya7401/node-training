import Joi from "joi";

export const signupValidator = Joi.object({
  name: Joi.string(),
  mobile_number: Joi.string()
    .pattern(RegExp("^(\\+91|\\+91\\-|0)?[789]\\d{9}$"))
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  confirm_password: Joi.ref("password"),
}).with("password", "confirm_password");
