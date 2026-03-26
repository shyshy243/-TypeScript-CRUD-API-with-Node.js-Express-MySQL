// src/request/request.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from 'sequelize';

export interface RequestItem {
    name: string;
    qty: number;
}

export interface RequestAttributes {
    id: number;
    type: string;
    items: RequestItem[];
    status: 'Pending' | 'Approved' | 'Rejected';
    employeeEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestCreationAttributes
    extends Optional<RequestAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Request
    extends Model<RequestAttributes, RequestCreationAttributes>
    implements RequestAttributes {

    public id!: number;
    public type!: string;
    public items!: RequestItem[];
    public status!: 'Pending' | 'Approved' | 'Rejected';
    public employeeEmail!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Request {
    Request.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM('Equipment', 'Leave', 'Resources'),
                allowNull: false,
            },
            items: {
                type: DataTypes.JSON,
                allowNull: false,
                validate: {
                    validateItems(value: any): boolean {
                        if (!Array.isArray(value)) {
                            throw new Error('Items must be an array');
                        }
                        if (value.length === 0) {
                            throw new Error('Items cannot be empty');
                        }
                        value.forEach((item: any) => {
                            if (!item.name || typeof item.name !== 'string') {
                                throw new Error('Each item must have a name');
                            }
                            if (!item.qty || typeof item.qty !== 'number' || item.qty <= 0) {
                                throw new Error('Each item must have a positive quantity');
                            }
                        });
                        return true;
                    }
                }
            },
            status: {
                type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
                allowNull: false,
                defaultValue: 'Pending',
            },
            employeeEmail: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: true,
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
            modelName: 'Request',
            tableName: 'Requests',
            timestamps: true,
        }
    );
    return Request;
}
