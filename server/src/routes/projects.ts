import { Router } from 'express';
import { db } from '../../../db/src/index';
import { projects, projectTranslations, galleries, amenities, unitTypes } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const lang = (req.query.lang as string) || 'en';
    
    // In a real app we'd join with translations
    const allProjects = await db.select({
      id: projects.id,
      slug: projects.slug,
      heroImage: projects.heroImage,
      categoryId: projects.categoryId,
      status: projects.status,
      title: projectTranslations.title,
      description: projectTranslations.description,
    }).from(projects)
      .leftJoin(projectTranslations, and(eq(projects.id, projectTranslations.projectId), eq(projectTranslations.language, lang)));
      
    res.json(allProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const lang = (req.query.lang as string) || 'en';

    const projectData = await db.select({
      id: projects.id,
      slug: projects.slug,
      heroImage: projects.heroImage,
      videoUrl: projects.videoUrl,
      masterplanImage: projects.masterplanImage,
      title: projectTranslations.title,
      description: projectTranslations.description,
      locationText: projectTranslations.locationText,
    }).from(projects)
      .leftJoin(projectTranslations, and(eq(projects.id, projectTranslations.projectId), eq(projectTranslations.language, lang)))
      .where(eq(projects.slug, slug))
      .limit(1);

    if (!projectData.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectData[0];

    // Fetch related data
    const projectGalleries = await db.select().from(galleries).where(eq(galleries.projectId, project.id));
    const projectAmenities = await db.select().from(amenities).where(eq(amenities.projectId, project.id));
    const projectUnitTypes = await db.select().from(unitTypes).where(eq(unitTypes.projectId, project.id));

    res.json({
      ...project,
      galleries: projectGalleries,
      amenities: projectAmenities,
      unitTypes: projectUnitTypes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;
