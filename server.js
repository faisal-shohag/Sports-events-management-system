const express = require('express');
const auth = require('./authentication/auth');
const getData = require('./apis/getData');
const postData = require('./apis/postData');
const deleteData = require('./apis/deleteData');
const cookieParser = require('cookie-parser');
const {reqAdminAuth, reqTeacherAuth, checkTeacher} = require('./middlewares/auth_middleware');
const hbs = require('hbs');
const app = express();


// middleware
app.use(cookieParser())
app.use(express.static('public'));
app.use(express.json());


//view engine
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


//routes

// app.get('*', checkTeacher);
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/student_reg', (req, res) => {
    res.render('studentReg');
})

app.get('/admin_login',  (req, res) => {
    res.render('admin_login');
})

app.get('/admin', reqAdminAuth,  (req, res) => {
    res.render('admin');
});

app.get('/teacher_signup', (req, res) =>{
    res.render('teacher_signup');
    
})

app.get('/recover', (req, res) => {
    res.render('recover');
})


app.get('/teacher_login', (req, res) =>{
    res.render('teacher_login');
})

app.get('/teacher', checkTeacher, reqTeacherAuth,  (req, res) => {
  res.render('teacher')
})



app.use(auth);
app.use(getData);
app.use(postData);
app.use(deleteData);





app.listen(3000, ()=>{
    console.log('Server is listening to port 3000!');
})