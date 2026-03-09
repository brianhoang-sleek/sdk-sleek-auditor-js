import { Inject, Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

import {
  AUDIT_EVENTS_CLIENT_OPTIONS,
  AuditEventsClientOptions,
} from "./audit-events-client.module";
import { LogAuditEventDto } from "./dto/create-audit-event.dto";
import {
  AuditEvent,
  AuditEventQueryParams,
  PaginatedResponse,
} from "./interfaces/audit-event.interface";

const DEFAULT_RETRIES = 3;

@Injectable()
export class AuditLogger {
  private readonly http: AxiosInstance;

  constructor(
    @Inject(AUDIT_EVENTS_CLIENT_OPTIONS)
    private readonly options: AuditEventsClientOptions,
  ) {
    this.http = axios.create({
      baseURL: `${options.baseUrl}/audit-events`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": options.apiKey,
      },
    });

    const retries = DEFAULT_RETRIES;
    axiosRetry(this.http, {
      retries: DEFAULT_RETRIES,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) =>
        axiosRetry.isNetworkError(error) ||
        (error.response?.status ?? 0) >= 500,
    });
  }

  async log(
    dto: LogAuditEventDto | Record<string, unknown>,
  ): Promise<AuditEvent> {
    const instance = plainToInstance(LogAuditEventDto, dto, {
      enableImplicitConversion: true,
    });

    const errors = await validate(instance, { whitelist: true });

    if (errors.length > 0) {
      const messages = errors.flatMap((e: ValidationError) =>
        e.constraints ? Object.values(e.constraints) : [e.property],
      );
      throw new Error(`Audit event validation failed: ${messages.join("; ")}`);
    }

    const { data } = await this.http.post<AuditEvent>("", instance);
    return data;
  }

  async findAll(
    query?: AuditEventQueryParams,
  ): Promise<PaginatedResponse<AuditEvent>> {
    const { data } = await this.http.get<PaginatedResponse<AuditEvent>>("", {
      params: query,
    });
    return data;
  }

  async findOne(eventId: string): Promise<AuditEvent> {
    const { data } = await this.http.get<AuditEvent>(`/${eventId}`);
    return data;
  }
}
