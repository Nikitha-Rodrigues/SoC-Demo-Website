import json
import pymysql

# =========================================================
# CONFIGURATION
# =========================================================

PACKET_JSONL_PATH = ("C:/Users/Nikitha/Downloads/5th_sem/aiml_dbms_lab/CapturePackets/CaptureUnseenAttacks/correct_mixed_test_packets.jsonl")
FLOW_JSONL_PATH = ("C:/Users/Nikitha/Downloads/5th_sem/aiml_dbms_lab/CapturePackets/flow_jsonl.jsonl")
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Qplb@1716122",
    "database": "COVERT_CHANNEL"
}

# =========================================================
# DEFAULT HANDLING
# =========================================================

DEFAULTS = {
    "int": 0,
    "float": 0.0,
    "str": ""
}

def get(pkt, key, dtype="int"):
    value = pkt.get(key)
    if value is None:
        return DEFAULTS[dtype]
    return value

# =========================================================
# LOAD FLOW → FLOWID MAPPING
# =========================================================

def load_flow_mapping(flow_jsonl_path):
    """
    Build mapping:
    (src_ip, dst_ip, src_port, dst_port, protocol) -> FlowID
    """
    flow_map = {}

    with open(flow_jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            flow = json.loads(line)

            key = (
                flow["SourceIP"],
                flow["DestinationIP"],
                flow["SourcePort"],
                flow["DestinationPort"],
                flow["Protocol"]
            )
            flow_map[key] = flow["FlowID"]

    return flow_map

# =========================================================
# MAIN INSERTION LOGIC
# =========================================================

def insert_packets():
    # -----------------------
    # Load packets
    # -----------------------
    packets = []
    with open(PACKET_JSONL_PATH, "r", encoding="utf-8") as f:
        for line in f:
            packets.append(json.loads(line))

    print(f"Loaded {len(packets)} packets")

    # -----------------------
    # Load flows
    # -----------------------
    flow_map = load_flow_mapping(FLOW_JSONL_PATH)
    print(f"Loaded {len(flow_map)} flows")

    # -----------------------
    # DB connection
    # -----------------------
    db = pymysql.connect(**DB_CONFIG)
    cursor = db.cursor()

    # -----------------------
    # SQL INSERT (31 fields)
    # -----------------------
    sql = """
    INSERT INTO packet (
        PacketID,
        SourceIP,
        DestinationIP,
        SourcePort,
        DestinationPort,
        Protocol,
        PacketLength,
        TCPHeaderLength,
        TCPPayloadLength,
        UDPLength,
        UDPPayloadLength,
        IPHeaderLength,
        IPTotalLength,
        EthernetHeaderLength,
        Timestamp,
        TCPSYN,
        TCPACK,
        TCPFIN,
        TCPRST,
        TCPPSH,
        TCPURG,
        TCPDataofs,
        TCPWindow,
        TCPReserved,
        Seq,
        Ack,
        IPID,
        IPTTL,
        IAT,
        label,
        FlowID
    )
    VALUES (
        %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s,
        %s, %s, %s, %s,
        %s, %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s,
        %s, %s, %s, %s, %s, %s
    )
    """

    # -----------------------
    # Insert packets
    # -----------------------
    inserted = 0

    for pkt in packets:
        packet_id = get(pkt, "packet_id")

        flow_key = (
            pkt.get("src_ip"),
            pkt.get("dst_ip"),
            pkt.get("src_port"),
            pkt.get("dst_port"),
            pkt.get("protocol")
        )
        reverse_key = (
            pkt.get("dst_ip"),
            pkt.get("src_ip"),
            pkt.get("dst_port"),
            pkt.get("src_port"),
            pkt.get("protocol")
        )

        flow_id = flow_map.get(flow_key) or flow_map.get(reverse_key)

        values = (
            packet_id,
            get(pkt, "src_ip", "str"),
            get(pkt, "dst_ip", "str"),
            get(pkt, "src_port"),
            get(pkt, "dst_port"),
            get(pkt, "protocol", "str"),
            get(pkt, "packet_length"),
            get(pkt, "tcp_header_length"),
            get(pkt, "tcp_payload_length"),
            get(pkt, "udp_length"),
            get(pkt, "udp_payload_length"),
            get(pkt, "ip_header_length"),
            get(pkt, "ip_total_length"),
            get(pkt, "ethernet_header_length"),
            get(pkt, "timestamp", "float"),
            get(pkt, "tcp_syn"),
            get(pkt, "tcp_ack"),
            get(pkt, "tcp_fin"),
            get(pkt, "tcp_rst"),
            get(pkt, "tcp_psh"),
            get(pkt, "tcp_urg"),
            get(pkt, "tcp_dataofs"),
            get(pkt, "tcp_window"),
            get(pkt, "tcp_reserved"),
            get(pkt, "seq"),
            get(pkt, "ack"),
            get(pkt, "IPID"),
            get(pkt, "ip_ttl"),
            get(pkt, "IAT", "float"),
            get(pkt, "Label", "str"),
            flow_id
        )

        cursor.execute(sql, values)
        inserted += 1

        if inserted % 5000 == 0:
            print(f"Inserted {inserted} packets...")

    # -----------------------
    # Commit & close
    # -----------------------
    db.commit()
    cursor.close()
    db.close()

    print(f"✅ Successfully inserted {inserted} packets")

# =========================================================
# ENTRY POINT
# =========================================================

if __name__ == "__main__":
    insert_packets()
