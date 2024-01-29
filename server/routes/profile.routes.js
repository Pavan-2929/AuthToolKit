import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js';
import { deleteUserController, updateController, userController } from '../controllers/profile.controller.js';

const router = express.Router()

router.get("/", verifyToken, userController)
router.put("/update", verifyToken, updateController);
router.delete("/delete", verifyToken, deleteUserController)

export default router