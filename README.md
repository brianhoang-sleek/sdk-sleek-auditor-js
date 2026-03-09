# Sleek Auditor SDK (sdk-sleek-auditor-js)

HTTP client SDK for the Sleek Auditor API (audit events). Use this package in NestJS or Express services to send and query audit events.

## 1. Run Auditor API Locally

```bash
cd sleek-auditor-api
npm install
npm run db:start  # or your DB setup
npm run start:dev
```

API base URL (with version prefix):

    http://localhost:3000/v1

## 2. Build the SDK

```bash
cd sdk-sleek-auditor-js
npm install
npm run build
```

## 3. Use in Your Service

### Environment variables

```bash
export AUDIT_SERVICE_BASE_URL=http://localhost:3000/v1
export AUDIT_SERVICE_API_KEY=your-audit-api-key
```

## 4. Using in an Express app

### Install

```bash
npm i @sleek-sdk/auditor
```

Or install from local path:

```bash
npm i ../sdk-sleek-auditor-js
```

### Create client

```javascript
const { AuditLogger } = require('@sleek-sdk/auditor');

app.set(
  'AuditLogger',
  new AuditLogger({
    baseUrl: process.env.AUDIT_SERVICE_BASE_URL,
    apiKey: process.env.AUDIT_SERVICE_API_KEY,
  }),
);
```

### Example route

```javascript
app.get('/api/audit-test', function (req, res) {
  const AuditLogger = req.app.get('AuditLogger');

  if (!AuditLogger) {
    return res.status(503).json({
      ok: false,
      message: 'Audit service not configured (missing config or env)',
    });
  }

  AuditLogger
    .log({
      service: 'sleek-back',
      actorId: req.user?._id?.toString() ?? 'anonymous',
      tenantId: 'tenant-1',
      clientId: 'staff_portal',
      action: 'TEST',
      targetType: 'AuditTest',
      targetId: 'test-1',
      metadata: { source: 'GET /api/audit-test', at: new Date().toISOString() },
    })
    .then((event) => res.json({ ok: true, auditEvent: event }))
    .catch((err) => {
      logger.error('Audit test failed', err);
      res.status(500).json({ ok: false, error: err.message });
    });
});
```

## 5. Using in a NestJS app

### Install

```bash
npm i @sleek-sdk/auditor
```

Or install from local path:

```bash
npm i ../sdk-sleek-auditor-js
```

### Register module in `AppModule`

```typescript
import { AuditEventsClientModule } from '@sleek-sdk/auditor';

@Module({
  imports: [
    AuditEventsClientModule.register({
      baseUrl: 'http://localhost:3000/v1',
      apiKey: 'your-audit-api-key',
    }),
  ],
})
export class AppModule {}
```

### Inject and use

```typescript
import { Injectable } from '@nestjs/common';
import { AuditLogger } from '@sleek-sdk/auditor';

@Injectable()
export class OrderService {
  constructor(private readonly auditLogger: AuditLogger) {}

  async createOrder(userId: string, tenantId: string) {
    const order = { id: 'ord_123' };

    await this.auditLogger.log({
      service: 'order-service',
      actorId: userId,
      tenantId,
      clientId: 'staff_portal',
      action: 'CREATE',
      targetType: 'Order',
      targetId: order.id,
      afterState: order,
    });

    return order;
  }
}
```

### Optional: register with ConfigModule

```typescript
import { ConfigService } from '@nestjs/config';
import { AuditEventsClientModule } from '@sleek-sdk/auditor';

@Module({
  imports: [
    AuditEventsClientModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        baseUrl: config.get('AUDIT_SERVICE_BASE_URL'),
        apiKey: config.get('AUDIT_SERVICE_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Querying events

`AuditLogger` also provides `findAll(query?)` and `findOne(eventId)` for listing and fetching audit events:

```typescript
const page = await this.auditLogger.findAll({ page: 1, limit: 20, tenantId: 'tenant-1' });
const event = await this.auditLogger.findOne('event-uuid');
```
