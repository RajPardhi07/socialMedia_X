import express from 'express'
import { deleteNotifications, getNotifications } from '../controller/notificationController.js';

const router = express.Router();

router.get('/:id', getNotifications);

router.delete("/", deleteNotifications);





export default router;