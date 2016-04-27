// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '462594957284917', // your App ID
        'clientSecret'  : '57029f505e34820f86c48be746e314c0', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'cFTsYp5zsXvvhqacaU4hZe2kN',
        'consumerSecret'    : 'VdXMmW3EThyxuT7gXqixFWD3mBdlPf5GmZ54rl73o6LWgGKaZq',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback' //'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '162399741273-lh0ml5ej9esfv6ldp7m6b9q2j5740oev.apps.googleusercontent.com',
        'clientSecret'  : 'kGDP-n-WqOLgrNGL5QC9VFsZ',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback' //http://127.0.0.1:3000
    },

    'burl' :   'http://localhost:3000/'// 'https://twelo.herokuapp.com/' //'https://tryroom.herokuapp.com/'

};
