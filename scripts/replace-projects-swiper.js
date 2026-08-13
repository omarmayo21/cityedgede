const fs = require('fs');
let code = fs.readFileSync('../client/src/components/home/ProjectsSection.tsx', 'utf8');

// The main Swiper div:
code = code.replace(
  '<div className="swiper elementor-loop-container elementor-grid swiper-initialized swiper-horizontal swiper-pointer-events" dir="ltr">',
  '<Swiper className="swiper elementor-loop-container elementor-grid" dir="ltr" modules={[Autoplay, Navigation, Pagination]} autoplay={{ delay: 5000, pauseOnMouseEnter: true }} slidesPerView={2} breakpoints={{ 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }} navigation={{ nextEl: \'.elementor-swiper-button-next\', prevEl: \'.elementor-swiper-button-prev\' }} pagination={{ el: \'.swiper-pagination\', clickable: true }}>'
);

// The swiper-wrapper div:
code = code.replace(
  '<div className="swiper-wrapper" aria-live="off" id="swiper-wrapper-4c56c1f57feed26b" >',
  ''
);

// Replace all closing swiper-wrapper divs. Wrap the div with <SwiperSlide>.
code = code.replace(/<div data-elementor-type="loop-item"/g, '<SwiperSlide className="swiper-slide"><div data-elementor-type="loop-item"');

// Now, for every <SwiperSlide>, there is a closing </div> that needs a </SwiperSlide>
code = code.replace(/<\/div>\s*<span className="swiper-notification"/g, '</div></SwiperSlide></Swiper><span className="swiper-notification"');
code = code.replace(/<\/div>\s*<SwiperSlide/g, '</div></SwiperSlide><SwiperSlide');

if (!code.includes('import { Swiper, SwiperSlide }')) {
  code = code.replace("import React from 'react';", "import React from 'react';\nimport { Swiper, SwiperSlide } from 'swiper/react';\nimport { Autoplay, Navigation, Pagination } from 'swiper/modules';\nimport 'swiper/css';\nimport 'swiper/css/navigation';\nimport 'swiper/css/pagination';");
}

fs.writeFileSync('../client/src/components/home/ProjectsSection.tsx', code, 'utf8');
console.log('Projects Swiper injected');
