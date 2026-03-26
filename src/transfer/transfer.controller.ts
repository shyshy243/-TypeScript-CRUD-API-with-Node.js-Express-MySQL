// src/transfer/transfer.controller.ts
import type { Request, Response, NextFunction } from "express";
import { Router } from "express";
import Joi from 'joi';
import { validateRequest } from "../_middleware/validateRequest";
import { transferService } from "./transfer.service";

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/employee/:employeeId', getByEmployeeId);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.put('/:id/approve', approveSchema, approve);
router.put('/:id/reject', rejectSchema, reject);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    transferService.getAll()
        .then((transfers) => res.json(transfers))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    transferService.getById(Number(req.params.id))
        .then((transfer) => res.json(transfer))
        .catch(next);
}

function getByEmployeeId(req: Request, res: Response, next: NextFunction): void {
    transferService.getByEmployeeId(Number(req.params.employeeId))
        .then((transfers) => res.json(transfers))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    transferService.create(req.body)
        .then(() => res.json({ message: 'Transfer request created' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    transferService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Transfer updated' }))
        .catch(next);
}

function approve(req: Request, res: Response, next: NextFunction): void {
    transferService.approveTransfer(Number(req.params.id), req.body.approvedBy)
        .then(() => res.json({ message: 'Transfer approved' }))
        .catch(next);
}

function reject(req: Request, res: Response, next: NextFunction): void {
    transferService.rejectTransfer(Number(req.params.id), req.body.approvedBy)
        .then(() => res.json({ message: 'Transfer rejected' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    transferService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Transfer deleted' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.number().integer().required(),
        fromDepartmentId: Joi.number().integer().required(),
        toDepartmentId: Joi.number().integer().required(),
        transferDate: Joi.date().required(),
        reason: Joi.string().allow('').optional(),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').default('Pending'),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeId: Joi.number().integer().empty(''),
        fromDepartmentId: Joi.number().integer().empty(''),
        toDepartmentId: Joi.number().integer().empty(''),
        transferDate: Joi.date().empty(''),
        reason: Joi.string().allow('').optional(),
        status: Joi.string().valid('Pending', 'Approved', 'Rejected').empty(''),
    });
    validateRequest(req, next, schema);
}

function approveSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        approvedBy: Joi.number().integer().required(),
    });
    validateRequest(req, next, schema);
}

function rejectSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        approvedBy: Joi.number().integer().required(),
    });
    validateRequest(req, next, schema);
}