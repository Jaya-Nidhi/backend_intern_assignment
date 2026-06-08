import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/auth.controller';
import { authenticateJWT, authorizeRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { RegisterSchema, LoginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);
router.get('/me', authenticateJWT, getMe);
router.get('/users', authenticateJWT, authorizeRole('ADMIN'), getAllUsers);

export default router;
