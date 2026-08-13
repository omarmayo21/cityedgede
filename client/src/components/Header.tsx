import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─── Navigation data ───────────────────────────────────────────────────────────
const CED_DEVELOPMENTS = [
  { label: 'New Cairo City',    slug: 'new-cairo-city' },
  { label: 'Sheikh Zayed City', slug: 'sheikh-zayed-city' },
];

const CED_PROJECTS = [
  { label: 'New Alamein City',  slug: 'new-alamein-city' },
  { label: 'New Capital City',  slug: 'new-capital-city' },
  { label: 'New Mansoura City', slug: 'new-mansoura-city' },
  { label: 'Maspero Triangle',  slug: 'maspero-triangle' },
];

// Destination slugs map to /location/{slug} routes
const getDestinationHref = (slug: string) => `/location/${slug}`;


// ─── Caret SVG ─────────────────────────────────────────────────────────────────
function CaretDown({ size = 10, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg className="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"
      width={size} height={size} style={{ fill: color, marginLeft: 4, flexShrink: 0 }}>
      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
    </svg>
  );
}

// ─── Flyout hook ───────────────────────────────────────────────────────────────
function useHover(delay = 100) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const onLeave = () => { timer.current = setTimeout(() => setOpen(false), delay); };

  return { open, onEnter, onLeave };
}

// ─── Main Header ───────────────────────────────────────────────────────────────
export default function Header({ onContactClick }: { onContactClick?: () => void }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);
  const [mobileCedDev, setMobileCedDev] = useState(false);
  const [mobileCedProj, setMobileCedProj] = useState(false);

  // Desktop hover state
  const dest = useHover();
  const cedDev = useHover();
  const cedProj = useHover();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path || location.pathname === path + '/';

  return (
    <>
      {/* ── Preloader ─────────────────────────────────────────────────────── */}
      <div className="imp-tooltips-container" data-image-map-id="6c1d3f3b-8242-4be0-8086-0f910a42a55c" />
      <div className="preloader-plus complete">
        <div className="prog-bar-wrapper">
          <div className="prog-bar-bg" />
          <div className="prog-bar" />
        </div>
        <div className="preloader-content">
          <img className="preloader-custom-img" src="/wp-content/uploads/2025/09/logo.svg" alt="City Edge" />
        </div>
      </div>

      {/* ── GTM noscript ──────────────────────────────────────────────────── */}
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MLDFRZR" height={0} width={0} />
      </noscript>

      <a className="skip-link screen-reader-text" href="#content">Skip to content</a>

      {/* ── Elementor Header wrapper ───────────────────────────────────────── */}
      <div
        data-elementor-type="header"
        data-elementor-id="38"
        className="elementor elementor-38 elementor-location-header"
        data-elementor-post-type="elementor_library"
      >
        {/* Outer container */}
        <div className="has_eae_slider elementor-element elementor-element-6504ca3 e-flex e-con-boxed e-con e-parent e-lazyloaded"
          data-id="6504ca3" data-element_type="container">
          <div className="e-con-inner">

            {/* Logo column */}
            <div className="has_eae_slider elementor-element elementor-element-db34e2c e-con-full e-flex e-con e-child"
              data-id="db34e2c" data-element_type="container">
              <div className="elementor-element elementor-element-9084e82 elementor-widget elementor-widget-theme-site-logo elementor-widget-image"
                data-id="9084e82" data-element_type="widget" data-widget_type="theme-site-logo.default">
                <div className="elementor-widget-container">
                  <Link to="/">
                    <img width={108} height={141} src="/wp-content/uploads/2025/05/logo-1.svg"
                      className="attachment-full size-full wp-image-5483" alt="City Edge Developments" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Nav column (mobile lang switcher + main menu) */}
            <div className="has_eae_slider elementor-element elementor-element-cec3a5f e-con-full e-flex e-con e-child"
              data-id="cec3a5f" data-element_type="container">

              {/* ─── DESKTOP MAIN MENU ─────────────────────────────────────── */}
              <div className="elementor-element elementor-element-75a7462 elementor-nav-menu__align-center elementor-nav-menu--stretch elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu"
                data-id="75a7462" data-element_type="widget" data-widget_type="nav-menu.default">
                <div className="elementor-widget-container">
                  <nav aria-label="Menu" className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-fade">
                    <ul id="menu-1-75a7462" className="elementor-nav-menu" data-smartmenus-id="1786294048174213">

                      {/* Home */}
                      <li className={`menu-item menu-item-type-post_type menu-item-object-page${isActive('/') ? ' current-menu-item' : ''} menu-item-7064`}>
                        <Link to="/" className={`elementor-item${isActive('/') ? ' elementor-item-active' : ''}`}>Home</Link>
                      </li>

                      {/* About us */}
                      <li className={`menu-item menu-item-type-post_type menu-item-object-page${isActive('/about-us') ? ' current-menu-item' : ''} menu-item-25`}>
                        <Link to="/about-us" className={`elementor-item${isActive('/about-us') ? ' elementor-item-active' : ''}`}>About us</Link>
                      </li>

                      {/* ── Destinations flyout ─────────────────────────── */}
                      <li
                        className={`menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-30 desktop-dropdown-parent ${dest.open ? 'is-active' : ''}`}
                        onMouseEnter={dest.onEnter}
                        onMouseLeave={dest.onLeave}
                      >
                        <a href="#" className="elementor-item elementor-item-anchor has-submenu"
                          onClick={e => e.preventDefault()}
                          aria-haspopup="true"
                          aria-expanded={dest.open}>
                          Destinations
                          <span className="sub-arrow"><CaretDown /></span>
                        </a>

                        {/* Level-1 dropdown */}
                        <ul className="sub-menu elementor-nav-menu--dropdown desktop-dropdown-menu">
                          {/* ── CED Developments ───────────────────────── */}
                          <li
                            className={`menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-5435 desktop-dropdown-parent ${cedDev.open ? 'is-active' : ''}`}
                            onMouseEnter={cedDev.onEnter}
                            onMouseLeave={cedDev.onLeave}
                          >
                            <a href="#" className="elementor-sub-item elementor-item-anchor has-submenu"
                              onClick={e => e.preventDefault()}
                              aria-haspopup="true"
                              aria-expanded={cedDev.open}>
                              CED Developments
                              <span className="sub-arrow"><CaretDown size={8} /></span>
                            </a>

                            {/* Level-2 CED Developments */}
                            <ul className="sub-menu elementor-nav-menu--dropdown desktop-dropdown-menu level-2">
                              {CED_DEVELOPMENTS.map(item => (
                                <li key={item.slug} className="menu-item menu-item-type-taxonomy menu-item-object-location">
                                  <Link to={getDestinationHref(item.slug)} className="elementor-sub-item">
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>

                          {/* ── CED Projects ───────────────────────────── */}
                          <li
                            className={`menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-5436 desktop-dropdown-parent ${cedProj.open ? 'is-active' : ''}`}
                            onMouseEnter={cedProj.onEnter}
                            onMouseLeave={cedProj.onLeave}
                          >
                            <a href="#" className="elementor-sub-item elementor-item-anchor has-submenu"
                              onClick={e => e.preventDefault()}
                              aria-haspopup="true"
                              aria-expanded={cedProj.open}>
                              CED Projects
                              <span className="sub-arrow"><CaretDown size={8} /></span>
                            </a>

                            {/* Level-2 CED Projects */}
                            <ul className="sub-menu elementor-nav-menu--dropdown desktop-dropdown-menu level-2">
                              {CED_PROJECTS.map(item => (
                                <li key={item.slug} className="menu-item menu-item-type-taxonomy menu-item-object-location">
                                  <Link to={getDestinationHref(item.slug)} className="elementor-sub-item">
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      </li>

                      {/* Virtual Tour */}
                      <li className={`vrcon menu-item menu-item-type-post_type menu-item-object-page${isActive('/virtual-tour') ? ' current-menu-item' : ''} menu-item-22`}>
                        <Link to="/virtual-tour" className={`elementor-item${isActive('/virtual-tour') ? ' elementor-item-active' : ''}`}>Virtual Tour</Link>
                      </li>


                    </ul>
                  </nav>

                  {/* ─── Mobile burger toggle ──────────────────────────── */}
                  <div
                    className={`elementor-menu-toggle${mobileOpen ? ' elementor-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label="Menu Toggle"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen(o => !o)}
                    onKeyDown={e => e.key === 'Enter' && setMobileOpen(o => !o)}
                  >
                    <svg aria-hidden="true" role="presentation" className="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" />
                    </svg>
                    <svg aria-hidden="true" role="presentation" className="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
                    </svg>
                  </div>

                  {/* ─── Mobile dropdown nav ───────────────────────────── */}
                  <nav
                    className="elementor-nav-menu--dropdown elementor-nav-menu__container"
                    aria-hidden={!mobileOpen}
                    style={mobileOpen ? { display: 'block' } : {}}
                  >
                    <ul id="menu-2-75a7462" className="elementor-nav-menu">
                      <li className="menu-item"><Link to="/" className="elementor-item" onClick={() => setMobileOpen(false)}>Home</Link></li>
                      <li className="menu-item"><Link to="/about-us" className="elementor-item" onClick={() => setMobileOpen(false)}>About us</Link></li>

                      {/* Mobile Destinations */}
                      <li className={`menu-item menu-item-has-children ${mobileDestOpen ? 'is-open' : ''}`}>
                        <a href="#" className="elementor-item has-submenu"
                          onClick={e => { e.preventDefault(); setMobileDestOpen(o => !o); }}>
                          Destinations <span className="sub-arrow"><CaretDown /></span>
                        </a>
                        <div className={`mobile-submenu-wrapper ${mobileDestOpen ? 'is-open' : ''}`}>
                          <ul className="sub-menu elementor-nav-menu--dropdown mobile-dropdown-menu">
                            {/* CED Developments */}
                            <li className={`menu-item menu-item-has-children ${mobileCedDev ? 'is-open' : ''}`}>
                              <a href="#" className="elementor-sub-item has-submenu"
                                onClick={e => { e.preventDefault(); setMobileCedDev(o => !o); }}>
                                CED Developments <span className="sub-arrow"><CaretDown size={8} /></span>
                              </a>
                              <div className={`mobile-submenu-wrapper ${mobileCedDev ? 'is-open' : ''}`}>
                                <ul className="sub-menu elementor-nav-menu--dropdown mobile-dropdown-menu">
                                  {CED_DEVELOPMENTS.map(item => (
                                    <li key={item.slug} className="menu-item">
                                      <Link to={getDestinationHref(item.slug)} className="elementor-sub-item"
                                        onClick={() => setMobileOpen(false)}>{item.label}</Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                            {/* CED Projects */}
                            <li className={`menu-item menu-item-has-children ${mobileCedProj ? 'is-open' : ''}`}>
                              <a href="#" className="elementor-sub-item has-submenu"
                                onClick={e => { e.preventDefault(); setMobileCedProj(o => !o); }}>
                                CED Projects <span className="sub-arrow"><CaretDown size={8} /></span>
                              </a>
                              <div className={`mobile-submenu-wrapper ${mobileCedProj ? 'is-open' : ''}`}>
                                <ul className="sub-menu elementor-nav-menu--dropdown mobile-dropdown-menu">
                                  {CED_PROJECTS.map(item => (
                                    <li key={item.slug} className="menu-item">
                                      <Link to={getDestinationHref(item.slug)} className="elementor-sub-item"
                                        onClick={() => setMobileOpen(false)}>{item.label}</Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </li>

                      <li className="vrcon menu-item"><Link to="/virtual-tour" className="elementor-item" onClick={() => setMobileOpen(false)}>Virtual Tour</Link></li>
                      
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Right column: EN/AR + Visit us */}
            <div className="has_eae_slider elementor-element elementor-element-857150c e-con-full elementor-hidden-mobile elementor-hidden-tablet e-flex e-con e-child"
              data-eae-slider="83090" data-id="857150c" data-element_type="container">
              <div className="elementor-element elementor-element-b89dd17 elementor-nav-menu__align-center elementor-nav-menu--stretch elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu"
                data-id="b89dd17" data-element_type="widget" data-widget_type="nav-menu.default">
                <div className="elementor-widget-container">
                  <nav aria-label="Menu" className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-fade">
                    
                  </nav>
                </div>
              </div>
            </div>

          </div>{/* /e-con-inner */}
        </div>{/* /e-parent */}

        {/* ── Fixed Contact Trigger + Scroll Button ──────────────────────── */}
        <div className="has_eae_slider elementor-element elementor-element-65ca805 e-con-full con-right e-flex e-con e-parent e-lazyloaded"
          data-eae-slider="50599" data-id="65ca805" data-element_type="container"
          data-settings="{&quot;position&quot;:&quot;fixed&quot;}">
          <a className="has_eae_slider elementor-element elementor-element-0ad6a66 e-con-full mega-menu-trigger e-flex e-con e-child"
            data-eae-slider="92983" data-id="0ad6a66" data-element_type="container"
            data-settings="{&quot;background_background&quot;:&quot;classic&quot;}"
            href="#contact-form"
            onClick={event => { event.preventDefault(); onContactClick?.(); }}>
            <div className="elementor-element elementor-element-97fcb06 elementor-view-default elementor-widget elementor-widget-icon"
              data-id="97fcb06" data-element_type="widget" data-widget_type="icon.default">
              <div className="elementor-widget-container">
                <div className="elementor-icon-wrapper">
                  <div className="elementor-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" id="a0eecb04-3825-4823-933f-cf65f05d6c87" data-name="Layer 1" viewBox="0 0 11.7 10.2">
                      <path d="M6.6,10.2l-.9-.9L9.3,5.7H0V4.5H9.3L5.7.9,6.6,0l5.1,5.1Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="elementor-element elementor-element-005109a small elementor-widget elementor-widget-heading"
              data-id="005109a" data-element_type="widget" data-widget_type="heading.default">
              <div className="elementor-widget-container">
                <h2 className="elementor-heading-title elementor-size-default">Contact us</h2>
              </div>
            </div>
          </a>
        </div>

        {/* Scroll button container */}
        <div className="has_eae_slider elementor-element elementor-element-b998435 e-flex e-con-boxed e-con e-parent e-lazyloaded"
          data-eae-slider="27333" data-id="b998435" data-element_type="container">
          <div className="e-con-inner">
            <div className="elementor-element elementor-element-6fd9e54 elementor-widget elementor-widget-html"
              data-id="6fd9e54" data-element_type="widget" data-widget_type="html.default">
              <div className="elementor-widget-container">
                <a href="#" id="smart-scroll-button" aria-label="Scroll Page" className="" />

                <style dangerouslySetInnerHTML={{ __html: `
  #smart-scroll-button {
      --water-level: 100%;
      position: fixed;
      bottom: 180px;
      right: 10px;
      width: 45px;
      height: 45px;
      background-color: #A68543;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      z-index: 9999;
      transition: transform 0.3s ease, bottom 0.3s ease-out;
      text-decoration: none;
      display: block;
      overflow: hidden;
      box-shadow: 0px 0px 25px -5px rgba(50, 88, 130, 0.4);
  }
  #smart-scroll-button.is-lowered { bottom: 20px; }
  #smart-scroll-button:hover { transform: scale(1.1); }
  #smart-scroll-button::before {
      content: '\\2193';
      position: relative;
      z-index: 2;
      font-size: 24px;
      line-height: 45px;
      text-align: center;
      display: block;
      text-shadow: 0 0 5px rgba(0,0,0,0.5);
  }
  #smart-scroll-button.scroll-to-top::before { content: '\\2191'; }
  #smart-scroll-button::after {
      content: '';
      position: absolute;
      z-index: 1;
      opacity: .7;
      bottom: 0;
      left: -25%;
      height: 100%;
      width: 150%;
      background: #00263D;
      border-radius: 40%;
      animation: waveEffect 5s ease-in-out alternate infinite;
      transform: translateY(var(--water-level));
      transition: transform 0.5s ease-out;
  }
  #smart-scroll-button.is-bouncing { animation: bounce 0.4s ease-out; }
  @keyframes waveEffect { to { transform: translateY(var(--water-level)) rotate(360deg); } }
  @keyframes bounce {
      0% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0); }
  }
  @media screen and (max-width: 768px) {
      #smart-scroll-button { bottom: 200px; z-index: 100!important; }
      #smart-scroll-button.is-lowered { bottom: 20px; }
  }
` }} />

                <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var scrollButton = document.getElementById('smart-scroll-button');
    if (!scrollButton) return;
    var isBouncing = false;
    function updateState() {
      if (!isBouncing) {
        isBouncing = true;
        scrollButton.classList.add('is-bouncing');
        setTimeout(function() { scrollButton.classList.remove('is-bouncing'); isBouncing = false; }, 400);
      }
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight;
      var winHeight = window.innerHeight;
      var scrollable = docHeight - winHeight;
      var pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 100;
      scrollButton.style.setProperty('--water-level', (100 - pct) + '%');
      var atBottom = (scrollTop + winHeight) >= (docHeight - 50);
      scrollButton.classList.toggle('scroll-to-top', atBottom);
      var footer = document.getElementById('main-footer-id');
      var trigger = document.querySelector('.mega-menu-trigger');
      if (footer && trigger) {
        var footerTop = footer.getBoundingClientRect().top + scrollTop;
        if ((scrollTop + winHeight) > (footerTop - 20)) {
          trigger.style.display = 'none';
          scrollButton.classList.add('is-lowered');
        } else {
          trigger.style.display = '';
          scrollButton.classList.remove('is-lowered');
        }
      }
    }
    scrollButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (scrollButton.classList.contains('scroll-to-top')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.scrollY + window.innerHeight, behavior: 'smooth' });
      }
    });
    window.addEventListener('scroll', updateState, { passive: true });
    updateState();
  })();
` }} />
              </div>
            </div>
          </div>
        </div>

      </div>{/* /elementor-38 */}

      {/* ── Inline CSS for dropdown hover styles ─────────────────────────── */}
      <style>{`
        /* Destinations dropdown */
        @media (min-width: 1025px) {
          .desktop-dropdown-parent {
            position: relative;
          }
          .desktop-dropdown-menu {
            display: block !important;
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            min-width: 220px !important;
            z-index: 9999 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            transform: translateY(10px) !important;
            transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease !important;
          }
          .desktop-dropdown-parent.is-active > .desktop-dropdown-menu {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transform: translateY(0) !important;
          }
          
          /* Hit area extension to prevent hover loss over gaps */
          .desktop-dropdown-menu::after {
            content: "";
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            z-index: -1;
          }

          .desktop-dropdown-menu.level-2 {
            top: 0 !important; /* Align with parent item */
            left: 100% !important; /* Open to the right */
            transform: translateX(10px) !important;
          }
          .desktop-dropdown-parent.is-active > .desktop-dropdown-menu.level-2 {
            transform: translateX(0) !important;
          }
          
          /* Sub-arrows inside dropdowns rotated right */
          .desktop-dropdown-menu .sub-arrow svg {
            transform: rotate(-90deg) !important;
          }
        }
        @media (max-width: 1024px) {
          /* Force ancestors to static so the mobile nav panel can be full viewport width */
          body .elementor-element-cec3a5f, 
          body .elementor-element-75a7462, 
          body .elementor-element-75a7462 > .elementor-widget-container {
            position: static !important;
          }
          
          /* Main Mobile Menu Panel */
          body nav.elementor-nav-menu--dropdown.elementor-nav-menu__container {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            z-index: 9999 !important;
          }
          
          /* Mobile Accordion Wrappers */
          body div.mobile-submenu-wrapper {
            display: grid !important;
            grid-template-rows: 0fr !important;
            transition: grid-template-rows 0.3s ease !important;
            overflow: hidden !important; /* CRITICAL for accordion */
          }
          body div.mobile-submenu-wrapper.is-open {
            grid-template-rows: 1fr !important;
          }
          
          /* Mobile Nested Menus - High specificity to override Elementor global sub-menu absolute positioning */
          body nav.elementor-nav-menu__container ul.mobile-dropdown-menu,
          body div.mobile-submenu-wrapper > ul.mobile-dropdown-menu {
            display: block !important; /* Override Elementor display: none */
            overflow: hidden !important;
            min-height: 0 !important; /* CRITICAL for CSS grid accordion */
            
            /* Reset Elementor absolute positioning for mobile accordion */
            position: static !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: none !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            max-height: none !important;
            left: auto !important;
            top: auto !important;
          }
          
          /* Only apply structural indentation to level 3 locations */
          body div.mobile-submenu-wrapper .mobile-submenu-wrapper .elementor-sub-item {
            padding-left: 50px !important;
          }
          
          body .menu-item .sub-arrow svg {
            transition: transform 0.3s ease !important;
          }
          body .menu-item.is-open > a .sub-arrow svg {
            transform: rotate(180deg) !important;
          }
          body .menu-item .sub-arrow {
            margin-left: auto !important;
          }
        }
      `}</style>
    </>
  );
}
