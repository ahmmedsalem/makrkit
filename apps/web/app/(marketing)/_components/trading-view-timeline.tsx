'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewTimeline() {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptLoaded.current) return;

    // Clear any existing content
    container.current.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "displayMode": "regular",
      "feedMode": "all_symbols",
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
    <div className="w-full h-[550px] max-w-none">
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