const User = require('../model/User'); // Ensure User model is imported
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async(req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and Password are necessary!' });

    const foundUser = await User.findOne({ username: user }).exec();  // Ensure this line works now
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    // Evaluate the password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save the refreshToken with the current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        // Send the refresh token in a cookie
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send back accessToken and userId
        res.json({ accessToken, userId: foundUser._id });
    } else {
        res.sendStatus(401); // Unauthorized if passwords don't match
    }
}

module.exports = { handleLogin };
