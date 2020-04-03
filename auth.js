require("dotenv").config();
const jwt = require("jsonwebtoken");


const createTokens = (user) => {

    const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign({
        id: user.id,
        email: user.email,
        count: user.count
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '31day' }
    )

    return {
        accessToken,
        refreshToken, 
        refreshExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
        accessExpires:  new Date(Date.now() + 1000 * 60 * 15),
    }

}

const createAndAssignTokens = (user, res) => {
    const {
        refreshToken, 
        accessToken,
        accessExpires,
        refreshExpiress
    } = createTokens(user);

    res.cookie("refresh-token", refreshToken, { expires: refreshExpiress })
    res.cookie("access-token", accessToken, { expires: accessExpires })

    return res;
}

module.exports.createTokens = createTokens;
module.exports.createAndAssignTokens = createAndAssignTokens;