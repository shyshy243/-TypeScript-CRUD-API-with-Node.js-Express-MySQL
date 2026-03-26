// src/department/department.service.ts
import { db } from '../_helpers/db';
import { Department, DepartmentCreationAttributes } from './department.model';

export const departmentService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getEmployeeCount,
};

async function getAll(): Promise<Department[]> {
    return await db.Department.findAll();
}

async function getById(id: number): Promise<Department> {
    return await getDepartment(id);
}

async function create(params: DepartmentCreationAttributes): Promise<void> {
    const existingDepartment = await db.Department.findOne({ where: { name: params.name } });
    if (existingDepartment) {
        throw new Error(`Department "${params.name}" already exists`);
    }

    await db.Department.create(params);
}

async function update(id: number, params: Partial<DepartmentCreationAttributes>): Promise<void> {
    const department = await getDepartment(id);

    if (params.name) {
        const existingDepartment = await db.Department.findOne({
            where: { name: params.name, id: { [db.Department.sequelize.Sequelize.Op.ne]: id } }
        });
        if (existingDepartment) {
            throw new Error(`Department "${params.name}" already exists`);
        }
    }

    await department.update(params);
}

async function _delete(id: number): Promise<void> {
    const department = await getDepartment(id);

    // Check if department has employees
    const employeeCount = await db.Employee.count({ where: { departmentId: id } });
    if (employeeCount > 0) {
        throw new Error('Cannot delete department with employees');
    }

    await department.destroy();
}

async function getEmployeeCount(id: number): Promise<number> {
    return await db.Employee.count({ where: { departmentId: id } });
}

async function getDepartment(id: number): Promise<Department> {
    const department = await db.Department.findByPk(id);
    if (!department) {
        throw new Error('Department not found');
    }
    return department;
}
