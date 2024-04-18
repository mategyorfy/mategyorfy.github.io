import { useEffect, useState } from "react";
import { NodeInterface } from "./PathFindingVisualizer";
import { MemoizedNode } from "./Node";

interface MaingridProps {
  nodes: NodeInterface[][];
  clickOnNode: (nodeInfo: [number, number, number], drag: boolean) => void;
  clickOnRoute: (nodeInfo: [number, number, number], dir: string) => void;
}

export default function Maingrid(props: MaingridProps) {
  const [nodes, setNodes] = useState(props.nodes);

  useEffect(() => {
    console.log("chage");
    setNodes(props.nodes);
  }, [props.nodes]);

  return (
    <>
      <div key={"maingrid"} id="maingrid" className="">
        {nodes.map((nodeRow, rowIndex) => {
          return (
            <div key={rowIndex} className="gridrow">
              {nodeRow.map((node) => {
                return (
                  <MemoizedNode
                    key={node.id}
                    id={node.id}
                    x={node.x}
                    y={node.y}
                    nodeTypeProp={node.type}
                    isVisitedProp={node.visited}
                    depthProp={node.depth}
                    isTestOnProp={node.isTestOnProp}
                    weight={node.weight}
                    clickOnNode={props.clickOnNode}
                    clickOnRoute={props.clickOnRoute}
                    isLastRow={node.isLastRow}
                    isLastCol={node.isLastCol}
                    rightRouteWeightProp={node.rightRouteWeight}
                    bottomRouteWeightProp={node.bottomRouteWeight}
                    isRightRoutePathProp={node.isRightRoutePath}
                    isBottomRoutePathProp={node.isBottomRoutePath}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
