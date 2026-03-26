// src/transfer/transfer.service.ts
import { db } from '../_helpers/db';
import { Transfer, TransferCreationAttributes } from './transfer.model';

export const transferService = {
    getAll,
    getById,
    getByEmployeeId,
    create,
    update,
    delete: _delete,
    approveTransfer,
    rejectTransfer,
};

async function getAll(): Promise<Transfer[]> {
    return await db.Transfer.findAll({
        include: [
            {
                model: db.Employee,
                as: 'employee',
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ]
            },
            {
                model: db.Department,
                as: 'fromDepartment',
                attributes: ['id', 'name']
            },
            {
                model: db.Department,
                as: 'toDepartment',
                attributes: ['id', 'name']
            },
            {
                model: db.User,
                as: 'approver',
                attributes: ['id', 'firstName', 'lastName', 'email'],
                required: false
            }
        ]
    });
}

async function getById(id: number): Promise<Transfer> {
    return await getTransfer(id);
}

async function getByEmployeeId(employeeId: number): Promise<Transfer[]> {
    return await db.Transfer.findAll({
        where: { employeeId },
        include: [
            {
                model: db.Employee,
                as: 'employee',
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ]
            },
            {
                model: db.Department,
                as: 'fromDepartment',
                attributes: ['id', 'name']
            },
            {
                model: db.Department,
                as: 'toDepartment',
                attributes: ['id', 'name']
            },
            {
                model: db.User,
                as: 'approver',
                attributes: ['id', 'firstName', 'lastName', 'email'],
                required: false
            }
        ]
    });
}

async function create(params: TransferCreationAttributes): Promise<void> {
    // Verify employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee) {
        throw new Error('Employee not found');
    }

    // Verify from department exists and matches employee's current department
    const fromDepartment = await db.Department.findByPk(params.fromDepartmentId);
    if (!fromDepartment) {
        throw new Error('From department not found');
    }

    if (employee.departmentId !== params.fromDepartmentId) {
        throw new Error('From department does not match employee\'s current department');
    }

    // Verify to department exists
    const toDepartment = await db.Department.findByPk(params.toDepartmentId);
    if (!toDepartment) {
        throw new Error('To department not found');
    }

    // Check if from and to departments are different
    if (params.fromDepartmentId === params.toDepartmentId) {
        throw new Error('From and to departments cannot be the same');
    }

    await db.Transfer.create(params);
}

async function update(id: number, params: Partial<TransferCreationAttributes>): Promise<void> {
    const transfer = await getTransfer(id);

    if (params.employeeId) {
        const employee = await db.Employee.findByPk(params.employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }
    }

    if (params.fromDepartmentId) {
        const fromDepartment = await db.Department.findByPk(params.fromDepartmentId);
        if (!fromDepartment) {
            throw new Error('From department not found');
        }
    }

    if (params.toDepartmentId) {
        const toDepartment = await db.Department.findByPk(params.toDepartmentId);
        if (!toDepartment) {
            throw new Error('To department not found');
        }
    }

    await transfer.update(params);
}

async function approveTransfer(id: number, approvedBy: number): Promise<void> {
    const transfer = await getTransfer(id);

    if (transfer.status !== 'Pending') {
        throw new Error('Transfer is not pending');
    }

    // Update transfer status
    await transfer.update({ status: 'Approved', approvedBy });

    // Update employee's department
    const employee = await db.Employee.findByPk(transfer.employeeId);
    if (employee) {
        await employee.update({ departmentId: transfer.toDepartmentId });
    }
}

async function rejectTransfer(id: number, approvedBy: number): Promise<void> {
    const transfer = await getTransfer(id);

    if (transfer.status !== 'Pending') {
        throw new Error('Transfer is not pending');
    }

    await transfer.update({ status: 'Rejected', approvedBy });
}

async function _delete(id: number): Promise<void> {
    const transfer = await getTransfer(id);

    // Only allow deletion of pending transfers
    if (transfer.status !== 'Pending') {
        throw new Error('Cannot delete approved or rejected transfers');
    }

    await transfer.destroy();
}

async function getTransfer(id: number): Promise<Transfer> {
    const transfer = await db.Transfer.findByPk(id, {
        include: [
            {
                model: db.Employee,
                as: 'employee',
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['id', 'firstName', 'lastName', 'email']
                    }
                ]
            },
            {
                model: db.Department,
                as: 'fromDepartment',
                attributes: ['id', 'name']
            },
            {
                model: db.Department,
                as: 'toDepartment',
                attributes: ['id', 'name']
            },
            {
                model: db.User,
                as: 'approver',
                attributes: ['id', 'firstName', 'lastName', 'email'],
                required: false
            }
        ]
    });
    if (!transfer) {
        throw new Error('Transfer not found');
    }
    return transfer;
}