import express, { Router } from 'express';
import * as authController from './controllers/authController';
import { createValidator } from 'express-joi-validation';
import * as authValidators from './validators/auth.validator';
import { verifyToken } from './middleware/jwt.middleware';
import * as projectsController from './controllers/projectsController';
import * as projectsValidator from './validators/project.validator';
import * as atachmentsController from './controllers/attachmentsController';
import * as attachmentsValidator from './validators/attachment.validator';
import * as rolesValidator from './validators/role.validator';
import * as rolesController from './controllers/rolesController';
import checkPermissions from './middleware/rbac.middleware';
import { CRUDOperation, ModuleType, Role } from './config/appConstants';
import * as permissionValidator from './validators/permission.validator';
import * as permissionController from './controllers/permissionsController';

export const router: Router = express.Router();

const validator = createValidator({ passError: true });

// auth
router.post('/auth/signup', validator.body(authValidators.signupValidator), authController.signup);
router.post('/auth/login', validator.body(authValidators.loginValidator), authController.login);

router.use(verifyToken);

// projects
router.get(
  '/projects',
  validator.query(projectsValidator.getProjectsValidator),
  validator.body(projectsValidator.metaValidator),
  projectsController.getProjects,
);
router.post('/project', validator.body(projectsValidator.createProjectValidator), projectsController.createProject);
router.put('/project', validator.body(projectsValidator.updateProjectValidator), projectsController.updateProject);
router.delete('/project', validator.body(projectsValidator.deleteProjectValidator), projectsController.deleteProject);
router.post('/project/attachment', validator.body(projectsValidator.createProjectAttachmentValidator), projectsController.createProjectAttachment);

// attachments
router.post('/attachments/presigned_url', validator.body(attachmentsValidator.getPresignedUrlValidator), atachmentsController.getPresignedUrl);
router.put('/attachments/create_attachment', validator.body(attachmentsValidator.createAttachmentValidator), atachmentsController.createAttachment);

// roles
router.post(
  '/role',
  checkPermissions({ role: Role.admin, module: ModuleType.role, operation: CRUDOperation.create }),
  validator.body(rolesValidator.createRoleValidator),
  rolesController.createRole,
);
router.get(
  '/roles',
  checkPermissions({ role: Role.admin, module: ModuleType.role, operation: CRUDOperation.read }),
  validator.body(rolesValidator.getRolesValidator),
  rolesController.getRoles,
);
router.get(
  '/role',
  checkPermissions({ role: Role.admin, module: ModuleType.role, operation: CRUDOperation.read }),
  validator.body(rolesValidator.getRoleByIdOrNameValidator),
  rolesController.getRoleByIdOrName,
);
router.put(
  '/role',
  checkPermissions({ role: Role.admin, module: ModuleType.role, operation: CRUDOperation.update }),
  validator.body(rolesValidator.updateRoleValidator),
  rolesController.updateRole,
);
router.delete(
  '/role',
  checkPermissions({ role: Role.admin, module: ModuleType.role, operation: CRUDOperation.delete }),
  validator.body(rolesValidator.deleteRoleValidator),
  rolesController.deleteRole,
);

// permissions
router.post(
  '/permission',
  checkPermissions({ role: Role.admin, module: ModuleType.permission, operation: CRUDOperation.create }),
  validator.body(permissionValidator.createPermissionValidator),
  permissionController.createPermission,
);

router.get(
  '/permission',
  checkPermissions({ role: Role.admin, module: ModuleType.permission, operation: CRUDOperation.read }),
  validator.body(permissionValidator.getPermissionValidator),
  permissionController.getPermission,
);

router.put(
  '/permission',
  checkPermissions({ role: Role.admin, module: ModuleType.permission, operation: CRUDOperation.update }),
  validator.body(permissionValidator.updatePermissionValidator),
  permissionController.updatePermission,
);

router.delete(
  '/permission',
  checkPermissions({ role: Role.admin, module: ModuleType.permission, operation: CRUDOperation.delete }),
  validator.body(permissionValidator.deletePermissionValidator),
  permissionController.deletePermission,
);
