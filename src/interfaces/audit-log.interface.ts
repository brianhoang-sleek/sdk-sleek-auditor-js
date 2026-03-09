export interface AuditLog {
  id: string;
  createdAt: Date;
  serviceName: string;
  entityType: string;
  entityId: string | null;
  action: string;
  actorId: string | null;
  payload: Record<string, unknown> | null;
  createdBy: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  entityType?: string;
  entityId?: string;
}
