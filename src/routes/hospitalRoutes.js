const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.route('/')
    .get(hospitalController.getAllHospitals);

router.route('/id/:providerId')
    .get(hospitalController.getHospitalById);

router.route('/city')
    .get(hospitalController.getHospitalsByCity);

router.route('/state')
    .get(hospitalController.getHospitalsByState);

router.route('/county')
    .get(hospitalController.getHospitalsByCounty);

router.route('/admin/')
    .post(hospitalController.createHospital)
    .delete(hospitalController.deleteAllHospitals);

router.route('/id/:providerId')
    .put(hospitalController.updateHospitalById)
    .delete(hospitalController.deleteHospitalById);

router.route("/admin/city")
    .delete(hospitalController.deleteHospitalsByCity);
// router.route('/admin/state')
//     .delete(hospitalController.deleteHospitalsByState);
// router.route("/admin/county")
//     .delete(hospitalController.deleteHospitalsByCounty);

module.exports = router;
