import requests
import json
import random
from datetime import datetime, timedelta

# Ingestor URL
ingestor_url = "http://localhost:3000/ingest"

# Sample log data
sample_log = {
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
        "parentResourceId": "server-0987"
    }
}

# Function to generate a random log with variations
def generate_random_log():
    timestamp = datetime.utcnow() - timedelta(days=random.randint(0, 30))
    trace_id = f"{random.choice(['a', 'b', 'c'])}{random.choice(['1', '2', '3'])}-{random.choice(['x', 'y', 'z'])}{random.choice(['1', '2', '3'])}-{random.choice(['123', '456', '789'])}"
    span_id = f"span-{random.randint(100, 999)}"
    commit = f"{random.randint(0, 9)}e{random.randint(100000, 999999)}"
    parent_resource_id = f"server-{random.randint(1000, 9999)}"

    return {
        "level": random.choice(["info", "warning", "error"]),
        "message": random.choice(["Failed to connect to DB", "Timeout error", "Unknown error"]),
        "resourceId": f"server-{random.randint(1000, 9999)}",
        "timestamp": timestamp.isoformat() + "Z",
        "traceId": trace_id,
        "spanId": span_id,
        "commit": commit,
        "metadata": {
            "parentResourceId": parent_resource_id
        }
    }

# Number of logs to send
num_logs = 100

# Send random logs to the ingestor
for _ in range(num_logs):
    random_log = generate_random_log()

    try:
        response = requests.post(ingestor_url, json=random_log)
        response.raise_for_status()
        print(f"Log ingested successfully: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Error ingesting log: {e}")

print(f"Sent {num_logs} random logs to the log ingester.")
