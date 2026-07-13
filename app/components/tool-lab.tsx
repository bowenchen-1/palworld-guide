"use client";

import { useMemo, useState } from "react";

function NumberField({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (value: number) => void; min?: number }) {
  return (
    <label className="tool-field">
      <span>{label}</span>
      <input type="number" min={min} value={value} onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))} />
    </label>
  );
}

export default function ToolLab() {
  const [nodes, setNodes] = useState(8);
  const [yieldPerNode, setYieldPerNode] = useState(40);
  const [trips, setTrips] = useState(3);

  const [eggs, setEggs] = useState(24);
  const [incubators, setIncubators] = useState(6);
  const [minutesPerEgg, setMinutesPerEgg] = useState(30);

  const [workerCap, setWorkerCap] = useState(15);
  const [farmers, setFarmers] = useState(3);
  const [miners, setMiners] = useState(4);
  const [transporters, setTransporters] = useState(3);
  const [utility, setUtility] = useState(2);

  const resourceTotal = nodes * yieldPerNode * trips;
  const breeding = useMemo(() => {
    const safeIncubators = Math.max(1, incubators);
    const batches = Math.ceil(eggs / safeIncubators);
    return { batches, totalMinutes: batches * minutesPerEgg };
  }, [eggs, incubators, minutesPerEgg]);
  const usedWorkers = farmers + miners + transporters + utility;
  const openWorkers = workerCap - usedWorkers;

  return (
    <div className="tool-grid">
      <article className="tool-card tool-card-coral">
        <div className="tool-card-head"><span>◆</span><div><p>Resource Run</p><h3>Trip Yield Planner</h3></div></div>
        <p className="tool-copy">Estimate the haul from a marked node circuit before deciding whether another trip is worth it.</p>
        <div className="tool-fields">
          <NumberField label="Nodes" value={nodes} onChange={setNodes} min={1} />
          <NumberField label="Yield each" value={yieldPerNode} onChange={setYieldPerNode} min={1} />
          <NumberField label="Trips" value={trips} onChange={setTrips} min={1} />
        </div>
        <div className="tool-result"><span>Estimated haul</span><strong>{resourceTotal.toLocaleString()}</strong><small>resources before world-setting modifiers</small></div>
      </article>

      <article className="tool-card tool-card-blue">
        <div className="tool-card-head"><span>◉</span><div><p>Breeding</p><h3>Batch Time Planner</h3></div></div>
        <p className="tool-copy">Plan incubator capacity using the timer shown in your own world settings.</p>
        <div className="tool-fields">
          <NumberField label="Eggs" value={eggs} onChange={setEggs} min={1} />
          <NumberField label="Incubators" value={incubators} onChange={setIncubators} min={1} />
          <NumberField label="Minutes each" value={minutesPerEgg} onChange={setMinutesPerEgg} min={0} />
        </div>
        <div className="tool-result"><span>{breeding.batches} incubation batches</span><strong>{Math.floor(breeding.totalMinutes / 60)}h {breeding.totalMinutes % 60}m</strong><small>when all incubators start together</small></div>
      </article>

      <article className="tool-card tool-card-green">
        <div className="tool-card-head"><span>⌂</span><div><p>Base Roster</p><h3>Worker Slot Planner</h3></div></div>
        <p className="tool-copy">Sketch a worker roster and see whether the plan fits your current base limit.</p>
        <div className="tool-fields tool-fields-five">
          <NumberField label="Worker cap" value={workerCap} onChange={setWorkerCap} min={1} />
          <NumberField label="Farm" value={farmers} onChange={setFarmers} />
          <NumberField label="Mine" value={miners} onChange={setMiners} />
          <NumberField label="Transport" value={transporters} onChange={setTransporters} />
          <NumberField label="Utility" value={utility} onChange={setUtility} />
        </div>
        <div className={`tool-result ${openWorkers < 0 ? "tool-result-alert" : ""}`}>
          <span>{usedWorkers} of {workerCap} slots planned</span>
          <strong>{openWorkers >= 0 ? `${openWorkers} open` : `${Math.abs(openWorkers)} over`}</strong>
          <small>{openWorkers >= 0 ? "reserve open slots for specialists" : "reduce one role before deployment"}</small>
        </div>
      </article>
    </div>
  );
}
