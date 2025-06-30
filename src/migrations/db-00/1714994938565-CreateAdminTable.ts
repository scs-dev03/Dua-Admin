import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAdminTable1714994938565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'admins',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '150',
                    isUnique: true,
                },
                {
                    name: 'mobile',
                    type: 'bigint',
                    unsigned: true,
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '150',
                    isNullable: false,
                }
            ],
            indices: [
                {
                    columnNames: ['email'],
                    isUnique: true
                },
                {
                    columnNames: ['mobile'],
                    isUnique: true
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('admins')
    }

}
