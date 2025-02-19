import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../../controllers/sessionController.js";
import { authenticateJWT } from "../../middlewares/authMiddleware.js"; 

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authenticateJWT, getCurrentUser); 

export default router;