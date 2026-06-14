import { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import "./Dashboard.css";

// Modular UI imports
import Header from "../components/Header";
import NotificationToast from "../components/NotificationToast";
import MetricsGrid from "../components/MetricsGrid";
import AssetTable from "../components/AssetTable";
import SignalTable from "../components/SignalTable";

// Modular Chart imports
import HistoryChartContainer from "../charts/HistoryChartContainer";

function Dashboard() {
  // State variables for application data
  const [prices, setPrices] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [strategy, setStrategy] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Selection and filter states
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [chartLimit, setChartLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  
  // UX status and loading states
  const [apiStatus, setApiStatus] = useState("checking"); // 'checking' | 'connected' | 'disconnected'
  const [initialLoading, setInitialLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [runningStrategy, setRunningStrategy] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Quick helper to show alerts/toasts
  const triggerNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch prices, analytics, and strategy results simultaneously
  const fetchDashboardData = useCallback(async (isInitial = false, isSilent = false) => {
    if (isInitial) setInitialLoading(true);
    try {
      if (!isSilent) setApiStatus("checking");
      
      // Call endpoints
      const [pricesRes, analyticsRes, strategyRes] = await Promise.all([
        API.get("/prices"),
        API.get("/analytics"),
        API.get("/strategy/results")
      ]);

      setPrices(pricesRes.data);
      setAnalytics(analyticsRes.data);
      setStrategy(strategyRes.data);
      setApiStatus("connected");
      
      // Capture timestamp
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Auto-select first symbol on initial load if BTC is not found in database
      if (isInitial && pricesRes.data.length > 0) {
        const hasBtc = pricesRes.data.some(c => c.symbol === "BTC");
        if (!hasBtc) {
          setSelectedSymbol(pricesRes.data[0].symbol);
        }
      }
    } catch (error) {
      console.error("Dashboard fetching error:", error);
      setApiStatus("disconnected");
      if (!isSilent) {
        triggerNotification("Failed to fetch backend data. Make sure backend is running.", "error");
      }
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  }, []);

  // Fetch chart history for the currently selected symbol
  const fetchHistoryData = useCallback(async (symbol, limit) => {
    if (!symbol) return;
    setLoadingHistory(true);
    try {
      const historyRes = await API.get(`/history?symbol=${symbol}&limit=${limit}`);
      setHistory(historyRes.data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Triggered on page mount
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Set up 30 seconds silent auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false, true); // silent auto-refresh
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Fetch history when selected symbol or limit changes
  useEffect(() => {
    if (prices.length > 0) {
      fetchHistoryData(selectedSymbol, chartLimit);
    }
  }, [selectedSymbol, chartLimit, prices.length, fetchHistoryData]);

  // Ingest fresh market data from CoinGecko
  const handleSyncMarkets = async () => {
    setSyncing(true);
    try {
      const response = await API.get("/markets");
      triggerNotification(
        `Successfully ingested and stored fresh data for ${response.data.coins} assets!`,
        "success"
      );
      // Refresh all values
      await fetchDashboardData();
    } catch (error) {
      console.error("Sync error:", error);
      triggerNotification("Failed to sync fresh market data from CoinGecko.", "error");
    } finally {
      setSyncing(false);
    }
  };

  // Run the rule-based strategy engine
  const handleRunStrategy = async () => {
    setRunningStrategy(true);
    try {
      const response = await API.post("/strategy/run");
      setStrategy(response.data.results);
      triggerNotification("Trading strategy rules executed successfully!", "success");
    } catch (error) {
      console.error("Strategy run error:", error);
      triggerNotification("Strategy engine execution failed.", "error");
    } finally {
      setRunningStrategy(false);
    }
  };

  // Format currency helpers
  const formatUSD = (val) => {
    if (val === undefined || val === null) return "$0.00";
    if (val >= 1) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(val);
    }
    return "$" + val.toFixed(6); // fine resolution for low price coins
  };

  const formatVolume = (val) => {
    if (!val) return "$0";
    if (val >= 1.0e9) return "$" + (val / 1.0e9).toFixed(2) + "B";
    if (val >= 1.0e6) return "$" + (val / 1.0e6).toFixed(2) + "M";
    if (val >= 1.0e3) return "$" + (val / 1.0e3).toFixed(2) + "K";
    return "$" + val.toLocaleString();
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Search filter
  const filteredPrices = prices.filter((coin) => {
    const symbolMatch = coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return symbolMatch;
  });

  // Calculate statistics from loaded datasets
  const getTopGainer = () => {
    if (analytics.length === 0) return null;
    return [...analytics].sort((a, b) => b.price_change_percentage - a.price_change_percentage)[0];
  };

  const getVolumeLeader = () => {
    if (prices.length === 0) return null;
    return [...prices].sort((a, b) => b.volume - a.volume)[0];
  };

  const getStrategySummary = () => {
    const buyCount = strategy.filter(s => s.signal === "BUY").length;
    const sellCount = strategy.filter(s => s.signal === "SELL").length;
    return { buyCount, sellCount, total: strategy.length };
  };

  const topGainer = getTopGainer();
  const volumeLeader = getVolumeLeader();
  const stratSummary = getStrategySummary();

  // Find analytics data for selected coin to display details
  const selectedAnalytics = analytics.find(a => a.symbol === selectedSymbol);
  const selectedCoinData = prices.find(p => p.symbol === selectedSymbol);
  const selectedStrategyData = strategy.find(s => s.symbol === selectedSymbol);

  return (
    <div className="dashboard-container">
      {/* Toast Alert Notification */}
      <NotificationToast notification={notification} />

      {/* Styled Keyframe Animations injected inline for simple self-containment */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%) translateY(-10px); opacity: 0; }
          to { transform: translateX(0) translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Premium Dashboard Header */}
      <Header
        apiStatus={apiStatus}
        handleSyncMarkets={handleSyncMarkets}
        syncing={syncing}
        lastUpdated={lastUpdated}
      />

      {/* Quick Metrics highlight panels (with initial skeleton loading) */}
      <MetricsGrid
        selectedSymbol={selectedSymbol}
        selectedCoinData={selectedCoinData}
        selectedAnalytics={selectedAnalytics}
        topGainer={topGainer}
        volumeLeader={volumeLeader}
        stratSummary={stratSummary}
        formatUSD={formatUSD}
        formatVolume={formatVolume}
        loading={initialLoading}
      />

      {/* Main Content Layout Grid */}
      <main className="main-dashboard-grid">
        {/* LEFT COLUMN: Price/Volume Charts & Strategy Controller */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Interactive Chart Container */}
          <HistoryChartContainer
            selectedSymbol={selectedSymbol}
            chartLimit={chartLimit}
            setChartLimit={setChartLimit}
            loadingHistory={loadingHistory}
            history={history}
            formatUSD={formatUSD}
            formatVolume={formatVolume}
            formatDate={formatDate}
          />
           {/* Strategy Algo Engine Control Panel */}
          <SignalTable
            strategy={strategy}
            handleRunStrategy={handleRunStrategy}
            runningStrategy={runningStrategy}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            formatUSD={formatUSD}
            formatVolume={formatVolume}
          />
        </div>

        {/* RIGHT COLUMN: Searchable Asset List & Performance Table */}
        <AssetTable
          prices={prices}
          filteredPrices={filteredPrices}
          analytics={analytics}
          selectedSymbol={selectedSymbol}
          setSelectedSymbol={setSelectedSymbol}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          formatUSD={formatUSD}
          apiStatus={apiStatus}
        />
      </main>
    </div>
  );
}

export default Dashboard;