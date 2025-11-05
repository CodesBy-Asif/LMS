import nodemailer,{Transporter} from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { promises } from 'dns';
require('dotenv').config();

interface IMailOptions {
    to: string;
    subject: string;
    template: string;
    data: {[key: string]: any};
}

const sendMail = async (options: IMailOptions) :Promise <void> => {


        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS,
            },
        });

        const { to, subject, template, data } = options;
     
        const html = await ejs.renderFile(path.join(__dirname, `../mails/${template}.ejs`), data);
    
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to,
            subject,
            html,
        };

        await transporter.sendMail(mailOptions);
}

export default sendMail;


