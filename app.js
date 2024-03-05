const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const hbs = require('hbs')
const path = require('path')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')


require('dotenv').config();

const userName = process.env.USER;
const password = process.env.PASSWORD;

// console.log(userName, password);


const port = process.env.PORT;


require('./src/db/connectdb');

const User = require("./src/models/registers")

const templatesFile = path.join(__dirname, "./templates/views")
const partialsFile = path.join(__dirname, "./templates/partials")

app.set("view engine", "hbs")
app.set("views", templatesFile)
hbs.registerPartials(partialsFile)



app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('login')
});

app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', async (req, res) => {

    try {

        const registerUser = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            password: req.body.password,
            photo: req.body.photo,
        })

        let registeredUser = await registerUser.save();
        // show message to usr "user saved successfully"    tommorrow's task
        res.status(201).render('login')



    } catch (error) {
        res.status(400).render('register', { errorMessage: 'Email is already registered' });
    }
});

app.get('/login', (req, res) => {
    res.render('login')

});



app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const loggedUser = await User.findOne({ email: email });

        if (loggedUser) {
            const passwordMatch =  loggedUser.password
            // console.log(passwordMatch);
            // console.log(password);
            if (passwordMatch===password) {
                res.status(201).render('index');
            } else {
                res.status(400).render('login', { errorMessage: 'Invalid Credentials' });
            }
        } else {
            res.status(400).render('login', { errorMessage: 'Email is not registered' });
        }

    } catch (error) {
        console.log(error);
    }
});




app.get('/forgot-password', async (req, res) => {
    try {
        res.status(200).render('forgot-password')
    } catch (error) {
        res.status(401).send('no directory mentioned')
    }

})

const resetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user:userName ,
                pass: password
            }
                
         })

       

         const baseUrl = process.env.NODE_ENV === 'production' ? 'https://authentication-page-dwpp.onrender.com' : 'http://localhost:3000';

         const mailOption = {
             from: process.env.USER,
             to: email,
             subject: "reset password",
             html: `<p> Hi ${name}, please click the link <a href="${baseUrl}/reset-password?token=${token}">click here</a> to reset your password.</p>`
         };
         

        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('mail has been sent', info.response)
            }
        }

        )

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
}

app.post('/forgot-password', async (req, res) => {



    try {
        const email = req.body.email;
        const visitedUser = await User.findOne({ email: email })

        if (visitedUser) {
            var randomString = randomstring.generate()
            // console.log(randomString)
            const forgotUserData = await User.updateOne({ email: email }, { $set: { token: randomString } })
         
            // console.log(visitedUser)

            resetPasswordMail(visitedUser.name, visitedUser.email, randomString)
            res.status(200).render('forgot-password', { message: 'Password reset email has been sent to the email.', success: true });

        }
        else {
            res.status(200).render('forgot-password', { message: 'This email does not exist.', success: false });

        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }
});

app.get('/reset-password', async (req, res) => {
    let token=req.query.token
    // console.log(token)
    res.status(200).render('reset-password',{token:token})

})


app.post('/reset-password', async (req, res) => {
    try {
        const token = req.body.token;
      ;
        
        const user = await User.findOne({ token: token });
       console.log(user)
        if (user) {
            // Hash the new password
            const newPassword = req.body.newPassword;
            // console.log(newPassword)
            const hashedPassword = newPassword
            console.log('Hashed Password:', hashedPassword);
            
            // Update the user's password and reset the token
            user.password = hashedPassword;
            console.log(hashedPassword)
            user.token = '';
            await user.save();

            res.status(200).render('login', { successMessage: 'Password updated successfully. Please login with your new password.' });
        } else {
            res.status(400).render('reset-password', { errorMessage: 'Invalid or expired token. Please try again.' });
        }
    } catch (error) {
        console.log(error);
    }
});








app.listen(port, () => {
    console.log(`listening on ${port}`)

})



