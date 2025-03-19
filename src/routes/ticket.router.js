import express from 'express';
import TicketController from '../controllers/ticketController.js';
import passport from 'passport';

const router = express.Router();
const ticketController = new TicketController();

router.post('/', passport.authenticate('jwt', { session: false }), ticketController.createTicket.bind(ticketController));

export default router;