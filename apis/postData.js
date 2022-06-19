const {PrismaClient} = require('@prisma/client');
const {Router} = require('express')
const router = Router();
const prisma = new PrismaClient();
const set = require('date-fns/set')
const mail = require('../nodemailer/mail')

router.post('/postEvent', async (req, res)=>{
    const data = req.body;
    try{
        const event = await prisma.events.create({
                 data:{
                    ...data, 
                    startAt: set(new Date(data.startAt), {hours: 12}),
                    endAt: set(new Date(data.endAt), {hours: 12}),
                }
        })
        console.log(event);
        res.status(200).json({success: true});
    }
    catch(err){
    console.log(err);
    res.status(400).json({err: true});
    }

});

router.post('/postStudent', async (req, res)=>{
    const data = req.body;
    console.log(data);
    try{
        const event = await prisma.students.create({
                 data:{
                    ...data, 
                    id: parseInt(data.id),
                    age: parseInt(data.age)
                }
        })
        console.log(event);
        // mail(data.email, 'student_signup', data.name);
        res.status(200).json({success: true});
    }
    catch(err){
    console.log(err);
    res.status(400).json({err: true});
    }
});

router.post('/postGame', async (req, res)=>{
    const data = req.body;
    try{
        const event = await prisma.games.create({data:data});
        console.log(event);
        res.status(200).json({success: true});
    }
    catch(err){
    console.log(err);
    res.status(400).json({err: true});
    }
});

router.post('/postGameStudents', async (req, res)=>{
    const data = req.body;
    console.log(data);
    try{
        const gameStd = await prisma.gameStudents.createMany({
            data: data
        });
        console.log(gameStd);
        res.status(200).json({success: true});
    }
    catch(err){
    console.log(err);
    res.status(400).json({err: true});
    }
});


module.exports = router;