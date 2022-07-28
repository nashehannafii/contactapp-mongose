const mongooose = require('mongoose');

mongooose.connect('mongodb://127.0.0.1:27017/contact_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true
});



// // Menambahkan 1 data
// const contact1 = new Contact({
//     nama: 'Nasheh Annafii',
//     email: 'nashehannafii@gmail.com',
//     phone: '0812-3456-7890'
// })

// // Simpan Collection
// contact1.save().then((contact) => console.log(contact))