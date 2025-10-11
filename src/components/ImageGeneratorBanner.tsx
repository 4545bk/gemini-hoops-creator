import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import beforePhoto1 from '@/assets/before-photo-1.jpg';
import afterPhoto1 from '@/assets/after-photo-1.jpg';
import beforePhoto2 from '@/assets/before-photo-2.jpg';
import afterPhoto2 from '@/assets/after-photo-2.jpg';
import beforePhoto3 from '@/assets/before-photo-3.jpg';
import afterPhoto3 from '@/assets/after-photo-3.jpg';
import beforePhoto4 from '@/assets/before-photo-4.jpg';
import afterPhoto4 from '@/assets/after-photo-4.jpg';

const ImageGeneratorBanner: React.FC = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = ['creators.', 'editors.', 'dreamers.', 'artists.'];

  useEffect(() => {
    const typeSpeed = isDeleting ? 40 : 100;
    const currentFullText = texts[currentIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isDeleting, texts]);

  const beforeAfterPairs = [
    { before: beforePhoto1, after: afterPhoto1, label: 'Basketball' },
    { before: beforePhoto2, after: afterPhoto2, label: 'Graduation' },
    { before: beforePhoto3, after: afterPhoto3, label: 'Wedding' },
    { before: beforePhoto4, after: afterPhoto4, label: 'Celebrity' }
  ];

  return (
    <>
      <style>{`
        @font-face {
          font-family: "monument_extendedregular";
          src: url("https://www.yudiz.com/codepen/photography-banner/monumentextended-regular.woff2") format("woff2");
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: "Extenda Trial 20 Micro";
          src: url("https://www.yudiz.com/codepen/photography-banner/Extenda-20Micro.woff2") format("woff2");
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Extenda Trial 30 Deca";
          src: url("https://www.yudiz.com/codepen/photography-banner/Extenda-30Deca.woff2") format("woff2");
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        .image-banner * {
          box-sizing: border-box;
        }
        
        .image-banner {
          background-color: hsl(var(--color-neutral-950));
          overflow-x: hidden;
          min-height: 100vh;
          width: 100%;
        }

        .image-banner *::selection {
          background-color: hsl(var(--color-purple-400) / 0.3);
          color: hsl(var(--foreground));
        }

        .info-section {
          min-height: 100vh;
          padding: 80px 30px 80px 30px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          z-index: 1;
          user-select: none;
          overflow: hidden;
        }

        .info-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.4;
          background: hsl(var(--color-purple-500));
          filter: blur(162px);
          height: 35%;
          width: 55%;
          position: absolute;
          top: -40%;
          left: -66%;
          transform: translate(50%, 50%);
          z-index: -1;
        }

        .left-part {
          padding: 20px 0 0;
          overflow: hidden;
        }

        .left-part h1 {
          margin: 0;
          color: hsl(var(--foreground));
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(80px, 16vw, 240px);
          line-height: 0.75;
          font-weight: normal;
          font-style: normal;
          text-transform: uppercase;
        }

        .left-part h1 .text {
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          height: clamp(120px, 20vw, 180px);
        }

        .left-part h1 .d-flex {
          display: flex;
          align-items: center;
        }

        .left-part h1 .char {
          transform: translateY(0);
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(-515px);
          }
          to {
            transform: translateY(0);
          }
        }

        .left-part p {
          width: 72%;
          margin: 20px 0 0;
          color: hsl(var(--foreground-secondary));
          font-size: 16px;
          font-style: normal;
          font-weight: normal;
          line-height: 2;
          font-family: "monument_extendedregular";
          opacity: 0.8;
        }

        .right-part {
          background-color: transparent;
          height: 588px;
          width: 588px;
          margin: 0 0 0 auto;
          margin-right: -14px;
          display: block;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .right-part::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.4;
          background: hsl(var(--color-orange-500));
          filter: blur(112px);
          height: 35%;
          width: 55%;
          position: absolute;
          top: 50%;
          right: 33%;
          transform: translate(50%, -50%);
          z-index: -1;
        }

        .right-part .d-flex {
          height: 100%;
          gap: 24px;
          display: flex;
          flex-wrap: wrap;
          align-content: space-between;
          position: relative;
        }

        .main-grid {
          position: relative;
        }

        .box {
          width: calc((100% / 3) - 16px);
          height: calc((100% / 3) - 16px);
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid hsl(var(--border));
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px;
          color: hsl(var(--foreground));
          font-family: "monument_extendedregular";
          border-radius: 120px;
          position: absolute;
          animation: 30s infinite;
        }

        .box:nth-child(1) {
          left: 0;
          top: 0;
          animation-name: box-1;
        }

        .box:nth-child(2) {
          left: calc(100% / 3);
          top: 0;
          animation-name: box-2;
        }

        .box:nth-child(3) {
          left: calc((100% / 3) * 2);
          top: 0;
          animation-name: box-3;
        }

        .box:nth-child(4) {
          left: 0;
          top: calc(100% / 3);
          animation-name: box-4;
        }

        .box:nth-child(5) {
          left: calc((100% / 3) * 2);
          top: calc(100% / 3);
          animation-name: box-5;
        }

        .box:nth-child(6) {
          left: 0;
          top: calc((100% / 3) * 2);
          animation-name: box-6;
        }

        .box:nth-child(7) {
          left: calc(100% / 3);
          top: calc((100% / 3) * 2);
          animation-name: box-7;
        }

        .box:nth-child(8) {
          left: calc((100% / 3) * 2);
          top: calc((100% / 3) * 2);
          animation-name: box-8;
        }

        @keyframes box-1 {
          0%, 90%, 100% { left: 0; top: 0; }
          2.5%, 12.5% { left: calc(100% / 3); }
          15%, 25% { left: calc((100% / 3) * 2); top: 0; }
          27.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); }
          29.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          31.5%, 33.5% { left: calc(100% / 3); width: 100%; }
          35.5%, 37.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          40%, 50% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          52.5%, 62.5% { left: calc(100% / 3); }
          65%, 75% { left: 0; top: calc((100% / 3) * 2); }
          77.5%, 87.5% { top: calc(100% / 3); }
        }

        @keyframes box-2 {
          0%, 90%, 100% { left: calc(100% / 3); }
          2.5%, 12.5% { left: calc((100% / 3) * 2); top: 0; }
          15%, 17% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          19%, 21% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
          23%, 25% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          27.5%, 37.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          40%, 50% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          52.5%, 62.5% { left: 0; top: calc((100% / 3) * 2); }
          65%, 75% { left: 0; top: calc(100% / 3); }
          77.5%, 87.5% { left: 0; top: 0; }
        }

        @keyframes box-3 {
          0%, 90%, 100% { left: calc((100% / 3) * 2); }
          2.5%, 12.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); }
          4.5%, 10.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          6.5%, 8.5% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
          15%, 25% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          27.5%, 37.5% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          40%, 50% { left: 0; top: calc((100% / 3) * 2); }
          52.5%, 62.5% { left: 0; top: calc(100% / 3); }
          65%, 75% { left: 0; top: 0; }
          77.5%, 87.5% { left: calc(100% / 3); top: 0; }
        }

        @keyframes box-4 {
          0%, 90%, 100% { top: calc(100% / 3); }
          2.5%, 12.5% { left: 0; top: 0; }
          15%, 25% { left: calc(100% / 3); top: 0; }
          27.5%, 37.5% { left: calc((100% / 3) * 2); top: 0; }
          40%, 42%, 48%, 50% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          44%, 46% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
          52.5%, 62.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          65%, 75% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          77.5%, 87.5% { left: 0; top: calc((100% / 3) * 2); }
        }

        @keyframes box-5 {
          0%, 90%, 92%, 98%, 100% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          2.5%, 12.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          15%, 25% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          27.5%, 37.5% { left: 0; top: calc((100% / 3) * 2); }
          40%, 50% { left: 0; top: calc(100% / 3); }
          52.5%, 62.5% { left: 0; top: 0; }
          65%, 75% { left: calc(100% / 3); top: 0; }
          77.5%, 87.5% { left: calc((100% / 3) * 2); top: 0; }
          94%, 96% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
        }

        @keyframes box-6 {
          0%, 90%, 100% { left: 0; top: calc((100% / 3) * 2); }
          2.5%, 12.5% { left: 0; top: calc(100% / 3); }
          15%, 25% { left: 0; top: 0; }
          27.5%, 37.5% { left: calc(100% / 3); top: 0; }
          40%, 50% { left: calc((100% / 3) * 2); top: 0; }
          52.5%, 54.5%, 60.5%, 62.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          56.5%, 58.5% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
          65%, 75% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          77.5%, 87.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
        }

        @keyframes box-7 {
          0%, 90%, 100% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          2.5%, 12.5% { left: 0; top: calc((100% / 3) * 2); }
          15%, 25% { left: 0; top: calc(100% / 3); }
          27.5%, 37.5% { left: 0; top: 0; }
          40%, 50% { left: calc(100% / 3); top: 0; }
          52.5%, 62.5% { left: calc((100% / 3) * 2); top: 0; }
          65%, 67%, 73%, 75% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); }
          69%, 71% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
          77.5%, 87.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
        }

        @keyframes box-8 {
          0%, 90%, 100% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          2.5%, 12.5% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          15%, 25% { left: 0; top: calc((100% / 3) * 2); }
          27.5%, 37.5% { left: 0; top: calc(100% / 3); }
          40%, 50% { left: 0; top: 0; }
          52.5%, 62.5% { left: calc(100% / 3); top: 0; }
          65%, 75% { left: calc((100% / 3) * 2); top: 0; }
          77.5%, 79.5%, 85.5%, 87.5% { left: calc((100% / 3) * 2); top: calc(100% / 3); width: calc((100% / 3) - 16px); border-radius: 100%; }
          81.5%, 83.5% { left: calc(100% / 3); top: calc(100% / 3); width: 100%; }
        }

        .box span {
          position: absolute;
          display: block;
          opacity: 0.8;
          z-index: 5;
          font-size: 12px;
          text-transform: uppercase;
        }

        .box:nth-child(1) span { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .box:nth-child(3) span { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .box:nth-child(4) span { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .box:nth-child(8) span { top: 50%; left: 50%; transform: translate(-50%, -50%); }

        .box .ba-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 120px;
          overflow: hidden;
        }

        .box .ba-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }

        .box .before-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
          z-index: 2;
        }

        .box .after-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .box .ba-divider {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 100%;
          background: hsl(var(--color-orange-500));
          z-index: 3;
          box-shadow: 0 0 10px hsl(var(--color-orange-500) / 0.5);
        }

        .box .ba-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 30px;
          background: hsl(var(--color-orange-500));
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 4;
          box-shadow: 0 0 15px hsl(var(--color-orange-500) / 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        /* Features Section */
        .features-section {
          padding: 120px 30px;
          background: hsl(var(--color-neutral-900));
          position: relative;
          overflow: hidden;
        }

        .features-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.3;
          background: hsl(var(--color-purple-500));
          filter: blur(140px);
          height: 40%;
          width: 40%;
          position: absolute;
          top: 20%;
          right: -20%;
          z-index: -1;
        }

        .features-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .feature-card {
          background: hsl(var(--card) / 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid hsl(var(--border) / 0.3);
          border-radius: var(--radius-lg);
          padding: 40px;
          transition: var(--transition-bounce);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-glow);
          border-color: hsl(var(--color-purple-400) / 0.5);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: var(--gradient-hero);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .feature-title {
          color: hsl(var(--foreground));
          font-family: "monument_extendedregular";
          font-size: 20px;
          margin: 0 0 12px;
          text-transform: uppercase;
        }

        .feature-description {
          color: hsl(var(--foreground-secondary));
          font-family: "monument_extendedregular";
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 30px;
          background: hsl(var(--color-neutral-950));
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .cta-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.6;
          background: var(--gradient-accent);
          filter: blur(180px);
          height: 60%;
          width: 80%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-title {
          color: hsl(var(--foreground));
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(60px, 10vw, 120px);
          line-height: 0.9;
          margin: 0 0 30px;
          text-transform: uppercase;
        }

        .cta-subtitle {
          color: hsl(var(--foreground-secondary));
          font-family: "monument_extendedregular";
          font-size: 18px;
          line-height: 1.6;
          margin: 0 0 50px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        @media screen and (max-width: 1199px) {
          .right-part { height: 400px; width: 400px; }
          .right-part .d-flex { gap: 20px; }
          .box { height: 118px; width: 118px; font-size: 12px; }
          .left-part p { font-size: 14px; line-height: 1.8; width: 85%; }
          .left-part h1 .text { height: 132px; }
        }

        @media screen and (max-width: 767px) {
          .info-section { display: block; padding: 60px 16px; overflow: visible; min-height: auto; height: auto; }
          .left-part { padding: 40px 16px 60px; overflow: visible; }
          .right-part { height: 334px; width: 334px; margin: 0 auto; margin-right: auto; }
          .left-part h1 .text { height: 88px; }
          .left-part p { font-size: 12px; width: 96%; }
          .box { height: 96px; width: 96px; font-size: 10px; }
          .features-section, .cta-section { padding: 80px 16px; }
          .features-container { grid-template-columns: 1fr; gap: 30px; }
        }
      `}</style>
      
      <div className="image-banner">
        <main>
          <section className="info-section">
            <div className="left-part">
              <h1>
                <span className="d-flex">
                  {['w', 'e', ' ', 'e', 'm', 'p', 'o', 'w', 'e', 'r'].map((char, index) => (
                    <span key={index} className="char" style={{ animationDelay: `${index * 0.08}s` }}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
                <span className="text">{currentText}</span>
              </h1>
              <p>Transform your photos with AI magic. Turn ordinary moments into extraordinary memories.</p>
              <div className="mt-8 flex gap-4">
                <Button 
                  onClick={() => navigate('/generator')}
                  size="lg"
                  className="gradient-hero text-white hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
              </div>
            </div>
            <div className="right-part">
              <div className="main-grid d-flex">
                {beforeAfterPairs.map((pair, idx) => {
                  // Boxes with images: 2, 5, 6, 8 (indices 1, 4, 5, 7)
                  const hasImage = [1, 4, 5, 7].includes(idx);
                  const imageIndex = [1, 4, 5, 7].indexOf(idx);
                  
                  return (
                    <div key={idx} className="box">
                      {hasImage && imageIndex !== -1 ? (
                        <div className="ba-container">
                          <div className="before-img">
                            <img 
                              src={beforeAfterPairs[imageIndex].before} 
                              alt={`Before ${beforeAfterPairs[imageIndex].label}`} 
                            />
                          </div>
                          <div className="after-img">
                            <img 
                              src={beforeAfterPairs[imageIndex].after} 
                              alt={`After ${beforeAfterPairs[imageIndex].label}`} 
                            />
                          </div>
                          <div className="ba-divider"></div>
                          <div className="ba-handle">⟷</div>
                        </div>
                      ) : (
                        <span>{['AI Magic', 'Transform', 'Enhance', 'Create'][idx] || ''}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="features-container">
              <div className="feature-card">
                <div className="feature-icon">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="feature-title">AI-Powered</h3>
                <p className="feature-description">
                  Advanced artificial intelligence transforms your photos with stunning accuracy and detail
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-description">
                  Generate professional-quality images in seconds, not hours. No waiting, just results
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="feature-title">Secure & Private</h3>
                <p className="feature-description">
                  Your photos are encrypted and protected. We never share or sell your data
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="feature-title">Always Improving</h3>
                <p className="feature-description">
                  Our AI models are continuously updated with the latest technology for better results
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-container">
              <h2 className="cta-title">Ready to Transform?</h2>
              <p className="cta-subtitle">
                Join thousands of creators who are already using AI to bring their vision to life.
                Your journey starts here.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="gradient-accent text-white hover:opacity-90 transition-opacity text-lg px-8 py-6"
              >
                Get Started Free
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ImageGeneratorBanner;
