let instance;
const nodemailer = require('nodemailer');
const config = require('../../../utils/config');

class MailSender {

    init(){
        this.config = config.get('smtp');
        this.email = process.env.EMAIL_USERNAME || this.config.email;
        this.password = process.env.EMAIL_PASSWORD || this.config.password;
        this.service = process.env.EMAIL_SERVICE || this.config.service;
        this.transporter = nodemailer.createTransport({
            service: `${this.service}`,
            auth: {
                user: `${this.email}`,
                pass: `${this.password}`
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