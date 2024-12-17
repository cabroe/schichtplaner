import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const lineData = [
  { name: 'Mo', stunden: 8 },
  { name: 'Di', stunden: 6 },
  { name: 'Mi', stunden: 7 },
  { name: 'Do', stunden: 8 },
  { name: 'Fr', stunden: 4 },
]

const pieData = [
  { name: 'Frühschicht', value: 40 },
  { name: 'Spätschicht', value: 30 },
  { name: 'Nachtschicht', value: 30 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

const DashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-2">Aktuelle Schicht</h2>
          <div className="text-2xl font-bold text-blue-600">Frühschicht</div>
          <p className="text-gray-600">06:00 - 14:00 Uhr</p>
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-2">Nächste Schicht</h2>
          <div className="text-2xl font-bold text-green-600">Spätschicht</div>
          <p className="text-gray-600">Morgen, 14:00 - 22:00 Uhr</p>
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-2">Statistiken</h2>
          <div className="text-2xl font-bold text-purple-600">32h</div>
          <p className="text-gray-600">Diese Woche gearbeitet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-4">Arbeitsstunden diese Woche</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stunden" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-4">Schichtverteilung</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
