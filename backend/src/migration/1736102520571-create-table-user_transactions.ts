import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUserTransactions1736102520571
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE user_transactions (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                transaction_id INT NOT NULL,
                data DATE NOT NULL,
                valor DECIMAL(15, 2) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (transaction_id) REFERENCES transaction(id)
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.user_transactions`);
    }
}
