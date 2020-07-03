import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateDataBaseEntities1593682836812
  implements MigrationInterface {
  name = 'CreateDataBaseEntities1593682836812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "email" character varying NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "customers_pk" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "products" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying NOT NULL,
      "price" decimal(10, 2) NOT NULL,
      "quantity" integer NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "products_pk" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "orders_products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" uuid NOT NULL,
        "order_id" uuid NOT NULL,
        "price" decimal(10, 2) NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "ordersproducts_pk" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "customer_id" uuid,
        CONSTRAINT "orders_1_uk" UNIQUE ("customer_id"),
        CONSTRAINT "orders_pk" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products"
      ADD CONSTRAINT "ordersproducts_1_fk" FOREIGN KEY ("order_id")
      REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products"
      ADD CONSTRAINT "ordersproducts_2_fk" FOREIGN KEY ("product_id")
      REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders"
      ADD CONSTRAINT "orders_1_fk" FOREIGN KEY ("customer_id")
      REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "orders_1_fk"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "ordersproducts_2_fk"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_products" DROP CONSTRAINT "ordersproducts_1_fk"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "orders"`, undefined);
    await queryRunner.query(`DROP TABLE "orders_products"`, undefined);
    await queryRunner.query(`DROP TABLE "products"`, undefined);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
