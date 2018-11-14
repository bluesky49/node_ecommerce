const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(indexController.homepage));
router.get('/about', indexController.about);
router.get('/how-it-works', indexController.howItWorks);

router.get('/register/shoveler', userController.registerForm);
router.get('/register/shovelee', userController.registerForm);
router.post(
  '/register/shoveler',
  userController.validateShovelerRegistration,
  userController.registerShoveler,
  authController.loginShoveler
);
router.post(
  '/register/shovelee',
  userController.validateShoveleeRegistration,
  userController.registerShovelee,
  authController.loginShovelee
);
router.get('/logout', authController.logout);

router.get('/login', userController.loginForm);
router.post('/login', (req, res, next) => {
  const accountType = req.body.accountType;
  if (accountType === 'shoveler') authController.loginShoveler(req, res, next);
  else authController.loginShovelee(req, res, next);
});

module.exports = router;
