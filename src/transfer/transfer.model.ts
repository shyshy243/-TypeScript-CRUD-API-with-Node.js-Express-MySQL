// src/transfer/transfer.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from 'sequelize';

export interface TransferAttributes {
    id: number;
    employeeId: number;
    fromDepartmentId: number;
    toDepartmentId: number;
    transferDate: Date;
    reason?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    approvedBy?: number; // User ID of admin who approved
    createdAt: Date;
    updatedAt: Date;
}

export interface TransferCreationAttributes
    extends Optional<TransferAttributes, 'id' | 'createdAt' | 'updatedAt' | 'approvedBy'> {}

export class Transfer
    extends Model<TransferAttributes, TransferCreationAttributes>
    implements TransferAttributes {

    public id!: number;
    public employeeId!: number;
    public fromDepartmentId!: number;
    public toDepartmentId!: number;
    public transferDate!: Date;
    public reason?: string;
    public status!: 'Pending' | 'Approved' | 'Rejected';
    public approvedBy?: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Transfer {
    Transfer.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Employees',
                    key: 'id'
                }
            },
            fromDepartmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Departments',
                    key: 'id'
                }
            },
            toDepartmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Departments',
                    key: 'id'
                }
            },
            transferDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
                allowNull: false,
                defaultValue: 'Pending',
            },
            approvedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Transfer',
            tableName: 'Transfers',
            timestamps: true,
        }
    );
    return Transfer;
}