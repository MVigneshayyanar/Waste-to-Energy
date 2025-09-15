import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ProcessOverview } from "./components/ProcessOverview";
import { TemperatureControl } from "./components/TemperatureControl";
import { ProcessMonitoring } from "./components/ProcessMonitoring";
import { PathwayControl } from "./components/PathwayControl";
import { SafetyMonitoring } from "./components/SafetyMonitoring";
import { Settings, Activity, Gauge, Route, Shield } from "lucide-react";

export default function App() {
  // Main process state
  const [processData, setProcessData] = useState({
    temperature: 485,
    targetTemperature: 500,
    pressure: 95,
    flowRate: 28,
    powerConsumption: 75,
    heatingPower: 85,
    isHeatingActive: true,
    processStatus: 'running' as 'running' | 'idle' | 'shutdown' | 'maintenance',
    efficiency: 82
  });

  // Pathway control state
  const [pathwayState, setPathwayState] = useState({
    activePathway: 'both' as 'condensation' | 'hydrogen' | 'both',
    condensationStatus: {
      isActive: true,
      coolingTemp: 45,
      oilOutput: 12.5,
      gasRecycle: 78
    },
    hydrogenStatus: {
      isActive: true,
      purity: 96.8,
      output: 8.2,
      separationEfficiency: 89
    }
  });

  // Safety monitoring state
  const [safetyState, setSafetyState] = useState({
    systemStatus: {
      temperatureSafety: true,
      pressureSafety: true,
      electricalSafety: true,
      gasLeakDetection: true,
      emergencyStop: false
    },
    alerts: [
      {
        id: '1',
        type: 'warning' as const,
        message: 'Membrane separation efficiency below optimal (89%)',
        timestamp: '14:23:15',
        system: 'Hydrogen Separation'
      },
      {
        id: '2',
        type: 'info' as const,
        message: 'Scheduled maintenance due in 48 hours',
        timestamp: '12:45:30',
        system: 'System Maintenance'
      }
    ]
  });

  // Mock data for charts
  const [temperatureData, setTemperatureData] = useState([
    { time: '14:00', temperature: 450, target: 500 },
    { time: '14:05', temperature: 465, target: 500 },
    { time: '14:10', temperature: 475, target: 500 },
    { time: '14:15', temperature: 485, target: 500 },
    { time: '14:20', temperature: 488, target: 500 },
    { time: '14:25', temperature: 485, target: 500 }
  ]);

  const [productionData, setProductionData] = useState([
    { time: '14:00', syngas: 15, oil: 8, char: 5 },
    { time: '14:05', syngas: 18, oil: 10, char: 6 },
    { time: '14:10', syngas: 22, oil: 12, char: 7 },
    { time: '14:15', syngas: 25, oil: 12, char: 8 },
    { time: '14:20', syngas: 28, oil: 12, char: 8 },
    { time: '14:25', syngas: 30, oil: 12, char: 8 }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      setProcessData(prev => {
        const newTemp = Math.max(200, Math.min(700, prev.temperature + (Math.random() - 0.5) * 10));
        const newPressure = Math.max(85, Math.min(105, prev.pressure + (Math.random() - 0.5) * 5));
        const newFlowRate = Math.max(20, Math.min(35, prev.flowRate + (Math.random() - 0.5) * 3));

        // Update temperature data
        setTemperatureData(prevData => {
          const safeData = Array.isArray(prevData) ? prevData : [];
          const newPoint = {
            time: timeStr,
            temperature: Math.round(newTemp),
            target: prev.targetTemperature || 500
          };
          return [...safeData.slice(-5), newPoint];
        });

        // Update production data
        setProductionData(prevData => {
          const safeData = Array.isArray(prevData) ? prevData : [];
          const lastData = safeData[safeData.length - 1];
          const newPoint = {
            time: timeStr,
            syngas: Math.round(Math.max(20, Math.min(35, (lastData?.syngas || 25) + (Math.random() - 0.5) * 3))),
            oil: Math.round((pathwayState.condensationStatus?.oilOutput || 12) * 10) / 10,
            char: Math.round(Math.max(5, Math.min(10, (lastData?.char || 8) + (Math.random() - 0.5) * 1)))
          };
          return [...safeData.slice(-5), newPoint];
        });

        return {
          ...prev,
          temperature: Math.round(newTemp),
          pressure: Math.round(newPressure * 10) / 10,
          flowRate: Math.round(newFlowRate * 10) / 10
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [pathwayState.condensationStatus?.oilOutput]);

  // Control handlers
  const handleTargetTempChange = (temp: number) => {
    setProcessData(prev => ({ ...prev, targetTemperature: temp }));
  };

  const handleHeatingToggle = (active: boolean) => {
    setProcessData(prev => ({ 
      ...prev, 
      isHeatingActive: active,
      processStatus: active ? 'running' : 'idle'
    }));
  };

  const handlePowerChange = (power: number) => {
    setProcessData(prev => ({ ...prev, heatingPower: power }));
  };

  const handlePathwayChange = (pathway: 'condensation' | 'hydrogen' | 'both') => {
    setPathwayState(prev => ({
      ...prev,
      activePathway: pathway,
      condensationStatus: {
        ...prev.condensationStatus,
        isActive: pathway === 'condensation' || pathway === 'both'
      },
      hydrogenStatus: {
        ...prev.hydrogenStatus,
        isActive: pathway === 'hydrogen' || pathway === 'both'
      }
    }));
  };

  const handleEmergencyStop = () => {
    setProcessData(prev => ({ 
      ...prev, 
      isHeatingActive: false,
      processStatus: 'shutdown'
    }));
    setSafetyState(prev => ({
      ...prev,
      systemStatus: {
        ...prev.systemStatus,
        emergencyStop: true
      }
    }));
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setSafetyState(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Waste-to-Energy Pyrolysis Control System</h1>
          <p className="text-gray-400">Resistive Coil Heating • Dual Pathway Recovery • Real-time Monitoring</p>
        </div>

        {/* Process Overview */}
        <div className="mb-8">
          <ProcessOverview
            temperature={processData.temperature}
            pressure={processData.pressure}
            flowRate={processData.flowRate}
            powerConsumption={processData.powerConsumption}
            processStatus={processData.processStatus}
          />
        </div>

        {/* Main Control Tabs */}
        <Tabs defaultValue="control" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800">
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Control
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="pathways" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Pathways
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-6">
            <TemperatureControl
              currentTemp={processData.temperature}
              targetTemp={processData.targetTemperature}
              heatingPower={processData.heatingPower}
              isHeatingActive={processData.isHeatingActive}
              onTargetTempChange={handleTargetTempChange}
              onHeatingToggle={handleHeatingToggle}
              onPowerChange={handlePowerChange}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <ProcessMonitoring
              temperatureData={temperatureData}
              productionData={productionData}
              efficiency={processData.efficiency}
            />
          </TabsContent>

          <TabsContent value="pathways" className="space-y-6">
            <PathwayControl
              activePathway={pathwayState.activePathway}
              condensationStatus={pathwayState.condensationStatus}
              hydrogenStatus={pathwayState.hydrogenStatus}
              onPathwayChange={handlePathwayChange}
            />
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <SafetyMonitoring
              alerts={safetyState.alerts}
              systemStatus={safetyState.systemStatus}
              onEmergencyStop={handleEmergencyStop}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProcessMonitoring
                temperatureData={temperatureData}
                productionData={productionData}
                efficiency={processData.efficiency}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}