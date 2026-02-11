# SoC Demo Website Instructions #
### Creation of MySQL database ###

1. Creation of flow table

   1. CREATE TABLE flow (
                                                 ->     FlowID INT PRIMARY KEY,                             -- Assuming FlowID is unique
                                                 ->     SourceIP VARCHAR(15) NOT NULL,                      -- IP addresses are typically in 'xxx.xxx.xxx.xxx' format
                                                 ->     DestinationIP VARCHAR(15) NOT NULL,                 -- Same as SourceIP
                                                 ->     SourcePort INT UNSIGNED NOT NULL,                   -- Port numbers are integers between 0 and 65535
                                                 ->     DestinationPort INT UNSIGNED NOT NULL,              -- Same as SourcePort
                                                 ->     Protocol VARCHAR(10) NOT NULL,                      -- Protocol could be a string like 'TCP', 'UDP', etc.
                                                 ->     FlowStartTime DOUBLE NOT NULL,                       -- Assuming this represents a timestamp as a float/double
                                                 ->     FlowEndTime DOUBLE NOT NULL,                         -- Same as FlowStartTime
                                                 ->     FlowDuration DOUBLE NOT NULL,                       -- Duration in seconds (float/double)
                                                 ->     TotalFwdPackets INT UNSIGNED NOT NULL,              -- Number of packets in the forward direction
                                                 ->     TotalBwdPackets INT UNSIGNED NOT NULL,              -- Number of packets in the backward direction
                                                 ->     TotalLengthFwdPackets INT UNSIGNED NOT NULL,        -- Total length of forward packets
                                                 ->     FwdPacketLengthMean DOUBLE NOT NULL,                -- Mean length of forward packets
                                                 ->     FwdPacketLengthStd DOUBLE NOT NULL,                 -- Standard deviation of forward packet length
                                                 ->     FwdPacketLengthMin INT UNSIGNED NOT NULL,           -- Minimum length of forward packets
                                                 ->     FwdPacketLengthMax INT UNSIGNED NOT NULL,           -- Maximum length of forward packets
                                                 ->     TotalLengthBwdPackets INT UNSIGNED NOT NULL,        -- Total length of backward packets
                                                 ->     BwdPacketLengthMean DOUBLE NOT NULL,                -- Mean length of backward packets
                                                 ->     BwdPacketLengthStd DOUBLE NOT NULL,                 -- Standard deviation of backward packet length
                                                 ->     BwdPacketLengthMin INT UNSIGNED NOT NULL,           -- Minimum length of backward packets
                                                 ->     BwdPacketLengthMax INT UNSIGNED NOT NULL,           -- Maximum length of backward packets
                                                 ->     FlowBytesPerSec DOUBLE NOT NULL,                    -- Flow bytes per second (float/double)
                                                 ->     FlowPktsPerSec DOUBLE NOT NULL,                     -- Flow packets per second (float/double)
                                                 ->     FwdPktsPerSec DOUBLE NOT NULL,                      -- Forward packets per second
                                                 ->     BwdPktsPerSec DOUBLE NOT NULL,                      -- Backward packets per second
                                                 ->     FwdAvgBytesPerBulk DOUBLE NOT NULL,                 -- Forward average bytes per bulk
                                                 ->     FwdAvgPktsPerBulk DOUBLE NOT NULL,                  -- Forward average packets per bulk
                                                 ->     BwdAvgBytesPerBulk DOUBLE NOT NULL,                 -- Backward average bytes per bulk
                                                 ->     BwdAvgPktsPerBulk DOUBLE NOT NULL,                  -- Backward average packets per bulk
                                                 ->     FlowIATMean DOUBLE NOT NULL,                        -- Flow inter-arrival time mean
                                                 ->     FlowIATStd DOUBLE NOT NULL,                         -- Flow inter-arrival time standard deviation
                                                 ->     FlowIATMin DOUBLE NOT NULL,                         -- Flow inter-arrival time minimum
                                                 ->     FlowIATMax DOUBLE NOT NULL,                         -- Flow inter-arrival time maximum
                                                 ->     FwdIATMean DOUBLE NOT NULL,                         -- Forward inter-arrival time mean
                                                 ->     FwdIATStd DOUBLE NOT NULL,                          -- Forward inter-arrival time standard deviation
                                                 ->     FwdIATMin DOUBLE NOT NULL,                          -- Forward inter-arrival time minimum
                                                 ->     FwdIATMax DOUBLE NOT NULL,                          -- Forward inter-arrival time maximum
                                                 ->     FwdIATTotal DOUBLE NOT NULL,                        -- Forward inter-arrival time total
                                                 ->     BwdIATMean DOUBLE NOT NULL,                         -- Backward inter-arrival time mean
                                                 ->     BwdIATStd DOUBLE NOT NULL,                          -- Backward inter-arrival time standard deviation
                                                 ->     BwdIATMin DOUBLE NOT NULL,                          -- Backward inter-arrival time minimum
                                                 ->     BwdIATMax DOUBLE NOT NULL,                          -- Backward inter-arrival time maximum
                                                 ->     BwdIATTotal DOUBLE NOT NULL,                        -- Backward inter-arrival time total
                                                 ->     FINFlagCount INT UNSIGNED NOT NULL,                 -- Number of FIN flags
                                                 ->     SYNFlagCount INT UNSIGNED NOT NULL,                 -- Number of SYN flags
                                                 ->     RSTFlagCount INT UNSIGNED NOT NULL,                 -- Number of RST flags
                                                 ->     PSHFlagCount INT UNSIGNED NOT NULL,                 -- Number of PSH flags
                                                 ->     ACKFlagCount INT UNSIGNED NOT NULL,                 -- Number of ACK flags
                                                 ->     URGFlagCount INT UNSIGNED NOT NULL,                 -- Number of URG flags
						 ->	Label varchar(20) not null);
