import { ITokens, signTokens } from './../lib/sign-token';
import { Response, Request } from 'express';
import UserDTO from '../../../dto/user';
import { findUserByUsername } from '../../../db/user/repository';


interface ILoginRequestBody {
    username: string;
    password: string;
}
interface ILoginResponseBody {
    user: UserDTO;
    tokens: ITokens;
}
function isValidBody(object: any): object is ILoginRequestBody {
    return 'username' in object && 'password' in object;
}
export default async function (req: Request, res: Response, next: Function) {
    
    if (!isValidBody(req.body)) {
        return res.status(422).send();
    }

    const body: ILoginRequestBody = req.body;

    try {
        const user = await findUserByUsername(body.username);
        if (!user) {
            return res.status(401).send();
        }

        const isValidPassword = await user.verifyPassword(body.password);
        if (!isValidPassword) {
            return res.status(401).send();
        }

        const tokens = await signTokens(user._id);

        const responseBody: ILoginResponseBody = {
            user: new UserDTO(user),
            tokens: tokens
        }
        return res.status(200).json(responseBody);
    }
    catch(e) {
        console.log(e);
        return res.status(500).send();
    }

}
/**
  * @swagger
  * /login:
  *   post:
  *     summary: Login endpoint
  *     description:
  *       "Endpoint to get access to authentication tokens"
  *     tags:
  *       - Users
  *     parameters:
  *       - name: body
  *         in: body
  *         required: true
  *         schema:
  *           type: object
  *           required:
  *             - username
  *             - password
  *           properties:
  *             username:
  *               type: string
  *             password:
  *               type: string
  *           example: {
  *             "username": "someUser",
  *             "password": "somePassword"
  *           }
  *     responses:
  *       200:
  *         description: The user succesfully logged in. Returns the user and a set of authentication tokens.
  *       401:
  *         description: Could not authenticate
  *       422:
  *         description: Invalid body
  */
  