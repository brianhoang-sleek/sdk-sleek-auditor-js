import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Payload for creating an audit event. Matches Sleek Auditor API POST /v1/audit-events.
 * Use with class-validator (validate) before sending.
 */
export class LogAuditEventDto {
  @IsString()
  @MaxLength(255)
  service!: string;

  @IsString()
  @MaxLength(255)
  actorId!: string;

  @IsString()
  @IsOptional()
  @MaxLength(64)
  actorType?: string | null;

  @IsString()
  @MaxLength(255)
  tenantId!: string;

  @IsString()
  @MaxLength(255)
  clientId!: string;

  @IsString()
  @MaxLength(128)
  action!: string;

  @IsString()
  @MaxLength(255)
  targetType!: string;

  @IsString()
  @MaxLength(255)
  targetId!: string;

  @IsObject()
  @IsOptional()
  beforeState?: Record<string, unknown> | null;

  @IsObject()
  @IsOptional()
  afterState?: Record<string, unknown> | null;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  requestId?: string | null;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> | null;
}
