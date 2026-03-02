'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SlideData {
    id?: string;
    badge: string;
    title: string;
    subtitle: string;
    imageURL: string;
    linkText: string;
    linkUrl: string;
    order?: number | string;
}

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
            <section className="hero-slider" style={{ minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to TechShop</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Premium E-Commerce Platform</p>
                </div>
            </section>
        );
    }

    const slide = slides[currentSlide];

    return (
        <section className="hero-slider" key={`slide-${currentSlide}`}>
            {/* Background Image */}
            <div className="hero-slider__bg">
                <img
                    src={slide.imageURL}
                    alt={slide.title}
                    className="hero-slider__img"
                />
                <div className="hero-slider__overlay" />
            </div>

            {/* Content */}
            <div className="hero-slider__content animate-fade-in">
                <span className="hero-slider__badge">{slide.badge}</span>
                <h1 className="hero-slider__title">{slide.title}</h1>
                <p className="hero-slider__subtitle">{slide.subtitle}</p>
                <Link href={slide.linkUrl} className="btn-primary">
                    {slide.linkText}
                </Link>
            </div>

            {/* Dots */}
            <div className="hero-slider__dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`hero-slider__dot ${index === currentSlide ? 'hero-slider__dot--active' : ''}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
