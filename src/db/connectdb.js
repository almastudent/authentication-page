const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://bablukumar:dKI0PE7bhd1RPpd8@cluster0.vcq2ecf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// dKI0PE7bhd1RPpd8
mongoose.connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // createIndexes: true
}).then(() => {
    console.log('Database connected');
}).catch((e) => {
    console.error('Unable to connect to database:');
});



 

// const mongoose = require('mongoose');

// // Replace with your actual connection details, ensuring proper escaping


// mongoose.connect(mongoURI, {
//   // ... other options
// })



