export {
  AuditEventsClientModule,
  AuditEventsClientOptions,
  AuditEventsClientAsyncOptions,
} from './audit-events-client.module';
export { AuditLogger } from './audit-events-client.service';
export { LogAuditEventDto as CreateAuditEventDto } from './dto/create-audit-event.dto';
export {
  AuditEvent,
  AuditEventQueryParams,
  PaginatedResponse,
} from './interfaces/audit-event.interface';
