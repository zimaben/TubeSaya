import Calendar from "./comp/calendar";
import Reminder from "./comp/remindercard";
import ReminderTwo from "./comp/remindertwo";
import HalfCardArea from "./comp/HalfCardArea";

export default function AppTray(){

    return (
        <div className="w-60 flex-shrink-0 bg-[#1E2533] rounded-2xl flex flex-col overflow-hidden text-white">
            <div className="px-5 pt-5 pb-4 border-b border-white/10">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#7B9EC8]">AppTray</span>
                <h2 className="mt-1 text-[15px] font-semibold text-white">Activity</h2>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">

                {/* <ReminderTwo /> */}

                {/* <HalfCardArea /> */}

                {/* <Reminder /> */}

                {/* <Calendar /> */}
            </div>
        </div>
    
    );
}