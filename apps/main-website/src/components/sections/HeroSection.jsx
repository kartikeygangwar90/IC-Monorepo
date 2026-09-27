'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import HeroContent from './HeroContent';
import NoticeSection from './NoticeSection';
import { CLOUDINARY_BASE_URL } from '@/constants/const';
import { getOptimizedCloudinaryUrl } from '@/utils/cloudinary';

const RAW_HERO_IMAGES = [
  `${CLOUDINARY_BASE_URL}/v1782887029/img15_gvvduj.jpg`,
  `${CLOUDINARY_BASE_URL}/v1782887046/img9_arcgxv.jpg`,
  `${CLOUDINARY_BASE_URL}/v1782896082/home4_fgdtfi.jpg`,
  `${CLOUDINARY_BASE_URL}/v1782896090/IMG20230921194023_rzcmok.jpg`,
];

export default function HeroSection({ notices = [], heroProps = {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const heroImages = useMemo(() => {
    return RAW_HERO_IMAGES.map((src) =>
      getOptimizedCloudinaryUrl(src, { quality: 'q_auto:best' })
    );
  }, []);

  // Preload all hero background images
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [heroImages]);

  // Change image only after ensuring the target image is fully loaded
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndexRef.current + 1) % heroImages.length;
      const nextSrc = heroImages[nextIndex];

      const img = new Image();
      img.src = nextSrc;

      const switchImage = () => {
        setCurrentIndex(nextIndex);
      };

      if (img.complete && img.naturalWidth !== 0) {
        switchImage();
      } else {
        img.onload = () => {
          switchImage();
        };
        img.onerror = () => {
          // If image load fails, maintain current background image
        };
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [heroImages]);

  return (
    <section id="home" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 pt-[110px] pb-14 sm:px-8 sm:pt-[120px] sm:pb-16 lg:px-10">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroImages.map((src, index) => {
          const isVisible = index === currentIndex;
          return (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-fixed transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.70), rgba(2, 4, 9, 0.52)), url('${src}')`,
              }}
            />
          );
        })}
      </div>

      <div className="site-container relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <div>
          <HeroContent {...heroProps} />
        </div>

        <div className="w-full">
          <NoticeSection notices={notices} />
        </div>
      </div>
    </section>
  );
}

