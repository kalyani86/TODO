import { Router } from "express";
import { login,signup ,logout} from "../controllers/user.controller.js";
import auth from "../middleware/Auth.js";
const router=Router();

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/logout').get(auth,logout);
export default router;