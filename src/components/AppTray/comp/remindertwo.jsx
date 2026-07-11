
export default function ReminderTwo () {
    return (
        <div className="rounded-xl bg-white/8 border border-white/10 p-3">
            <p className="text-[10px] text-[#7B9EC8] mb-1">30 min call with Client</p>
            <p className="text-xs font-semibold text-white">Project Discovery Call</p>
            <div className="mt-3 flex items-center justify-between">
                <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-[#4A7A47]/60 border-2 border-[#1E2533]"></div>
                <div className="w-6 h-6 rounded-full bg-[#F5A462]/60 border-2 border-[#1E2533]"></div>
                <div className="w-6 h-6 rounded-full bg-[#8B6BB1]/60 border-2 border-[#1E2533]"></div>
                </div>
                <span className="text-sm font-mono font-bold text-white">28:35</span>
            </div>
        </div>
    );
}