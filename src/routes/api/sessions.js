import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../../controllers/sessionController.js";
import { authenticateJWT } from "../../middlewares/authMiddleware.js"; 
import { UserDTO } from "../../dtos/userDTO.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", authenticateJWT, getCurrentUser); 

export default router;
