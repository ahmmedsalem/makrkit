'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewTechnicalAnalysis() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear any existing content first
    container.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      displayMode: 'single',
      isTransparent: false,
      locale: 'en',
      interval: '1W',
      disableInterval: false,
      width: '100%',
      height: 550,
      symbol: 'BINANCE:BTCUSD',
      showIntervalTabs: true,
    });

    container.current.appendChild(widgetContainer);
    container.current.appendChild(script);
  }, []);

  return <div className="tradingview-widget-container" ref={container} />;
}

export default memo(TradingViewTechnicalAnalysis);
