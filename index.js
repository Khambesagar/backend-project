const express = require('express');
const app = express();
const mongoose = require('mongoose');   // npm i mongose
const db = require('./config/db');
const employeeSchema = require('./models/employeeSchema');
const User = require('./models/userSchema')
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const bcrypt = require('bcrypt');

//for image
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// ***

//postman install third-party module (cors: cross origin resourse sharing)
const cors = require('cors');  // npm i cors
app.use(cors());

const ejs = require('ejs');
app.set('view engine', 'ejs');

// all  API search front page 
app.get('/dashboard', async (req, res) => {
    try {
        const data = await employeeSchema.find()
        res.render('dashboard', { data })
    } catch (err) {
        res.send(err)
    }
})

// Add API (ejs file)
app.get('/add-data', (req, res) => {
    res.render('add-data')  // ejs data file
})

// ************************************
//login form
app.get('/', (req, res) => {
    res.render('login')
})

//login auth post
// app.post('/auth/login', async (req, res) => {
//     const {username,password } = req.body;

//     const user = await User.findOne({username});
//     if (!user) {
//         return res.status(404).send('User not found');
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//         return res.status(400).send('Invalid credentials');
//     }

//     const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
//     res.send({ token });

//     res.send('login successfull')
// });

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).render('login-error');
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare plain text password with hashed password
    if (!isMatch) {
        return res.status(400).render('login-error');
    }
    // res.redirect('/dashboard')
    // res.redirect('/welcome')
    res.redirect(`/welcome?username=${encodeURIComponent(username)}`); //uri uuniform resource identyfire.(type url) (like spaces or symbols handle)
});

app.get('/welcome',(req,res)=>{
    const username = req.query.username; 
    res.render('welcome',{username})  // pass the username and ejs file
})

//*************** */

//signup form
app.get('/signup', (res, req) => {
    req.render('signup')
})

// //signup auth post api
// app.post('/auth/signup', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const user = new User({ username, password })
//         await user.save();

//         const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
//         res.send({ token });

//     } catch (err) {
//         res.status(400).send(err);
//     }
// })


// Hash password before saving
app.post('/auth/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
        const user = new User({ username, password: hashedPassword }); // Save the hashed password
        await user.save();

        // const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
        // res.send({ token });
        res.render('signup-success')
    } catch (err) {
        res.render('signup-error')
        // res.status(400).send(err);
    }
});


//*************** 


//Update data form
app.get('/update/:id', (req, res) => {
    const id = req.params.id;
    employeeSchema.findById(id)
        .then(data => {
            res.render('update-data', { user: data });    //ejs file send
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Failed to load update form');
        });
});

// Search API

    app.get('/:id', (req, res) => {
        employeeSchema.findById(req.query._id)
        .then((data) => {
            if (data) {
                res.render('dashboard', { data: [data] });
            } else {
                res.render('dashboard', { data: [] });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send('Failed to retrieve data');
        });
});


//Delete API..
app.post('/delete/:id', (req, res) => {
    employeeSchema.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/dashboard');
        })
        .catch(err => res.send(err))
})




//API post (add) Add new data
app.post('/add', (req, res) => {
    console.log("Add Data:", req.body);
    const { name, position, salary } = req.body;
    const newemployeeSchema = new employeeSchema({
        _id: new mongoose.Types.ObjectId(),
        // emp_id,
        name,
        position,
        salary
    });
    newemployeeSchema.save()
        .then(() => {
            res.redirect('/dashboard')
        })
        .catch(err => res.send(err))
});



//API Update

app.post('/update/:id', (req, res) => {
    console.log("Update Data:", req.body);
    const { name, position, salary } = req.body;
    employeeSchema.findByIdAndUpdate(     //updateOne
        req.params.id,
        { name, position, salary },
        { new: true }
    )
        .then(() => {
            res.redirect('/dashboard')
        })
        .catch(err => { res.send(err) })
})

// LogOut

// app.post('/auth/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.status(500).send('Could not log out, please try again');
//         }
//         res.redirect('/'); // Redirect to home or login page after logout
//     });
// });






app.listen(2525, () => {
    console.log('server running');
})



