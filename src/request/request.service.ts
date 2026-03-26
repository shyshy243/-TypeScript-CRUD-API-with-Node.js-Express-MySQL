// src/request/request.service.ts
import { db } from '../_helpers/db';
import { Request as RequestModel, RequestCreationAttributes, RequestItem } from './request.model';

export const requestService = {
    getAll,
    getById,
    getByEmployeeEmail,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<RequestModel[]> {
    const requests = await db.Request.findAll();
    // Manually join with user data
    const requestsWithUsers = await Promise.all(
        requests.map(async (request: RequestModel) => {
            const user = await db.User.findOne({ where: { email: request.employeeEmail } });
            return {
                ...request.toJSON(),
                employee: user ? {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                } : null
            };
        })
    );
    return requestsWithUsers as any;
}

async function getById(id: number): Promise<RequestModel> {
    return await getRequest(id);
}

async function getByEmployeeEmail(employeeEmail: string): Promise<RequestModel[]> {
    const requests = await db.Request.findAll({ where: { employeeEmail } });
    const user = await db.User.findOne({ where: { email: employeeEmail } });
    const requestsWithUsers = requests.map((request: RequestModel) => ({
        ...request.toJSON(),
        employee: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        } : null
    }));
    return requestsWithUsers as any;
}

async function create(params: RequestCreationAttributes): Promise<void> {
    // Verify that the employee email exists in users
    const user = await db.User.findOne({ where: { email: params.employeeEmail } });
    if (!user) {
        throw new Error('Employee email not found');
    }

    await db.Request.create(params);
}

async function update(id: number, params: Partial<RequestCreationAttributes>): Promise<void> {
    const request = await getRequest(id);

    if (params.employeeEmail) {
        const user = await db.User.findOne({ where: { email: params.employeeEmail } });
        if (!user) {
            throw new Error('Employee email not found');
        }
    }

    await request.update(params);
}

async function _delete(id: number): Promise<void> {
    const request = await getRequest(id);
    await request.destroy();
}

async function getRequest(id: number): Promise<RequestModel> {
    const request = await db.Request.findByPk(id);
    if (!request) {
        throw new Error('Request not found');
    }

    const user = await db.User.findOne({ where: { email: request.employeeEmail } });
    return {
        ...request.toJSON(),
        employee: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        } : null
    } as any;
}
