import express, { Router } from 'express';
import * as authController from './controllers/authController';
import { createValidator } from 'express-joi-validation';
import * as authValidator from './validators/auth.validator';
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
import * as userController from './controllers/userController';
import * as userValidator from './validators/user.validator';

export const router: Router = express.Router();

const validator = createValidator({ passError: true });

// auth
router.post('/auth/signup', validator.body(authValidator.signupValidator), authController.signup);
router.post('/auth/login', validator.body(authValidator.loginValidator), authController.login);

router.use(verifyToken);

// user
router.put('/user', validator.body(userValidator.updateUserValidator), userController.updateUser);

// projects
router.get(
  '/projects',
  checkPermissions({ allowedRoles: [Role.admin, Role.accountant, Role.donor], module: ModuleType.project, operation: CRUDOperation.read }),
  validator.query(projectsValidator.getProjectsValidator),
  validator.body(projectsValidator.metaValidator),
  projectsController.getProjects,
);
router.post(
  '/project',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.project, operation: CRUDOperation.create }),
  validator.body(projectsValidator.createProjectValidator),
  projectsController.createProject,
);
router.put(
  '/project',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.project, operation: CRUDOperation.update }),
  validator.body(projectsValidator.updateProjectValidator),
  projectsController.updateProject,
);
router.delete(
  '/project',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.project, operation: CRUDOperation.delete }),
  validator.body(projectsValidator.deleteProjectValidator),
  projectsController.deleteProject,
);
router.post(
  '/project/attachment',
  checkPermissions({ allowedRoles: [Role.admin, Role.accountant], module: ModuleType.project, operation: CRUDOperation.create }),
  validator.body(projectsValidator.createProjectAttachmentValidator),
  projectsController.createProjectAttachment,
);

// attachments
router.post('/attachments/presigned_url', validator.body(attachmentsValidator.getPresignedUrlValidator), atachmentsController.getPresignedUrl);
router.put(
  '/attachments/create_attachment',
  checkPermissions({ allowedRoles: [Role.admin, Role.accountant, Role.donor], module: ModuleType.attachment, operation: CRUDOperation.create }),
  validator.body(attachmentsValidator.createAttachmentValidator),
  atachmentsController.createAttachment,
);

// roles
router.post(
  '/role',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.role, operation: CRUDOperation.create }),
  validator.body(rolesValidator.createRoleValidator),
  rolesController.createRole,
);
router.get(
  '/roles',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.role, operation: CRUDOperation.read }),
  validator.body(rolesValidator.getRolesValidator),
  rolesController.getRoles,
);
router.get(
  '/role',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.role, operation: CRUDOperation.read }),
  validator.body(rolesValidator.getRoleByIdOrNameValidator),
  rolesController.getRoleByIdOrName,
);
router.put(
  '/role',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.role, operation: CRUDOperation.update }),
  validator.body(rolesValidator.updateRoleValidator),
  rolesController.updateRole,
);
router.delete(
  '/role',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.role, operation: CRUDOperation.delete }),
  validator.body(rolesValidator.deleteRoleValidator),
  rolesController.deleteRole,
);

// permissions
router.post(
  '/permission',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.permission, operation: CRUDOperation.create }),
  validator.body(permissionValidator.createPermissionValidator),
  permissionController.createPermission,
);

router.get(
  '/permission',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.permission, operation: CRUDOperation.read }),
  validator.body(permissionValidator.getPermissionValidator),
  permissionController.getPermission,
);

router.put(
  '/permission',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.permission, operation: CRUDOperation.update }),
  validator.body(permissionValidator.updatePermissionValidator),
  permissionController.updatePermission,
);

router.delete(
  '/permission',
  checkPermissions({ allowedRoles: [Role.admin], module: ModuleType.permission, operation: CRUDOperation.delete }),
  validator.body(permissionValidator.deletePermissionValidator),
  permissionController.deletePermission,
);
