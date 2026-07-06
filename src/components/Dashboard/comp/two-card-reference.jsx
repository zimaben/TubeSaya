export default function TwoCardBS(){
    return(
                <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#F5A462] to-[#E8754A] p-5 text-white">
            <div className="text-xs font-medium opacity-80 mb-3 uppercase tracking-wide">R&amp;D Banking</div>
            <p className="text-sm font-semibold leading-snug">New Banking Mobile App</p>
            <div className="mt-4 flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-white/40 border-2 border-white/60"></div>
              <div className="w-6 h-6 rounded-full bg-white/30 border-2 border-white/60"></div>
              <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-white/60"></div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[#8B6BB1] to-[#5E3E8C] p-5 text-white">
            <div className="text-xs font-medium opacity-80 mb-3 uppercase tracking-wide">Design Sprint</div>
            <p className="text-sm font-semibold leading-snug">Create Signup Page</p>
            <div className="mt-4 flex items-center justify-end">
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <span className="text-lg font-bold">47%</span>
              </div>
            </div>
          </div>
        </div>
    );
}