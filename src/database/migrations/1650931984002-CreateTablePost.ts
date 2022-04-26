import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTablePost1650931984002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
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
                new TableForeignKey({
                    columnNames: ['user_id'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'user'
                }),
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('post', true, true, true);
    }

}
