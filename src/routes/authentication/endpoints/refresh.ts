import { ITokens, signTokens, TokenTypes } from './../lib/sign-token';
import { Response, Request } from 'express';
import UserDTO from '../../../dto/user';
import { findUserById } from '../../../db/user/repository';
import verifyToken from '../lib/verify-token';


interface IRefreshRequestBody {
    refreshToken: string;
}
interface IRefreshResponseBody {
    user: UserDTO;
    tokens: ITokens;
}
function isValidBody(object: any): object is IRefreshRequestBody {
    return 'refreshToken' in object;
}
export default async function refreshToken(req: Request, res: Response) {

    if (!isValidBody(req.body)) {
        return res.status(422).send();
    }

    try {
        const decodedToken = await verifyToken(req.body.refreshToken);
        if (decodedToken.type !== TokenTypes.REFRESH_TOKEN) {
            return res.status(401).send();
        }
        const user = await findUserById(decodedToken.id);
        if (user === null) {
            return res.status(404).send();
        }

        const invalidLogoutVersion = !decodedToken.logoutVersion || user.logoutVersion !== decodedToken.logoutVersion;
        if (invalidLogoutVersion) {
            return res.status(401).send();
        }

        const signedTokens = await signTokens(user._id, user.logoutVersion);

        const responseBody: IRefreshResponseBody = {
            user: new UserDTO(user),
            tokens: signedTokens
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
  * /refresh:
  *   post:
  *     summary: Refresh token endpoint
  *     description:
  *       "Endpoint to get access to authentication tokens by using a refresh token."
  *     tags:
  *       - Users
  *     parameters:
  *       - name: body
  *         in: body
  *         required: true
  *         schema:
  *           type: object
  *           required:
  *             - refreshToken
  *           properties:
  *             refreshToken:
  *               type: string
  *           example: {
  *             "refreshToken": "some-refresh-token",
  *           }
  *     responses:
  *       200:
  *         description: The user succesfully logged in. Returns the user and a set of authentication tokens.
  *       401:
  *         description: Could not authenticate
  *       422:
  *         description: Invalid body
  */
  
