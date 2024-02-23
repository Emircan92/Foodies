import { S3 } from '@aws-sdk/client-s3';

import fs from 'node:fs';

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const s3 = new S3({
  region: 'eu-central-1',
});

const db = sql('meals.db');

export async function getMeals() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
  const stmt = db.prepare(
    'INSERT INTO meals (title, summary, instructions, image, creator, creator_email, slug) VALUES (@title, @summary, @instructions, @image, @creator, @creator_email, @slug)'
  );

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  s3.putObject({
    Bucket: 'emircan-kucukmotor-foodies',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  stmt.run(meal);
}
