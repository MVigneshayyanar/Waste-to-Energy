import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface AnalyticsProps {
  temperatureData: Array<{ time: string; temperature: number; target: number }>;
  productionData: Array<{ time: string; syngas: number; oil: number; char: number }>;
  efficiency: number;
  systemMetrics: {
    energyConsumption: number;
    wasteProcessed: number;
    totalOutput: number;
    uptime: number;
  };
}

export function Analytics({ 
  temperatureData, 
  productionData, 
  efficiency, 
  systemMetrics 
}: AnalyticsProps) {
  // Safely prepare data with validation
  const safeTemperatureData = temperatureData
    .filter(item => item && typeof item.temperature === 'number' && typeof item.target === 'number' && item.time)
    .map(item => ({
      time: item.time,
      temperature: Number(item.temperature) || 0,
      target: Number(item.target) || 0,
      variance: Math.abs((Number(item.temperature) || 0) - (Number(item.target) || 0))
    }));

  const safeProductionData = productionData
    .filter(item => item && typeof item.syngas === 'number' && typeof item.oil === 'number' && typeof item.char === 'number' && item.time)
    .map(item => ({
      time: item.time,
      syngas: Number(item.syngas) || 0,
      oil: Number(item.oil) || 0,
      char: Number(item.char) || 0,
      total: (Number(item.syngas) || 0) + (Number(item.oil) || 0) + (Number(item.char) || 0)
    }));

  // Create efficiency trend data
  const efficiencyData = safeTemperatureData.map((item, index) => ({
    time: item.time,
    efficiency: Math.max(60, Math.min(95, efficiency + (Math.random() - 0.5) * 10)),
    target: 85
  }));

  // Production distribution for pie chart
  const latestProduction = safeProductionData[safeProductionData.length - 1];
  const productionDistribution = latestProduction ? [
    { name: 'Syngas', value: latestProduction.syngas, color: '#06B6D4' },
    { name: 'Pyrolysis Oil', value: latestProduction.oil, color: '#8B5CF6' },
    { name: 'Solid Char', value: latestProduction.char, color: '#F59E0B' }
  ] : [];

  // Energy consumption data
  const energyData = safeTemperatureData.map((item, index) => ({
    time: item.time,
    consumption: Math.max(60, Math.min(90, 75 + (Math.random() - 0.5) * 20)),
    efficiency: efficiencyData[index]?.efficiency || 80
  }));

  // Performance metrics
  const performanceMetrics = [
    { 
      title: "Process Efficiency", 
      value: `${efficiency}%`, 
      trend: efficiency > 80 ? "up" : "down",
      color: efficiency > 80 ? "text-green-400" : "text-yellow-400"
    },
    { 
      title: "Energy Consumption", 
      value: `${systemMetrics.energyConsumption} kW/h`, 
      trend: "stable",
      color: "text-blue-400"
    },
    { 
      title: "Waste Processed", 
      value: `${systemMetrics.wasteProcessed} kg/h`, 
      trend: "up",
      color: "text-green-400"
    },
    { 
      title: "System Uptime", 
      value: `${systemMetrics.uptime}%`, 
      trend: systemMetrics.uptime > 95 ? "up" : "down",
      color: systemMetrics.uptime > 95 ? "text-green-400" : "text-yellow-400"
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="p-4 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{metric.title}</p>
                <p className={`text-xl ${metric.color}`}>{metric.value}</p>
              </div>
              <div className="flex items-center">
                {metric.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
                {metric.trend === "down" && <TrendingDown className="w-5 h-5 text-red-500" />}
                {metric.trend === "stable" && <Activity className="w-5 h-5 text-blue-500" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Analysis */}
        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg text-white">Temperature Analysis</h3>
          </div>
          {safeTemperatureData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={safeTemperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 3 }}
                  name="Current Temp (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target Temp (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="variance" 
                  stroke="#EF4444" 
                  strokeWidth={1}
                  dot={false}
                  name="Variance (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No temperature data available
            </div>
          )}
        </Card>

        {/* Production Trends */}
        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg text-white">Production Trends</h3>
          </div>
          {safeProductionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={safeProductionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="syngas" 
                  stackId="1"
                  stroke="#06B6D4" 
                  fill="#06B6D4"
                  fillOpacity={0.7}
                  name="Syngas (L/min)"
                />
                <Area 
                  type="monotone" 
                  dataKey="oil" 
                  stackId="1"
                  stroke="#8B5CF6" 
                  fill="#8B5CF6"
                  fillOpacity={0.7}
                  name="Oil (L/min)"
                />
                <Area 
                  type="monotone" 
                  dataKey="char" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  fillOpacity={0.7}
                  name="Char (kg/min)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No production data available
            </div>
          )}
        </Card>

        {/* Efficiency Tracking */}
        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg text-white">Process Efficiency</h3>
          </div>
          {efficiencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[60, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Efficiency (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No efficiency data available
            </div>
          )}
        </Card>

        {/* Production Distribution */}
        <Card className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg text-white">Current Production Mix</h3>
          </div>
          {productionDistribution.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={productionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="ml-4 space-y-2">
                {productionDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-white">{item.name}</span>
                    <span className="text-sm text-gray-400">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400">
              No production data available
            </div>
          )}
        </Card>
      </div>

      {/* Energy Consumption Analysis */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg text-white">Energy Consumption vs Efficiency</h3>
        </div>
        {energyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="consumption"
                fill="#F59E0B"
                name="Energy (kW)"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                stroke="#10B981"
                strokeWidth={3}
                name="Efficiency (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-400">
            No energy data available
          </div>
        )}
      </Card>

      {/* Summary Statistics */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg text-white mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl text-cyan-400">
              {safeProductionData.reduce((acc, item) => acc + item.syngas, 0)}L
            </div>
            <div className="text-sm text-gray-400">Total Syngas</div>
            <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              Primary Output
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-purple-400">
              {safeProductionData.reduce((acc, item) => acc + item.oil, 0).toFixed(1)}L
            </div>
            <div className="text-sm text-gray-400">Total Oil</div>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
              Fuel Grade
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-yellow-400">
              {safeProductionData.reduce((acc, item) => acc + item.char, 0)}kg
            </div>
            <div className="text-sm text-gray-400">Total Char</div>
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Solid Residue
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-green-400">
              {safeTemperatureData.length > 0 ? 
                (safeTemperatureData.reduce((acc, item) => acc + (100 - item.variance), 0) / safeTemperatureData.length).toFixed(1) 
                : 0}%
            </div>
            <div className="text-sm text-gray-400">Temp. Stability</div>
            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
              Control Quality
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}