import User from '../user/user.model.js';

export const existenteEmail = async (email = '') => {
    const existeEmail = await User.findOne({ email});

    if (existeEmail) {
        throw new Error(`The email ${email} already been registered`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`The ID: ${id} does not exist`);
    }
}

export const existePostById = async (id = '') => {
    const existePost = await Post.findById(id);

    if (!existePost) {
        throw new Error(`The ID: ${id} does not exist`);
    }
}