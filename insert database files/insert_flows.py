import json
import pymysql

# -----------------------
# 1. Read flows from flows_jsonl.jsonl
# -----------------------
        
flows = []

with open(
    "C:/Users/Nikitha/Downloads/5th_sem/aiml_dbms_lab/CapturePackets/flow_jsonl.jsonl",
    "r"
) as f:
    for line in f:
        line = line.strip()
        if line:
            flows.append(json.loads(line))

if not flows:
    print("No flows found in flows_jsonl.jsonl")
else:
    # -----------------------
    # 2. Connect to database
    # -----------------------
    db = pymysql.connect(
        host="localhost",
        user="root",
        password="Qplb@1716122",
        database="COVERT_CHANNEL"
    )

    cursor = db.cursor()

    # -----------------------
    # 3. Insert each flow
    # -----------------------
    sql = """
    INSERT INTO flow (
            FlowID, SourceIP, DestinationIP, SourcePort, DestinationPort,
            Protocol, FlowStartTime, FlowEndTime, FlowDuration,
            TotalFwdPackets, TotalBwdPackets, TotalLengthFwdPackets, TotalLengthBwdPackets,
            FwdPacketLengthMean, FwdPacketLengthStd, FwdPacketLengthMin, FwdPacketLengthMax,
            BwdPacketLengthMean, BwdPacketLengthStd, BwdPacketLengthMin, BwdPacketLengthMax,
            FlowBytesPerSec, FlowPktsPerSec, FwdPktsPerSec, BwdPktsPerSec,
            FwdAvgBytesPerBulk, FwdAvgPktsPerBulk, BwdAvgBytesPerBulk, BwdAvgPktsPerBulk,
            FlowIATMean, FlowIATStd, FlowIATMin, FlowIATMax,
            FwdIATMean, FwdIATStd, FwdIATMin, FwdIATMax, FwdIATTotal,
            BwdIATMean, BwdIATStd, BwdIATMin, BwdIATMax, BwdIATTotal,
            FINFlagCount, SYNFlagCount, RSTFlagCount, PSHFlagCount, ACKFlagCount, URGFlagCount,
            Label
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s,
            %s
        )
        ON DUPLICATE KEY UPDATE
            SourceIP=VALUES(SourceIP),
            DestinationIP=VALUES(DestinationIP),
            SourcePort=VALUES(SourcePort),
            DestinationPort=VALUES(DestinationPort),
            Protocol=VALUES(Protocol),
            FlowStartTime=VALUES(FlowStartTime),
            FlowEndTime=VALUES(FlowEndTime),
            FlowDuration=VALUES(FlowDuration),
            TotalFwdPackets=VALUES(TotalFwdPackets),
            TotalBwdPackets=VALUES(TotalBwdPackets),
            TotalLengthFwdPackets=VALUES(TotalLengthFwdPackets),
            TotalLengthBwdPackets=VALUES(TotalLengthBwdPackets),
            FwdPacketLengthMean=VALUES(FwdPacketLengthMean),
            FwdPacketLengthStd=VALUES(FwdPacketLengthStd),
            FwdPacketLengthMin=VALUES(FwdPacketLengthMin),
            FwdPacketLengthMax=VALUES(FwdPacketLengthMax),
            BwdPacketLengthMean=VALUES(BwdPacketLengthMean),
            BwdPacketLengthStd=VALUES(BwdPacketLengthStd),
            BwdPacketLengthMin=VALUES(BwdPacketLengthMin),
            BwdPacketLengthMax=VALUES(BwdPacketLengthMax),
            FlowBytesPerSec=VALUES(FlowBytesPerSec),
            FlowPktsPerSec=VALUES(FlowPktsPerSec),
            FwdPktsPerSec=VALUES(FwdPktsPerSec),
            BwdPktsPerSec=VALUES(BwdPktsPerSec),
            FwdAvgBytesPerBulk=VALUES(FwdAvgBytesPerBulk),
            FwdAvgPktsPerBulk=VALUES(FwdAvgPktsPerBulk),
            BwdAvgBytesPerBulk=VALUES(BwdAvgBytesPerBulk),
            BwdAvgPktsPerBulk=VALUES(BwdAvgPktsPerBulk),
            FlowIATMean=VALUES(FlowIATMean),
            FlowIATStd=VALUES(FlowIATStd),
            FlowIATMin=VALUES(FlowIATMin),
            FlowIATMax=VALUES(FlowIATMax),
            FwdIATMean=VALUES(FwdIATMean),
            FwdIATStd=VALUES(FwdIATStd),
            FwdIATMin=VALUES(FwdIATMin),
            FwdIATMax=VALUES(FwdIATMax),
            FwdIATTotal=VALUES(FwdIATTotal),
            BwdIATMean=VALUES(BwdIATMean),
            BwdIATStd=VALUES(BwdIATStd),
            BwdIATMin=VALUES(BwdIATMin),
            BwdIATMax=VALUES(BwdIATMax),
            BwdIATTotal=VALUES(BwdIATTotal),
            FINFlagCount=VALUES(FINFlagCount),
            SYNFlagCount=VALUES(SYNFlagCount),
            RSTFlagCount=VALUES(RSTFlagCount),
            PSHFlagCount=VALUES(PSHFlagCount),
            ACKFlagCount=VALUES(ACKFlagCount),
            URGFlagCount=VALUES(URGFlagCount),
            Label=VALUES(Label)
    """

    for flw in flows:
        values = (
            flw.get("FlowID"),
            flw.get("SourceIP"),
            flw.get("DestinationIP"),
            flw.get("SourcePort"),
            flw.get("DestinationPort"),
            flw.get("Protocol"),
            flw.get("FlowStartTime"),
            flw.get("FlowEndTime"),
            flw.get("FlowDuration"),
            flw.get("TotalFwdPackets", 0),
            flw.get("TotalBwdPackets", 0),
            flw.get("TotalLengthFwdPackets", 0),
            flw.get("TotalLengthBwdPackets", 0),
            flw.get("FwdPacketLengthMean", 0),
            flw.get("FwdPacketLengthStd", 0),
            flw.get("FwdPacketLengthMin", 0),
            flw.get("FwdPacketLengthMax", 0),
            flw.get("BwdPacketLengthMean", 0),
            flw.get("BwdPacketLengthStd", 0),
            flw.get("BwdPacketLengthMin", 0),
            flw.get("BwdPacketLengthMax", 0),
            flw.get("FlowBytesPerSec", 0),
            flw.get("FlowPktsPerSec", 0),
            flw.get("FwdPktsPerSec", 0),
            flw.get("BwdPktsPerSec", 0),
            flw.get("FwdAvgBytesPerBulk", 0),
            flw.get("FwdAvgPktsPerBulk", 0),
            flw.get("BwdAvgBytesPerBulk", 0),
            flw.get("BwdAvgPktsPerBulk", 0),
            flw.get("FlowIATMean", 0),
            flw.get("FlowIATStd", 0),
            flw.get("FlowIATMin", 0),
            flw.get("FlowIATMax", 0),
            flw.get("FwdIATMean", 0),
            flw.get("FwdIATStd", 0),
            flw.get("FwdIATMin", 0),
            flw.get("FwdIATMax", 0),
            flw.get("FwdIATTotal", 0),
            flw.get("BwdIATMean", 0),
            flw.get("BwdIATStd", 0),
            flw.get("BwdIATMin", 0),
            flw.get("BwdIATMax", 0),
            flw.get("BwdIATTotal", 0),
            flw.get("FINFlagCount", 0),
            flw.get("SYNFlagCount", 0),
            flw.get("RSTFlagCount", 0),
            flw.get("PSHFlagCount", 0),
            flw.get("ACKFlagCount", 0),
            flw.get("URGFlagCount", 0),
            flw.get("Label")
        )

        cursor.execute(sql, values)

    db.commit()
    cursor.close()
    db.close()

    print(f"Inserted/updated {len(flows)} flows successfully!")
