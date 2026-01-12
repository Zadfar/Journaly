import MoodCalendar from "../components/MoodCalender"
import MoodChart from "../components/MoodChart"

const InsightsPage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: The Calendar */}
        <MoodCalendar />
        
        <MoodChart />
      </div>
    </div>
  )
}

export default InsightsPage