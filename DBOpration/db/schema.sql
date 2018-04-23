CREATE TABLE "MonitorData" (
	 "AnalyticsTime" TEXT(255,0) NOT NULL,
	 "DataFileName" TEXT(255,0) NOT NULL,
	 "SampleName" TEXT(255,0) NOT NULL,
	 "SampleType" TEXT(255,0) NOT NULL,
	 "CollectFun" TEXT(255,0) NOT NULL,
	 "PollutantName" TEXT(255,0) NOT NULL,
	 "MonitorValue" REAL(1000,10) NOT NULL,
	 "MonitorData" REAL(1000,10) NOT NULL,
     "Flag" TEXT(255,0) NOT NULL,
	 PRIMARY KEY ("AnalyticsTime", "PollutantName"); 
);
CREATE INDEX "MonitorTime_index" ON MonitorData ("AnalyticsTime" COLLATE NOCASE DESC);
CREATE TABLE "DataFile" (
	 "AnalyticsTime" TEXT(255,0) NOT NULL PRIMARY KEY,
	 "DataFileName" TEXT(255,0) NOT NULL,
	 "SampleName" TEXT(255,0) NOT NULL,
	 "SampleType" TEXT(255,0) NOT NULL,
	 "CollectFun" TEXT(255,0) NOT NULL,
	 "IsSuccess" INTEGER NOT NULL
);
CREATE INDEX "DataFile_index" ON DataFile ("AnalyticsTime" COLLATE NOCASE DESC);
