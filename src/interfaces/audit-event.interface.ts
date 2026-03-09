/**
 * Audit event shape returned by Sleek Auditor API. Matches audit_events entity.
 */
export interface AuditEvent {
  event_id: string;
  timestamp: string;
  service: string;
  actor_id: string;
  actor_type: string | null;
  tenant_id: string;
  client_id: string;
  action: string;
  target_type: string;
  target_id: string;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  request_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string | null;
  version?: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AuditEventQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  tenantId?: string;
  actorId?: string;
  action?: string;
  targetType?: string;
  service?: string;
  fromTimestamp?: string;
  toTimestamp?: string;
}
