'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewScreener() {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptLoaded.current) return;

    // Clear any existing content
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "en",
      "width": "100%",
      "height": 550
    });
    
    container.current.appendChild(script);
    scriptLoaded.current = true;

    // Cleanup function
    return () => {
      scriptLoaded.current = false;
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full h-[550px]">
      <div 
        className="tradingview-widget-container w-full h-full" 
        ref={container}
        style={{ minHeight: '550px' }}
      >
        <div className="tradingview-widget-container__widget w-full h-full"></div>
        <div className="tradingview-widget-copyright mt-2">
          <a href="https://www.tradingview.com/crypto-coins-screener/" rel="noopener nofollow" target="_blank">
            <span className="text-blue-500 text-xs">Cryptocurrency market by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewScreener);