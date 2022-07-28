const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')


const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

app.use(methodOverride('_method'))

app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
// app.use(morgan('dev'))
app.use(expressLayouts)

app.listen(port, () => console.log(`Mongo Contact App: http://localhost:${port}!`))

// Halaman Home

app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama: 'Rizki',
            email: 'rizki@gmail.com'
        },
        {
            nama: 'Imam',
            email: 'imam@gmail.com',
        },
        {
            nama: 'Wahid',
            email: 'wahid@gmail.com'
        },
        {
            nama: 'Zaim',
            email: 'zaim@gmail.com'
        }
    ]
    res.render('index', {
        layout: 'layouts/main-layout',
        nama: 'Nasheh Annafii',
        title: 'Home',
        mahasiswa
    })
})


// Halaman About

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About'
    })
})



// Halaman Contact

app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts,
        msg: req.flash('msg')
    })
})

app.get('/contact/detail/:name/', async (req, res) => {
    const contact = await Contact.findOne({ name: req.params.name })
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Detail',
        contact
    })
})


// Fitur CRUD


app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Add Contact',
    })
})

app.post('/contact', [
    body('name').custom(async (value) => {
        const duplikat = await Contact.findOne({ name: value })
        if (duplikat) {
            throw new Error('Nama contact sudah digunakan')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('phone', 'Nomor HP tidak valid').isMobilePhone('id-ID')
]
    , (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.render('add-contact', {
                layout: 'layouts/main-layout',
                title: 'Add Contact',
                error: error.array()
            })
        } else {
            Contact.insertMany(req.body, (error, result) => {
                // kirim flash berhasil
                req.flash('msg', 'Contact berhasil ditambahkan')
                res.redirect('/contact')
            })
        }
    })

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ name: req.body.name }).then((result) => {
        req.flash('msg', 'Contact berhasil dihapus')
        res.redirect('/contact')
    })
})

app.get('/contact/edit/:name', async (req, res) => {
    const contact = await Contact.findOne({ name: req.params.name })
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Add Contact',
        contact
    })
})

app.put('/contact',
    [
        body('name').custom(async (value, { req }) => {
            const duplikat = await Contact.findOne({ name: value })
            if (value !== req.body.oldName && duplikat) {
                throw new Error('Nama contact sudah digunakan')
            }
            return true
        }),
        check('email', 'Email tidak valid').isEmail(),
        check('phone', 'Nomor HP tidak valid').isMobilePhone('id-ID')
    ]
    , (req, res) => {
        const error = validationResult(req)
        if (!error.isEmpty()) {
            res.render('edit-contact', {
                layout: 'layouts/main-layout',
                title: 'Edit Contact',
                error: error.array(),
                contact: req.body
            })
        } else {
            // editContact(req.body)
            Contact.updateOne(
                {
                    _id: req.body._id
                },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone
                    }
                }).then((result) => {
                    req.flash('msg', 'Contact berhasil diubah')
                    res.redirect('/contact')
                })
        }
    })