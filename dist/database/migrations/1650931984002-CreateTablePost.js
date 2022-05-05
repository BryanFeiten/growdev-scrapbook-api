"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTablePost1650931984002 = void 0;
const typeorm_1 = require("typeorm");
class CreateTablePost1650931984002 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'post',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'int',
                    isNullable: false
                },
                {
                    name: 'post_header',
                    type: 'varchar',
                    length: '255',
                    isNullable: false
                },
                {
                    name: 'post_content',
                    type: 'text',
                    isNullable: false
                },
                {
                    name: 'post_privacity',
                    type: 'varchar',
                    length: '11',
                    isNullable: false
                },
            ],
            foreignKeys: [
                new typeorm_1.TableForeignKey({
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'user'
                }),
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('post', true, true, true);
    }
}
exports.CreateTablePost1650931984002 = CreateTablePost1650931984002;
