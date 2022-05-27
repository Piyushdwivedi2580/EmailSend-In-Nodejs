        const express = require('express');
        const bodyParser = require('body-parser');
        const exphbs = require('express-handlebars');
        const path = require('path');
        const nodemailer = require('nodemailer');

        const app = express();

        // View engine setup
        app.engine('handlebars', exphbs());
        app.set('view engine', 'handlebars');

        // Static folder
        app.use('/public', express.static(path.join(__dirname, 'public')));

        // Body Parser Middleware
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.get('/', (req, res) => {
        res.render('contact');
        });

        app.post('/send', (req, res) => {
            const output = `
                <p>You have a new contact request</p>
                <h3>Contact Details</h3>
                <ul>  
                <li>Name: ${req.body.name}</li>
                <li>Company: ${req.body.company}</li>
                <li>Email: ${req.body.email}</li>
                <li>Phone: ${req.body.phone}</li>
                </ul>
                <h3>Message</h3>
                <p>${req.body.message}</p>
            `;

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.theonlinegurukul.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'alerts@theonlinegurukul.com', // generated ethereal user
                    pass: 'ratedr_123#'  // generated ethereal password
                },
                tls:{
                rejectUnauthorized:false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"theOnlineGurukul Education" <alerts@theonlinegurukul.com>', // sender address
                to: 'piyushraj351@gmail.com', // list of receivers
                subject: 'theOnlineGurukul Contact Request', // Subject line
                text: 'Hello dear theOnlineGurukul?', // plain text body
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);   
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.render('contact', {msg:'Email has been sent'});
            });
        });

        app.listen(3000, () => console.log('Server started...'));