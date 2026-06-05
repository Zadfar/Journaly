import MoodCalendar from "../components/MoodCalender";
import MoodChart from "../components/MoodChart";
import WeeklyWrapUp from "../components/WeeklyWrapUp";

const InsightsPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 w-full animate-fade-in-up">
      
      {/* Header Section */}
      <div className="pt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
          Your Insights
        </h1>
        <p className="text-stone-500 mt-2 font-light text-lg">
          Understand your emotional patterns and journey over time.
        </p>
      </div>

      {/* Top Row: Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8">
        <div className="flex flex-col h-full">
          <MoodCalendar />
        </div>
        <div className="flex flex-col h-full">
          <MoodChart />
        </div>
      </div>

      {/* Bottom Row: AI Analysis */}
      <div className="pt-4">
        <WeeklyWrapUp />
      </div>

    </div>
  );
};

export default InsightsPage;