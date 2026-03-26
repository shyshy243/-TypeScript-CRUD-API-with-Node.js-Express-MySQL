// src/_helpers/db.ts
import config from '../../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';

export interface Database{
    User: any;
    Department: any;
    Employee: any;
    Request: any;
    Transfer: any;
}

export const db: Database = {} as Database;

export async function initialize(): Promise<void> {
    const  { host, port, user, password, database } = config.database;

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql'});

    const { default: userModel } = await import('../users/user.model');
    db.User = userModel(sequelize);

    const { default: departmentModel } = await import('../department/department.model');
    db.Department = departmentModel(sequelize);

    const { default: employeeModel } = await import('../employee/employee.model');
    db.Employee = employeeModel(sequelize);

    const { default: requestModel } = await import('../request/request.model');
    db.Request = requestModel(sequelize);

    const { default: transferModel } = await import('../transfer/transfer.model');
    db.Transfer = transferModel(sequelize);

    // Set up associations
    db.User.hasOne(db.Employee, { foreignKey: 'userId', as: 'employee' });
    db.Employee.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

    db.Department.hasMany(db.Employee, { foreignKey: 'departmentId', as: 'employees' });
    db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

    db.Employee.hasMany(db.Transfer, { foreignKey: 'employeeId', as: 'transfers' });
    db.Transfer.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'employee' });

    db.Department.hasMany(db.Transfer, { foreignKey: 'fromDepartmentId', as: 'transfersFrom' });
    db.Department.hasMany(db.Transfer, { foreignKey: 'toDepartmentId', as: 'transfersTo' });
    db.Transfer.belongsTo(db.Department, { foreignKey: 'fromDepartmentId', as: 'fromDepartment' });
    db.Transfer.belongsTo(db.Department, { foreignKey: 'toDepartmentId', as: 'toDepartment' });

    db.User.hasMany(db.Transfer, { foreignKey: 'approvedBy', as: 'approvedTransfers' });
    db.Transfer.belongsTo(db.User, { foreignKey: 'approvedBy', as: 'approver' });

    // For requests, we'll handle the relationship manually since employeeEmail references User.email
    // db.User.hasMany(db.Request, { foreignKey: 'employeeEmail', sourceKey: 'email', as: 'requests' });
    // db.Request.belongsTo(db.User, { foreignKey: 'employeeEmail', targetKey: 'email', as: 'employee' });

    await sequelize.sync({ alter: true });

    console.log('Database initialized and models synced');
}