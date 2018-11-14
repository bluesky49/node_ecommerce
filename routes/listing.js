const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authController = require('../controllers/authController');
const paymentController = require('../controllers/paymentController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/add', authController.isShovelee, listingController.listingForm);
router.get(
  '/in-progress',
  authController.isShoveler,
  catchErrors(listingController.jobsInProgress)
);
router.get(
  '/available-jobs',
  authController.isShoveler,
  authController.notOnDuty,
  listingController.availableJobs
);
router.get(
  '/:id',
  authController.isLoggedIn,
  catchErrors(listingController.listingDetails)
);

router.post(
  '/available-jobs/share-location',
  authController.isShoveler,
  authController.notOnDuty,
  authController.hasEquipment,
  listingController.validateShovelerLocation,
  catchErrors(listingController.jobsByNeighborhood)
);

router.post(
  '/add',
  catchErrors(listingController.validateListing),
  catchErrors(listingController.createListing),
  paymentController.pay
);

router.post(
  '/bid/:id',
  authController.isShoveler,
  catchErrors(listingController.createBid)
);

router.post(
  '/accept-job/:id',
  authController.isShoveler,
  catchErrors(listingController.acceptJob)
);

router.post(
  '/accept-bid/:id',
  authController.isShovelee,
  catchErrors(listingController.acceptBid)
);

router.post(
  '/complete-job/:id',
  authController.isShoveler,
  listingController.validateShovelerLocation,
  catchErrors(listingController.validateShovelerLocationWithListingLocation),
  listingController.validateShovelerRating,
  catchErrors(listingController.completeJob),
  paymentController.payOutShoveler
);

router.get('/payment/success', catchErrors(paymentController.execute));
router.get('/payment/cancel', (req, res) => {
  res.render('error', {
    title: 'Payment Cancelled',
    message: 'Transaction was cancelled'
  });
});

module.exports = router;
