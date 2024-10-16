const User = require('../model/User');
const jwt = require('jsonwebtoken');

const { generateAccessToken } = require('../tokenUtils'); // Import helper

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // Unauthorized

    // Evaluate JWT
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403); // Forbidden

        const accessToken = generateAccessToken(decoded.username);
        res.json({ accessToken });
    });
};

module.exports = { handleRefreshToken };
