import UserDTO from '../../../dto/user';
import { ITokens, signTokens } from './../lib/sign-token';
import { Request, Response }  from 'express';
import { createFbUser, findUserByFbId }  from '../../../db/user/repository';
import { isTokenCheckResponseValid, getFbIdByToken, getFbUserById }  from '../lib/facebook-util';

interface IFacebookLoginRequestBody {
    fbToken: string;
}
interface IFacebookLoginResponseBody {
    user: UserDTO;
    tokens: ITokens;
}
function isValidBody(object: any): object is IFacebookLoginRequestBody {
    return 'fbToken' in object;
}
export default async function (req: Request, res: Response, next: Function) {

    if (!isValidBody(req.body)) {
        return res.status(422).send();
    }

    const body: IFacebookLoginRequestBody = req.body;

    try {

        let tokenCheckResponse = await getFbIdByToken(body.fbToken);
        let isValid = isTokenCheckResponseValid(tokenCheckResponse.data);
        if (!isValid) {
            return res.status(401).send();
        }

        let fbUserId = tokenCheckResponse.data.user_id;
        let user = await findUserByFbId(fbUserId);

        if (!user) {
            let fbUser = await getFbUserById(fbUserId);
            user = await createFbUser(fbUser.id);
        }
        const tokens = await signTokens(user._id, user.logoutVersion);
        const responseBody: IFacebookLoginResponseBody = { user: new UserDTO(user), tokens: tokens };
        return res.status(200).send(responseBody);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send();
    }

}
/**
  * @swagger
  * /facebooklogin:
  *   post:
  *     summary: Facebook login endpoint
  *     description:
  *       "Works as both account creation and login"
  *     tags:
  *       - Users
  *     parameters:
  *       - name: body
  *         in: body
  *         required: true
  *         schema:
  *           type: object
  *           required:
  *             - fbToken
  *           properties:
  *             fbToken:
  *               type: string
  *           example: {
  *             "fbToken": "token_value"
  *           }
  *     responses:
  *       200:
  *         description: The user succesfully logged in. Returns the user and a set of authentication tokens.
  *       400:
  *         description: Something went wrong when authenticating towards facebook (Invalid token)
  *       422:
  *         description: Body is missing parameters
  */