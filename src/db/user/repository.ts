import UserModel, { IUser } from './model';
import Cache from '../lib/model-cache';

const cache = new Cache<IUser>(100, 5);

export async function createUser(username: string, password: string, type: string): Promise<IUser> {
    const user = new UserModel({
        username: username.toLowerCase(),
        password: password,
    });
    user.password = await user.hashPassword(password);
    return await user.save();
}

/** TODO: implement cache by username  */
export async function findUserByUsername(username: string, useCache: boolean = true): Promise<IUser | null> {
    const user = await UserModel.findOne({ username: username });
    return user;
}
export async function findUserById(id: string, useCache: boolean = true): Promise<IUser | null> {

    if (useCache) {
        const cachedUser = cache.get(id);
        if (cachedUser) {
            return cachedUser;
        }
    }

    const user = await UserModel.findById(id);
    if (user !== null) {
        cache.put(user._id, user);
    }
    return user;
}