// 工单服务API
import { getAuthHeader } from './auth';
import { queryCRM, createCRM, updateCRM, deleteCRM } from './crm-operations';

// 基础类型定义
type StringOrArray<T> = T | T[];

// CRM API 工单接口类型
export interface CRMTicket {
  id: StringOrArray<string>;
  name: StringOrArray<string>;
  caseType: string[];
  caseStatus: string[];
  caseDescription: StringOrArray<string>;
  contactName: StringOrArray<string>;
  contactPhoneNum: StringOrArray<string>;
  remark: StringOrArray<string>;
}

// 内部工单接口类型
export interface Ticket {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  contact: string;
  phone: string;
  remarks: string;
}

// 工单类型和状态映射
export const TICKET_TYPE_MAP = {
  "1": "咨询",
  "3": "维修", 
  "5": "投诉"
} as const;

export const TICKET_STATUS_MAP = {
  "1": "待分配",
  "3": "处理中",
  "5": "已完成"
} as const;

// API 响应类型
export interface CRMResponse {
  data?: {
    records?: CRMTicket[];
    totalCount?: number;
  };
  success?: boolean;
  message?: string;
  records?: CRMTicket[];
  totalCount?: number;
}

// 模拟工单数据
export const mockTickets: Ticket[] = [
  {
    id: "T001",
    title: "系统登录异常",
    type: "1",
    status: "1",
    description: "用户反馈无法正常登录系统，提示密码错误，但密码确认无误",
    contact: "张三",
    phone: "13800138001",
    remarks: "需要优先处理，影响用户正常使用"
  },
  {
    id: "T002", 
    title: "服务器故障维修",
    type: "3",
    status: "3",
    description: "服务器出现故障，需要紧急维修处理",
    contact: "李四",
    phone: "13800138002",
    remarks: "硬件故障，需要更换配件"
  }
];

// 通用工具函数
const extractValue = (value: StringOrArray<string>): string => {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]) : '';
  }
  return String(value || '');
};

const extractArrayValue = (value: string[]): string => {
  return value && value.length > 0 ? String(value[0]) : '';
};

const findKeyByValue = (map: Record<string, string>, value: string): string => {
  for (const [key, mapValue] of Object.entries(map)) {
    if (mapValue === value) return key;
  }
  return value;
};

// 将CRM数据转换为内部格式
export function convertCRMTicketToTicket(crmTicket: CRMTicket): Ticket {
  const rawType = extractArrayValue(crmTicket.caseType);
  const rawStatus = extractArrayValue(crmTicket.caseStatus);

  return {
    id: extractValue(crmTicket.id),
    title: extractValue(crmTicket.name),
    type: findKeyByValue(TICKET_TYPE_MAP, rawType),
    status: findKeyByValue(TICKET_STATUS_MAP, rawStatus),
    description: extractValue(crmTicket.caseDescription),
    contact: extractValue(crmTicket.contactName),
    phone: extractValue(crmTicket.contactPhoneNum),
    remarks: extractValue(crmTicket.remark)
  };
}

// 将内部格式转换为CRM格式
export function convertTicketToCRMTicket(ticket: Ticket): CRMTicket {
  return {
    id: ticket.id,
    name: ticket.title,
    caseType: [ticket.type],
    caseStatus: [ticket.status],
    caseDescription: ticket.description,
    contactName: ticket.contact,
    contactPhoneNum: ticket.phone,
    remark: ticket.remarks
  };
}

// 从CRM API获取工单数据
export async function fetchTicketsFromCRM(): Promise<Ticket[]> {
  const xoql = "SELECT id, name, caseType, caseStatus, caseDescription, contactName, contactPhoneNum, remark FROM serviceCase ORDER BY createdAt DESC LIMIT 5";

  try {
    const records = await queryCRM<CRMTicket>(xoql);
    
    if (records && records.length > 0) {
      console.log('CRM数据转换前:', records);
      const convertedData = records.map(convertCRMTicketToTicket);
      console.log('CRM数据转换后:', convertedData);
      return convertedData;
    } else {
      console.warn('CRM API未返回工单记录');
      return [];
    }
  } catch (error) {
    console.error('获取CRM工单数据失败:', error);
    throw error;
  }
}

// 获取工单数据（根据登录状态选择数据源）
export async function getTickets(): Promise<Ticket[]> {
  const authHeader = getAuthHeader();
  console.log('获取工单数据 - 认证状态:', authHeader ? '已登录' : '未登录');
  
  if (authHeader) {
    // 用户已登录，从CRM API获取数据
    console.log('尝试从CRM API获取数据...');
    try {
      const crmData = await fetchTicketsFromCRM();
      console.log('成功从CRM获取数据:', crmData.length, '条记录');
      return crmData;
    } catch (error) {
      console.error('获取CRM数据失败，使用模拟数据:', error);
      return mockTickets;
    }
  } else {
    // 用户未登录，使用模拟数据
    console.log('使用模拟数据');
    return mockTickets;
  }
}

// 保存工单ID到localStorage（用于跟踪真实工单）
export function saveTicketId(ticketId: string): void {
  const savedIds = getSavedTicketIds();
  if (!savedIds.includes(ticketId)) {
    savedIds.push(ticketId);
    localStorage.setItem('ticket_ids', JSON.stringify(savedIds));
  }
}

// 获取已保存的工单ID列表
export function getSavedTicketIds(): string[] {
  const saved = localStorage.getItem('ticket_ids');
  return saved ? JSON.parse(saved) : [];
}

// 清除已保存的工单ID
export function clearSavedTicketIds(): void {
  localStorage.removeItem('ticket_ids');
}

// 工具函数：将数字类型转换为显示文本
export function getTypeDisplayText(type: string): string {
  return TICKET_TYPE_MAP[type as keyof typeof TICKET_TYPE_MAP] || type;
}

// 工具函数：将数字状态转换为显示文本
export function getStatusDisplayText(status: string): string {
  return TICKET_STATUS_MAP[status as keyof typeof TICKET_STATUS_MAP] || status;
}

// API 请求和响应接口
export interface CreateTicketRequest {
  name: string;
  caseDescription: string;
  contactName: string;
  contactPhoneNum: string;
  remark: string;
  caseType: string;
  caseStatus: string;
  entityType: string;
}

export interface TicketResponse {
  success?: boolean;
  message?: string;
  data?: {
    id?: string;
    [key: string]: unknown;
  };
}

export interface DeleteTicketResponse {
  code?: string;
  msg?: string;
  data?: {
    id?: number | string;
    [key: string]: unknown;
  };
}

// 通用API响应处理函数
const processCRMResponse = (result: any): TicketResponse => ({
  success: result.success,
  message: result.message,
  data: {
    id: result.data?.id ? String(result.data.id) : undefined,
    ...(result.data ? Object.fromEntries(
      Object.entries(result.data).filter(([key]) => key !== 'id')
    ) : {})
  }
});

// CRM API 操作函数
export async function createTicketToCRM(ticketData: CreateTicketRequest): Promise<TicketResponse> {
  try {
    const result = await createCRM('serviceCase', ticketData);
    return processCRMResponse(result);
  } catch (error) {
    console.error('创建工单失败:', error);
    throw error;
  }
}

export async function updateTicketToCRM(ticketId: string, ticketData: Partial<CreateTicketRequest>): Promise<TicketResponse> {
  try {
    const result = await updateCRM('serviceCase', ticketId, ticketData);
    return processCRMResponse(result);
  } catch (error) {
    console.error('更新工单失败:', error);
    throw error;
  }
}

export async function deleteTicketToCRM(ticketId: string): Promise<DeleteTicketResponse> {
  try {
    const result = await deleteCRM('serviceCase', ticketId);
    return result as DeleteTicketResponse;
  } catch (error) {
    console.error('删除工单失败:', error);
    throw error;
  }
}

// 通用错误处理函数
const handleAPIError = (operation: string, error: unknown): never => {
  console.error(`${operation}失败:`, error);
  throw error instanceof Error ? error : new Error(`${operation}失败`);
};

// 检查API响应是否成功
const isSuccessResponse = (response: { success?: boolean; code?: string }): boolean => {
  return response.success !== false && (response.code === "200" || !response.code);
};

// 删除工单（根据登录状态选择数据源）
export async function deleteTicket(ticketId: string): Promise<boolean> {
  const authHeader = getAuthHeader();
  console.log('删除工单 - 认证状态:', authHeader ? '已登录' : '未登录');
  
  if (!authHeader) {
    console.log('用户未登录，仅删除本地工单');
    return true;
  }

  try {
    console.log('尝试通过CRM API删除工单...');
    const response = await deleteTicketToCRM(ticketId);
    
    console.log('CRM API删除工单响应详情:', response);
    
    if (response.code === "200") {
      console.log('成功通过CRM API删除工单:', ticketId);
      return true;
    }
    
    const errorMessage = response.msg || 'API未返回成功状态';
    throw new Error(`删除工单失败: ${errorMessage}`);
  } catch (error) {
    handleAPIError('通过CRM API删除工单', error);
  }
}

// 构建CRM请求数据
const buildCRMRequest = (ticket: Ticket): Omit<CreateTicketRequest, 'entityType'> => {
  const crmTicket = convertTicketToCRMTicket(ticket);
  return {
    name: extractValue(crmTicket.name),
    caseDescription: extractValue(crmTicket.caseDescription),
    contactName: extractValue(crmTicket.contactName),
    contactPhoneNum: extractValue(crmTicket.contactPhoneNum),
    remark: extractValue(crmTicket.remark),
    caseType: extractArrayValue(crmTicket.caseType),
    caseStatus: extractArrayValue(crmTicket.caseStatus),
  };
};

// 更新工单（根据登录状态选择数据源）
export async function updateTicket(ticket: Ticket): Promise<Ticket> {
  const authHeader = getAuthHeader();
  console.log('更新工单 - 认证状态:', authHeader ? '已登录' : '未登录');
  
  if (!authHeader) {
    console.log('用户未登录，仅更新本地工单');
    return ticket;
  }

  try {
    console.log('尝试通过CRM API更新工单...');
    const updateRequest = buildCRMRequest(ticket);
    console.log('更新工单请求数据:', updateRequest);

    const response = await updateTicketToCRM(ticket.id, updateRequest);
    console.log('CRM API更新工单响应详情:', response);
    
    if (response.success !== false) {
      console.log('成功通过CRM API更新工单:', ticket);
      return ticket;
    }
    
    const errorMessage = response.message || 'API未返回成功状态';
    throw new Error(`更新工单失败: ${errorMessage}`);
  } catch (error) {
    handleAPIError('通过CRM API更新工单', error);
  }
}

// 创建工单（根据登录状态选择数据源）
export async function createTicket(ticket: Ticket): Promise<Ticket> {
  const authHeader = getAuthHeader();
  console.log('创建工单 - 认证状态:', authHeader ? '已登录' : '未登录');
  
  if (!authHeader) {
    console.log('用户未登录，仅创建本地工单');
    return ticket;
  }

  try {
    console.log('尝试通过CRM API创建工单...');
    const createRequest: CreateTicketRequest = {
      ...buildCRMRequest(ticket),
      entityType: "1042489262408070" // 固定值，根据API文档
    };
    
    console.log('创建工单请求数据:', createRequest);
    const response = await createTicketToCRM(createRequest);
    console.log('CRM API创建工单响应详情:', response);
    
    if (response.success !== false && response.data?.id) {
      const createdTicket = { ...ticket, id: response.data.id };
      saveTicketId(createdTicket.id);
      console.log('成功通过CRM API创建工单:', createdTicket);
      return createdTicket;
    }
    
    const errorMessage = response.message || 
      (response.data ? `API返回数据但缺少ID: ${JSON.stringify(response.data)}` : 'API未返回有效数据');
    throw new Error(`创建工单失败: ${errorMessage}`);
  } catch (error) {
    handleAPIError('通过CRM API创建工单', error);
  }
}