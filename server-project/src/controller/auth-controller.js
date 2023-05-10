const bycriptjs = require('bcryptjs');
const jwt = require('../utils/jwt');
const User = require('../models/user')
const axios = require('axios')


const register = async (req, res) => {
    const { firstName, lastName, email, password, municipio, departamento } = req.body;

    if (!email) return res.status('400').send({msg: "required email"})
    if (!password) return res.status('400').send({msg: "required email"})

    const salt = bycriptjs.genSaltSync(10)
    const hashPassword = bycriptjs.hashSync(password, salt)

    const userPayload = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        role: 'user',
        active: false,
        password: hashPassword,
        municipio: municipio,
        departamento: departamento
    }

    const user = new User(userPayload);
    if (!this.validateLocaion(user)) {
       return res.status(400).send({ msg: 'Error to create the user' })
    }
    try {
        const userStorage = await user.save()
        res.status(201).send(userStorage)
    } catch (error) {
        res.status(400).send({ msg: 'Error to create the user' })
    }

}

const login = async (req, res) => {
    const {email, password } = req.body;
    try {
        if (!email || !password) throw new Error("Email and ")
        const emailLowerCase = email.toLowerCase()
        const user = await User.findOne({ email: emailLowerCase }).exec()
        if (!user) {
            throw new Error('Not found user')
        }
        const check = await bycriptjs.compare(password, user.password)
        if (!check) {
            throw new Error('Incorreted password')
        }
        if (!user.active) {
            throw new Error('Unauthorized user or inactive')
        }
        res.status(200).send({
            access: jwt.createAccessToken(user),
            refresh: jwt.createRefreshToken(user)
        })
    } catch(error) {
        res.status(400).send({ msg: error.message })
    }
    
}

async function validateLocaion(user){
    const locations = await axios.get('https://www.datos.gov.co/resource/xdk5-pm3f.json').then(resp =>{ return resp.data})
    if (locations.some(location =>  location.municipio == user.municipio && location.departamento == user.departamento )) {
        return true;
    } else {
        return false;
    }
 }

const refreshAccessToken = (req, res) => {
    const { token } = req.body;
    if (!token) res.status(400).send({ msg: "Token required"})
    const { user_id } = jwt.decode(token)
    userModel.findOne({ _id: user_id }), (error, userStoraged) => {
        if (error) {
            res.status(500).send({ msg: "Error from server" })
        } else {
            res.status(200).send({
                accessToken: jwt.createAccessToken(userStoraged)
            })
        }
    }
}


module.exports = {
    register,
    login,
    refreshAccessToken,
    validateLocaion
}