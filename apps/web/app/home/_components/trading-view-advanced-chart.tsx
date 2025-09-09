'use client';

import React, { useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    TradingView?: any;
  }
}

function TradingViewAdvancedChart() {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const { i18n } = useTranslation();
  
  // Get the current locale, default to 'en' if not Arabic
  const currentLocale = i18n.language === 'ar' ? 'ar' : 'en';
  
  // Debug logging
  console.log('TradingView Advanced Chart - Current language:', i18n.language, 'Locale:', currentLocale);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content and reset script loaded flag
    container.current.innerHTML = '';
    scriptLoaded.current = false;
    
    // Remove any existing TradingView scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="tradingview.com"]');
    existingScripts.forEach(script => {
      if (script.src.includes('embed-widget-advanced-chart.js')) {
        script.remove();
      }
    });

    // Also clear any TradingView global variables that might interfere
    if (window.TradingView) {
      delete window.TradingView;
    }

    // Small delay to ensure cleanup is complete
    const timeoutId = setTimeout(() => {
      if (!container.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "allow_symbol_change": true,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": currentLocale,
        "save_image": true,
        "style": "1",
        "symbol": "NASDAQ:AAPL",
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "watchlist": [],
        "withdateranges": false,
        "compareSymbols": [],
        "studies": [],
        "autosize": true
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
    <div key={currentLocale} className="w-full h-[500px]">
      <div 
        className="tradingview-widget-container w-full h-full" 
        ref={container}
        style={{ minHeight: '500px' }}
      >
        <div className="tradingview-widget-container__widget w-full h-full" style={{ height: 'calc(100% - 32px)' }}></div>
        <div className="tradingview-widget-copyright mt-2">
          <a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/?exchange=NASDAQ" rel="noopener nofollow" target="_blank">
            <span className="text-blue-500 text-xs">AAPL chart by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewAdvancedChart);