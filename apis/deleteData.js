const {PrismaClient} = require('@prisma/client');
const {Router, request} = require('express')
const router = Router();
const prisma = new PrismaClient();

router.delete('/deleteFromAllStudents/:id', async (req, res)=>{
  try {
    const deleteFromAllStudents = await prisma.students.delete({
      where: {id: parseInt(req.params.id)}
    });

    console.log(deleteFromAllStudents);
    res.status(200).json({'success': 'A student is deleted from all student!'})
  } catch (error) {
    
  }
})

router.delete('/deleteRoundStudent/:gameId/:id/:round', async(req, res) => {
    const gameId = parseInt(req.params.gameId),
         studentId = parseInt(req.params.id),
         round = parseInt(req.params.round);    
    try{
     const deleteRow = await prisma.gameStudents.delete({
        where: {
            gameId_studentId_round: {gameId, studentId, round}
        }
     });
     console.log(deleteRow);
     res.json({'success': 'Student deleted from row!'});
    }
    catch(err){
        console.log(err);
    }


})

router.delete('/deleteRound/:round', async(req, res) => {
  try {
    const deleteRound = await prisma.gameStudents.deleteMany({
        where: {
            round: {
                contains: parseInt(req.params.round)
            }
        }

    })

    console.log(deleteRound);
    res.status(200).json({'success': 'Deleted a whole round!'});
  } catch (error)  {
    console.log(err);
  }
})


module.exports = router;