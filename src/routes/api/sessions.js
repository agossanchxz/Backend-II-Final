const express = require('express');
const passport = require('../../config/passport');
const sessionsController = require('../../controllers/sessionsController');

const router = express.Router();

router.post('/login', passport.authenticate('local', { session: false }), sessionsController.login);
router.get('/current', passport.authenticate('jwt', { session: false }), sessionsController.currentUser);

module.exports = router;