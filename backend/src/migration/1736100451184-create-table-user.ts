import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1736100451184 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
           CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            cpf_cnpj VARCHAR(18) NOT NULL UNIQUE
        );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE public.users;
        `);
    }
}
