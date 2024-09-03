import express from 'express';
import UserController from '../controllers/users.controller.js';
import { validateToken } from '../middleware/validateToken.js';
const router = express.Router();

router.post('/create', UserController.createUser);
router.post('/sendOtp', UserController.sendOtp);
router.post('/verifyOtp', UserController.verifyOtp);

// this will use for set or reset both 
router.post('/setMpin', validateToken, UserController.setMpin);
// router.get('/:id', UserController.getUser);
// router.put('/:id', UserController.updateUser);
// router.delete('/:id', UserController.deleteUser);


// router.delete('/:id', UserController.login);



export default router;