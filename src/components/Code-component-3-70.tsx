import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { TrendingUp, TrendingDown, Power, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface TemperatureControlProps {
  currentTemp: number;
  targetTemp: number;
  heatingPower: number;
  isHeatingActive: boolean;
  onTargetTempChange: (temp: number) => void;
  onHeatingToggle: (active: boolean) => void;
  onPowerChange: (power: number) => void;
}

export function TemperatureControl({
  currentTemp,
  targetTemp,
  heatingPower,
  isHeatingActive,
  onTargetTempChange,
  onHeatingToggle,
  onPowerChange
}: TemperatureControlProps) {
  const [tempInput, setTempInput] = useState(targetTemp.toString());
  
  const tempDifference = currentTemp - targetTemp;
  const isOverheating = currentTemp > 650;
  const isUnderpowered = currentTemp < targetTemp - 50;

  const handleTempInputChange = (value: string) => {
    setTempInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 800) {
      onTargetTempChange(numValue);
    }
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg text-white">Resistive Coil Temperature Control</h3>
        <div className="flex items-center gap-2">
          <Power className={`w-5 h-5 ${isHeatingActive ? 'text-green-500' : 'text-gray-500'}`} />
          <Switch 
            checked={isHeatingActive}
            onCheckedChange={onHeatingToggle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Temperature</span>
            <div className="flex items-center gap-2">
              {tempDifference > 5 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : tempDifference < -5 ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : null}
              <span className="text-2xl text-white">{currentTemp}°C</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target Temperature</span>
              <span className="text-white">{targetTemp}°C</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((currentTemp / 800) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0°C</span>
              <span>400°C</span>
              <span>600°C</span>
              <span>800°C</span>
            </div>
          </div>

          {/* Alerts */}
          {(isOverheating || isUnderpowered) && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-400">
                {isOverheating ? 'Temperature exceeds safe limits' : 'Temperature significantly below target'}
              </span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Set Target Temperature (°C)</label>
            <Input
              type="number"
              value={tempInput}
              onChange={(e) => handleTempInputChange(e.target.value)}
              min="0"
              max="800"
              className="bg-gray-800 border-gray-600 text-white"
              disabled={!isHeatingActive}
            />
          </div>

          <Separator className="bg-gray-700" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-gray-400">Heating Power</label>
              <span className="text-sm text-white">{heatingPower}%</span>
            </div>
            <Slider
              value={[heatingPower]}
              onValueChange={(value) => onPowerChange(value[0])}
              max={100}
              step={1}
              className="w-full"
              disabled={!isHeatingActive}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              variant="outline" 
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => onTargetTempChange(450)}
              disabled={!isHeatingActive}
            >
              Set 450°C
            </Button>
            <Button 
              variant="outline"
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => onTargetTempChange(550)}
              disabled={!isHeatingActive}
            >
              Set 550°C
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}