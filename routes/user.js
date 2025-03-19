import express from 'express';
const routerUser = express.Router();
import bcrypt from 'bcryptjs';
import flash from 'connect-flash'
import passport from 'passport';

import { getUser,getUserByEmail, insertUser } from '../controllers/userController.js';

// Route for homepage
routerUser.get('/login', (req, res) => {
    res.render('login');
});

routerUser.get('/register', (req, res) => {
    res.render('register');
});

routerUser.post('/register', (req, res) => {

    const {first_name, last_name, email, password, password2 } = req.body;
    // Check required fields
    let errors = [];

    if (!first_name || !last_name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length

    if (errors.length > 0) {
        res.render('register', {
            errors,
            first_name,
            last_name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        // Register user in database
        getUserByEmail(email)
           .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' });
                    res.render('register', {
                        errors,
                        first_name,
                        last_name,
                        email,
                        password,
                        password2
                    });
                } else {
                    // hash password
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) throw err;
                        // Store hashed password in database
                        insertUser(first_name, last_name, email, hash)
                           .then(id => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/user/login');
                            })
                           .catch(err => console.log(err));
                    });

                        // Save user to database
                        
                }
            })
           .catch(err => console.log(err));
    }

});

routerUser.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})

routerUser.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
      });
  });

export default routerUser;