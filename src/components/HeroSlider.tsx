'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SlideData } from './AdminSlideForm';

interface HeroSliderProps {
    slides: SlideData[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!slides || slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    if (!slides || slides.length === 0) {
        return (
            <section className="hero" style={{ position: 'relative' }}>
                <div className="hero-content" style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
                    <h1 className="title">Welcome to TechShop</h1>
                    <p className="subtitle">Premium E-Commerce Platform</p>
                </div>
            </section>
        );
    }

    const slide = slides[currentSlide];

    return (
        <section className="hero" style={{ position: 'relative' }}>
            <div className="hero-content animate-fade-in" key={`content-${currentSlide}`}>
                <span className="hero-badge">{slide.badge}</span>
                <h1 className="title">{slide.title}</h1>
                <p className="subtitle">{slide.subtitle}</p>
                <div className="hero-actions">
                    <Link href={slide.linkUrl} className="btn-primary">
                        {slide.linkText}
                    </Link>
                </div>
            </div>
            <div className="hero-image-wrapper animate-fade-in" key={`image-${currentSlide}`}>
                <img
                    src={slide.imageURL}
                    alt={slide.title}
                    className="hero-image"
                />
            </div>

            {/* Slider Controls */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        style={{
                            width: index === currentSlide ? '32px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: index === currentSlide ? 'var(--primary-color)' : 'rgba(148, 163, 184, 0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
