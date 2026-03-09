import { DynamicModule, FactoryProvider, Module, ModuleMetadata, ValueProvider } from '@nestjs/common';

import { AuditLogsClientService } from './audit-logs-client.service';

export interface AuditLogsClientOptions {
  baseUrl: string;
  apiKey: string;
}

export interface AuditLogsClientAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => AuditLogsClientOptions | Promise<AuditLogsClientOptions>;
  inject?: FactoryProvider['inject'];
}

export const AUDIT_LOGS_CLIENT_OPTIONS = Symbol('AUDIT_LOGS_CLIENT_OPTIONS');

@Module({})
export class AuditLogsClientModule {
  static register(options: AuditLogsClientOptions): DynamicModule {
    const optionsProvider: ValueProvider = {
      provide: AUDIT_LOGS_CLIENT_OPTIONS,
      useValue: options,
    };

    return {
      module: AuditLogsClientModule,
      providers: [optionsProvider, AuditLogsClientService],
      exports: [AuditLogsClientService],
    };
  }

  static registerAsync(asyncOptions: AuditLogsClientAsyncOptions): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: AUDIT_LOGS_CLIENT_OPTIONS,
      useFactory: asyncOptions.useFactory,
      inject: asyncOptions.inject ?? [],
    };

    return {
      module: AuditLogsClientModule,
      imports: asyncOptions.imports ?? [],
      providers: [optionsProvider, AuditLogsClientService],
      exports: [AuditLogsClientService],
    };
  }
}
