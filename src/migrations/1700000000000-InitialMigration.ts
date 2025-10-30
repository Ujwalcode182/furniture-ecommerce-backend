import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "public"`);
    await queryRunner.query(`SET search_path TO "public"`);
    
    await queryRunner.query(`
      CREATE TABLE "public"."users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "email" varchar UNIQUE NOT NULL,
        "address" varchar NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."furniture" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "description" text NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "images" text[] NOT NULL,
        "width" decimal(10,2) NOT NULL,
        "height" decimal(10,2) NOT NULL,
        "depth" decimal(10,2) NOT NULL,
        "category" varchar NOT NULL,
        "inStock" boolean DEFAULT true,
        "stockQuantity" integer DEFAULT 0,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "totalAmount" decimal(10,2) NOT NULL,
        "status" varchar DEFAULT 'pending',
        "shippingAddress" varchar NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_orders_user" FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."order_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL,
        "furnitureId" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_order_items_order" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_items_furniture" FOREIGN KEY ("furnitureId") REFERENCES "public"."furniture"("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "public"."reviews" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "furnitureId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "rating" integer NOT NULL,
        "comment" text NOT NULL,
        "createdAt" timestamp DEFAULT now(),
        "updatedAt" timestamp DEFAULT now(),
        CONSTRAINT "FK_reviews_furniture" FOREIGN KEY ("furnitureId") REFERENCES "public"."furniture"("id"),
        CONSTRAINT "FK_reviews_user" FOREIGN KEY ("userId") REFERENCES "public"."users"("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "public"."users" ("id", "name", "email", "address") VALUES
      ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', '123 Main St'),
      ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '456 Oak Ave')
    `);

    await queryRunner.query(`
      INSERT INTO "public"."furniture" ("id", "name", "description", "price", "images", "width", "height", "depth", "category", "inStock", "stockQuantity") VALUES
      ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Modern Sofa', 'Comfortable 3-seater sofa with soft cushions', 899.99, ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'], 220, 90, 95, 'Sofas', true, 10),
      ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Wooden Dining Table', 'Elegant 6-seater dining table made from oak wood', 1299.99, ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'], 180, 75, 90, 'Tables', true, 5),
      ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Ergonomic Office Chair', 'Adjustable office chair with lumbar support', 499.99, ARRAY['https://images.unsplash.com/photo-1549497538-303791108f95?w=800', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'], 65, 120, 70, 'Chairs', true, 15),
      ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'King Size Bed Frame', 'Stylish bed frame with storage drawers', 1599.99, ARRAY['https://images.unsplash.com/photo-1631889993954-24a9fadddfb9?w=800', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'], 200, 180, 220, 'Beds', true, 8),
      ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Coffee Table', 'Modern glass and metal coffee table', 349.99, ARRAY['https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'], 120, 45, 60, 'Tables', true, 12)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."reviews"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."order_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."furniture"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "public"."users"`);
  }
}

