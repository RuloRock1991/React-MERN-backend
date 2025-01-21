const { response } = require("express");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, resp = response) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({
            email
        });

        if (user) {
            return resp.status(400).json({
                ok: false,
                msg: "Ya existe un usuario con ese correo"
            });
        }

        user = new User(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //Gerar JWT
        const token = await generateJWT(user.id, user.name);

        resp.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error interno. Contactar al administrador"
        });
    }
}

const loginUser = async (req, resp = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return resp.status(400).json({
                ok: false,
                msg: "Usuario y contraseña no son correctos"
            });
        }

        //Confirmar los password
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return resp.status(400).json({
                ok: false,
                msg: "Contraseña incorrecta"
            });
        }

        //Generar JWT
        const token = await generateJWT(user.id, user.name);

        resp.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: "Error interno. Contactar al administrador"
        });
    }
}

const renewToken = async(req, resp = response) => {
    const { uid, name } = req;

    //generar un nuevo jwt y retornarlo en la peticion
    const token = await generateJWT(uid, name);

    resp.json({
        ok: true,
        uid,
        name,
        token
    });
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}