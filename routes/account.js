const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', authController.isLoggedIn, catchErrors(userController.account));
router.post('/:accountType', catchErrors(userController.updateAccount));
router.post('/reset/:accountType', catchErrors(authController.forgot));
router.get('/reset/:accountType/:token', catchErrors(authController.reset));
router.post(
  '/reset/:accountType/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

router.post(
  '/updatePassword/:accountType',
  authController.isLoggedIn,
  authController.confirmedPasswords,
  catchErrors(authController.resetInternally)
);

module.exports = router;
