import express from 'express';
import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsContoller';
import multer from 'multer';
import multerConfig from './config/multer';
import {celebrate, Joi } from 'celebrate';

// Padrão usado para as funções do Bando de dados
// index-pegar todos os dados, show- unico dados, create, update, delete 
const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsContoller = new ItemsController();

routes.get('/items', itemsContoller.index);
routes.get('/points/:id',  pointsController.show);
routes.get('/points',  pointsController.index);

routes.post(
    '/points', 
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    },{
        abortEarly: false 
    }), 
    pointsController.create
);

export default routes;