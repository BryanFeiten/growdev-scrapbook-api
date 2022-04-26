import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableUser1650931956460 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
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
                    name: 'first_name',
                    type: 'varchar',
                    length: '50',
                    isNullable: false
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '50',
                    isNullable: false
                },
                {
                    name: 'gender',
                    type: 'varchar',
                    length: '11',
                    isNullable: false
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '150',
                    isNullable: false
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '50',
                    isNullable: false
                },
                {
                    name: 'birth_date',
                    type: 'date',
                    isNullable: false
                },
            ],
        }));
    }
    //  age
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user', true, true, true);
    }

}
