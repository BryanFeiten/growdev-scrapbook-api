"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableUser1650931956460 = void 0;
const typeorm_1 = require("typeorm");
class CreateTableUser1650931956460 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    isNullable: false,
                },
                {
                    name: 'username',
                    type: 'varchar',
                    length: '50',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'full_name',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'gender',
                    type: 'varchar',
                    length: '11',
                    isNullable: false,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '150',
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '70',
                    isNullable: false,
                },
                {
                    name: 'birth_date',
                    type: 'date',
                    isNullable: false,
                },
                {
                    name: 'auto_token',
                    type: 'varchar',
                    length: '100',
                    isNullable: true,
                },
                {
                    name: 'sign_token',
                    type: 'varchar',
                    length: '255',
                    isNullable: true
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('user', true, true, true);
    }
}
exports.CreateTableUser1650931956460 = CreateTableUser1650931956460;
