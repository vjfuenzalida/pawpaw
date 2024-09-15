import 'server-only';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import {
  pgTable,
  text,
  integer,
  timestamp,
  pgEnum,
  serial,
  uuid
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(sql);

// Define an enum for pet types (example: dog, cat)
export const petTypeEnum = pgEnum("pet_type", ["dog", "cat", "bird", "other"]);

// Owners table
export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Walkers table
export const walkers = pgTable("walkers", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Pets table with pet type enum
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id")
    .references(() => owners.id)
    .notNull(),
  name: text("name").notNull(),
  type: petTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type for selecting pets
export type SelectPet = typeof pets.$inferSelect;

// Schema for inserting a pet
export const insertPetSchema = createInsertSchema(pets);

// Fetch pets based on a search string
export async function getPets(
  search: string,
  offset: number
): Promise<{
  pets: SelectPet[];
  newOffset: number | null;
  totalPets: number;
}> {
  // Search pets by name using ilike for case-insensitive search
  if (search) {
    return {
      pets: await db
        .select()
        .from(pets)
        .where(ilike(pets.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalPets: 0,
    };
  }

  if (offset === null) {
    return { pets: [], newOffset: null, totalPets: 0 };
  }

  const totalPets = await db.select({ count: count() }).from(pets);
  const morePets = await db.select().from(pets).limit(5).offset(offset);
  const newOffset = morePets.length >= 5 ? offset + 5 : null;

  return {
    pets: morePets,
    newOffset,
    totalPets: totalPets[0].count,
  };
}

// Delete a pet by ID
export async function deletePetById(id: number) {
  await db.delete(pets).where(eq(pets.id, id));
}

// Fetch all owners (useful for selecting owners when inserting pets)
export async function getOwners() {
  return await db.select().from(owners);
}

// Fetch all walkers (useful for fetching walker data)
export async function getWalkers() {
  return await db.select().from(walkers);
}
