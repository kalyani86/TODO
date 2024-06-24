import { Router } from "express";
import { addTodo ,deleteTodo,addStatus,getTodo,getTodoCount} from "../controllers/todo.controller.js";

const router=Router();

router.route('/addTodo').post(addTodo);
router.route('/deleteTodo').put(deleteTodo);
router.route('/addStatus').post(addStatus);
router.route('/getTodo').get(getTodo);
router.route('/getTodoCount').get(getTodoCount);
export default router;