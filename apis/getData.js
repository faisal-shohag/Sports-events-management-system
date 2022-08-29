const {PrismaClient} = require('@prisma/client');
const {Router} = require('express')
const router = Router();
const prisma = new PrismaClient();

router.get('/getTeachers', async(req, res) =>{
    try{
        const allTeachers = await prisma.teachers.findMany();
        res.status(200).json(allTeachers);
    }
    catch(err){
        console.log(err)
    }
})

router.get('/getStudents', async(req, res) =>{
    try{
        const allStudents = await prisma.students.findMany();
        res.status(200).json(allStudents);
    }
    catch(err){
        console.log(err);
    }
})

router.get('/getTeachers', async(req, res) =>{
    try{
        const allTeachers = await prisma.teachers.findMany();
        res.status(200).json(allTeachers);
    }
    catch(err){
        console.log(err);
    }
})


router.get('/getEvents', async(req, res) =>{
    try{
        const allEvents= await prisma.events.findMany();
        res.status(200).json(allEvents);
    }
    catch(err){
        console.log(err);
    }
})

router.get('/getEvent/:id', async(req, res) =>{

    try{
        const allEvents= await prisma.events.findUnique({
            where: {id: parseInt(req.params.id)},
        });
        res.status(200).json(allEvents);
    }
    catch(err){
        console.log(err);
    }
    
})

router.get('/getGames/:id', async(req, res) => {
    try{
        const allGamesByEvent = await prisma.games.findMany({
            where: {eventId: parseInt(req.params.id)},
            include: {
                Teachers: true
            }
        });

        res.status(200).json(allGamesByEvent);

    }catch(err){
        console.log(err)
    }
})

router.get('/getGame/:id', async(req, res) => {
    try{
        const game = await prisma.games.findUnique({
            where: {id: parseInt(req.params.id)},
            include: {Teachers: true}
        });

        res.status(200).json(game);

    }catch(err){
        console.log(err)
    }
})

router.get('/getGameStudents/:id/:round', async(req, res) => {
    try{
        const game = await prisma.gameStudents.findMany({
            where: {gameId: parseInt(req.params.id), round: parseInt(req.params.round)},
            include: {
                student: true
            }
        });

        res.status(200).json(game);

    }catch(err){
        console.log(err)
    }
})

router.get('/getGameRounds/:id', async(req, res) => {
    try{
        const game = await prisma.gameStudents.findMany({
            where: {gameId: parseInt(req.params.id)},
            include: {
                student: true
            }
        });

        res.status(200).json(game);

    }catch(err){
        console.log(err)
    }
})

router.get('/getDistinctRound/:gameId', async (req, res)=>{
    try{
        const distinctRound = await prisma.gameStudents.findMany({
            where: {gameId: parseInt(req.params.gameId)},
            orderBy: {
                round: 'asc'
            },
            distinct: ['round'],
            select:{
                round: true
            }
        })

        res.status(200).json(distinctRound);
    }
    catch(err){
    
        console.log(err);
    }
    
})


router.get('/getTeacherEvents/:uid', async (req, res) => {
    try {
        const teacherEvents = await prisma.games.findMany({
            where: {
                teacherUid: req.params.uid
            },
            include:{
                event: true,
            }
        })

        // console.log(teacherEvents);
        res.status(200).json(teacherEvents);
    } catch (error) {
        console.log(error);
        res.status(400).json({"err": 'error'})
    }
 })


 router.get('/getResultData/:gameId/:eventId', async (req, res) => {
    try {
        const Results = await prisma.results.findUnique({
            where: {
                gameId_eventId: {
                gameId: parseInt(req.params.gameId),
                eventId: parseInt(req.params.eventId),
                }               
            }
        })


        res.status(200).json(Results);
    } catch (error) {
        console.log(error);
        res.status(400).json({"err": 'error'})
    }
 })



module.exports = router;
