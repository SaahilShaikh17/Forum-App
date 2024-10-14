const User = require('../model/User');

const handleLogout = async(req,res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(204); //no Content
    }

    const refreshToken = cookies.jwt;

    //Check if refreshToken is in DB
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly: true, sameSite:'None', secure: true});
        return res.sendStatus(204); //no Content
    }

    //Delete refreshtoken from DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})   // in production ad the flag secure: true. This only serves only on https
    res.sendStatus(204); // no content

}

module.exports ={ handleLogout };