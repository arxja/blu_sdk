# Reference
## Ingestion
<details><summary><code>client.ingestion.<a href="src/blu/ingestion/client.py">ingest_events</a>(...)</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Accepts a batch of normalized Blu events for the tenant associated
with the supplied ingestion API key.

The tenant is derived from the API key. `tenantId`, plan, billing
status, and other Blu-owned fields must not be supplied by the client.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```python
from blu import BluApi, BluEvent
from blu.environment import BluApiEnvironment
import datetime

client = BluApi(
    api_key="<value>",
    environment=BluApiEnvironment.PRODUCTION,
)

client.ingestion.ingest_events(
    events=[
        BluEvent(
            event_id="550e8400-e29b-41d4-a716-446655440000",
            event="purchase_completed",
            user_id="user_123",
            anonymous_id="anonymous_456",
            group_id="group_789",
            timestamp=datetime.datetime.fromisoformat("2026-09-26T08:00:00+00:00"),
            properties={
                "productId": "prod_123",
                "amount": 49,
                "currency": "USD"
            },
            context={
                "page": "/checkout"
            },
        )
    ],
)

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**events:** `typing.List[BluEvent]` — Batch of normalized Blu events. The entire batch is accepted or rejected as a unit in v1.
    
</dd>
</dl>

<dl>
<dd>

**request_options:** `typing.Optional[RequestOptions]` — Request-specific configuration.
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

