const {findAdmin, findTeacher} = require('./findUser');
const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const handleError = (err) =>{
    let errors = {username: '', password: ''}

    if(err.code === "P2002"){
        return {username: "User already exist!"}
    }

    if(err.message === 'This username does not exist!'){
        errors.username = 'This username does not exist!';
    }
    if(err.message === 'Password is incorrect!'){
        errors.password = 'Password is incorrect!';
    }
    return errors;
}

//create jwt token
const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'sports admin secret', {
        expiresIn: maxAge
    })
}

//admin login controller
module.exports.admin_login = async (req, res) => {
    const {username, password} = req.body;
    try{
        const user = await findAdmin(username, password);
        const token = createToken(user.uuid);
        res.cookie('jwt_admin', token, {httpOnly: true, maxAge: maxAge * 1000,});
        res.status(200).json({user});
    }
    catch(err){
     const errors = handleError(err);
     res.status(400).json({errors});
    }
}

module.exports.admin_logout = async (req, res) => {
    try{
        res.cookie('jwt_admin', '', {maxAge: 1,});
        res.redirect('/');
    }
    catch(err){
     const errors = handleError(err);
     res.status(400).json({errors});
    }
}


//teacher signup controller
module.exports.teacher_signup = async (req, res) => {
    const {name, email, dept, username, password} = req.body;
    const salt = await bcrypt.genSalt();
    let crypted = await bcrypt.hash(password, salt);
    try{
      const teacher = await prisma.teachers.create({
          data:{
              username,
              password: crypted,
              dept,
              email,
              name
          }
      });

      const token = createToken(teacher.uuid);
      res.cookie('jwt_teacher', token, {httpOnly: true, maxAge: maxAge * 1000});
      res.status(200).json({teacher});
    }
    catch(err){
        console.log(err)
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}

//teacher login controller
module.exports.teacher_login = async (req, res) => {
    const {username, password} = req.body;
    try{
        const teacher = await findTeacher(username, password);
        const token = createToken(teacher.uuid);
        res.cookie('jwt_teacher', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json(teacher);
    }
    catch(err){
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}

module.exports.teacher_logout = async (req, res) => {
    const {uuid} = req.body;
    try{
        res.cookie('jwt_teacher', '', {maxAge: 1});
        res.redirect('/');
    }
    catch(err){
        const errors = handleError(err);
        res.status(400).json({errors});
    }
}