export default function IntensitySlider({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-end justify-between">
        <p className="text-sm font-semibold text-dash-primary">Seberapa kuat perasaan ini?</p>
        <p className="text-2xl leading-8 font-bold tracking-[-0.22px] text-dash-primary">{value}</p>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-dash-primary h-1.5 rounded-lg cursor-pointer"
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-dash-linkMuted">SANGAT LEMAH</span>
        <span className="text-[11px] font-bold text-dash-linkMuted">SANGAT KUAT</span>
      </div>
    </div>
  );
}
