import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class  $npmConfigName1742563492836 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       const accountant = await queryRunner.hasTable("accountant");
       if(!accountant) {
        await queryRunner.createTable(
            new Table({
                name: "accountant",
                columns: [
                    {name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment"},
                    {name: "username", type: "character varying(50)" , isNullable: false, isUnique: true},
                    {name: "password",type: "character varying(100)" , isNullable: false},
                    {name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP"},
                    {name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"}

                ]
            })
        )
       }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("accountant", true);
    }

}
