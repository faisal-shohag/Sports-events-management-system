const {PrismaClient} = require('@prisma/client');
const {Router} = require('express')
const router = Router();
const prisma = new PrismaClient();
const set = require('date-fns/set')
const {mail, rejectMail, acceptMail} = require('../nodemailer/mail')

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
                 data: data
                
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
    // console.log(data);
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


router.post('/postAttendence', async (req, res) => {
    const data = req.body;
    try {
        const attendence = await prisma.gameStudents.update({
            where: {
                gameId_studentId_round: {
                    gameId: data.gameId,
                    studentId: data.studentId,
                    round: data.round
                }
            }, 
            data: {
                attendence: data.attendence
            }
        })
        res.status(200).json({success: true});
    }

    catch(err){
        console.log(err);
        res.status(400).json({err: true});
    }
})


router.post('/postRank', async (req, res) => {
    const data = req.body;
    try {
        const attendence = await prisma.gameStudents.update({
            where: {
                gameId_studentId_round: {
                    gameId: data.gameId,
                    studentId: data.studentId,
                    round: data.round
                }
            }, 
            data: {
                winRank: data.winRank
            }
        })
        res.status(200).json({success: true});
    }

    catch(err){
        console.log(err);
        res.status(400).json({err: true});
    }
})

router.post('/postResultState', async (req, res) => {
    const data = req.body;
    try {
        const attendence = await prisma.results.update({
            where: {
                gameId_eventId: {
                    gameId: parseInt(data.gameId),
                    eventId: parseInt(data.eventId)
                }
            }, 
            data: {
                ResultState: data.ResultState
            }
        })
        res.status(200).json({success: true});
    }

    catch(err){
        console.log(err);
        res.status(400).json({err: true});
    }
})

router.post('/postGameRequest', async (req, res) => {
    const data = req.body;
    try {
        const result = await prisma.gameRequests.create({
            data: data
        })
        res.status(200).json({success: true});
    }

    catch(err){
        console.log(err);
        res.status(400).json({err: true});
    }
});

router.post('/updateGameRequest', async (req, res) => {
    const data = req.body;
    try {
        const result = await prisma.gameRequests.update({
            where: {
                gameId_uuid_studentId: {
                    gameId: data.gameId,
                    uuid: data.uuid,
                    studentId: data.studentId
                }
            },
            data: {
                state: data.data
            }
        })
        res.status(200).json({success: true});
        if(data.data == 2){
            rejectMail(data.email, data.name, data.title);
        }
    }

    catch(err){
        console.log(err);
        res.status(400).json({err: true});
    }
})
module.exports = router;