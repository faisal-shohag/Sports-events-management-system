const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();

const findAdmin = async(username, password) => {
      const admin =  await prisma.user.findUnique({where: {username}})
       
      if(admin){
            const match = await bcrypt.compare(password, admin.password);
            if(match){
                return admin;
            }
           throw Error('Password is incorrect!');
          } 
    throw Error('This username does not exist!')
} 


const findTeacher = async(username, password) => {
    const teacher = await prisma.teachers.findUnique({where: {username}});
    if(teacher){
        const match = await bcrypt.compare(password, teacher.password);
        if(match){
            return teacher;
        }
        throw Error("Password is incorrect!");
    }
    throw Error("This username does not exist!");
}

module.exports = {findAdmin, findTeacher};