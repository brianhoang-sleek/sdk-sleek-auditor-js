import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { AUDIT_LOGS_CLIENT_OPTIONS, AuditLogsClientOptions } from './audit-logs-client.module';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog, AuditLogQueryParams, PaginatedResponse } from './interfaces/audit-log.interface';

@Injectable()
export class AuditLogsClientService {
  private readonly http: AxiosInstance;

  constructor(
    @Inject(AUDIT_LOGS_CLIENT_OPTIONS)
    private readonly options: AuditLogsClientOptions,
  ) {
    this.http = axios.create({
      baseURL: `${options.baseUrl}/audit-logs`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': options.apiKey,
      },
    });
  }

  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    const { data } = await this.http.post<AuditLog>('', dto);
    return data;
  }

  async findAll(query?: AuditLogQueryParams): Promise<PaginatedResponse<AuditLog>> {
    const { data } = await this.http.get<PaginatedResponse<AuditLog>>('', { params: query });
    return data;
  }

  async findOne(id: string): Promise<AuditLog> {
    const { data } = await this.http.get<AuditLog>(`/${id}`);
    return data;
  }
}
