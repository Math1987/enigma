/** 
 * USER ROUTES
 * 
 * All the routes used by user and actualy a little bit more (rank routes)
 * the functions are in controller folder.
 * Give free access to CreateUser, LoginUser, (ranks),
 * Protect routes with midlewear used JWT token as
 * readUser, createChara, moveChara, actionChara, getWorld etc...
 * 
 */
import { Response } from 'express' ;
import { actionCharaReq, createCharaReq, incCharaValueReq, moveCharaReq } from '../controlers/chara.controller';
import { rankKillReq, rankLevelReq } from '../controlers/rank.controller';
import { createUserReq, readUserReq, loginUserReq } from '../controlers/user.controller';
import { getWorldReq } from '../controlers/world.controller';
import { PatternHandler } from '../patterns/index.patterns';
import { userSecurMidelwear } from '../secur/user.secur';
const express = require('express');
export const routes = express.Router() ;


routes.get('/test', (req:Request, res : Response) => { res.status(200).send('testOk');} );


routes.post('/api/user/create', createUserReq );
routes.post('/api/user/login', loginUserReq );

routes.get('/api/rank/level', rankLevelReq );
routes.get('/api/rank/kill', rankKillReq );

//FOR DEV IN ALPHA WORK...keep it secret ;)
routes.get('/api/world/pass', (req:Request, res : Response) => { PatternHandler.pass() ; res.status(200).send('ok');} );


routes.use('/api/user', userSecurMidelwear );
routes.get('/api/user/read', readUserReq );
routes.post('/api/user/createChara', createCharaReq );
routes.post('/api/user/chara/incValue', incCharaValueReq );
routes.post('/api/user/chara/move', moveCharaReq );
routes.post('/api/user/chara/action', actionCharaReq );
routes.post('/api/user/world/get', getWorldReq );




