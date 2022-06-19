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
                teacher: true
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
            include: {teacher: true}
        });

        res.status(200).json(game);

    }catch(err){
        console.log(err)
    }
})

router.get('/getGameStudents/:id', async(req, res) => {
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




module.exports = router;
