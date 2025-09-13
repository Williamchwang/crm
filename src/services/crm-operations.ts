// CRM通用服务 - 查询、创建、更新、删除
import { getAuthHeader } from './auth';

// 通用CRM响应接口
export interface CRMResponse<T = any> {
  success?: boolean;
  message?: string;
  code?: string;
  msg?: string;
  data?: T | { records?: T[]; totalCount?: number; [key: string]: any };
  records?: T[];
  totalCount?: number;
}

// CRM操作选项
export interface CRMOperationOptions {
  enableLogging?: boolean;
  timeout?: number;
}

// 实体类型常量
export const ENTITY_TYPES = {
  SERVICE_CASE: 'serviceCase',
  ACCOUNT: 'account',
  CONTACT: 'contact',
  LEAD: 'lead',
  OPPORTUNITY: 'opportunity',
  TICKET: 'ticket'
} as const;

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];

// HTTP方法类型
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// 请求配置
interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

// 默认配置
const DEFAULT_OPTIONS: Required<CRMOperationOptions> = {
  enableLogging: true,
  timeout: 10000
};

// API基础URL
const API_BASE = '/crm-api/rest/data/v2.0';

/**
 * 通用HTTP请求函数
 */
async function makeRequest<T = any>(
  config: RequestConfig,
  options: Required<CRMOperationOptions>
): Promise<CRMResponse<T>> {
  const { enableLogging, timeout } = options;
  
  if (enableLogging) {
    console.log('发送CRM请求:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      body: config.body
    });
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.body,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (enableLogging) {
      console.log('CRM API响应状态:', response.status, response.statusText);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('CRM API错误响应:', errorText);
      throw new Error(`CRM操作失败. HTTP ${response.status}: ${errorText}`);
    }

    const result: CRMResponse<T> = await response.json();
    
    if (enableLogging) {
      console.log('CRM API响应数据:', result);
    }
    
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`CRM操作超时 (${timeout}ms)`);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`网络请求失败，可能是跨域问题: ${error.message}`);
    }
    
    console.error('CRM操作失败:', error);
    throw error;
  }
}

/**
 * 获取认证头
 */
function getAuthHeaders(): Record<string, string> {
  const authHeader = getAuthHeader();
  if (!authHeader) {
    throw new Error('用户未登录，无法执行CRM操作');
  }
  
  return {
    "Authorization": authHeader,
    "Content-Type": "application/json"
  };
}

/**
 * 构建API URL
 */
function buildApiUrl(endpoint: string): string {
  return `${API_BASE}${endpoint}`;
}

/**
 * 创建CRM记录
 */
export async function createCRM<T = any>(
  entityType: EntityType | string,
  data: any,
  options: CRMOperationOptions = {}
): Promise<CRMResponse<T>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const config: RequestConfig = {
    method: 'POST',
    url: buildApiUrl(`/xobjects/${entityType}`),
    headers: getAuthHeaders(),
    body: JSON.stringify({ data })
  };
  
  return makeRequest<T>(config, mergedOptions);
}

/**
 * 更新CRM记录
 */
export async function updateCRM<T = any>(
  entityType: EntityType | string,
  id: string,
  data: any,
  options: CRMOperationOptions = {}
): Promise<CRMResponse<T>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const config: RequestConfig = {
    method: 'PATCH',
    url: buildApiUrl(`/xobjects/${entityType}/${id}`),
    headers: getAuthHeaders(),
    body: JSON.stringify({ data })
  };
  
  return makeRequest<T>(config, mergedOptions);
}

/**
 * 删除CRM记录
 */
export async function deleteCRM<T = any>(
  entityType: EntityType | string,
  id: string,
  options: CRMOperationOptions = {}
): Promise<CRMResponse<T>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const config: RequestConfig = {
    method: 'DELETE',
    url: buildApiUrl(`/xobjects/${entityType}/${id}`),
    headers: getAuthHeaders()
  };
  
  return makeRequest<T>(config, mergedOptions);
}

/**
 * 查询CRM记录 - 使用XOQL
 */
export async function queryCRM<T = any>(
  xoql: string,
  options: CRMOperationOptions = {}
): Promise<T[]> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const config: RequestConfig = {
    method: 'POST',
    url: buildApiUrl('/query/xoql'),
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ xoql }).toString()
  };
  
  const result = await makeRequest(config, mergedOptions);
  
  // 提取记录数据
  let records: T[] = [];
  
  // 处理不同的响应格式
  if (result.data) {
    if (Array.isArray(result.data)) {
      records = result.data;
    } else if (result.data.records && Array.isArray(result.data.records)) {
      records = result.data.records;
    }
  } else if (Array.isArray(result.records)) {
    records = result.records;
  }
  
  if (mergedOptions.enableLogging && records.length > 0) {
    console.log('CRM查询成功，返回记录数:', records.length);
  }
  
  return records;
}

/**
 * 根据ID获取单个CRM记录
 */
export async function getCRM<T = any>(
  entityType: EntityType | string,
  id: string,
  options: CRMOperationOptions = {}
): Promise<CRMResponse<T>> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const config: RequestConfig = {
    method: 'GET',
    url: buildApiUrl(`/xobjects/${entityType}/${id}`),
    headers: getAuthHeaders()
  };
  
  return makeRequest<T>(config, mergedOptions);
}
