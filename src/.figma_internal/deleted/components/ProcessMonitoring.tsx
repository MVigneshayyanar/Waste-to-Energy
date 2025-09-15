import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface ProcessMonitoringProps {
  temperatureData: Array<{ time: string; temperature: number; target: number }>;
  productionData: Array<{ time: string; syngas: number; oil: number; char: number }>;
  efficiency: number;
}

export function ProcessMonitoring({ temperatureData, productionData, efficiency }: ProcessMonitoringProps) {
  // Ensure data is valid and has no undefined values
  const validTemperatureData = temperatureData.filter(data => 
    data && 
    typeof data.temperature === 'number' && 
    typeof data.target === 'number' && 
    data.time &&
    !isNaN(data.temperature) &&
    !isNaN(data.target)
  ).map(data => ({
    time: data.time,
    temperature: Math.round(data.temperature),
    target: Math.round(data.target)
  }));
  
  const validProductionData = productionData.filter(data => 
    data && 
    typeof data.syngas === 'number' && 
    typeof data.oil === 'number' && 
    typeof data.char === 'number' && 
    data.time &&
    !isNaN(data.syngas) &&
    !isNaN(data.oil) &&
    !isNaN(data.char)
  ).map(data => ({
    time: data.time,
    syngas: Math.round(data.syngas),
    oil: Math.round(data.oil * 10) / 10,
    char: Math.round(data.char)
  }));

  const latestProduction = validProductionData[validProductionData.length - 1];
  const totalProduction = latestProduction ? latestProduction.syngas + latestProduction.oil + latestProduction.char : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Temperature Monitoring Display */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg text-white mb-4">Temperature Monitoring</h3>
        <div className="space-y-4">
          {validTemperatureData.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Current Temperature</div>
                  <div className="text-2xl text-orange-400">
                    {validTemperatureData[validTemperatureData.length - 1]?.temperature || 0}°C
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Target Temperature</div>
                  <div className="text-2xl text-green-400">
                    {validTemperatureData[validTemperatureData.length - 1]?.target || 0}°C
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Recent Temperature History</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {validTemperatureData.slice(-6).map((data, index) => (
                    <div key={index} className="bg-gray-800 p-2 rounded text-center">
                      <div className="text-gray-400 text-xs">{data.time}</div>
                      <div className="text-white">{data.temperature}°C</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No temperature data available
            </div>
          )}
        </div>
      </Card>

      {/* Production Output Display */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg text-white mb-4">Production Output</h3>
        <div className="space-y-4">
          {validProductionData.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Syngas</div>
                  <div className="text-xl text-cyan-400">
                    {validProductionData[validProductionData.length - 1]?.syngas || 0}
                  </div>
                  <div className="text-xs text-gray-400">L/min</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Oil</div>
                  <div className="text-xl text-purple-400">
                    {validProductionData[validProductionData.length - 1]?.oil || 0}
                  </div>
                  <div className="text-xs text-gray-400">L/min</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Char</div>
                  <div className="text-xl text-yellow-400">
                    {validProductionData[validProductionData.length - 1]?.char || 0}
                  </div>
                  <div className="text-xs text-gray-400">kg/min</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Production Trend</div>
                <div className="space-y-1">
                  {validProductionData.slice(-3).map((data, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800 p-2 rounded text-sm">
                      <span className="text-gray-400">{data.time}</span>
                      <div className="flex gap-4">
                        <span className="text-cyan-400">{data.syngas}L</span>
                        <span className="text-purple-400">{data.oil}L</span>
                        <span className="text-yellow-400">{data.char}kg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No production data available
            </div>
          )}
        </div>
      </Card>

      {/* Production Summary */}
      <Card className="p-6 bg-gray-900 border-gray-700 lg:col-span-2">
        <h3 className="text-lg text-white mb-4">Current Production Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl text-cyan-400">{latestProduction?.syngas || 0}</div>
            <div className="text-sm text-gray-400">Syngas (L/min)</div>
            <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              High Quality
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-purple-400">{latestProduction?.oil || 0}</div>
            <div className="text-sm text-gray-400">Pyrolysis Oil (L/min)</div>
            <Badge className="mt-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
              Fuel Grade
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-yellow-400">{latestProduction?.char || 0}</div>
            <div className="text-sm text-gray-400">Solid Char (kg/min)</div>
            <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Industrial Use
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-green-400">{efficiency}%</div>
            <div className="text-sm text-gray-400">Process Efficiency</div>
            <Badge className={`mt-2 ${efficiency > 85 ? 'bg-green-500/20 text-green-400 border-green-500/30' : efficiency > 70 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {efficiency > 85 ? 'Excellent' : efficiency > 70 ? 'Good' : 'Needs Attention'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}