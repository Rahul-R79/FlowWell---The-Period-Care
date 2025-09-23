//passport js config
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails, photos } = profile;
                const email = emails && emails[0] && emails[0].value;

                let user = await User.findOne({ googleId: id });

                if (!user) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.googleId = id;
                        if (photos && photos[0] && photos[0].value) {
                            user.avatar = photos[0].value;
                        }
                        await user.save();
                    } else {
                        user = await User.create({
                            name: displayName,
                            email,
                            googleId: id,
                            avatar: photos && photos[0] && photos[0].value,
                        });
                    }
                } else {
                    user.name = displayName || user.name;
                    if (photos && photos[0] && photos[0].value) {
                        user.avatar = photos[0].value;
                    }
                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
