export class CreateAuditLogDto {
  serviceName!: string;
  entityType!: string;
  entityId?: string | null;
  action!: string;
  actorId?: string | null;
  payload?: Record<string, unknown> | null;
  createdBy?: string | null;
}
