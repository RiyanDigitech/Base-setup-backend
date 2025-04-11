import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { userRegistrationSchema } from "../common/validation/registrationValidation";
import { userLoginSchema } from "../common/validation/login.validation";
import { upload } from "../middleware/upload.middleware";
import { StorageProvider } from "../common/utils/fileServices";


const authController = new AuthController();
const storageProvider = new StorageProvider();
const router = Router();

router.post("/register", validateRequest(userRegistrationSchema), upload.single("image"),  authController.register);
router.post("/login", validateRequest(userLoginSchema), authController.login  )
router.put('/update-profile/:id',   authController.updateProfile )
router.get('/users', authController.getUsers )
router.get('/user/:id', authController.getUserById)
router.delete('/user/:id', authController.deleteUser)
router.post("/request-password-reset", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.post("/logut", authController.logout)

export default router;
