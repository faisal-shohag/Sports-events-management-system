const jwt = require('jsonwebtoken');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

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

//check current teacher
const checkTeacher =  (req, res, next) =>{
    const token = req.cookies.jwt_teacher;
    if(token){
        jwt.verify(token, 'sports admin secret',async(err, decodedToken)=>{
            if(err){
                console.log(err.message);
                next();
            }else{
                // console.log(decodedToken)
                let teacher = await prisma.teachers.findUnique({
                    where: {
                        uuid: decodedToken.id
                    }
                });
                res.cookie('uuid', teacher.uuid, {httpOnly: false});
                res.locals.teacher = teacher;
              
                next();
            }
        })
    }else{
        res.locals.teacher = null;
        next();
    }
}

module.exports = {reqAdminAuth, reqTeacherAuth, checkTeacher};