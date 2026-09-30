import datetime
import os
import uuid

from blu import BluApi, BluEvent

client = BluApi(
    api_key=os.environ["BLU_API_KEY"],   # from the seed output
    base_url="http://localhost:3000",    # overrides environment for local dev
)

event_id = str(uuid.uuid4())
client.ingestion.ingest_events(
    events=[
        BluEvent(
            event_id=event_id,
            event="python_smoke_test",
            user_id="py_user_1",
            timestamp=datetime.datetime.now(datetime.timezone.utc),
            properties={"source": "python-sandbox", "runtime": "cpython"},
        )
    ],
)

print(f"sent event_id={event_id}")