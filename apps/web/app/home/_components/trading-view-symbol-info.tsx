'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewSymbolInfoProps {
  symbol: string;
}

function TradingViewSymbolInfo({ symbol }: TradingViewSymbolInfoProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content and reset script loaded state
    container.current.innerHTML = '';
    scriptLoaded.current = false;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol,
      "colorTheme": "dark",
      "isTransparent": false,
      "locale": "en",
      "width": "100%"
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
  }, [symbol]); // Re-run when symbol changes

  return (
    <div className="w-full h-[200px]">
      <div 
        className="tradingview-widget-container w-full h-full" 
        ref={container}
        style={{ minHeight: '200px' }}
      >
        <div className="tradingview-widget-container__widget w-full h-full"></div>
        <div className="tradingview-widget-copyright mt-1">
          <a href={`https://www.tradingview.com/symbols/${symbol.replace(':', '-')}/?exchange=${symbol.split(':')[0]}`} rel="noopener nofollow" target="_blank">
            <span className="text-blue-500 text-xs">{symbol} symbol info by TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewSymbolInfo);