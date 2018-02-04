let instance;
const nodemailer = require('nodemailer');
const config = require('../../../utils/config');

class MailSender {

    init(){
        this.config = config.get('smtp');
        this.transporter = nodemailer.createTransport({
            service: `${this.config.service}`,
            auth: {
                user: `${this.config.email}`,
                pass: `${this.config.password}`
            }
        });
    }

    sendEmail(mailOptions, callback){
        this.transporter.sendMail(mailOptions, callback);
    }


}

if (typeof instance !== MailSender)
    instance = new MailSender();

module.exports = instance;