# Sleek Audit Log -- Local Setup & Usage

## 1. Run Audit Service Locally

### Start `sleek-nest-audit`

``` bash
cd sleek-nest-audit
npm install
npm run db:start
npm run start:dev
```

Audit service will run on:

    http://localhost:3003/v1

------------------------------------------------------------------------

# 2. Build Audit Client SDK

``` bash
cd sleek-sdk-audit-client
npm install
npm run build
```

------------------------------------------------------------------------

# 3. Use Audit Client in Other Services

## Environment Variables

Add the following variables:

``` bash
export AUDIT_SERVICE_BASE_URL=http://localhost:3003/v1
export AUDIT_SERVICE_API_KEY=your-audit-api-key
```

------------------------------------------------------------------------

# 4. Using in an Express Service

### Install SDK

``` bash
npm i ../sleek-sdk-audit-client
```

### Inject `AuditLogsClientService`

``` javascript
const { AuditLogsClientService } = require('@sleek-sdk/audit-client');

app.set(
  'auditService',
  new AuditLogsClientService({
    baseUrl: process.env.AUDIT_SERVICE_BASE_URL,
    apiKey: process.env.AUDIT_SERVICE_API_KEY,
  }),
);
```

### Example Route

``` javascript
app.get("/api/audit-test", function (req, res) {
  const auditService = req.app.get("auditService");

  if (!auditService) {
    return res.status(503).json({
      ok: false,
      message: "Audit service not configured (missing config or env)"
    });
  }

  auditService
    .create({
      serviceName: "sleek-back",
      entityType: "AuditTest",
      entityId: null,
      action: "TEST",
      actorId: req.user?._id?.toString() || null,
      payload: {
        source: "GET /api/audit-test",
        at: new Date().toISOString(),
      },
      createdBy: req.user?._id?.toString() || null,
    })
    .then((log) => res.json({ ok: true, auditLog: log }))
    .catch((err) => {
      logger.error("Audit test failed", err);
      res.status(500).json({ ok: false, error: err.message });
    });
});
```

------------------------------------------------------------------------

# 5. Using in a NestJS Service

### Install SDK

``` bash
npm i ../sleek-sdk-audit-client
```

### Import Module in `AppModule`

``` typescript
import { AuditLogsClientModule } from '@sleek-sdk/audit-client';

@Module({
  imports: [
    AuditLogsClientModule.register({
      baseUrl: 'http://localhost:3003/v1',
      apiKey: 'your-audit-api-key',
    }),
  ],
})
export class AppModule {}
```

### Inject `AuditLogsClientService`

``` typescript
import { Injectable } from '@nestjs/common';
import { AuditLogsClientService } from '@sleek-sdk/audit-client';

@Injectable()
export class OrderService {
  constructor(private readonly auditClient: AuditLogsClientService) {}

  async createOrder(userId: string) {
    const order = { id: 'ord_123' };

    await this.auditClient.create({
      serviceName: 'order-service',
      entityType: 'Order',
      entityId: order.id,
      action: 'CREATE',
      actorId: userId,
      payload: { after: order },
      createdBy: userId,
    });

    return order;
  }
}
```
