'use client';

import React, { useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';

function TradingViewTimeline() {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const { i18n } = useTranslation();
  
  // Get the current locale, default to 'en' if not Arabic
  const currentLocale = i18n.language === 'ar' ? 'ar' : 'en';

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content and reset script loaded flag
    container.current.innerHTML = '';
    scriptLoaded.current = false;
    
    // Remove any existing TradingView scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="tradingview.com"]');
    existingScripts.forEach(script => {
      if (script.src.includes('embed-widget-timeline.js')) {
        script.remove();
      }
    });

    // Small delay to ensure cleanup is complete
    const timeoutId = setTimeout(() => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "displayMode": "regular",
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": false,
        "locale": currentLocale,
        "width": "100%",
        "height": 550
      });
      
      container.current.appendChild(script);
      scriptLoaded.current = true;
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      scriptLoaded.current = false;
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [currentLocale]); // Re-run when locale changes

  return (
    <div key={currentLocale} className="w-full h-[550px] max-w-none">
      <div 
        className="tradingview-widget-container w-full h-full max-w-none" 
        ref={container}
        style={{ minHeight: '550px', width: '100%' }}
      >
        <div className="tradingview-widget-container__widget w-full h-full"></div>
        <div className="tradingview-widget-copyright mt-2">
          <a href="https://www.tradingview.com/news-flow/?priority=top_stories" rel="noopener nofollow" target="_blank">
            <span className="text-blue-500 text-xs">Top stories by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewTimeline);