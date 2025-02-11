const AuthService = require('../services/authService');

// Handler to register a new user
const register = (req,res) => {
    const { username, email, password, phone, firstname, lastname } = req.body;
    return AuthService.registerService({res, username, email, password, phone, firstname, lastname});
};

const login = (req,res) => {
    const { username, password } = req.body;
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