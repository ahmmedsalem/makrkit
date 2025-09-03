'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidgetSecond() {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptLoaded.current) return;

    // Clear any existing content
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "dataSource": "SPX500",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "grouping": "sector",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "dark",
      "exchanges": [],
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": false,
      "width": "100%",
      "height": "100%"
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
    <div className="w-full h-[500px]">
      <div 
        className="tradingview-widget-container w-full h-full" 
        ref={container}
        style={{ minHeight: '500px' }}
      >
        <div className="tradingview-widget-container__widget w-full h-full"></div>
        <div className="tradingview-widget-copyright mt-2">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="text-blue-500 text-xs">Stock heatmap by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidgetSecond);