const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../../../core/models').users;

let instance;

class Passport {
    init(){

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => Users.findById(id)
            .then((user) => done(null, user)));

        passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
            },
            (email, password, done) => {
                Users.findOne({
                    where: { email: email },
                }).then((user, err) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (!user.validPassword(password, user.password)) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                });
            }
        ));
    }
}

if (typeof instance !== Passport)
    instance = new Passport();

module.exports = instance;