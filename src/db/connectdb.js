const mongoose = require('mongoose');

// dKI0PE7bhd1RPpd8
require('dotenv').config();

// console.log( mongoURI + 'hello')

mongoose.connect(process.env.mongoURI).then(() => {
    console.log('Database connected');
}).catch((e) => {
    console.error('Unable to connect to database:' , e);
});



 

// const mongoose = require('mongoose');

// // Replace with your actual connection details, ensuring proper escaping


// mongoose.connect(mongoURI, {
//   // ... other options
// })



