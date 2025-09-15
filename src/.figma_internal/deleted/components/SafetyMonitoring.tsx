import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle, Shield, Thermometer, Wind, Zap, CheckCircle, XCircle } from "lucide-react";

interface SafetyAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  system: string;
}

interface SafetyMonitoringProps {
  alerts: SafetyAlert[];
  systemStatus: {
    temperatureSafety: boolean;
    pressureSafety: boolean;
    electricalSafety: boolean;
    gasLeakDetection: boolean;
    emergencyStop: boolean;
  };
  onEmergencyStop: () => void;
  onAcknowledgeAlert: (alertId: string) => void;
}

export function SafetyMonitoring({ 
  alerts, 
  systemStatus, 
  onEmergencyStop, 
  onAcknowledgeAlert 
}: SafetyMonitoringProps) {
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical');
  const warningAlerts = alerts.filter(alert => alert.type === 'warning');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Status Overview */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-500" />
            <h3 className="text-lg text-white">Safety Systems Status</h3>
          </div>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onEmergencyStop}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            EMERGENCY STOP
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-white">Temperature</span>
            </div>
            <Badge className={`${systemStatus.temperatureSafety ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {systemStatus.temperatureSafety ? 'OK' : 'ALERT'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-white">Pressure</span>
            </div>
            <Badge className={`${systemStatus.pressureSafety ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {systemStatus.pressureSafety ? 'OK' : 'ALERT'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-white">Electrical</span>
            </div>
            <Badge className={`${systemStatus.electricalSafety ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {systemStatus.electricalSafety ? 'OK' : 'ALERT'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-500" />
              <span className="text-sm text-white">Gas Leak</span>
            </div>
            <Badge className={`${systemStatus.gasLeakDetection ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {systemStatus.gasLeakDetection ? 'CLEAR' : 'DETECTED'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-white">E-Stop</span>
            </div>
            <Badge className={`${!systemStatus.emergencyStop ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {!systemStatus.emergencyStop ? 'READY' : 'ACTIVE'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <Card className="p-6 bg-gray-900 border-red-500/30">
          <h3 className="text-lg text-white mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Critical Alerts ({criticalAlerts.length})
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {criticalAlerts.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                No critical alerts
              </div>
            ) : (
              criticalAlerts.map((alert) => (
                <Alert key={alert.id} className={getAlertColor(alert.type)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <AlertDescription className="text-white">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-gray-400 mt-1">
                          {alert.system} • {alert.timestamp}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      ACK
                    </Button>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </Card>

        {/* Warning Alerts */}
        <Card className="p-6 bg-gray-900 border-yellow-500/30">
          <h3 className="text-lg text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Warnings ({warningAlerts.length})
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {warningAlerts.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                No warnings
              </div>
            ) : (
              warningAlerts.map((alert) => (
                <Alert key={alert.id} className={getAlertColor(alert.type)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <AlertDescription className="text-white">
                          {alert.message}
                        </AlertDescription>
                        <div className="text-xs text-gray-400 mt-1">
                          {alert.system} • {alert.timestamp}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      ACK
                    </Button>
                  </div>
                </Alert>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Safety Procedures */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h3 className="text-lg text-white mb-4">Emergency Procedures</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="text-white mb-2">High Temperature</h4>
            <p className="text-sm text-gray-400">
              1. Reduce heating power immediately<br/>
              2. Increase cooling system<br/>
              3. Check ventilation systems
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="text-white mb-2">Pressure Alert</h4>
            <p className="text-sm text-gray-400">
              1. Check gas outlet valves<br/>
              2. Verify membrane integrity<br/>
              3. Activate pressure relief
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="text-white mb-2">Gas Leak</h4>
            <p className="text-sm text-gray-400">
              1. Activate emergency ventilation<br/>
              2. Stop heating system<br/>
              3. Evacuate personnel
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}