const mongooose = require('mongoose')

// Schema
const Contact = mongooose.model('Contact', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    }
})

module.exports = Contact

