import { Response, Request } from 'express';
import { signTokens, ITokens } from '../lib/sign-token';
import { createUser } from '../../../db/user/repository';
import UserDTO from '../../../dto/user';

interface IRegisterBody {
    username: string;
    password: string;
    type: string;
}
interface IRegisterResponseBody {
    user: UserDTO;
    tokens: ITokens;
}
function isValidBody(object: any): object is IRegisterBody {
    return 'username' in object && 'password' in object;
}
export default async function (req: Request, res: Response, next: Function) {
    
    if (!isValidBody(req.body)) {
        return res.status(422).send();
    }

    const body: IRegisterBody = req.body;

    try {
        const user = await createUser(body.username, body.password, body.type);

        const tokens = await signTokens(user._id);
    
        const responseBody: IRegisterResponseBody = {
            user: new UserDTO(user),
            tokens: tokens,
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
  * /register:
  *   post:
  *     summary: Creates a new user
  *     description:
  *       "Endpoint to create a new user"
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
  *         description: The user was created. Returns the user and a set of authentication tokens.
  *       409:
  *         description: The username already exists
  *       422:
  *         description: Invalid body
  */