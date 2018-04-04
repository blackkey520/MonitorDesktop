CREATE TABLE "MonitorData" (
	 "Data_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	 "MonitorTime" TEXT(255,0) NOT NULL,
	 "PollutantCode" TEXT(255,0) NOT NULL,
	 "MonitorValue" REAL(1000,10) NOT NULL,
     "Flag" TEXT(255,0) NOT NULL
);
CREATE INDEX "MonitorTime_index" ON MonitorData ("MonitorTime" COLLATE NOCASE DESC);
