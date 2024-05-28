import express, { Router } from 'express';
import * as authController from './controllers/authController';
import { createValidator } from 'express-joi-validation';
import * as authValidators from './validators/auth.validator';

export const router: Router = express.Router();

const validator = createValidator();

// auth
router.post('/auth/signup', validator.body(authValidators.signupValidator), authController.signup);

router.post('/auth/login', validator.body(authValidators.loginValidator), authController.login);
