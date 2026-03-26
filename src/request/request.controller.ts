// src/request/request.controller.ts
import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from 'joi';
import { validateRequest } from "../_middleware/validateRequest";
import { requestService } from "./request.service";

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/employee/:email', getByEmployeeEmail);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    requestService.getAll()
        .then((requests) => res.json(requests))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    requestService.getById(Number(req.params.id))
        .then((request) => res.json(request))
        .catch(next);
}

function getByEmployeeEmail(req: Request, res: Response, next: NextFunction): void {
    requestService.getByEmployeeEmail(req.params.email as string)
        .then((requests) => res.json(requests))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    requestService.create(req.body)
        .then(() => res.json({ message: 'Request created' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    requestService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Request updated' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    requestService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Request deleted' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        type: Joi.string().valid('Equipment', 'Leave', 'Resources').required(),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                qty: Joi.number().integer().min(1).required(),
            })
        ).min(1).required(),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').default('Pending'),
        employeeEmail: Joi.string().email().required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        type: Joi.string().valid('Equipment', 'Leave', 'Resources').empty(''),
        items: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                qty: Joi.number().integer().min(1).required(),
            })
        ).min(1).empty(''),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').empty(''),
        employeeEmail: Joi.string().email().empty(''),
    });
    validateRequest(req, next, schema);
}
