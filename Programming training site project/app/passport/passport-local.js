const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('app/models/user');


//>----------------------- create serialize User by Id

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

//>----------------------- create deserialize User by Id

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

//>----------------------- create customize Strategy for register

passport.use('local.register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    // console.log(email, password);
    User.findOne({ 'email': email }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, false, req.flash('errors', 'چنین کاربری قبلا در سایت ثبت نام کرده است'));


        const newUser = new User({
            name: req.body.name,
            email,
            password
        });

        newUser.save(err => {
            if (err) return done(err, false, req.flash('errors', 'ثبت نام با موفقعیت انجام نشد مجدد تلاش کنید'));
            done(null, newUser);
        })
        // console.log(err, user);
    });
}));

//>----------------------- create customize Strategy for login

passport.use('local.login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  
  User.findOne({ 'email': email }, (err, user) => {
    if (err) return done(err);
    if (!user || !user.comparePassword(password)) {
      return done(null, false, req.flash('errors', 'طالاعات وارده شده مطابقت ندارد'));
    }
    done(null, user);
  });
})); 

