// src/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import usersController from './users/users.controller';
import departmentsController from './department/department.controller';
import employeesController from './employee/employee.controller';
import requestsController from './request/request.controller';
import transfersController from './transfer/transfer.controller';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', usersController);
app.use('/departments', departmentsController);
app.use('/employees', employeesController);
app.use('/requests', requestsController);
app.use('/transfers', transfersController);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Test with: POST /user with { email, password, ...}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });