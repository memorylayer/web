"use client";

import {
  IconBuilding,
  IconCheck,
  IconChevronDown,
  IconInnerShadowTop,
  IconPlus,
} from "@tabler/icons-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface Layer {
  id: string;
  name: string;
  shortcut: string;
  plan: string;
}

const layers: Layer[] = [
  {
    id: "acme-inc",
    name: "Acme Inc",
    shortcut: "⌘1",
    plan: "Enterprise",
  },
  {
    id: "acme-corp",
    name: "Acme Corp.",
    shortcut: "⌘2",
    plan: "Pro",
  },
  {
    id: "evil-corp",
    name: "Evil Corp.",
    shortcut: "⌘3",
    plan: "Free",
  },
];

export function LayerSwitcher() {
  const [selectedLayer, setSelectedLayer] = React.useState<Layer>(layers[0]);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLayerChange = React.useCallback(
    (layer: Layer) => {
      if (layer.id !== selectedLayer.id) {
        setSelectedLayer(layer);
        toast.success(`Switched to ${layer.name}`, {
          description: `Now using ${layer.plan} plan`,
        });
      }
      setIsOpen(false);
    },
    [selectedLayer.id],
  );

  const handleAddLayer = () => {
    toast.info("Add layer functionality", {
      description: "This would open a dialog to create a new layer",
    });
    setIsOpen(false);
  };

  // Handle keyboard shortcuts
  const handleKeyboardShortcut = React.useCallback(
    (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;

      const keyToIndex: Record<string, number> = { "1": 0, "2": 1, "3": 2 };
      const index = keyToIndex[event.key];

      if (index !== undefined && layers[index]) {
        event.preventDefault();
        handleLayerChange(layers[index]);
      }
    },
    [handleLayerChange],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <IconInnerShadowTop className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedLayer.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {selectedLayer.plan}
                </span>
              </div>
              <IconChevronDown
                className={`ml-auto size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
              Layers
            </DropdownMenuLabel>
            {layers.map((layer) => (
              <DropdownMenuItem
                key={layer.id}
                onClick={() => handleLayerChange(layer)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <IconBuilding className="size-4 shrink-0" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium">{layer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {layer.plan}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {layer.shortcut}
                </span>
                {selectedLayer.id === layer.id && (
                  <IconCheck className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleAddLayer}
              className="gap-2 p-2 cursor-pointer"
            >
              <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
                <IconPlus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add layer</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
