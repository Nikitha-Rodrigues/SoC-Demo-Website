import json
import pymysql
from collections import defaultdict

ATTACK_JSONL = "C:/Users/Nikitha/Downloads/5th_sem/aiml_dbms_lab/SendPackets/attck_jsonl.jsonl"

# -----------------------
# DB connection
# -----------------------
db = pymysql.connect(
    host="localhost",
    user="root",
    password="Qplb@1716122",
    database="COVERT_CHANNEL",
    autocommit=False
)
cursor = db.cursor()

# -----------------------
# Load JSONL
# -----------------------
entries = []
with open(ATTACK_JSONL, "r", encoding="utf-8") as f:
    for line in f:
        entries.append(json.loads(line))

print(f"Loaded {len(entries)} attack log entries")

# -----------------------
# Group by attack_run_id
# -----------------------
attacks = defaultdict(list)
for e in entries:
    if "attack_run_id" in e:
        attacks[e["attack_run_id"]].append(e)

# -----------------------
# Get next AttackID
# -----------------------
cursor.execute("SELECT COALESCE(MAX(AttackID), 0) FROM attack")
next_attack_id = cursor.fetchone()[0] + 1

# -----------------------
# Insert attacks
# -----------------------
for attack_run_id, logs in attacks.items():

    attack_id = next_attack_id
    next_attack_id += 1

    attack_name = None
    start_ts = None
    end_ts = None

    packets_seen = set()
    vulnerabilities = set()

    # ---- extract metadata ----
    for e in logs:
        if e.get("type") == "ATTACK_END":
            end_ts = e.get("attack_end_timestamp")
        else:
            attack_name = e.get("attack_name")
            start_ts = e.get("attack_start_timestamp")
            packets_seen.add(e["packet_id"])
            for v in e.get("vulnerability_ids", []):
                vulnerabilities.add(v)

    # ---- insert ATTACK ----
    cursor.execute(
        """
        INSERT INTO attack (AttackID, AttackName, StartTimestamp, EndTimestamp)
        VALUES (%s, %s, %s, %s)
        """,
        (attack_id, attack_name, start_ts, end_ts)
    )

    # ---- insert ATTACK_PACKET ----
    for pkt_id in packets_seen:
        cursor.execute(
            """
            INSERT IGNORE INTO attack_packet (AttackID, PacketID)
            VALUES (%s, %s)
            """,
            (attack_id, pkt_id)
        )

    # ---- insert ATTACK_VULNERABILITY ----
    for vuln_id in vulnerabilities:
        cursor.execute(
            """
            INSERT IGNORE INTO attack_vulnerability (AttackID, VulnerabilityID)
            VALUES (%s, %s)
            """,
            (attack_id, vuln_id)
        )

    # ---- insert ATTACK_MODIFICATION ----
    for e in logs:
        if e.get("type") == "ATTACK_END":
            continue

        cursor.execute(
            """
            INSERT INTO attack_modification
                (AttackID, PacketID, ModifiedField, OriginalValue, ModiifedValue)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                attack_id,
                e["packet_id"],
                e["modified_field"],
                str(e.get("original_value")),
                str(e.get("modified_value"))
            )
        )

    print(f"Inserted AttackID={attack_id} with {len(packets_seen)} packets")

# -----------------------
# Commit & close
# -----------------------
db.commit()
cursor.close()
db.close()

print("All attacks inserted successfully.")
