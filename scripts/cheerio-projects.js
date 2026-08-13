const fs = require('fs');
const cheerio = require('cheerio');

const content = fs.readFileSync('parts/main.jsx.txt', 'utf8');

// Find the projects section
const projectsStartStr = '<div className="has_eae_slider elementor-element elementor-element-417bdf8';
const projIdx = content.indexOf(projectsStartStr);
const projectsHtml = content.substring(projIdx, content.lastIndexOf('</main>'));

const $ = cheerio.load(projectsHtml, { xmlMode: true, decodeEntities: false });

// Find the swiper container
const $swiper = $('.elementor-loop-container.swiper');
$swiper.removeClass('swiper-initialized swiper-horizontal swiper-pointer-events');

// Change it to <Swiper>
$swiper[0].name = 'Swiper';
$swiper.attr('modules', '{[Autoplay, Navigation, Pagination]}');
$swiper.attr('autoplay', '{{ delay: 5000, pauseOnMouseEnter: true }}');
$swiper.attr('slidesPerView', '{2}');
$swiper.attr('breakpoints', '{{ 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }}');
$swiper.attr('navigation', '{{ nextEl: ".elementor-swiper-button-next", prevEl: ".elementor-swiper-button-prev" }}');
$swiper.attr('pagination', '{{ el: ".swiper-pagination", clickable: true }}');

// Get the swiper-wrapper and move its children to be direct children of Swiper
const $wrapper = $swiper.find('.swiper-wrapper');
$swiper.append($wrapper.contents());
$wrapper.remove();

// Process each slide
$swiper.find('.swiper-slide').each((i, el) => {
  if ($(el).hasClass('swiper-slide-duplicate')) {
    $(el).remove();
    return;
  }
  
  // Wrap with <SwiperSlide>
  const $el = $(el);
  $el[0].name = 'SwiperSlide';
  
  // Actually, elementor slides are <div data-elementor-type="loop-item" className="... swiper-slide ...">
  // We can just change the tag name from div to SwiperSlide!
});

// Remove swiper-notification
$swiper.parent().find('.swiper-notification').remove();

// We have to undo cheerio's HTML escaping for the curly brace attributes
let finalHtml = $.html();
finalHtml = finalHtml.replace(/modules="\{\[Autoplay, Navigation, Pagination\]\}"/g, 'modules={[Autoplay, Navigation, Pagination]}');
finalHtml = finalHtml.replace(/autoplay="\{\{ delay: 5000, pauseOnMouseEnter: true \}\}"/g, 'autoplay={{ delay: 5000, pauseOnMouseEnter: true }}');
finalHtml = finalHtml.replace(/slidesPerView="\{2\}"/g, 'slidesPerView={2}');
finalHtml = finalHtml.replace(/breakpoints="\{\{ 320: \{ slidesPerView: 1 \}, 768: \{ slidesPerView: 2 \}, 1024: \{ slidesPerView: 2 \} \}\}"/g, 'breakpoints={{ 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }}');
finalHtml = finalHtml.replace(/navigation="\{\{ nextEl: &quot;\.elementor-swiper-button-next&quot;, prevEl: &quot;\.elementor-swiper-button-prev&quot; \}\}"/g, 'navigation={{ nextEl: ".elementor-swiper-button-next", prevEl: ".elementor-swiper-button-prev" }}');
finalHtml = finalHtml.replace(/pagination="\{\{ el: &quot;\.swiper-pagination&quot;, clickable: true \}\}"/g, 'pagination={{ el: ".swiper-pagination", clickable: true }}');
finalHtml = finalHtml.replace(/class=/g, 'className=');

// Output React component
const tsx = `// @ts-nocheck
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProjectsSection() {
  return (
    <>
      ${finalHtml}
    </>
  );
}
`;

fs.writeFileSync('../client/src/components/home/ProjectsSection.tsx', tsx, 'utf8');
console.log('ProjectsSection.tsx successfully generated with Cheerio.');
