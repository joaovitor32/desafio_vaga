import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTransaction1736096498728 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE transaction (
                id SERIAL PRIMARY KEY,
                transaction_reference_id UUID
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.transaction;
        `);
    }
}
