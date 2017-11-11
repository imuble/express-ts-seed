import UserDTO from '../../../dto/user';
import { ITokens, signTokens } from './../lib/sign-token';
import { Request, Response } from 'express';
//import { createFbUser } from '../../../db/user/repository';
import { verifyTokenAndFetchUserFromFacebook } from '../lib/facebook-util';

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
        const user = await verifyTokenAndFetchUserFromFacebook(body.fbToken);
        if (user === null) {
            return res.status(400).send();
        }
        
        /* TODO: implement database storage and return user with accesstokens */
        //const user = await createFbUser(user);
        //const tokens = await signTokens(user._id);
        //responseBody: IFacebookLoginResponseBody = { user: new UserDTO(user), tokens: tokens };
        //return res.status(200).send(responseBody);
    }
    catch(e) {
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