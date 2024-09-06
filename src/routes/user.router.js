import { Router } from "express";
import { login,signup ,logout,uploadPhoto,isAuth, getData} from "../controllers/user.controller.js";
import auth from "../middleware/Auth.js";
import { upload } from "../middleware/multer.js";
const router=Router();

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/logout').get(auth,logout);
router.route('/uploadPhoto').post(upload.single('ProfilePhoto'),uploadPhoto)
router.route('/isAuth').get(isAuth);
router.route('/getData').get(auth,getData);

export default router;