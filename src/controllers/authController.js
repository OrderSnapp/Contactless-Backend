const AuthService = require('../services/authService');

// Handler to register a new user
const register = (req,res) => {
    const { username, email, password, phone } = req.body;
    return AuthService.registerService({res, username, email, password, phone});
};

const login = (req,res) => {
    const { username, password } = req.body;
    return AuthService.loginService({res, username, password});
}


module.exports = {
    register,
    login
};