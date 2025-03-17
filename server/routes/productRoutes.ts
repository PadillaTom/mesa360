import express from "express";

import { authCheck } from "../middleware/auth";
import { ProductController } from "../controllers/productController";


const router = express.Router();
router.use(authCheck)

router.post('/', ProductController.create);
router.get('/', ProductController.getAll);
router.get('/:categoryId', ProductController.getByCategory);
router.put("/:id", ProductController.edit)
router.delete("/:id", ProductController.remove)

export default router;