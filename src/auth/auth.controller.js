import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import { generarJWT } from '../helpers/generar-jwt.js';

export const login = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        let user;

        // Buscar por email o username
        user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { userName: emailOrUsername }
            ]
        });

        if (!user) {
            return res.status(400).json({
                msg: "Incorrect credentials, Email or Username does not exist in the database",
            });
        }
        if (!user.state) {
            return res.status(400).json({
                msg: "The user does not exist in the database",
            });
        }
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Password is incorrect",
            });
        }
        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: "Login OK!",
            user,
            token
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: "Contact administrator",
        });
    }
}