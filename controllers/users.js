'use strict';

module.exports = function(_, passport, validator){

    return {
        setRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);

            //router.post('/', Uservalidation.LoginValidation, this.postLogin);
            router.post('/', [
                validator.check('email').not().isEmpty().isEmail()
                .withMessage('Email is invalid !'),
                validator.check('password').not().isEmpty().isLength({min: 5})
                .withMessage('Password is required and must be at least 5 characters'),
            ], this.postValidation, this.postLogin);
            //router.post('/signup', Uservalidation.SignUpValidation, this.postSignUp);
            router.post('/signup', [
                validator.check('username').not().isEmpty().isLength({min: 5})
                .withMessage('Username is required and must be at least 5 characters !'),
                validator.check('email').not().isEmpty().isEmail().
                withMessage('Email is invalid !'),
                validator.check('password').not().isEmpty().isLength({min: 5})
                .withMessage('Password is required and must be at least 5 characters'),
            ], this.postValidation, this.postSignUp);
        },

        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {title: 'Login', messages: errors, hasErrors: 
            errors.length > 0});
        },

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title: 'Signup', messages: errors, hasErrors: 
            errors.length > 0});
        },

        postValidation: function(req, res, next) {
            const err = validator.validationResult(req);
            const errors = err.array();
            const messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });

            req.flash('error', messages);
            return next();       
        },

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: 'home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        homePage: function(req, res){
            return res.render('home');
        }
    }
}

