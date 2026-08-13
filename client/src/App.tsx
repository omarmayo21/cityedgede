import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import { useElementorAnimations } from './hooks/useElementorAnimations';
import { useElementorSliders } from './hooks/useElementorSliders';
import { useElementorCounters } from './hooks/useElementorCounters';
import { useProjectFilters } from './hooks/useProjectFilters';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import VirtualTour from './pages/VirtualTour';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactFormModal from './components/ContactFormModal';
import { useLocationFilter } from './hooks/useLocationFilter';

// Map routes to WordPress body classes (elementor-page-{postId})
// Required so theme.min.css removes max-width:1140px from .site-main
const ROUTE_BODY_CLASSES: Record<string, string> = {
  '/': 'page-id-6996 elementor-page-6996',
  '/about-us': 'page-id-14 elementor-page-14',
  '/virtual-tour': 'page-id-22 elementor-page-22',
  '/location/new-cairo-city': 'archive tax-location term-new-cairo-city-en term-7 wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2075 elementor-template-full-width',
  '/location/sheikh-zayed-city': 'archive tax-location term-sheikh-zayed-city-en term-15 wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2075 elementor-template-full-width',
  '/location/new-alamein-city': 'archive tax-location term-new-alamein-city-en term-13 wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2075 elementor-template-full-width',
  '/location/new-capital-city': 'archive tax-location term-new-capital-city-en term-14 wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2075 elementor-template-full-width',
  '/location/new-mansoura-city': 'archive tax-location term-new-mansoura-city-en term-16 wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2075 elementor-template-full-width',
  '/location/maspero-triangle': 'archive tax-location term-maspero-triangle-en term-17 wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2075 elementor-template-full-width',
};

const BASE_BODY_CLASSES = 'wp-embed-responsive elementor-default elementor-kit-7';

const PROJECT_BODY_CLASSES: Record<string, string> = {
  '/project/almaqsad-park': 'postid-3884',
  '/project/almaqsad-residences': 'postid-3818',
  '/project/etapa': 'postid-3336',
  '/project/north-edge': 'postid-4002',
  '/project/v40': 'postid-4724',
};

import { lazy, Suspense } from 'react';
const ProjectAlmaqsadPark = lazy(() => import('./pages/ProjectAlmaqsadPark'));
const ProjectAlmaqsadResidences = lazy(() => import('./pages/ProjectAlmaqsadResidences'));
const ProjectAlmaqsadVillas = lazy(() => import('./pages/ProjectAlmaqsadVillas'));
const ProjectAreej = lazy(() => import('./pages/ProjectAreej'));
const ProjectArjan = lazy(() => import('./pages/ProjectArjan'));
const ProjectBeachfrontTower = lazy(() => import('./pages/ProjectBeachfrontTower'));
const ProjectCentria = lazy(() => import('./pages/ProjectCentria'));
const ProjectDowntown = lazy(() => import('./pages/ProjectDowntown'));
const ProjectDowntownCommercial = lazy(() => import('./pages/ProjectDowntownCommercial'));
const ProjectEtapa = lazy(() => import('./pages/ProjectEtapa'));
const ProjectEtapaSquare = lazy(() => import('./pages/ProjectEtapaSquare'));
const ProjectGardenCityHeights = lazy(() => import('./pages/ProjectGardenCityHeights'));
const ProjectJadePark = lazy(() => import('./pages/ProjectJadePark'));
const ProjectLatinCity = lazy(() => import('./pages/ProjectLatinCity'));
const ProjectLushValley = lazy(() => import('./pages/ProjectLushValley'));
const ProjectMamshaAlmaqsad = lazy(() => import('./pages/ProjectMamshaAlmaqsad'));
const ProjectMamshaAvenue = lazy(() => import('./pages/ProjectMamshaAvenue'));
const ProjectMamshaCentral = lazy(() => import('./pages/ProjectMamshaCentral'));
const ProjectMamshaDistrict = lazy(() => import('./pages/ProjectMamshaDistrict'));
const ProjectMamshaGardens = lazy(() => import('./pages/ProjectMamshaGardens'));
const ProjectMamshaViews = lazy(() => import('./pages/ProjectMamshaViews'));
const ProjectMamshaVista = lazy(() => import('./pages/ProjectMamshaVista'));
const ProjectMarjan = lazy(() => import('./pages/ProjectMarjan'));
const ProjectMasperoBusinessTowers = lazy(() => import('./pages/ProjectMasperoBusinessTowers'));
const ProjectMasperoMall = lazy(() => import('./pages/ProjectMasperoMall'));
const ProjectMasperoMetropolis = lazy(() => import('./pages/ProjectMasperoMetropolis'));
const ProjectMasperoNileHeights = lazy(() => import('./pages/ProjectMasperoNileHeights'));
const ProjectMazarineApartments = lazy(() => import('./pages/ProjectMazarineApartments'));
const ProjectMazarineBoulevard = lazy(() => import('./pages/ProjectMazarineBoulevard'));
const ProjectMazarineHub = lazy(() => import('./pages/ProjectMazarineHub'));
const ProjectMazarineIslands = lazy(() => import('./pages/ProjectMazarineIslands'));
const ProjectMazarineRiaChalets = lazy(() => import('./pages/ProjectMazarineRiaChalets'));
const ProjectMazarineRiaVillas = lazy(() => import('./pages/ProjectMazarineRiaVillas'));
const ProjectMazarineTheChalets = lazy(() => import('./pages/ProjectMazarineTheChalets'));
const ProjectMazarineTownhouses = lazy(() => import('./pages/ProjectMazarineTownhouses'));
const ProjectMazarineVillas = lazy(() => import('./pages/ProjectMazarineVillas'));
const ProjectMisque = lazy(() => import('./pages/ProjectMisque'));
const ProjectNorthEdge = lazy(() => import('./pages/ProjectNorthEdge'));
const ProjectNorthEdgeCabanas = lazy(() => import('./pages/ProjectNorthEdgeCabanas'));
const ProjectNorthSquareMall = lazy(() => import('./pages/ProjectNorthSquareMall'));
const ProjectRiseville = lazy(() => import('./pages/ProjectRiseville'));
const ProjectTheGateTowers = lazy(() => import('./pages/ProjectTheGateTowers'));
const ProjectV40 = lazy(() => import('./pages/ProjectV40'));
const ProjectV40District = lazy(() => import('./pages/ProjectV40District'));
const ProjectVerandas = lazy(() => import('./pages/ProjectVerandas'));
const LocationNewCairoCity = lazy(() => import('./pages/LocationNewCairoCity'));
const LocationSheikhZayedCity = lazy(() => import('./pages/LocationSheikhZayedCity'));
const LocationNewAlameinCity = lazy(() => import('./pages/LocationNewAlameinCity'));
const LocationNewCapitalCity = lazy(() => import('./pages/LocationNewCapitalCity'));
const LocationNewMansouraCity = lazy(() => import('./pages/LocationNewMansouraCity'));
const LocationMasperoTriangle = lazy(() => import('./pages/LocationMasperoTriangle'));

import { useMainProjectFilter } from './hooks/useMainProjectFilter';
import { useImageMapInteractions } from './hooks/useImageMapInteractions';
import PageTransition from './components/PageTransition';
import ProjectPageContentAdjustments from './components/ProjectPageContentAdjustments';

function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  useElementorAnimations();
  useElementorSliders();
  useElementorCounters();
  useProjectFilters();
  useLocationFilter();
  useMainProjectFilter();
  useImageMapInteractions();

  const location = useLocation();

  // Apply WordPress body classes per route.
  // Critical: theme.min.css rule `body:not([class*="elementor-page-"]) .site-main { max-width:1140px }`
  // requires the body to have class="elementor-page-{id}" for full-width Elementor layout.
  useEffect(() => {
    let routeClasses = ROUTE_BODY_CLASSES[location.pathname] || '';

    if (location.pathname.startsWith('/project/')) {
      const projectClasses = PROJECT_BODY_CLASSES[location.pathname] || '';
      routeClasses += ` wp-singular project-template-default single single-project ${projectClasses} wp-custom-logo wp-theme-hello-elementor hello-elementor-default elementor-page-2119`;
    }

    // Build class list — ALWAYS include 'complete' to prevent preloader-plus CSS
    // from hiding page content (body > :not(.preloader-plus) { opacity: 0 }).
    // Without 'complete', every route change would blank the page.
    const classes = [BASE_BODY_CLASSES, routeClasses, 'complete']
      .filter(Boolean)
      .join(' ')
      .trim();

    document.body.className = classes;
    document.body.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, [location.pathname]);

  // Immediately ensure body has complete class on first mount too
  useEffect(() => {
    document.body.classList.add('complete');
  }, []);

  return (
    <>
      <PageTransition />
      <Header onContactClick={() => setIsContactModalOpen(true)} />
      <ProjectPageContentAdjustments pathname={location.pathname} />
      <Suspense fallback={<div className="preloader-plus complete">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />
        <Route path="/project/almaqsad-park" element={<ProjectAlmaqsadPark />} />
        <Route path="/project/almaqsad-residences" element={<ProjectAlmaqsadResidences />} />
        <Route path="/project/almaqsad-villas" element={<ProjectAlmaqsadVillas />} />
        <Route path="/project/areej" element={<ProjectAreej />} />
        <Route path="/project/arjan" element={<ProjectArjan />} />
        <Route path="/project/beachfront-tower" element={<ProjectBeachfrontTower />} />
        <Route path="/project/centria" element={<ProjectCentria />} />
        <Route path="/project/downtown" element={<ProjectDowntown />} />
        <Route path="/project/downtown-commercial" element={<ProjectDowntownCommercial />} />
        <Route path="/project/etapa" element={<ProjectEtapa />} />
        <Route path="/project/etapa-square" element={<ProjectEtapaSquare />} />
        <Route path="/project/garden-city-heights" element={<ProjectGardenCityHeights />} />
        <Route path="/project/jade-park" element={<ProjectJadePark />} />
        <Route path="/project/latin-city" element={<ProjectLatinCity />} />
        <Route path="/project/lush-valley" element={<ProjectLushValley />} />
        <Route path="/project/mamsha-almaqsad" element={<ProjectMamshaAlmaqsad />} />
        <Route path="/project/mamsha-avenue" element={<ProjectMamshaAvenue />} />
        <Route path="/project/mamsha-central" element={<ProjectMamshaCentral />} />
        <Route path="/project/mamsha-district" element={<ProjectMamshaDistrict />} />
        <Route path="/project/mamsha-gardens" element={<ProjectMamshaGardens />} />
        <Route path="/project/mamsha-views" element={<ProjectMamshaViews />} />
        <Route path="/project/mamsha-vista" element={<ProjectMamshaVista />} />
        <Route path="/project/marjan" element={<ProjectMarjan />} />
        <Route path="/project/maspero-business-towers" element={<ProjectMasperoBusinessTowers />} />
        <Route path="/project/maspero-mall" element={<ProjectMasperoMall />} />
        <Route path="/project/maspero-metropolis" element={<ProjectMasperoMetropolis />} />
        <Route path="/project/maspero-nile-heights" element={<ProjectMasperoNileHeights />} />
        <Route path="/project/mazarine-apartments" element={<ProjectMazarineApartments />} />
        <Route path="/project/mazarine-boulevard" element={<ProjectMazarineBoulevard />} />
        <Route path="/project/mazarine-hub" element={<ProjectMazarineHub />} />
        <Route path="/project/mazarine-islands" element={<ProjectMazarineIslands />} />
        <Route path="/project/mazarine-ria-chalets" element={<ProjectMazarineRiaChalets />} />
        <Route path="/project/mazarine-ria-villas" element={<ProjectMazarineRiaVillas />} />
        <Route path="/project/mazarine-the-chalets" element={<ProjectMazarineTheChalets />} />
        <Route path="/project/mazarine-townhouses" element={<ProjectMazarineTownhouses />} />
        <Route path="/project/mazarine-villas" element={<ProjectMazarineVillas />} />
        <Route path="/project/misque" element={<ProjectMisque />} />
        <Route path="/project/north-edge" element={<ProjectNorthEdge />} />
        <Route path="/project/north-edge-cabanas" element={<ProjectNorthEdgeCabanas />} />
        <Route path="/project/north-square-mall" element={<ProjectNorthSquareMall />} />
        <Route path="/project/riseville" element={<ProjectRiseville />} />
        <Route path="/project/the-gate-towers" element={<ProjectTheGateTowers />} />
        <Route path="/project/v40" element={<ProjectV40 />} />
        <Route path="/project/v40-district" element={<ProjectV40District />} />
        <Route path="/project/verandas" element={<ProjectVerandas />} />
        <Route path="/location/new-cairo-city" element={<LocationNewCairoCity />} />
        <Route path="/location/sheikh-zayed-city" element={<LocationSheikhZayedCity />} />
        <Route path="/location/new-alamein-city" element={<LocationNewAlameinCity />} />
        <Route path="/location/new-capital-city" element={<LocationNewCapitalCity />} />
        <Route path="/location/new-mansoura-city" element={<LocationNewMansouraCity />} />
        <Route path="/location/maspero-triangle" element={<LocationMasperoTriangle />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      <Footer />
      <ContactFormModal open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}

export default App;
