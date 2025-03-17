import express from "express";
import { authCheck } from "../middleware/auth";
import { OrderController } from "../controllers/orderController";


const router = express.Router();
router.use(authCheck)


router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get("/:id",OrderController.getById)
router.put('/update-status', OrderController.updateStatus);
router.get('/get-order/:tableId', OrderController.getOrderByTable);
router.put("/:id",OrderController.edit)
router.delete("/:id", OrderController.remove)

export default router;