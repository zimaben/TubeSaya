
export default function HalfCardArea( ){
    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F5D6CC]/10 border border-[#F5D6CC]/20 p-3">
                <p className="text-2xl font-bold text-white">18</p>
                <p className="text-[10px] text-[#7B9EC8] mt-0.5">Planned Today</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-[10px] text-[#7B9EC8] mt-0.5">Finished Yesterday</p>
            </div>
        </div>
    );
}