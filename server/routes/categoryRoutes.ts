import express from "express";
import { authCheck } from "../middleware/auth";
import { CategoryController } from "../controllers/categoryController";


const router = express.Router();
router.use(authCheck)

router.post('/', CategoryController.create);
router.get('/',CategoryController.getAll);
router.put("/:id", CategoryController.edit)
router.delete("/:id",  CategoryController.remove)

export default router;