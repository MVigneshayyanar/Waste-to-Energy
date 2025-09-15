import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Droplets, Wind, Zap, Recycle, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PathwayControlProps {
  activePathway: 'condensation' | 'hydrogen' | 'both';
  condensationStatus: {
    isActive: boolean;
    coolingTemp: number;
    oilOutput: number;
    gasRecycle: number;
  };
  hydrogenStatus: {
    isActive: boolean;
    purity: number;
    output: number;
    separationEfficiency: number;
  };
  onPathwayChange: (pathway: 'condensation' | 'hydrogen' | 'both') => void;
}

export function PathwayControl({ 
  activePathway, 
  condensationStatus, 
  hydrogenStatus, 
  onPathwayChange 
}: PathwayControlProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Condensation Pathway */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg text-white">Condensation Pathway</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${condensationStatus.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {condensationStatus.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
            <Switch 
              checked={activePathway === 'condensation' || activePathway === 'both'}
              onCheckedChange={(checked) => {
                if (checked) {
                  onPathwayChange(activePathway === 'hydrogen' ? 'both' : 'condensation');
                } else {
                  onPathwayChange(activePathway === 'both' ? 'hydrogen' : 'both');
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Cooling System */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Cooling Temperature</span>
            <span className="text-white">{condensationStatus.coolingTemp}°C</span>
          </div>
          <Progress 
            value={(100 - condensationStatus.coolingTemp) / 0.8} 
            className="h-2"
          />

          <Separator className="bg-gray-700" />

          {/* Oil Production */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Pyrolysis Oil Output</span>
                <span className="text-white">{condensationStatus.oilOutput} L/hr</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-400">High quality fuel grade</span>
              </div>
            </div>
          </div>

          {/* Gas Recycling */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-white">Gas Recycling</span>
            </div>
            <div className="text-right">
              <div className="text-white">{condensationStatus.gasRecycle}%</div>
              <div className="text-xs text-gray-400">Back to reactor</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              variant="outline" 
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={!condensationStatus.isActive}
            >
              Optimize Cooling
            </Button>
            <Button 
              variant="outline"
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={!condensationStatus.isActive}
            >
              Drain Oil Tank
            </Button>
          </div>
        </div>
      </Card>

      {/* Hydrogen Separation Pathway */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wind className="w-6 h-6 text-green-500" />
            <h3 className="text-lg text-white">Hydrogen Separation</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${hydrogenStatus.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {hydrogenStatus.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
            <Switch 
              checked={activePathway === 'hydrogen' || activePathway === 'both'}
              onCheckedChange={(checked) => {
                if (checked) {
                  onPathwayChange(activePathway === 'condensation' ? 'both' : 'hydrogen');
                } else {
                  onPathwayChange(activePathway === 'both' ? 'condensation' : 'both');
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Hydrogen Purity */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Hydrogen Purity</span>
            <span className="text-white">{hydrogenStatus.purity}%</span>
          </div>
          <Progress 
            value={hydrogenStatus.purity} 
            className="h-2"
          />

          <Separator className="bg-gray-700" />

          {/* Hydrogen Production */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">H₂ Production Rate</span>
                <span className="text-white">{hydrogenStatus.output} m³/hr</span>
              </div>
              <div className="flex items-center gap-2">
                {hydrogenStatus.purity > 95 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-400">Fuel cell grade</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-yellow-400">Industrial grade</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Separation Efficiency */}
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-white">Membrane Efficiency</span>
            </div>
            <div className="text-right">
              <div className="text-white">{hydrogenStatus.separationEfficiency}%</div>
              <div className="text-xs text-gray-400">Separation rate</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              variant="outline" 
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={!hydrogenStatus.isActive}
            >
              Clean Membrane
            </Button>
            <Button 
              variant="outline"
              className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={!hydrogenStatus.isActive}
            >
              Collect H₂
            </Button>
          </div>
        </div>
      </Card>

      {/* Pathway Selection Control */}
      <Card className="p-6 bg-gray-900 border-gray-700 xl:col-span-2">
        <h3 className="text-lg text-white mb-4">Pathway Selection & Energy Recovery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant={activePathway === 'condensation' ? 'default' : 'outline'}
            className={`h-16 flex flex-col items-center justify-center gap-2 ${
              activePathway === 'condensation' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onPathwayChange('condensation')}
          >
            <Droplets className="w-5 h-5" />
            <span className="text-sm">Condensation Only</span>
          </Button>

          <Button 
            variant={activePathway === 'hydrogen' ? 'default' : 'outline'}
            className={`h-16 flex flex-col items-center justify-center gap-2 ${
              activePathway === 'hydrogen' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onPathwayChange('hydrogen')}
          >
            <Wind className="w-5 h-5" />
            <span className="text-sm">Hydrogen Sep.</span>
          </Button>

          <Button 
            variant={activePathway === 'both' ? 'default' : 'outline'}
            className={`h-16 flex flex-col items-center justify-center gap-2 ${
              activePathway === 'both' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onPathwayChange('both')}
          >
            <Recycle className="w-5 h-5" />
            <span className="text-sm">Both Pathways</span>
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400">Energy Recovery Active</span>
          </div>
          <p className="text-xs text-gray-400">
            Non-condensable gases are being recycled back to the reactor for supplementary heating, 
            reducing external energy requirements by approximately 15-25%.
          </p>
        </div>
      </Card>
    </div>
  );
}