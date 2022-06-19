const jwt = require('jsonwebtoken');


const reqAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt_admin;

    if(token){
        jwt.verify(token, 'sports admin secret', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/admin_login');
            }else{
                next();
            }
        })
    } else {
        res.redirect('/admin_login');
    }
}

const reqTeacherAuth = (req, res, next) =>{
    const token = req.cookies.jwt_teacher;
    
    if(token){
        jwt.verify(token, 'sports admin secret', (err, decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/teacher_login');
            }else{
                next();
            }
        })
    }else{
        res.redirect('/teacher_login');
    }
}


module.exports = {reqAdminAuth, reqTeacherAuth};