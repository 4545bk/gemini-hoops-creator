import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const texts = ['creators.', 'editors.'];

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
        /* Font faces */
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

        /* Component styles */
        .photography-banner,
        .photography-banner * {
          box-sizing: border-box;
        }
        
        .photography-banner {
          margin: 0;
          background-color: #212121;
          background-image: url("https://www.yudiz.com/codepen/photography-banner/frame.png");
          overflow-x: hidden;
          min-height: 100vh;
          width: 100%;
        }

        .photography-banner *::selection {
          background-color: rgba(241, 231, 40, 0.2);
          color: #ffffff;
        }

        .info-section {
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

        .info-section::before {
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

        /* Left part */
        .left-part {
          padding: 20px 0 0;
          overflow: hidden;
        }

        .left-part h1 {
          margin: 0;
          color: #fff;
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(100px, 18.5vw, 282px);
          line-height: 0.75;
          font-weight: normal;
          font-style: normal;
          text-transform: uppercase;
        }

        .left-part h1 .text {
          color: #f1e728;
          display: block;
          height: 200px;
        }

        .left-part h1 .d-flex {
          display: flex;
          align-items: center;
        }

        .left-part h1 .char {
          transform: translateY(0);
          transition: transform 0.5s;
          animation: slideUp 0.3s ease-out forwards;
        }

        .typed-cursor {
          display: none !important;
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
          color: #fff;
          font-size: 16px;
          font-style: normal;
          font-weight: normal;
          line-height: 2;
          font-family: "monument_extendedregular";
          opacity: 0.8;
        }

        /* Button */
        .book-link {
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
        }

        .book-link .linktext {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }

        .book-link .linktext::before {
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

        .book-link:hover .linktext:before {
          transform: scaleX(0);
          transform-origin: 100% 100%;
        }

        .book-link .arrow {
          height: 36px;
          width: 36px;
          top: -5px;
          display: inline-block;
          position: relative;
          overflow: hidden;
        }

        .book-link .arrow::before,
        .book-link .arrow::after {
          position: absolute;
          content: "";
          background-color: #f1e728;
          transition: all ease-in-out 0.35s;
          transform-origin: 0 0;
          border-radius: 30px;
        }

        .book-link .arrow::before {
          height: 2px;
          width: 100%;
          top: 0;
          right: 0;
        }

        .book-link .arrow::after {
          width: 2px;
          height: 100%;
          top: 0;
          right: 0;
        }

        .book-link:hover .arrow::before {
          width: 65%;
        }

        .book-link:hover .arrow::after {
          height: 65%;
        }

        .book-link .arrow span {
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

        .book-link .arrow span::before {
          background-color: #f1e728;
          content: "";
          height: 100%;
          width: 15px;
          left: -15px;
          top: 0;
          position: absolute;
        }

        /* Right part */
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

        /* Box animations */
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

        /* Keyframes for box animations */
        @keyframes box-1 {
          0%, 90%, 100% {
            left: 0;
            top: 0;
          }
          2.5%, 12.5% {
            left: calc(100% / 3);
          }
          15%, 25% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          27.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
          }
          29.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          31.5%, 33.5% {
            left: calc(100% / 3);
            width: 100%;
          }
          35.5%, 37.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          40%, 50% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          52.5%, 62.5% {
            left: calc(100% / 3);
          }
          65%, 75% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          77.5%, 87.5% {
            top: calc(100% / 3);
          }
        }

        @keyframes box-2 {
          0%, 90%, 100% {
            left: calc(100% / 3);
          }
          2.5%, 12.5% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          15%, 17% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          19%, 21% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
          23%, 25% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          27.5%, 37.5% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          40%, 50% {
            left: calc(100% / 3);
            top: calc((100% / 3) * 2);
          }
          52.5%, 62.5% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          65%, 75% {
            left: 0;
            top: calc(100% / 3);
          }
          77.5%, 87.5% {
            left: 0;
            top: 0;
          }
        }

        @keyframes box-3 {
          0%, 90%, 100% {
            left: calc((100% / 3) * 2);
          }
          2.5%, 12.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
          }
          4.5%, 10.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          6.5%, 8.5% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
          15%, 25% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          27.5%, 37.5% {
            left: calc(100% / 3);
            top: calc((100% / 3) * 2);
          }
          40%, 50% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          52.5%, 62.5% {
            left: 0;
            top: calc(100% / 3);
          }
          65%, 75% {
            left: 0;
            top: 0;
          }
          77.5%, 87.5% {
            left: calc(100% / 3);
            top: 0;
          }
        }

        @keyframes box-4 {
          0%, 90%, 100% {
            top: calc(100% / 3);
          }
          2.5%, 12.5% {
            left: 0;
            top: 0;
          }
          15%, 25% {
            left: calc(100% / 3);
            top: 0;
          }
          27.5%, 37.5% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          40%, 42%, 48%, 50% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          44%, 46% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
          52.5%, 62.5% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          65%, 75% {
            left: calc(100% / 3);
            top: calc((100% / 3) * 2);
          }
          77.5%, 87.5% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
        }

        @keyframes box-5 {
          0%, 90%, 92%, 98%, 100% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          2.5%, 12.5% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          15%, 25% {
            left: calc(100% / 3);
            top: calc((100% / 3) * 2);
          }
          27.5%, 37.5% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          40%, 50% {
            left: 0;
            top: calc(100% / 3);
          }
          52.5%, 62.5% {
            left: 0;
            top: 0;
          }
          65%, 75% {
            left: calc(100% / 3);
            top: 0;
          }
          77.5%, 87.5% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          94%, 96% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
        }

        @keyframes box-6 {
          0%, 90%, 100% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          2.5%, 12.5% {
            left: 0;
            top: calc(100% / 3);
          }
          15%, 25% {
            left: 0;
            top: 0;
          }
          27.5%, 37.5% {
            left: calc(100% / 3);
            top: 0;
          }
          40%, 50% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          52.5%, 54.5%, 60.5%, 62.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          56.5%, 58.5% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
          65%, 75% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          77.5%, 87.5% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
        }

        @keyframes box-7 {
          0%, 90%, 100% {
            left: calc(100% / 3);
            top: calc((100% / 3) * 2);
          }
          2.5%, 12.5% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          15%, 25% {
            left: 0;
            top: calc(100% / 3);
          }
          27.5%, 37.5% {
            left: 0;
            top: 0;
          }
          40%, 50% {
            left: calc(100% / 3);
            top: 0;
          }
          52.5%, 62.5% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          65%, 67%, 73%, 75% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
          }
          69%, 71% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
          77.5%, 87.5% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
        }

        @keyframes box-8 {
          0%, 90%, 100% {
            left: calc((100% / 3) * 2);
            top: calc((100% / 3) * 2);
          }
          2.5%, 12.5% {
            left: calc(100% / 3);
            top: calc((100% / 3) * 2);
          }
          15%, 25% {
            left: 0;
            top: calc((100% / 3) * 2);
          }
          27.5%, 37.5% {
            left: 0;
            top: calc(100% / 3);
          }
          40%, 50% {
            left: 0;
            top: 0;
          }
          52.5%, 62.5% {
            left: calc(100% / 3);
            top: 0;
          }
          65%, 75% {
            left: calc((100% / 3) * 2);
            top: 0;
          }
          77.5%, 79.5%, 85.5%, 87.5% {
            left: calc((100% / 3) * 2);
            top: calc(100% / 3);
            width: calc((100% / 3) - 16px);
            border-radius: 100%;
          }
          81.5%, 83.5% {
            left: calc(100% / 3);
            top: calc(100% / 3);
            width: 100%;
          }
        }

        /* Box Text */
        .box span.text-label {
          position: absolute;
          display: block;
          opacity: 0.8;
          z-index: 5;
        }

        .box:nth-child(1) span.text-label {
          top: 43%;
          left: -27px;
          transform: translateY(-50%);
        }

        .box:nth-child(3) span.text-label {
          left: -10px;
          bottom: 2px;
        }

        .box:nth-child(4) span.text-label {
          top: 50%;
          left: 55%;
          transform: translate(-50%, -50%);
        }

        .box:nth-child(8) span.text-label {
          top: 50%;
          transform: translate(-50%, -50%);
          left: 15%;
        }

        /* Box Background-Image with Before/After Split */
        .box .bg-img {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 120px;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .box .before-after-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
        }

        .box .before-side,
        .box .after-side {
          width: 50%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .box .before-side img,
        .box .after-side img {
          width: 200%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: center center;
        }

        .box .after-side img {
          margin-left: -100%;
        }

        .box .divider-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #f1e728;
          transform: translateX(-50%);
          z-index: 10;
        }

        /* Curve Line */
        .bg-line {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 85px;
          z-index: -1;
          overflow: hidden;
          display: flex;
          display: -webkit-flex;
          white-space: nowrap;
        }

        .bg-line img {
          position: relative;
          flex-shrink: 0;
          -webkit-flex-shrink: 0;
          animation: 26s linear infinite;
        }

        .bg-line img:nth-child(1) {
          animation-name: first-text;
        }

        .bg-line img:nth-child(2) {
          animation-name: second-text;
        }

        @keyframes first-text {
          50% {
            transform: translateX(-100%);
            opacity: 1;
          }
          50.05% {
            opacity: 0;
          }
          50.1% {
            transform: translateX(100%);
            opacity: 1;
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes second-text {
          50% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(-200%);
          }
          0% {
            transform: translateX(0%);
          }
        }

        /* Dash Circle */
        .bg-dash-circle {
          position: absolute;
          bottom: -35px;
          right: -13px;
          z-index: -1;
          width: 180px;
          aspect-ratio: 1/1;
        }

        .bg-dash-circle img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center center;
          animation: circle-rotate 18s linear infinite;
        }

        @keyframes circle-rotate {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Circle Line */
        .bg-circle-h-line {
          bottom: 42px;
          left: -68px;
          z-index: 1;
          width: 181px;
          height: 111px;
          position: relative;
        }

        .bg-circle-h-line img {
          width: 100%;
          max-width: 100%;
          height: auto;
          position: absolute;
          left: 0;
        }

        .bg-circle-h-line img:nth-child(1) {
          top: 0;
          animation: top-ring-move 2.5s linear infinite;
        }

        .bg-circle-h-line img:nth-child(2) {
          top: 50%;
          transform: translateY(-50%);
        }

        .bg-circle-h-line img:nth-child(3) {
          bottom: 0;
          animation: bottom-ring-move 2.5s linear infinite;
        }

        @keyframes top-ring-move {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes bottom-ring-move {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media screen and (min-width: 1500px) {
          .info-section {
            padding-left: 120px;
          }
        }

        @media screen and (min-width: 1400px) {
          .info-section {
            padding-left: 100px;
          }
        }

        @media screen and (max-width: 1199px) {
          .bg-line {
            height: 68px;
          }
          .right-part {
            height: 400px;
            width: 400px;
          }
          .right-part .d-flex {
            gap: 20px;
          }
          .box {
            height: 118px;
            width: 118px;
            font-size: 12px;
          }
          .left-part p {
            font-size: 14px;
            line-height: 1.8;
            width: 85%;
          }
          .left-part h1 .text {
            height: 132px;
          }
          .bg-dash-circle {
            width: 130px;
          }
          .bg-circle-h-line {
            width: 156px;
            height: 92px;
          }
          .book-link {
            font-size: 48px;
            gap: 24px;
          }
          .book-link .arrow {
            height: 28px;
            width: 28px;
          }
        }

        @media screen and (max-width: 767px) {
          .photography-banner {
            overflow-x: hidden;
          }
          
          .info-section {
            display: block;
            padding: 0;
            overflow: visible;
            min-height: auto;
            height: auto;
          }
          
          .bg-line {
            height: 52px;
          }
          
          .left-part {
            padding: 40px 16px 60px;
            overflow: visible;
          }
          
          .right-part {
            height: 334px;
            width: 334px;
            margin: 0 auto;
            margin-right: auto;
          }
          
          .left-part h1 .text {
            height: 88px;
          }
          
          .left-part p {
            font-size: 12px;
            width: 96%;
          }
          
          .box {
            height: 96px;
            width: 96px;
            font-size: 10px;
          }
          
          .book-link .arrow {
            height: 24px;
            width: 24px;
          }
          
          .book-link {
            font-size: 42px;
            gap: 20px;
            margin-top: 24px;
          }
          
          .bg-dash-circle {
            width: 80px;
          }
          
          .bg-circle-h-line {
            width: 126px;
            height: 65px;
          }
        }

        /* Features Section */
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
          letter-spacing: 0.05em;
          word-spacing: 0.2em;
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

        /* Testimonials Section */
        .testimonials-section {
          padding: 100px 30px;
          background-color: #212121;
          position: relative;
        }

        .testimonials-section::before {
          content: "";
          border-radius: 197.5px 0px;
          opacity: 0.4;
          background: #f1e728;
          filter: blur(120px);
          height: 50%;
          width: 30%;
          position: absolute;
          top: 50%;
          left: -15%;
          transform: translateY(-50%);
          z-index: -1;
        }

        .testimonials-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .testimonials-title {
          color: #fff;
          font-family: "Extenda Trial 30 Deca";
          font-size: clamp(60px, 8vw, 100px);
          line-height: 0.9;
          margin: 0 0 80px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          word-spacing: 0.2em;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-bottom: 60px;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #333;
          border-radius: 20px;
          padding: 40px 30px;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .testimonial-quote {
          color: #fff;
          font-family: "monument_extendedregular";
          font-size: 16px;
          line-height: 1.8;
          margin: 0 0 30px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f1e728;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #212121;
        }

        .author-info h4 {
          color: #fff;
          font-family: "monument_extendedregular";
          font-size: 14px;
          margin: 0;
          text-transform: uppercase;
        }

        .author-info p {
          color: #aaa;
          font-family: "monument_extendedregular";
          font-size: 12px;
          margin: 5px 0 0;
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 30px;
          background-color: #1a1a1a;
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
          letter-spacing: 0.05em;
          word-spacing: 0.2em;
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

        .cta-buttons {
          display: flex;
          gap: 30px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 18px 40px;
          background: #f1e728;
          color: #212121;
          text-decoration: none;
          font-family: "monument_extendedregular";
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          border-radius: 50px;
          transition: all 0.3s ease;
          border: 2px solid #f1e728;
          cursor: pointer;
        }

        .cta-button:hover {
          background: transparent;
          color: #f1e728;
        }

        .cta-button.secondary {
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
        }

        .cta-button.secondary:hover {
          background: #fff;
          color: #212121;
        }

        /* Responsive adjustments for new sections */
        @media screen and (max-width: 1199px) {
          .features-section,
          .testimonials-section,
          .cta-section {
            padding: 80px 20px;
          }

          .features-container {
            gap: 40px;
          }

          .testimonials-grid {
            gap: 30px;
          }

          .cta-buttons {
            gap: 20px;
          }
        }

        @media screen and (max-width: 767px) {
          .features-section,
          .testimonials-section,
          .cta-section {
            padding: 60px 16px;
          }

          .features-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .testimonial-card {
            padding: 30px 20px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
      
      <div className="photography-banner">
        <main>
          <section className="info-section">
            <div className="left-part">
              <h1>
                <span className="d-flex">
                  {['w', 'e', ' ', 'm', 'a', 'k', 'e'].map((char, index) => (
                    <span key={index} className="char" style={{ animationDelay: `${index * 0.08}s` }}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
                <span className="text">{currentText}</span>
              </h1>
              <p>Transform your photos with AI-powered image generation technology</p>
              <button onClick={() => navigate('/auth')} className="book-link">
                <span className="linktext">Start Creating</span>
                <span className="arrow">
                  <span></span>
                </span>
              </button>
            </div>
            <div className="right-part">
              <div className="bg-line">
                <img src="https://www.yudiz.com/codepen/photography-banner/wave.svg" alt="Line" />
                <img src="https://www.yudiz.com/codepen/photography-banner/wave.svg" alt="Line" />
              </div>
              <div className="main-grid d-flex">
                <div className="box">
                  <span className="text-label">Before</span>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <div className="before-after-container">
                      <div className="before-side">
                        <img src={beforePhoto1} alt="Before" />
                      </div>
                      <div className="after-side">
                        <img src={afterPhoto1} alt="After" />
                      </div>
                      <div className="divider-line"></div>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <span className="text-label">After</span>
                </div>
                <div className="box">
                  <span className="text-label">AI Magic</span>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <div className="before-after-container">
                      <div className="before-side">
                        <img src={beforePhoto2} alt="Before" />
                      </div>
                      <div className="after-side">
                        <img src={afterPhoto2} alt="After" />
                      </div>
                      <div className="divider-line"></div>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <div className="before-after-container">
                      <div className="before-side">
                        <img src={beforePhoto3} alt="Before" />
                      </div>
                      <div className="after-side">
                        <img src={afterPhoto3} alt="After" />
                      </div>
                      <div className="divider-line"></div>
                    </div>
                  </div>
                </div>
                <div className="box">
                  <span className="text-label">Transform</span>
                </div>
                <div className="box">
                  <div className="bg-img">
                    <div className="before-after-container">
                      <div className="before-side">
                        <img src={beforePhoto4} alt="Before" />
                      </div>
                      <div className="after-side">
                        <img src={afterPhoto4} alt="After" />
                      </div>
                      <div className="divider-line"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-circle-h-line">
                <img src="https://www.yudiz.com/codepen/photography-banner/circle-ring.svg" alt="Horizontal-circle" />
                <img src="https://www.yudiz.com/codepen/photography-banner/circle-ring.svg" alt="Horizontal-circle" />
                <img src="https://www.yudiz.com/codepen/photography-banner/circle-ring.svg" alt="Horizontal-circle" />
              </div>
              <div className="bg-dash-circle">
                <img src="https://www.yudiz.com/codepen/photography-banner/dash-circle.svg" alt="dash-circle" />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="features-container">
              <div className="features-content">
                <h2>
                  Why Choose <span className="highlight">Our</span> Platform?
                </h2>
              </div>
              <ul className="features-list">
                <li className="feature-item">
                  <div className="feature-icon">01</div>
                  <div className="feature-text">
                    <h3>AI-Powered</h3>
                    <p>Advanced AI technology that understands context and delivers stunning transformations</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon">02</div>
                  <div className="feature-text">
                    <h3>Lightning Fast</h3>
                    <p>Get your transformed images in seconds, not hours. Our optimized pipeline ensures speed</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon">03</div>
                  <div className="feature-text">
                    <h3>Secure & Private</h3>
                    <p>Your images are encrypted and never shared. Complete privacy guaranteed</p>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="feature-icon">04</div>
                  <div className="feature-text">
                    <h3>Always Improving</h3>
                    <p>Our AI models are constantly updated with the latest advancements in image generation</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="testimonials-section">
            <div className="testimonials-container">
              <h2 className="testimonials-title">What Our Users Say</h2>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    "This platform transformed my ordinary photos into professional-looking images. Absolutely incredible!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">SM</div>
                    <div className="author-info">
                      <h4>Sarah Martinez</h4>
                      <p>Content Creator</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    "The AI-powered transformations are mind-blowing. I use it for all my social media content now."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">DJ</div>
                    <div className="author-info">
                      <h4>David Johnson</h4>
                      <p>Social Media Manager</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-card">
                  <p className="testimonial-quote">
                    "Fast, reliable, and produces amazing results every single time. This is a game-changer!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">EL</div>
                    <div className="author-info">
                      <h4>Emma Lee</h4>
                      <p>Digital Artist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-container">
              <h2 className="cta-title">Ready to Start?</h2>
              <p className="cta-subtitle">
                Join thousands of creators who are already transforming their images with AI. 
                Your creative journey starts with a single click.
              </p>
              <div className="cta-buttons">
                <button onClick={() => navigate('/auth')} className="cta-button">
                  Get Started Free
                </button>
                <button onClick={() => navigate('/generator')} className="cta-button secondary">
                  View Examples
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default ImageGeneratorBanner;