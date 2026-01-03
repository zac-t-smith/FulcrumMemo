import { useState } from "react";
import { ChevronDown, ChevronRight, TrendingDown, TrendingUp, AlertTriangle, HandshakeIcon, Building2, Scissors, DollarSign, Shield, Gavel, CheckCircle2, Banknote, Wrench } from "lucide-react";

export type NodeId = "root" | "distress" | "distress-severity" | "consensual" | "strategic" | "growth" | "capital" | "liquidity" | null;

interface DecisionTreeProps {
  expandedNode: NodeId;
  setExpandedNode: (node: NodeId) => void;
}

// Helper to check if a node is expanded
const isExpanded = (expandedNode: NodeId, nodeId: NodeId): boolean => expandedNode === nodeId;

export const DecisionTree = ({ expandedNode, setExpandedNode }: DecisionTreeProps) => {
  const toggleNode = (nodeId: NodeId) => {
    setExpandedNode(expandedNode === nodeId ? null : nodeId);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Root Node */}
        <div className="flex flex-col items-center">
          <TreeNode 
            title="Company in Distress or Strategic Transition?"
            icon={<AlertTriangle className="h-4 w-4" />}
            variant="root"
            onClick={() => toggleNode("root")}
            expanded={expandedNode === "root"}
          />
          
          {isExpanded(expandedNode, "root") && (
            <div className="flex gap-8 mt-4">
              {/* Left Branch - Distress */}
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-border" />
                <TreeNode 
                  title="Financial Distress"
                  subtitle="Liquidity crisis, covenant breach, default"
                  icon={<TrendingDown className="h-4 w-4" />}
                  variant="warning"
                  onClick={() => toggleNode("distress")}
                  expanded={isExpanded(expandedNode, "distress")}
                />
                
                {isExpanded(expandedNode, "distress") && (
                  <div className="flex gap-6 mt-4">
                    {/* Check Runway */}
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-px bg-border" />
                      <TreeNode 
                        title="What's the Runway?"
                        subtitle="Liquidity < 13 wks = URGENT"
                        icon={<DollarSign className="h-4 w-4" />}
                        variant="decision"
                        onClick={() => toggleNode("liquidity")}
                        expanded={isExpanded(expandedNode, "liquidity")}
                      />
                      
                      {isExpanded(expandedNode, "liquidity") && (
                        <div className="flex gap-3 mt-4">
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="<13 wks: URGENT" subtitle="DIP, Standstill, Liquidation" icon={<AlertTriangle className="h-4 w-4" />} variant="danger" small />
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="13-26 wks" subtitle="A&E, Waiver, Exchange" icon={<Wrench className="h-4 w-4" />} variant="warning" small />
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title=">26 wks" subtitle="Refi, Asset Sales" icon={<CheckCircle2 className="h-4 w-4" />} variant="success" small />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Consensual Resolution */}
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-px bg-border" />
                      <TreeNode 
                        title="Consensual Resolution?"
                        icon={<HandshakeIcon className="h-4 w-4" />}
                        variant="decision"
                        onClick={() => toggleNode("consensual")}
                        expanded={isExpanded(expandedNode, "consensual")}
                      />
                      
                      {isExpanded(expandedNode, "consensual") && (
                        <div className="flex gap-4 mt-4">
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="Yes → Out-of-Court" subtitle="A&E, D4E, Exchange, LME" icon={<CheckCircle2 className="h-4 w-4" />} variant="success" />
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="No → In-Court" subtitle="Ch.11, Admin, CVA, Scheme" icon={<Gavel className="h-4 w-4" />} variant="danger" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Branch - Strategic */}
              <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-border" />
                <TreeNode 
                  title="Strategic Repositioning"
                  subtitle="Growth, portfolio optimization"
                  icon={<TrendingUp className="h-4 w-4" />}
                  variant="success"
                  onClick={() => toggleNode("strategic")}
                  expanded={isExpanded(expandedNode, "strategic")}
                />
                
                {isExpanded(expandedNode, "strategic") && (
                  <div className="flex gap-6 mt-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-px bg-border" />
                      <TreeNode 
                        title="Growth or Divest?"
                        icon={<TrendingUp className="h-4 w-4" />}
                        variant="decision"
                        onClick={() => toggleNode("growth")}
                        expanded={isExpanded(expandedNode, "growth")}
                      />
                      
                      {isExpanded(expandedNode, "growth") && (
                        <div className="flex gap-3 mt-4">
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="Expansion" subtitle="M&A, JV, Franchise" icon={<Building2 className="h-4 w-4" />} variant="info" small />
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="Divestment" subtitle="Spin-off, Carve-out, MBO" icon={<Scissors className="h-4 w-4" />} variant="muted" small />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-px bg-border" />
                      <TreeNode 
                        title="Capital Structure?"
                        icon={<DollarSign className="h-4 w-4" />}
                        variant="decision"
                        onClick={() => toggleNode("capital")}
                        expanded={isExpanded(expandedNode, "capital")}
                      />
                      
                      {isExpanded(expandedNode, "capital") && (
                        <div className="flex gap-3 mt-4">
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="Going Private" subtitle="Take-private, LBO" icon={<Shield className="h-4 w-4" />} variant="info" small />
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-px bg-border" />
                            <TreeNode title="Buyback/Recap" subtitle="Dividend recap, repurchase" icon={<Banknote className="h-4 w-4" />} variant="muted" small />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TreeNode = ({ 
  title, 
  subtitle, 
  icon, 
  variant = "default", 
  onClick, 
  expanded,
  small = false
}: { 
  title: string; 
  subtitle?: string; 
  icon: React.ReactNode; 
  variant?: "root" | "warning" | "success" | "danger" | "decision" | "info" | "muted" | "default";
  onClick?: () => void;
  expanded?: boolean;
  small?: boolean;
}) => {
  const variantStyles = {
    root: "bg-primary text-primary-foreground border-primary",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    danger: "bg-red-500/10 text-red-500 border-red-500/30",
    decision: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    info: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    muted: "bg-muted text-muted-foreground border-border",
    default: "bg-card text-foreground border-border",
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${small ? "px-3 py-2 min-w-[120px]" : "px-4 py-3 min-w-[180px]"}
        rounded-lg border-2 transition-all duration-200
        ${variantStyles[variant]}
        ${onClick ? "cursor-pointer hover:scale-105 hover:shadow-lg" : "cursor-default"}
      `}
    >
      <div className="flex items-center gap-2 justify-center">
        {icon}
        <span className={`font-semibold ${small ? "text-xs" : "text-sm"}`}>{title}</span>
        {onClick && (expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
      </div>
      {subtitle && <p className={`${small ? "text-[10px]" : "text-xs"} opacity-80 mt-1`}>{subtitle}</p>}
    </button>
  );
};
