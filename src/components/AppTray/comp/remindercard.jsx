export default function Reminder(){
    return (
        <div className="rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/25 p-3">
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-[10px] text-[#7B9EC8] mt-0.5">Due This Week</p>
            <div className="mt-2 space-y-0.5">
                <p className="text-[10px] text-[#F5A462]">4 Overdue</p>
                <p className="text-[10px] text-[#7B9EC8]">5 Due Today</p>
                <p className="text-[10px] text-[#7B9EC8]">9 New Tasks</p>
            </div>
        </div>
);
}