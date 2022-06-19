const nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;

const text = {
    "student_signup": `<br>
    You have successfully registered as <b>Student</b> to <b><i>Sports Management System</i></b>. Furthur update will be sent to your mail. So stay tuned!
    <br><br><i><small>This email is auto generated. This email is sending to you for testing purpose only.</small></i>
    <br>
    <b>From Team,</b><br>
    Faisal, Imran, Ezaz
    `,
    "teacher_signup": "",
    "teacher_assign": ""
}

const mail = (to, as, name) =>{

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cse1805027brur@gmail.com',
                pass:   'sravpjbdxkihkjtz'
            }
        }).use('compile', htmlToText())

        const mailOptions = {
            from: 'cse1805027brur@gmail.com',
            to: 'faisalshohagprog@gmail.com',
            subject: 'Sports Event Management Registration Confirmation',
            html: '<b>Hey, '+name +'!</b>'+text[as]
        }

        transporter.sendMail(mailOptions, (err, info)=>{
            if(err) console.log(err)
            else console.log('Email sent:' + info.response)
        })
} 


module.exports = mail;