import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

export interface MatrixPoint {
  id: string;
  label: string;
  competence: number;
  commitment: number;
  weight: number;
  kind: 'manager' | 'combined' | 'self';
}

const QUADRANTS = [
  { id: 'D1', x1: 1, x2: 3, y1: 3, y2: 5, fill: '#FEF3C7', labelX: 1.15, labelY: 4.85, color: '#B45309' },
  { id: 'D2', x1: 1, x2: 3, y1: 1, y2: 3, fill: '#FFE4E9', labelX: 1.15, labelY: 1.35, color: '#BE123C' },
  { id: 'D3', x1: 3, x2: 5, y1: 1, y2: 3, fill: '#EDE9FE', labelX: 4.35, labelY: 1.35, color: '#6D28D9' },
  { id: 'D4', x1: 3, x2: 5, y1: 3, y2: 5, fill: '#D1FAE5', labelX: 4.35, labelY: 4.85, color: '#047857' },
];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const p: MatrixPoint = payload[0].payload;
  return (
    <div className="rounded-xl bg-navy text-white px-4 py-3 text-xs shadow-xl">
      <div className="font-bold mb-1">{p.label}</div>
      <div>Competence: <span className="font-semibold">{p.competence.toFixed(2)}</span></div>
      <div>Commitment: <span className="font-semibold">{p.commitment.toFixed(2)}</span></div>
      {p.kind === 'manager' && <div>Weight: <span className="font-semibold">{p.weight.toFixed(2)}</span></div>}
    </div>
  );
}

function renderShape(props: any) {
  const { cx, cy, payload } = props;
  const p: MatrixPoint = payload;
  if (p.kind === 'combined') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={11} fill="#4F46E5" fillOpacity={0.18} />
        <circle cx={cx} cy={cy} r={7} fill="#4F46E5" stroke="#fff" strokeWidth={2} />
      </g>
    );
  }
  if (p.kind === 'self') {
    return <circle cx={cx} cy={cy} r={6.5} fill="white" stroke="#8B5CF6" strokeWidth={2.5} />;
  }
  return <circle cx={cx} cy={cy} r={5.5} fill="#172554" fillOpacity={0.75} stroke="#fff" strokeWidth={1.5} />;
}

export function ScatterMatrix({ points }: { points: MatrixPoint[] }) {
  const managers = points.filter((p) => p.kind === 'manager');
  const combined = points.filter((p) => p.kind === 'combined');
  const self = points.filter((p) => p.kind === 'self');

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid stroke="#eef0f6" />
          {QUADRANTS.map((q) => (
            <ReferenceArea key={q.id} x1={q.x1} x2={q.x2} y1={q.y1} y2={q.y2} fill={q.fill} fillOpacity={0.35} ifOverflow="extendDomain" />
          ))}
          <ReferenceLine x={2.5} stroke="#cbd5e1" strokeDasharray="4 4" />
          <ReferenceLine x={3.5} stroke="#cbd5e1" strokeDasharray="4 4" />
          <ReferenceLine y={2.5} stroke="#cbd5e1" strokeDasharray="4 4" />
          <ReferenceLine y={3.5} stroke="#cbd5e1" strokeDasharray="4 4" />
          <XAxis
            type="number"
            dataKey="competence"
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: 'COMPETENCE — Low → High', position: 'insideBottom', offset: -10, fontSize: 11, fontWeight: 600, fill: '#64748b' }}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            type="number"
            dataKey="commitment"
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: 'COMMITMENT — Low → High', angle: -90, position: 'insideLeft', fontSize: 11, fontWeight: 600, fill: '#64748b' }}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={managers} shape={renderShape} />
          <Scatter data={self} shape={renderShape} />
          <Scatter data={combined} shape={renderShape} />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
        {QUADRANTS.map((q) => (
          <span key={q.id} className="text-[10px] font-bold" style={{ color: q.color }}>
            {q.id}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-navy/75" /> Manager</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-primary border-2 border-white ring-2 ring-primary/30" /> Combined Result</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white border-2 border-violet-500" /> Self-Assessment</span>
      </div>
    </div>
  );
}
