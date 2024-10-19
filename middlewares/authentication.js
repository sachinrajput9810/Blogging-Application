const { validateToken } = require("../services/authentication")

function checkForAuthenticationCookie(cookieName){
    return (req , res , next) =>{
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue){
            console.log("No  token Found")
            return next()
        }
        const userPayload = validateToken(tokenCookieValue )
        req.user = userPayload
        
        return next()
    }
}

module.exports = {checkForAuthenticationCookie}