const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req,res) =>{
    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({'message':'Username and Password are Neecessary!'});

    const foundUser = await User.findOne({username: user}).exec();
    if(!foundUser) return res.sendStatus(401) //Unauthorised

    //Evaluation of password
    const match = await bcrypt.compare(pwd,foundUser.password);

    if(match){
        const accessToken = jwt.sign(
            {
                "username":foundUser.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        //Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt',refreshToken, {httpOnly:true, samesite:'None',maxage: 24 * 60*60*1000});
        res.json({ accessToken }); //fetch this in the client
    }else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }
 