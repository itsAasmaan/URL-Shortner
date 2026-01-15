// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    total: number;
    limit: number;
    totalPages: number;
  };
}

// URL Types
export interface URL {
  id?: number;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
  active?: boolean;
  totalClicks?: number;
  lastClicked?: string;
}

export interface CreateURLRequest {
  url: string;
  customAlias?: string;
  expiresIn?: number;
}

export interface CreateURLResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt?: string;
}

// Analytics Types
export interface ClickStats {
  totalClicks: number;
  clicksByDay: DayClick[];
  topReferrers: ReferrerStat[];
  topCountries: CountryStat[];
}

export interface DayClick {
  date: string;
  count: number;
}

export interface ReferrerStat {
  referrer: string;
  count: number;
}

export interface CountryStat {
  country: string;
  count: number;
}

export interface Click {
  id: number;
  url_id: number;
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  country?: string;
}

// Form Types
export interface URLFormData {
  url: string;
  customAlias?: string;
  expiresIn?: string;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode?: number;
}
