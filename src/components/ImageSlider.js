import React, { useState } from 'react';

const ImageSlider = ({ content, imageMap }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  let data = [];
  try {
    data = JSON.parse(content);
  } catch (e) {
    return <div style={{ color: 'red' }}>Error parsing image slider data. Please ensure it is valid JSON.</div>;
  }

  if (!data || data.length === 0) return null;

  const currentItem = data[currentIndex];
  const src = currentItem.image;

  let resolvedSrc = src;
  if (src && !/^https?:/i.test(src) && !src.startsWith('/')) {
    const normalized = src.startsWith('./') ? src.slice(2) : src;
    if (imageMap && imageMap[normalized]) {
      resolvedSrc = imageMap[normalized];
    }
  }

  return (
    <div style={{ margin: '2rem auto', padding: '1rem', border: '1px solid #e2e8f0', borderTop: '4px solid #333', borderRadius: '4px', backgroundColor: '#fff', width: 'fit-content', minWidth: '350px', maxWidth: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontFamily: 'serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ marginBottom: '0.8rem', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
          Training Step: {currentItem.step}
        </div>
        <input
          type="range"
          min={0}
          max={data.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(parseInt(e.target.value, 10))}
          style={{ width: '90%', cursor: 'pointer', appearance: 'none', height: '4px', background: '#ddd', outline: 'none', borderRadius: '2px' }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: #333;
            border-radius: 50%;
            cursor: pointer;
          }
          input[type='range']::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #333;
            border-radius: 50%;
            cursor: pointer;
            border: none;
          }
        `}} />
      </div>
      <div style={{ textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={resolvedSrc}
          alt={`Visual progression at step ${currentItem.step}`}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>
        Figure: Evolution of activations mapping at step {currentItem.step}.
      </div>
    </div>
  );
};

export default ImageSlider;
