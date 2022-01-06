const nodemailer = require('nodemailer')

const CONFIG = require('../config')
const templates = require('../templates/mailTemplates')



const sendMail = async (object) => {
    let fullName = object.firstName + " " + object.lastName;
    console.log(fullName);
    if(object.type==="signup verification"){
        let vLink = CONFIG.LOCAL_URL + `/verify?ts=${new Date().getTime()}&vtk=${object.vToken}`;

        let tempTemplate = templates.VerificationMailTemple.replace('@verificationLink', vLink);
        tempTemplate = tempTemplate.replace('@templateImage', CONFIG.EMAIL_IMAGE_URL);
        tempTemplate = tempTemplate.replace('@merchantName', fullName);

        object.template = tempTemplate;
        console.log(object);
        callSMTP(object);
    }

} 

const callSMTP = async (object) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: CONFIG.EMAIL_ID,
          pass: CONFIG.EMAIL_PASS
        }
    });

    try{
        let info = await transporter.sendMail({
            from: `"KhawaDawa.com 🍱" <${CONFIG.EMAIL_ID}>`,
            to: object.email,
            subject: "Email Verification ✔",
            html: object.template
        });
    }catch(e){
        console.log(e);
    }

    
}

module.exports = {sendMail};