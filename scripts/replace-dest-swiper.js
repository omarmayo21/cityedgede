const fs = require('fs');
let code = fs.readFileSync('../client/src/components/home/DestinationsSection.tsx', 'utf8');

const swiperReplacement = `
              <Swiper
                className="e-n-carousel swiper swiper-rtl"
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
                slidesPerView={5}
                breakpoints={{
                  320: { slidesPerView: 2, spaceBetween: 10 },
                  768: { slidesPerView: 2, spaceBetween: 10 },
                  1024: { slidesPerView: 5, spaceBetween: 10 }
                }}
                pagination={{ clickable: true }}
                dir="rtl"
              >
                <SwiperSlide className="swiper-slide">
                  <div className="has_eae_slider elementor-element elementor-element-1a07bd4 e-flex e-con-boxed e-con e-child" data-eae-slider="63402" data-id="1a07bd4" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-4ee85a2 elementor-widget elementor-widget-heading" data-id="4ee85a2" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default"><a href="#">Sheikh Zayed City</a></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="has_eae_slider elementor-element elementor-element-9cf1b73 e-flex e-con-boxed e-con e-child" data-eae-slider="82076" data-id="9cf1b73" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-21dc95e elementor-widget elementor-widget-heading" data-id="21dc95e" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default"><a href="#">New Capital City</a></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="has_eae_slider elementor-element elementor-element-ae55b88 e-flex e-con-boxed e-con e-child" data-eae-slider="94812" data-id="ae55b88" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-397e7c0 elementor-widget elementor-widget-heading" data-id="397e7c0" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default"><a href="#">New Alamein City</a></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="has_eae_slider elementor-element elementor-element-d386a1e e-flex e-con-boxed e-con e-child" data-eae-slider="14043" data-id="d386a1e" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-6c976dc elementor-widget elementor-widget-heading" data-id="6c976dc" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default"><a href="#">New Mansoura City</a></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="has_eae_slider elementor-element elementor-element-c8b8c07 e-flex e-con-boxed e-con e-child" data-eae-slider="90395" data-id="c8b8c07" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-fa2fbe9 elementor-widget elementor-widget-heading" data-id="fa2fbe9" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default"><a href="#">Maspero Triangle</a></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className="swiper-slide">
                  <div className="has_eae_slider elementor-element elementor-element-ef1600b e-flex e-con-boxed e-con e-child" data-eae-slider="32726" data-id="ef1600b" data-element_type="container">
                    <div className="e-con-inner">
                      <div className="elementor-element elementor-element-e070ddf elementor-widget elementor-widget-heading" data-id="e070ddf" data-element_type="widget" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                          <h2 className="elementor-heading-title elementor-size-default"><a href="#">New Cairo City</a></h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
`;

const startIdx = code.indexOf('<div className="e-n-carousel swiper');
const endIdx = code.indexOf('</div>', code.indexOf('<div className="swiper-pagination'));
if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + swiperReplacement + code.substring(endIdx + 6);
  if (!code.includes('import { Swiper, SwiperSlide }')) {
    code = code.replace("import React from 'react';", "import React from 'react';\nimport { Swiper, SwiperSlide } from 'swiper/react';\nimport { Autoplay, Pagination } from 'swiper/modules';\nimport 'swiper/css';\nimport 'swiper/css/pagination';");
  }
  fs.writeFileSync('../client/src/components/home/DestinationsSection.tsx', code, 'utf8');
  console.log('Swiper replaced in DestinationsSection');
} else {
  console.log('Could not find swiper block');
}
