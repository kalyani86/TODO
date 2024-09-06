import { Router } from "express";
import { addTodo ,deleteTodo,addStatus,getTodo,getTodoCount,getCompletedTodo,getPendingTodo,updateState,getOverdue,upcomingDeadline,getStatus, removeTodo, getParticularTodo} from "../controllers/todo.controller.js";
import auth from "../middleware/Auth.js";

const router=Router();

router.route('/addTodo').post(auth,addTodo);
router.route('/deleteTodo').put(auth,deleteTodo);
router.route('/addStatus').post(auth,addStatus);
router.route('/getTodo').get(auth,getTodo);
router.route('/getTodoCount').get(auth,getTodoCount);
router.route('/getCompletedTodo').get(auth,getCompletedTodo);
router.route('/getPendingTodo').get(auth,getPendingTodo);
router.route('/updateState').patch(auth,updateState);
router.route('/getOverdueTasks').get(auth,getOverdue)
router.route('/getupcomingDeadline').get(auth,upcomingDeadline);
router.route('/getStatus/:todoId').get(auth,getStatus);
router.route('/removeTodo').put(auth,removeTodo)
router.route(`/getSingleTodo/:todoId`).get(auth,getParticularTodo)
export default router;