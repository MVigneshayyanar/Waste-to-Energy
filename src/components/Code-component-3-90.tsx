import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Thermometer, Zap, Droplets, Wind, Flame } from "lucide-react";

interface ProcessOverviewProps {
  temperature: number;
  pressure: number;
  flowRate: number;
  powerConsumption: number;
  processStatus: 'running' | 'idle' | 'shutdown' | 'maintenance';
}

export function ProcessOverview({ 
  temperature, 
  pressure, 
  flowRate, 
  powerConsumption, 
  processStatus 
}: ProcessOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'shutdown': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Temperature</p>
            <p className="text-2xl text-white">{temperature}°C</p>
          </div>
          <Thermometer className="w-8 h-8 text-orange-500" />
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((temperature / 800) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Target: 400-600°C</p>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">System Pressure</p>
            <p className="text-2xl text-white">{pressure} kPa</p>
          </div>
          <Wind className="w-8 h-8 text-blue-500" />
        </div>
        <div className="mt-2">
          <Badge 
            className={`${pressure > 110 ? 'bg-red-500' : pressure > 90 ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
          >
            {pressure > 110 ? 'High' : pressure > 90 ? 'Normal' : 'Low'}
          </Badge>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Flow Rate</p>
            <p className="text-2xl text-white">{flowRate} L/min</p>
          </div>
          <Droplets className="w-8 h-8 text-cyan-500" />
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(flowRate / 50) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Power Usage</p>
            <p className="text-2xl text-white">{powerConsumption} kW</p>
          </div>
          <Zap className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(processStatus)}`} />
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              {processStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}