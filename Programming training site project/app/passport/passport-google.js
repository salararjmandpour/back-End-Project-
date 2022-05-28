const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('app/models/user');


//>----------------------- creat serialize User by Id

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//>----------------------- creat deserialize User by Id

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//>----------------------- creat customize Strategy for google account

// console.log(config.service.google);
passport.use('google',new googleStrategy({

  clientID: config.service.google.client_key,
  clientSecret: config.service.google.secret_key,
  callbackURL: config.service.google.callback_url,

}, (token, refreshToken, profile, done) => {


  //>------------------------ check user is register by account google

  User.findOne({ email: profile.emails[0].value } , (err, user) => {
    if (err) return done(err);

    if (user) {
      // console.log(user);
      return done(null, user);
    }

    const newUser = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: profile.id
    });

    newUser.save(err => {
      if (err) throw err;

      return done(null, newUser);
    })
  })

}));


