import { NextRequest, NextResponse } from 'next/server';
import { getConnection, sql } from '@/lib/db';

type ProductRow = {
  Id: number;
  Name: string;
  CategoryName?: string | null;
  SubCategoryName?: string | null;
};

function createDescription(product: ProductRow): string {
  const name = product.Name?.trim() || 'Ürün';
  const category = product.SubCategoryName?.trim() || product.CategoryName?.trim() || 'yedek parça';

  const lowerName = name.toLocaleLowerCase('tr-TR');
  const isIveco = lowerName.includes('iveco');
  const isDucato = lowerName.includes('ducato') || lowerName.includes('fiat');
  const isFoton = lowerName.includes('foton');
  const isKaratas = lowerName.includes('karataş') || lowerName.includes('karatas');
  const isMutluAku = lowerName.includes('mutlu') || lowerName.includes('akü') || lowerName.includes('aku');

  let usageText = 'dayanıklı malzeme yapısıyla uzun ömürlü kullanım sunar.';
  if (isIveco) usageText = 'İveco araçlarda uyumlu çalışma ve yüksek performans için tercih edilir.';
  if (isDucato) usageText = 'Fiat Ducato modellerinde güvenilir kullanım ve düzgün çalışma sağlar.';
  if (isFoton) usageText = 'Foton traktörlerde zorlu koşullarda verimli çalışma desteği verir.';
  if (isKaratas) usageText = 'Karataş traktörlerde günlük kullanımda sağlam ve kararlı performans sağlar.';
  if (isMutluAku) usageText = 'aracınızın ilk çalıştırma gücünü ve elektrik dengesini destekler.';

  return `${name}, ${category} kategorisinde yer alan kaliteli bir üründür. Orijinal ve uyumlu alternatifleriyle hızlı tedarik edilir, ${usageText}`;
}

export async function POST(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (!process.env.ADMIN_SECRET_KEY || adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const limit = Math.max(1, Math.min(2000, Number(body?.limit ?? 1000)));
    const dryRun = Boolean(body?.dryRun);
    const statsOnly = Boolean(body?.statsOnly);
    const includeVeryShort = Boolean(body?.includeVeryShort);
    const shortThreshold = Math.max(1, Math.min(120, Number(body?.shortThreshold ?? 35)));

    const pool = await getConnection();
    if (statsOnly) {
      const stats = await pool.request().query(`
        SELECT
          COUNT(*) AS totalProducts,
          SUM(CASE WHEN Description IS NULL THEN 1 ELSE 0 END) AS nullDescriptions,
          SUM(CASE WHEN Description IS NOT NULL AND LTRIM(RTRIM(Description)) = '' THEN 1 ELSE 0 END) AS emptyDescriptions,
          SUM(CASE WHEN Description IS NOT NULL AND LEN(LTRIM(RTRIM(Description))) BETWEEN 1 AND 35 THEN 1 ELSE 0 END) AS veryShortDescriptions
        FROM Products
      `);

      return NextResponse.json({
        success: true,
        stats: stats.recordset?.[0] ?? null,
      });
    }

    const productResult = await pool
      .request()
      .input('limit', sql.Int, limit)
      .input('includeVeryShort', sql.Bit, includeVeryShort)
      .input('shortThreshold', sql.Int, shortThreshold)
      .query(`
      SELECT TOP (@limit)
        p.Id,
        p.Name,
        c.Name AS CategoryName,
        sc.Name AS SubCategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryId = c.Id
      LEFT JOIN Categories sc ON p.SubCategoryId = sc.Id
      WHERE
        p.Description IS NULL
        OR LTRIM(RTRIM(p.Description)) = ''
        OR (
          @includeVeryShort = 1
          AND LEN(LTRIM(RTRIM(p.Description))) BETWEEN 1 AND @shortThreshold
        )
      ORDER BY p.Id ASC
    `);

    const rows = productResult.recordset as ProductRow[];
    const prepared = rows.map((row) => ({
      id: row.Id,
      name: row.Name,
      description: createDescription(row),
    }));

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        totalFound: rows.length,
        sample: prepared.slice(0, 10),
      });
    }

    let updated = 0;
    for (const item of prepared) {
      const result = await pool
        .request()
        .input('id', sql.Int, item.id)
        .input('description', sql.NVarChar(sql.MAX), item.description)
        .input('includeVeryShort', sql.Bit, includeVeryShort)
        .input('shortThreshold', sql.Int, shortThreshold)
        .query(`
          UPDATE Products
          SET Description = @description
          WHERE Id = @id
            AND (
              Description IS NULL
              OR LTRIM(RTRIM(Description)) = ''
              OR (
                @includeVeryShort = 1
                AND LEN(LTRIM(RTRIM(Description))) BETWEEN 1 AND @shortThreshold
              )
            )
        `);
      updated += result.rowsAffected[0] || 0;
    }

    return NextResponse.json({
      success: true,
      totalFound: rows.length,
      updated,
      sample: prepared.slice(0, 10),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
