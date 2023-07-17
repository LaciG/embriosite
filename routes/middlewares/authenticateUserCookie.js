let Models = require('../../models/index');
let jwt = require('jsonwebtoken');
let cookieParser = require('cookie-parser');

module.exports = (req, res, next) => {
    try {
        let verifiedCookie = jwt.verify(req.cookies.access_token, "embriosite", {ignoreExpiration: true});
        let userID = verifiedCookie.id;
        Models.user.findOne({where: {id: userID}})
        .then(user => { 
            res.locals.username = user.first_name + ' ' + user.last_name;
            /*if (user.enabled == 1) {
                next();
            } else {
                res.redirect('/');
            }*/
            next();
        })
        .catch(error => { res.status(500).send(); })

    } catch (error) {
        res.redirect('/');
    }
}