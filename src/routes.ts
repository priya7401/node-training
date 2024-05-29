import express, { Router } from 'express';
import * as authController from './controllers/authController';
import { createValidator } from 'express-joi-validation';
import * as authValidators from './validators/auth.validator';
import { verifyToken } from './utils/jwtHelper';
import * as projectsController from './controllers/projectsController';
import * as projectsValidator from './validators/project.validator';
import * as atachmentsController from './controllers/attachmentsController';
import * as attachmentsValidator from './validators/attachment.validator';

export const router: Router = express.Router();

const validator = createValidator();

// auth
router.post('/auth/signup', validator.body(authValidators.signupValidator), authController.signup);

router.post('/auth/login', validator.body(authValidators.loginValidator), authController.login);

router.use(verifyToken);

// projects
router.get('/projects', validator.query(projectsValidator.getProjectsValidator), projectsController.getProjects);
router.post('/projects', validator.body(projectsValidator.createProjectValidator), projectsController.createProject);
router.put('/project', validator.body(projectsValidator.updateProjectValidator), projectsController.updateProject);
router.delete('/project', validator.body(projectsValidator.deleteProjectValidator), projectsController.deleteProject);

router.post('/attachments/presigned_url', validator.body(attachmentsValidator.getPresignedUrlValidator), atachmentsController.getPresignedUrl);
router.put('/attachments/create_attachment', validator.body(attachmentsValidator.createAttachmentValidator), atachmentsController.createAttachment);