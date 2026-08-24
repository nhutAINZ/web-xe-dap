import { ClickEvent } from '../types';

const CLICKS_STORAGE_KEY = 'dxd_clicks_v2';

function getStoredClicks(): ClickEvent[] {
  try {
    const raw = localStorage.getItem(CLICKS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function setStoredClicks(clicks: ClickEvent[]): void {
  try {
    localStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(clicks.slice(0, 1000))); // Keep last 1000 events
  } catch (e) {
    console.error('Failed to save click events', e);
  }
}

export const analytics = {
  logClick(
    type: ClickEvent['type'], 
    targetLabel: string, 
    targetId?: string
  ): void {
    const isMobile = window.innerWidth <= 767;
    const isTablet = window.innerWidth > 767 && window.innerWidth < 1200;
    const device: ClickEvent['device'] = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    const event: ClickEvent = {
      id: 'clk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      targetId,
      targetLabel,
      pageUrl: window.location.pathname + window.location.hash,
      timestamp: new Date().toISOString(),
      device
    };

    const clicks = getStoredClicks();
    clicks.unshift(event);
    setStoredClicks(clicks);
  },

  getAllClicks(): ClickEvent[] {
    return getStoredClicks();
  },

  getClicksByFilter(days = 7): ClickEvent[] {
    const clicks = getStoredClicks();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return clicks.filter(c => new Date(c.timestamp) >= cutoff);
  },

  getStats(days = 7) {
    const events = this.getClicksByFilter(days);
    
    const byType: Record<string, number> = {
      banner: 0,
      cta_hero: 0,
      product_view: 0,
      add_to_cart: 0,
      hotline: 0,
      zalo: 0,
      messenger: 0,
      filter_use: 0
    };

    const byDevice: Record<string, number> = {
      desktop: 0,
      tablet: 0,
      mobile: 0
    };

    const topTargets: Record<string, number> = {};

    events.forEach(e => {
      byType[e.type] = (byType[e.type] || 0) + 1;
      byDevice[e.device] = (byDevice[e.device] || 0) + 1;
      topTargets[e.targetLabel] = (topTargets[e.targetLabel] || 0) + 1;
    });

    const sortedTargets = Object.entries(topTargets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, count]) => ({ label, count }));

    return {
      total: events.length,
      byType,
      byDevice,
      topTargets: sortedTargets
    };
  },

  exportToCSV(days = 30): void {
    const events = this.getClicksByFilter(days);
    if (events.length === 0) {
      alert('Chưa có dữ liệu lượt click để xuất file!');
      return;
    }

    const headers = ['ID', 'Loại tương tác', 'Mục tiêu', 'Đường dẫn', 'Thiết bị', 'Thời gian'];
    const rows = events.map(e => [
      e.id,
      e.type,
      `"${e.targetLabel.replace(/"/g, '""')}"`,
      e.pageUrl,
      e.device,
      new Date(e.timestamp).toLocaleString('vi-VN')
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dxd_click_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
