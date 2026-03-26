// src/employee/employee.service.ts
import { db } from '../_helpers/db';
import { Employee, EmployeeCreationAttributes } from './employee.model';

export const employeeService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll(): Promise<Employee[]> {
    return await db.Employee.findAll({
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
            },
            {
                model: db.Department,
                as: 'department',
                attributes: ['id', 'name']
            }
        ]
    });
}

async function getById(id: number): Promise<Employee> {
    return await getEmployee(id);
}

async function create(params: EmployeeCreationAttributes): Promise<void> {
    // Check if user exists
    const user = await db.User.findByPk(params.userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department) {
        throw new Error('Department not found');
    }

    // Check if employeeId is unique
    const existingEmployee = await db.Employee.findOne({ where: { employeeId: params.employeeId } });
    if (existingEmployee) {
        throw new Error(`Employee ID "${params.employeeId}" already exists`);
    }

    // Check if user is already an employee
    const existingUserEmployee = await db.Employee.findOne({ where: { userId: params.userId } });
    if (existingUserEmployee) {
        throw new Error('User is already an employee');
    }

    await db.Employee.create(params);
}

async function update(id: number, params: Partial<EmployeeCreationAttributes>): Promise<void> {
    const employee = await getEmployee(id);

    if (params.employeeId) {
        const existingEmployee = await db.Employee.findOne({
            where: { employeeId: params.employeeId, id: { [db.Employee.sequelize.Sequelize.Op.ne]: id } }
        });
        if (existingEmployee) {
            throw new Error(`Employee ID "${params.employeeId}" already exists`);
        }
    }

    if (params.userId) {
        const user = await db.User.findByPk(params.userId);
        if (!user) {
            throw new Error('User not found');
        }

        const existingUserEmployee = await db.Employee.findOne({
            where: { userId: params.userId, id: { [db.Employee.sequelize.Sequelize.Op.ne]: id } }
        });
        if (existingUserEmployee) {
            throw new Error('User is already assigned to another employee record');
        }
    }

    if (params.departmentId) {
        const department = await db.Department.findByPk(params.departmentId);
        if (!department) {
            throw new Error('Department not found');
        }
    }

    await employee.update(params);
}

async function _delete(id: number): Promise<void> {
    const employee = await getEmployee(id);
    await employee.destroy();
}

async function getEmployee(id: number): Promise<Employee> {
    const employee = await db.Employee.findByPk(id, {
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
            },
            {
                model: db.Department,
                as: 'department',
                attributes: ['id', 'name']
            }
        ]
    });
    if (!employee) {
        throw new Error('Employee not found');
    }
    return employee;
}
