import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

// Dynamic import for client-side only component
const ForceGraphComponent = () => {
  const { theme, resolvedTheme } = useTheme();
  const [ForceGraph3D, setForceGraph3D] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [isClient, setIsClient] = useState(false);
  const fgRef = useRef<{ zoomToFit?: (duration: number, padding: number) => void }>(null);
  
  // Import graph data from the JSON file
  const [graphData, setGraphData] = useState<{
    nodes: Array<{ id: string; user?: string; description?: string }>;
    links: Array<{ source: string; target: string }>;
  } | null>(null);

  // Determine background color based on theme
  const getBackgroundColor = () => {
    const currentTheme = resolvedTheme || theme;
    return currentTheme === "dark" ? "#020202" : "#ffffff";
  };

  useEffect(() => {
    setIsClient(true);
    
    // Dynamic import to avoid SSR issues
    import("react-force-graph-3d").then((module) => {
      setForceGraph3D(() => module.default);
    });
    
    // Load the graph data
    import("@/components/dashboard/graph/data.json").then((data) => {
      setGraphData(data.default);
    });
  }, []);

  // Auto-zoom to fit when graph is ready
  useEffect(() => {
    if (graphData && ForceGraph3D && isClient && fgRef.current?.zoomToFit) {
      // Small delay to ensure graph is rendered
      const timer = setTimeout(() => {
        fgRef.current?.zoomToFit?.(1000, 200);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [graphData, ForceGraph3D, isClient]);

  // Don't render anything during SSR or while loading data
  if (!isClient || !ForceGraph3D || !graphData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div>Loading graph...</div>
      </div>
    );
  }

  return (
    <ForceGraph3D
      ref={fgRef}
      zoom={0.5}
      graphData={graphData}
      nodeLabel="description"
      height={"100%"}
      width={"100%"}
      nodeAutoColorBy="user"
      backgroundColor={getBackgroundColor()}
      linkWidth={20}
      // linkAutoColorBy="user"
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={0.01}
      enableNodeDrag={true}
      enableNavigationControls={true}
      showNavInfo={true}
            nodeRelSize={10}
    />
  );
};

export default function MemoryGraphPage() {
  return (
    <DashboardLayout title="Memory Graph" fullScreen>
      <div 
        className="flex items-center justify-center overflow-hidden" 
        style={{ 
          height: 'calc(100vh - 12rem)',
          width: '100%'
        }}
      >
        <div 
          className="flex items-center justify-center"
          style={{ 
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        >
          <ForceGraphComponent />
        </div>
      </div>
    </DashboardLayout>
  );
}
