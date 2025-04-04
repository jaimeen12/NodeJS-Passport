import Strategy from 'passport-local'
import bcrypt from 'bcryptjs'
import { getUserByEmail,getUser } from '../controllers/userController.js'

const LocalStrategy = Strategy.Strategy

export function PassportFunc(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
        try {
            const user = await getUserByEmail(email);

            if (!user) {
                
                return done(null, false, { message: 'No user found with that email' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                
                return done(null, false, { message: 'Password incorrect' });
            }
            console.log(user)
            return done(null, user);
        } catch (error) {
            console.error('ERROR IN PASSPORT: '+ error);
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUser(id);
            done(null, user);
        } catch (error) {
            console.error(error);
            done(error);
        }
    });
}