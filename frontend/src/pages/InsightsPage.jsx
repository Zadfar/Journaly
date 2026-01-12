import MoodCalendar from "../components/MoodCalender"
import MoodChart from "../components/MoodChart"
import WeeklyWrapUp from "../components/WeeklyWrapUp"

const InsightsPage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodCalendar />
        <MoodChart />
      </div>
      <div className="mt-6">
        <WeeklyWrapUp />
      </div>
    </div>
  )
}

export default InsightsPage