import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const ImageGeneratorBanner: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const texts = ['creators.', 'editors.', 'artists.'];

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

        .image-gen-banner,
        .image-gen-banner * {
          box-sizing: border-box;
        }
        
        .image-gen-banner {
          margin: 0;
          background-color: #212121;
          background-image: url("https://www.yudiz.com/codepen/photography-banner/frame.png");
          overflow-x: hidden;
          min-height: 100vh;
          width: 100%;
        }

        .image-gen-banner *::selection {
          background-color: rgba(241, 231, 40, 0.2);
          color: #ffffff;
        }

        .hero-section {
          height: 100vh;
          min-height: 780px;
          padding: 0 0 0 30px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          position: relative;
          z-index: 1;
          user-select: none;
          overflow: hidden;
        }

        .hero-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.4;
          background: #f1e728;
          filter: blur(162px);
          height: 35%;
          width: 55%;
          position: absolute;
          top: -40%;
          left: -66%;
          transform: translate(50%, 50%);
          z-index: -1;
        }

        .hero-left {
          padding: 20px 0 0;
          overflow: hidden;
        }

        .hero-left h1 {
          margin: 0;
          color: #fff;
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(100px, 18.5vw, 282px);
          line-height: 0.75;
          font-weight: normal;
          font-style: normal;
          text-transform: uppercase;
        }

        .hero-left h1 .text {
          color: #f1e728;
          display: block;
          height: 200px;
        }

        .hero-left h1 .d-flex {
          display: flex;
          align-items: center;
        }

        .hero-left h1 .char {
          transform: translateY(0);
          transition: transform 0.5s;
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

        .hero-left p {
          width: 72%;
          margin: 20px 0 0;
          color: #fff;
          font-size: 16px;
          font-style: normal;
          font-weight: normal;
          line-height: 2;
          font-family: "monument_extendedregular";
          opacity: 0.8;
        }

        .cta-button {
          margin: 40px 0 0;
          padding: 0;
          border: 0;
          font-size: 56px;
          line-height: 1;
          color: #f1f1f1;
          letter-spacing: 0.25px;
          text-transform: uppercase;
          font-family: "Extenda Trial 20 Micro";
          font-weight: 300;
          font-style: normal;
          display: inline-flex;
          align-items: center;
          gap: 28px;
          position: relative;
          text-decoration: none;
          cursor: pointer;
          background: transparent;
        }

        .cta-button .linktext {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .cta-button .linktext::before {
          position: absolute;
          content: "";
          left: 0;
          bottom: 6px;
          width: 100%;
          height: 3px;
          background-color: #ffffff;
          transform: scaleX(1);
          transition: transform 250ms ease-in-out;
          transform-origin: 0 0;
        }

        .cta-button:hover .linktext:before {
          transform: scaleX(0);
          transform-origin: 100% 100%;
        }

        .cta-button .arrow {
          height: 36px;
          width: 36px;
          top: -5px;
          display: inline-block;
          position: relative;
          overflow: hidden;
        }

        .cta-button .arrow::before,
        .cta-button .arrow::after {
          position: absolute;
          content: "";
          background-color: #f1e728;
          transition: all ease-in-out 0.35s;
          transform-origin: 0 0;
          border-radius: 30px;
        }

        .cta-button .arrow::before {
          height: 2px;
          width: 100%;
          top: 0;
          right: 0;
        }

        .cta-button .arrow::after {
          width: 2px;
          height: 100%;
          top: 0;
          right: 0;
        }

        .cta-button:hover .arrow::before {
          width: 65%;
        }

        .cta-button:hover .arrow::after {
          height: 65%;
        }

        .cta-button .arrow span {
          background-color: #f1e728;
          height: 2px;
          width: 100%;
          display: inline-block;
          transform: rotate(-45deg) translate(-3px, -1px);
          transform-origin: right top;
          border-radius: 30px;
          position: relative;
          transition: all ease-in-out 0.35s;
          position: absolute;
          top: 0;
          left: 0;
        }

        .cta-button .arrow span::before {
          background-color: #f1e728;
          content: "";
          height: 100%;
          width: 15px;
          left: -15px;
          top: 0;
          position: absolute;
        }

        .hero-right {
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

        .hero-right::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.4;
          background: #f1e728;
          filter: blur(112px);
          height: 35%;
          width: 55%;
          position: absolute;
          top: 50%;
          right: 33%;
          transform: translate(50%, -50%);
          z-index: -1;
        }

        .hero-right .d-flex {
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
          border: 1px solid #555555;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 32px;
          color: #ffffff;
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
          40%, 50% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          52.5%, 62.5% { left: calc(100% / 3); }
          65%, 75% { left: 0; top: calc((100% / 3) * 2); }
          77.5%, 87.5% { top: calc(100% / 3); }
        }

        @keyframes box-2 {
          0%, 90%, 100% { left: calc(100% / 3); }
          2.5%, 12.5% { left: calc((100% / 3) * 2); top: 0; }
          27.5%, 37.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          40%, 50% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          52.5%, 62.5% { left: 0; top: calc((100% / 3) * 2); }
          65%, 75% { left: 0; top: calc(100% / 3); }
          77.5%, 87.5% { left: 0; top: 0; }
        }

        @keyframes box-3 {
          0%, 90%, 100% { left: calc((100% / 3) * 2); }
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
          52.5%, 62.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          65%, 75% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          77.5%, 87.5% { left: 0; top: calc((100% / 3) * 2); }
        }

        @keyframes box-5 {
          0%, 90%, 100% { left: calc((100% / 3) * 2); top: calc(100% / 3); }
          2.5%, 12.5% { left: calc((100% / 3) * 2); top: calc((100% / 3) * 2); }
          15%, 25% { left: calc(100% / 3); top: calc((100% / 3) * 2); }
          27.5%, 37.5% { left: 0; top: calc((100% / 3) * 2); }
          40%, 50% { left: 0; top: calc(100% / 3); }
          52.5%, 62.5% { left: 0; top: 0; }
          65%, 75% { left: calc(100% / 3); top: 0; }
          77.5%, 87.5% { left: calc((100% / 3) * 2); top: 0; }
        }

        @keyframes box-6 {
          0%, 90%, 100% { left: 0; top: calc((100% / 3) * 2); }
          2.5%, 12.5% { left: 0; top: calc(100% / 3); }
          15%, 25% { left: 0; top: 0; }
          27.5%, 37.5% { left: calc(100% / 3); top: 0; }
          40%, 50% { left: calc((100% / 3) * 2); top: 0; }
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
        }

        .box span {
          position: absolute;
          display: block;
          opacity: 0.8;
          z-index: 5;
        }

        .box:nth-child(1) span {
          top: 43%;
          left: -27px;
          transform: translateY(-50%);
        }

        .box:nth-child(3) span {
          left: -10px;
          bottom: 2px;
        }

        .box:nth-child(4) span {
          top: 50%;
          left: 55%;
          transform: translate(-50%, -50%);
        }

        .box:nth-child(8) span {
          top: 50%;
          transform: translate(-50%, -50%);
          left: 15%;
        }

        .box .bg-img {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 120px;
          overflow: hidden;
        }

        .box .bg-img,
        .box .bg-img img {
          height: 100%;
          width: 100%;
        }

        .box .bg-img img {
          max-width: 100%;
          object-fit: cover;
          object-position: center center;
        }

        @media screen and (max-width: 1199px) {
          .hero-right {
            height: 400px;
            width: 400px;
          }
          .hero-right .d-flex {
            gap: 20px;
          }
          .box {
            height: 118px;
            width: 118px;
            font-size: 12px;
          }
          .hero-left p {
            font-size: 14px;
            line-height: 1.8;
            width: 85%;
          }
          .hero-left h1 .text {
            height: 132px;
          }
          .cta-button {
            font-size: 48px;
            gap: 24px;
          }
          .cta-button .arrow {
            height: 28px;
            width: 28px;
          }
        }

        @media screen and (max-width: 767px) {
          .image-gen-banner {
            overflow-x: hidden;
          }
          
          .hero-section {
            display: block;
            padding: 0;
            overflow: visible;
            min-height: auto;
            height: auto;
          }
          
          .hero-left {
            padding: 40px 16px 60px;
            overflow: visible;
          }
          
          .hero-right {
            height: 334px;
            width: 334px;
            margin: 0 auto;
            margin-right: auto;
          }
          
          .hero-left h1 .text {
            height: 88px;
          }
          
          .hero-left p {
            font-size: 12px;
            width: 96%;
          }
          
          .box {
            height: 96px;
            width: 96px;
            font-size: 10px;
          }
          
          .cta-button .arrow {
            height: 24px;
            width: 24px;
          }
          
          .cta-button {
            font-size: 42px;
            gap: 20px;
            margin-top: 24px;
          }
        }

        .features-section {
          padding: 100px 30px;
          background-color: #1a1a1a;
          position: relative;
          overflow: hidden;
        }

        .features-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.3;
          background: #f1e728;
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
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 60px;
          align-items: center;
        }

        .features-content h2 {
          color: #fff;
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(60px, 8vw, 120px);
          line-height: 0.9;
          margin: 0 0 30px;
          text-transform: uppercase;
        }

        .features-content h2 .highlight {
          color: #f1e728;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          padding: 25px 0;
          border-bottom: 1px solid #333;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: #f1e728;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: #212121;
          flex-shrink: 0;
        }

        .feature-text h3 {
          color: #fff;
          font-family: "monument_extendedregular";
          font-size: 18px;
          margin: 0 0 8px;
          text-transform: uppercase;
        }

        .feature-text p {
          color: #aaa;
          font-family: "monument_extendedregular";
          font-size: 14px;
          margin: 0;
          line-height: 1.6;
        }

        .cta-section {
          padding: 120px 30px;
          background-color: #212121;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .cta-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.6;
          background: #f1e728;
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
          color: #fff;
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(80px, 12vw, 160px);
          line-height: 0.8;
          margin: 0 0 30px;
          text-transform: uppercase;
        }

        .cta-subtitle {
          color: #aaa;
          font-family: "monument_extendedregular";
          font-size: 18px;
          line-height: 1.6;
          margin: 0 0 50px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        @media screen and (max-width: 1199px) {
          .features-section,
          .cta-section {
            padding: 80px 20px;
          }

          .features-container {
            gap: 40px;
          }
        }

        @media screen and (max-width: 767px) {
          .features-section,
          .cta-section {
            padding: 60px 16px;
          }

          .features-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
      
      <div className="image-gen-banner">
        <main>
          <section className="hero-section">
            <div className="hero-left">
              <h1>
                <span className="d-flex">
                  {['A', 'I', ' ', 'f', 'o', 'r'].map((char, index) => (
                    <span key={index} className="char" style={{ animationDelay: `${index * 0.08}s` }}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
                <span className="text">{currentText}</span>
              </h1>
              <p>Transform your photos into NBA stars, professional headshots, and stunning artworks with AI</p>
              <button onClick={() => navigate('/auth')} className="cta-button">
                <span className="linktext">Start Creating</span>
                <span className="arrow">
                  <span></span>
                </span>
              </button>
            </div>
            <div className="hero-right">
              <div className="main-grid d-flex">
                <div className="box">
                  <span>NBA Player</span>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop" alt="Basketball" />
                  </div>
                </div>
                <div className="box">
                  <span>Professional</span>
                </div>
                <div className="box">
                  <span>Enhance</span>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=300&fit=crop" alt="Art" />
                  </div>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop" alt="Creative" />
                  </div>
                </div>
                <div className="box">
                  <span>Artistic</span>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop" alt="Portrait" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="features-section">
            <div className="features-container">
              <div className="features-content">
                <h2>
                  Endless <span className="highlight">Creative</span> Possibilities
                </h2>
              </div>
              <ul className="features-list">
                <li className="feature-item">
                  <div className="feature-icon">01</div>
                  <div className="feature-text">
                    <h3>AI-Powered</h3>
                    <p>Advanced AI models create stunning transformations in seconds</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon">02</div>
                  <div className="feature-text">
                    <h3>Multiple Styles</h3>
                    <p>From sports to professional photos to artistic paintings</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon">03</div>
                  <div className="feature-text">
                    <h3>Easy to Use</h3>
                    <p>Upload, select style, and generate - it's that simple</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon">04</div>
                  <div className="feature-text">
                    <h3>Affordable</h3>
                    <p>Just $1 per generation with flexible payment options</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-container">
              <h2 className="cta-title">Ready?</h2>
              <p className="cta-subtitle">
                Join thousands creating amazing AI-powered image transformations. 
                Get 3 free generations when you sign up.
              </p>
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-[#f1e728] text-[#212121] hover:bg-[#f1e728]/90 text-lg px-8 py-6 font-bold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Now - 3 Free Generations
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ImageGeneratorBanner;
