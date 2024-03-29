import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from './user.model.js';

export const getUsers = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);
    res.status(200).json({
        total,
        users,
    });
}

export const createUser = async (req, res) => {
    const { name, lastName, userName, email, password, state } = req.body;
    const user = new User({ name, lastName, userName, email, password, state });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        user,
    });
}

export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { oldPassword, newPassword, ...rest } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const validPassword = bcryptjs.compareSync(oldPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Incorrect old password' });
        }

        if (newPassword) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync(newPassword, salt);
        }

        await User.findByIdAndUpdate(id, rest);

        const updatedUser = await User.findById(id);

        res.status(200).json({
            msg: 'Updated User',
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}
