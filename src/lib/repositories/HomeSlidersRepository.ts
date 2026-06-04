import { unstable_cache } from 'next/cache';
import { getConnection, sql } from '../db';
import { CACHE_REVALIDATE, CACHE_TAGS } from '../cache';
import { CreateHomeSliderDto, HomeSlider, UpdateHomeSliderDto } from '../models/HomeSlider';
import { HOME_SLIDER_DEFAULTS } from '../homeSliderDefaults';

class HomeSlidersRepository {
  private static async ensureTable(): Promise<void> {
    const pool = await getConnection();
    await pool.request().query(`
      IF OBJECT_ID('dbo.HomeSliders', 'U') IS NULL
      BEGIN
        CREATE TABLE dbo.HomeSliders (
          Id INT IDENTITY(1,1) PRIMARY KEY,
          Title NVARCHAR(200) NOT NULL,
          Subtitle NVARCHAR(250) NOT NULL,
          Description NVARCHAR(500) NOT NULL,
          ImageUrl NVARCHAR(500) NOT NULL,
          CloudinaryPublicId NVARCHAR(200) NOT NULL,
          ButtonText NVARCHAR(120) NOT NULL,
          ButtonLink NVARCHAR(300) NOT NULL,
          SortOrder INT NOT NULL DEFAULT 0,
          IsActive BIT NOT NULL DEFAULT 1,
          CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
        );
      END
    `);
    await this.seedDefaultsIfEmpty();
  }

  private static async seedDefaultsIfEmpty(): Promise<void> {
    const pool = await getConnection();
    const countResult = await pool.request().query('SELECT COUNT(*) AS total FROM HomeSliders');
    const total = Number(countResult.recordset?.[0]?.total || 0);

    if (total > 0) return;

    for (const item of HOME_SLIDER_DEFAULTS) {
      await pool
        .request()
        .input('title', sql.NVarChar(200), item.title)
        .input('subtitle', sql.NVarChar(250), item.subtitle)
        .input('description', sql.NVarChar(500), item.description)
        .input('imageUrl', sql.NVarChar(500), item.image)
        .input('cloudinaryPublicId', sql.NVarChar(200), `legacy-${item.sortOrder}`)
        .input('buttonText', sql.NVarChar(120), item.buttonText)
        .input('buttonLink', sql.NVarChar(300), item.buttonLink)
        .input('sortOrder', sql.Int, item.sortOrder)
        .input('isActive', sql.Bit, true)
        .query(`
          INSERT INTO HomeSliders (
            Title, Subtitle, Description, ImageUrl, CloudinaryPublicId,
            ButtonText, ButtonLink, SortOrder, IsActive, CreatedAt
          )
          VALUES (
            @title, @subtitle, @description, @imageUrl, @cloudinaryPublicId,
            @buttonText, @buttonLink, @sortOrder, @isActive, GETDATE()
          )
        `);
    }
  }

  static async findAll(): Promise<HomeSlider[]> {
    return unstable_cache(
      async () => {
        await this.ensureTable();
        const pool = await getConnection();
        const result = await pool
          .request()
          .query('SELECT * FROM HomeSliders ORDER BY SortOrder ASC, Id DESC');
        return result.recordset;
      },
      ['home-sliders-all'],
      { tags: [CACHE_TAGS.HOME_SLIDERS], revalidate: CACHE_REVALIDATE.SLIDERS }
    )();
  }

  static async findActive(): Promise<HomeSlider[]> {
    return unstable_cache(
      async () => {
        const pool = await getConnection();
        const result = await pool
          .request()
          .query(
            'SELECT * FROM HomeSliders WHERE IsActive = 1 ORDER BY SortOrder ASC, Id DESC',
          );
        return result.recordset as HomeSlider[];
      },
      ['home-sliders-active'],
      { tags: [CACHE_TAGS.HOME_SLIDERS], revalidate: CACHE_REVALIDATE.SLIDERS },
    )();
  }

  static async findById(id: number): Promise<HomeSlider | null> {
    await this.ensureTable();
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM HomeSliders WHERE Id = @id');
    return result.recordset[0] || null;
  }

  static async create(data: CreateHomeSliderDto): Promise<HomeSlider> {
    await this.ensureTable();
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('title', sql.NVarChar(200), data.Title)
      .input('subtitle', sql.NVarChar(250), data.Subtitle)
      .input('description', sql.NVarChar(500), data.Description)
      .input('imageUrl', sql.NVarChar(500), data.ImageUrl)
      .input('cloudinaryPublicId', sql.NVarChar(200), data.CloudinaryPublicId)
      .input('buttonText', sql.NVarChar(120), data.ButtonText)
      .input('buttonLink', sql.NVarChar(300), data.ButtonLink)
      .input('sortOrder', sql.Int, data.SortOrder ?? 0)
      .input('isActive', sql.Bit, data.IsActive ?? true)
      .query(`
        INSERT INTO HomeSliders (
          Title, Subtitle, Description, ImageUrl, CloudinaryPublicId,
          ButtonText, ButtonLink, SortOrder, IsActive, CreatedAt
        )
        OUTPUT INSERTED.*
        VALUES (
          @title, @subtitle, @description, @imageUrl, @cloudinaryPublicId,
          @buttonText, @buttonLink, @sortOrder, @isActive, GETDATE()
        )
      `);
    return result.recordset[0];
  }

  static async update(id: number, data: UpdateHomeSliderDto): Promise<HomeSlider | null> {
    await this.ensureTable();
    const updates: string[] = [];
    const request = (await getConnection()).request();

    if (data.Title !== undefined) {
      updates.push('Title = @title');
      request.input('title', sql.NVarChar(200), data.Title);
    }
    if (data.Subtitle !== undefined) {
      updates.push('Subtitle = @subtitle');
      request.input('subtitle', sql.NVarChar(250), data.Subtitle);
    }
    if (data.Description !== undefined) {
      updates.push('Description = @description');
      request.input('description', sql.NVarChar(500), data.Description);
    }
    if (data.ImageUrl !== undefined) {
      updates.push('ImageUrl = @imageUrl');
      request.input('imageUrl', sql.NVarChar(500), data.ImageUrl);
    }
    if (data.CloudinaryPublicId !== undefined) {
      updates.push('CloudinaryPublicId = @cloudinaryPublicId');
      request.input('cloudinaryPublicId', sql.NVarChar(200), data.CloudinaryPublicId);
    }
    if (data.ButtonText !== undefined) {
      updates.push('ButtonText = @buttonText');
      request.input('buttonText', sql.NVarChar(120), data.ButtonText);
    }
    if (data.ButtonLink !== undefined) {
      updates.push('ButtonLink = @buttonLink');
      request.input('buttonLink', sql.NVarChar(300), data.ButtonLink);
    }
    if (data.SortOrder !== undefined) {
      updates.push('SortOrder = @sortOrder');
      request.input('sortOrder', sql.Int, data.SortOrder);
    }
    if (data.IsActive !== undefined) {
      updates.push('IsActive = @isActive');
      request.input('isActive', sql.Bit, data.IsActive);
    }

    if (updates.length === 0) return null;

    request.input('id', sql.Int, id);
    const result = await request.query(`
      UPDATE HomeSliders
      SET ${updates.join(', ')}
      OUTPUT INSERTED.*
      WHERE Id = @id
    `);
    return result.recordset[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    await this.ensureTable();
    const result = await (await getConnection())
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM HomeSliders WHERE Id = @id');
    return result.rowsAffected[0] > 0;
  }
}

export default HomeSlidersRepository;
