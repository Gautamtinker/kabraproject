import nodemailer from "nodemailer";

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        host: "smpt.gmail.com",
        port: 465,
        service : process.env.SMPT_SERVICE,
        auth : {
            user : process.env.SMPT_MAIL,
            pass : process.env.SMPT_PASS
        }
    })

    const mailOptions = {
        from : process.env.SMPT_MAIL,
        to : options.email,
        subject : options.subject,
        message : options.message
    }

    await transporter.sendMail(mailOptions,(err, info)=>{
        if(err){
            console.log(options.message)
            
        }
        else {
            console.log(info)
        }
    });

}

export default sendEmail;