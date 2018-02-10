const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../../../core/models').users;
const userService = require('../services/usersService');

let instance;

class Passport {
    init() {

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => await userService.getUserById(id)
            .then((user) => done(null, user)));

        passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                await userService.getUserByEmail(email).then((user, err) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: 'Incorrect username.'});
                    }
                    if (!user.validPassword(password, user.password)) {
                        return done(null, false, {message: 'Incorrect password.'});
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