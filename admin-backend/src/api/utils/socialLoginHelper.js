const {googleClientID, googleClientSecret, googleClientCalback} = require('../../config/vars');
const User = require('../models/users.model');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require( 'passport-facebook' ).Strategy;
const rp = require('request-promise');
const esignRepack = process.env.esignRepack;
module.exports = (passport) => {

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });
    
    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    });

    passport.use(new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleClientCalback,
        passReqToCallback: true
    },
        (request, accessToken, refreshToken, profile, done) => {
            createOrUpdateProfile(profile.id, null, profile.name.givenName, profile.name.familyName, profile.email, profile.picture, accessToken, refreshToken)
            .then(user => {
                // const accessToken = user.token()
                // user = {accessToken  , ...user }
                return done(null, user)
            })
            .catch(err => {
                return done(null, false, { message: 'User alreardy exist' });
            })
        })
    );

    // passport.use(new FacebookStrategy({
    //     clientID: facebook_config.client_ID,
    //     clientSecret: facebook_config.client_secret,
    //     callbackURL: facebook_config.callbackURL,
    //     profileFields: facebook_config.profileFields
    // },
    //     (accessToken, refreshToken, profile, done) => {
    //         createOrUpdateProfile(profile._json.id, profile._json.name  ,profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.photos[0].value, accessToken)
    //         .then(user => {
    //             return done(null, user)
    //         })
    //         .catch(err => {
    //             return done(null, false, { message: 'User alreardy exist' })
    //         })
    //     })
    // );
}

async function createOrUpdateProfile(id, displayName = null, firstName, lastName, email, imageUrl, accessToken, refreshToken) {
    return User.findOne({ googleProfileId: id })
        .exec()
        .then(async (user) => {
            var firstname 
            var lastname 
            var username
            if(displayName != null){
                var data = displayName.split(" ");
                firstname = data[0];
                lastname  = data [1];
             }else{
                firstname = firstName;
                lastname  = lastName;
                username = firstName

            }
            if (!user) {
                user = await new User({
                    email, 
                    googleProfileId: id, 
                    fileName: imageUrl,
                    isEmailVerified: true,
                    password:email+firstname,
                    firstname :firstname || 'NA',
                    lastname : lastname || 'NA',
                    username: firstname,
                    accociatedCoach: null
                }).save();

            }

            if(refreshToken)
                user.googleRefreshToken = refreshToken;
                user.googleAccessToken = accessToken;
            return await user.save();
        }).catch(err => {
            console.log("err", err);
        })
}
