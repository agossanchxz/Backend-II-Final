import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.jwt]),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport;
