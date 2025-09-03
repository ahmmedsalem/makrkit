'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewAdvancedChart() {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptLoaded.current) return;

    // Clear any existing content
    container.current.innerHTML = '';
    
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
      "locale": "en",
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