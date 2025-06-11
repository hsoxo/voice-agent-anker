import React, { useEffect, useRef, useState } from "react";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesReferenceLine,
} from "react-sparklines";
import { Loader2, X } from "lucide-react";

import { Button } from "../../ui/button";
import HelpTip from "../../ui/helptip";

const StatsTile = ({
  service,
  metric,
  tip,
  sub = "s",
  multiplier = 3,
  data,
}: {
  service: string;
  sub?: string;
  metric: string;
  tip?: string;
  multiplier?: number;
  data: MetricValue;
}) => {
  return (
    <div className="text-sm bg-white border border-primary-200 rounded-md">
      <header className="p-3">
        <div className="font-semibold text-base mb-3 flex flex-row gap-1 items-center">
          {service.charAt(0).toUpperCase() + service.slice(1)} {metric}
          {tip && <HelpTip text={tip} />}
        </div>
        <div className="bg-primary-50 rounded-md text-xs uppercase tracking-wide flex flex-wrap items-center justify-center gap-2 px-3 py-2">
          <span>Latest</span>
          <span className="font-medium">
            {data.latest?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
      </header>
      <div className="px-3">
        <Sparklines
          data={data.timeseries}
          limit={20}
          height={80}
          svgHeight={80}
        >
          <SparklinesBars style={{ fill: "#41c3f9", fillOpacity: ".25" }} />
          <SparklinesLine style={{ stroke: "#41c3f9", fill: "none" }} />
          <SparklinesReferenceLine type="mean" />
        </Sparklines>
      </div>
      <footer className="border-t border-primary-200 text-[11px] font-mono flex flex-row justify-between px-3 py-2">
        <div className="uppercase font-bold flex gap-1">
          H:
          <span className="font-normal">
            {data.high?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
        <div className="uppercase font-bold flex gap-1">
          M:
          <span className="font-normal">
            {data.median?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
        <div className="uppercase font-bold flex gap-1">
          L:
          <span className="font-normal">
            {data.low?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
      </footer>
    </div>
  );
};

interface StatsProps {
  statsAggregator: StatsAggregator;
  handleClose?: () => void;
}

const Stats = React.memo(
  ({ statsAggregator, handleClose }: StatsProps) => {
    const [currentStats, setCurrentStats] = useState<StatsMap>(
      statsAggregator.statsMap
    );
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const newStats = statsAggregator.getStats();
        if (newStats) setCurrentStats({ ...newStats });
      }, 2500);
      return () => clearInterval(intervalRef.current!);
    }, [statsAggregator]);

    return (
      <div className="absolute z-[9999] left-0 right-0 bottom-0 w-[var(--layout-aside-width)] bg-white border-t border-primary-200 shadow-[var(--tw-shadow-stats)] animate-[appear_0.3s_ease-in-out] text-left md:relative md:h-full md:z-[1] md:bg-transparent md:border-t-0 md:border-l md:shadow-none">
        {handleClose && (
          <div className="text-center md:text-right">
            <Button
              variant="icon"
              size="iconSm"
              onClick={handleClose}
              className="m-3"
            >
              <X />
            </Button>
          </div>
        )}
        <div className="select-none px-3 pt-0 pb-4 overflow-x-scroll flex flex-row gap-8 md:flex-col md:flex-wrap md:h-full md:overflow-x-visible md:overflow-y-scroll md:pb-[100px]">
          <section className="flex flex-row gap-6 md:flex-col md:flex-wrap">
            {Object.entries(currentStats).length < 1 ? (
              <div>
                <Loader2 className="animate-spin mx-auto" />
              </div>
            ) : (
              Object.entries(currentStats).map(([service, data], index) => (
                <div
                  key={service}
                  className="flex flex-row gap-2 md:flex-col md:gap-6"
                >
                  <StatsTile
                    key={`${service}-ttfb-${index}`}
                    metric="TTFB"
                    tip="Time to first byte"
                    service={service}
                    multiplier={3}
                    data={data.ttfb}
                  />
                  {data.characters && (
                    <StatsTile
                      key={`${service}-chars-${index}`}
                      metric="Characters"
                      sub=""
                      service={service}
                      multiplier={0}
                      data={data.characters}
                    />
                  )}
                  {data.processing && (
                    <StatsTile
                      key={`${service}-proc-${index}`}
                      metric="Processing"
                      service={service}
                      data={data.processing}
                    />
                  )}
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    );
  },
  () => true
);

export default Stats;
