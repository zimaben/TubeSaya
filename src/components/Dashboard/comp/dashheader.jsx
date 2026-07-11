import Settings from "./settings";

export default function DashboardHeader( {activeDash, updateSettings, settings}){

    const titleFromKey=( title )=>{
        let titleString = '';
        let titleArray = title.split('');
        titleArray[0] = titleArray[0].toUpperCase();
        titleArray.forEach((letter) =>{
            if(letter.toUpperCase() === letter){
            titleString+=' ' + letter;
            } else {
            titleString+=letter;
            }
        })
        return titleString.trim();
    }
    return (
        <div className="px-6 pt-5 pb-4 border-b border-[#CBE9F2] flex items-center justify-between">
            <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B07D4A]">Dashboard</span>
            <h2 className="mt-1 text-[15px] font-semibold text-[#2A2118]">{titleFromKey(activeDash)}</h2>
            </div>

            <Settings settings={settings} updateSettings={updateSettings} />
        </div>
    );
}