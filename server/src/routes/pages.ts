import { Router } from 'express';
import { db } from '../../../db/src/index';
import { pages, pageTranslations } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const lang = (req.query.lang as string) || 'en';

    const pageData = await db.select({
      id: pages.id,
      slug: pages.slug,
      title: pageTranslations.title,
      content: pageTranslations.content,
    }).from(pages)
      .leftJoin(pageTranslations, and(eq(pages.id, pageTranslations.pageId), eq(pageTranslations.language, lang)))
      .where(eq(pages.slug, slug))
      .limit(1);

    if (!pageData.length) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(pageData[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

export default router;
