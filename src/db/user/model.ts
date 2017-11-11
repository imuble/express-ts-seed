import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';


interface IVerifyPassword {
    (password: string): Promise<boolean>
}
interface IHashPassword {
    (password: string): Promise<string>
}
export interface IUser extends mongoose.Document {
    username: string;
    password: string;

    //functions
    verifyPassword: IVerifyPassword;
    hashPassword: IHashPassword;
}

export const UserSchema = new mongoose.Schema({
    username: { required: true, type: String, index: { unique: true } },
    password: { required: true, type: String },
});

const verifyPassword: IVerifyPassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
}
const hashPassword: IHashPassword = function (password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}
UserSchema.methods.hashPassword = hashPassword;
UserSchema.methods.verifyPassword = verifyPassword;
UserSchema.pre('save', async function (next) {
    next();
});

const UserModel = mongoose.model<IUser>('User', UserSchema)

export default UserModel;