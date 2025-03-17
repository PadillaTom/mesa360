import express from "express"
import { authCheck } from "../middleware/auth"
import { AuthController} from "../controllers/authController"

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/current-user', authCheck, AuthController.currentUser)

export default router