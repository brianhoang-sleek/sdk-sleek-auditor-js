import { DynamicModule, FactoryProvider, Module, ModuleMetadata, ValueProvider } from '@nestjs/common';
import { AuditLogger } from './audit-events-client.service';


export interface AuditEventsClientOptions {
  baseUrl: string;
  apiKey: string;
}

export interface AuditEventsClientAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => AuditEventsClientOptions | Promise<AuditEventsClientOptions>;
  inject?: FactoryProvider['inject'];
}

export const AUDIT_EVENTS_CLIENT_OPTIONS = Symbol('AUDIT_EVENTS_CLIENT_OPTIONS');

@Module({})
export class AuditEventsClientModule {
  static register(options: AuditEventsClientOptions): DynamicModule {
    const optionsProvider: ValueProvider = {
      provide: AUDIT_EVENTS_CLIENT_OPTIONS,
      useValue: options,
    };

    return {
      module: AuditEventsClientModule,
      providers: [optionsProvider, AuditLogger],
      exports: [AuditLogger],
    };
  }

  static registerAsync(asyncOptions: AuditEventsClientAsyncOptions): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: AUDIT_EVENTS_CLIENT_OPTIONS,
      useFactory: asyncOptions.useFactory,
      inject: asyncOptions.inject ?? [],
    };

    return {
      module: AuditEventsClientModule,
      imports: asyncOptions.imports ?? [],
      providers: [optionsProvider, AuditLogger],
      exports: [AuditLogger],
    };
  }
}
