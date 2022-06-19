const {Router} = require('express');
const controller = require('../auth_controller/controller');
const router = Router();


//Admin authentication
router.post('/admin_login', controller.admin_login);
router.post('/teacher_signup', controller.teacher_signup);
router.post('/teacher_login', controller.teacher_login)




 module.exports = router;