const AuthService = require('../services/authService');

// Handler to register a new user
const register = (req,res) => {
    const { username, email, password, phone } = req.body;
    return AuthService.registerService({res, username, email, password, phone});
};

const login = (req,res) => {
    const { username, password } = req.body;
    console.log("username", username);
    console.log(req.body);
    
    console.log("password", password);
    
    return AuthService.loginService({res, username, password});
}

const session = (req,res) => {
    return AuthService.sessionService({req,res});
}


module.exports = {
    register,
    login,
    session
};