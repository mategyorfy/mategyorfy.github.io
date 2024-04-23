import React, { useEffect, useState } from "react";
import "../App.tsx";
import "./style.css";
import { PathPointType } from "./PathFindingVisualizer.tsx";
import CommonFuncs, { Point } from "../algorithms/common-func.ts";

interface NodeProps {
  id: number;
  x: number;
  y: number;
  nodeTypeProp: PathPointType;
  isVisitedProp: boolean;
  depthProp: number;
  isTestOnProp: boolean;
  weight: number;
  clickOnNode: (nodeInfo: [number, number, number], drag: boolean) => void;
  dropOnNode: (nodeInfo: Point) => void;
  setNodeType: (nodeInfo: Point, type: PathPointType) => void;
  clickOnRoute: (nodeInfo: [number, number, number], dir: string) => void;
  isLastRow: boolean;
  isLastCol: boolean;
  rightRouteWeightProp: number;
  bottomRouteWeightProp: number;
  isRightRoutePathProp: boolean;
  isBottomRoutePathProp: boolean;
  toAnimateProp: boolean;
}

export default function Node(node: NodeProps) {
  const [nodeType, setNodeType] = useState(node.nodeTypeProp);
  const [isVisited, setIsVisited] = useState(node.isVisitedProp);
  const [depth, setDepth] = useState(node.depthProp);
  const [isTest, setIsTest] = useState(node.isTestOnProp);
  const [rightRouteWidth, setRigthRouteWidth] = useState(node.rightRouteWeightProp);
  const [bottomRouteWidth, setBottomRouteWidth] = useState(node.bottomRouteWeightProp);
  const [isRightRoutePath, setIsRightRoutePath] = useState(node.isRightRoutePathProp);
  const [isBottomRoutePath, setIsBottomRoutePath] = useState(node.isBottomRoutePathProp);
  const [toAnimate, setToAnimate] = useState(node.toAnimateProp);
  const [isDragging, setIsDragging] = useState(false);
  const [isScaleAnim, setIsScaleAnim] = useState(false);

  function handleClick() {
    if (isDragging) return;
    node.clickOnNode([node.id, node.x, node.y], false);
  }

  function handleClickOnRoute(dir: string) {
    node.clickOnRoute([node.id, node.x, node.y], dir);
  }

  // Handling dragging the mouse over a Node
  // -- calling clickOnNode with drag=true --
  function onMouseMouseOver(e: React.MouseEvent) {
    //console.log("On mouse over is dragging: " + isDragging);
    if (isDragging) return;
    if (e.buttons) {
      node.clickOnNode([node.id, node.x, node.y], true);
    }
  }

  // When the prop nodeTypeProp changes,
  // we set the state variable nodeType to the new nodeTypeProp value

  useEffect(() => {
    setToAnimate(node.toAnimateProp);
  }, [node.toAnimateProp]);

  useEffect(() => {
    setNodeType(node.nodeTypeProp);
  }, [node.nodeTypeProp]);

  useEffect(() => {
    setIsVisited(node.isVisitedProp);
  }, [node.isVisitedProp]);

  useEffect(() => {
    setDepth(node.depthProp);
  }, [node.depthProp]);

  useEffect(() => {
    setIsTest(node.isTestOnProp);
  }, [node.isTestOnProp]);

  useEffect(() => {
    setRigthRouteWidth(node.rightRouteWeightProp);
  }, [node.rightRouteWeightProp]);

  useEffect(() => {
    setBottomRouteWidth(node.bottomRouteWeightProp);
  }, [node.bottomRouteWeightProp]);

  useEffect(() => {
    setIsRightRoutePath(node.isRightRoutePathProp);
  }, [node.isRightRoutePathProp]);

  useEffect(() => {
    setIsBottomRoutePath(node.isBottomRoutePathProp);
  }, [node.isBottomRoutePathProp]);

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    //console.log("onDragOver");
    event.preventDefault();
  }
  async function onDragEnter(event: React.DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    if (isScaleAnim) return;
    event.preventDefault();
    console.log("onDragEnter");
    console.log(event.dataTransfer.types[0]);
    let type = parseInt(event.dataTransfer.types[0]) as PathPointType;
    setIsScaleAnim(true);
    node.setNodeType({ x: node.x, y: node.y }, type);
    //event.dataTransfer.setDragImage(dragImage, 0, 0);
    await CommonFuncs.timeout(500);
    setIsScaleAnim(false);
  }

  async function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    console.log("onDragLeave");
    setIsScaleAnim(true);
    node.setNodeType({ x: node.x, y: node.y }, PathPointType.Normal);
    await CommonFuncs.timeout(500);
    setIsScaleAnim(false);
  }
  function onDragStart(event: React.DragEvent<HTMLElement>) {
    setIsDragging(true);
    console.log("onDragStart");
    event.dataTransfer.clearData();
    event.dataTransfer.setData(nodeType.toString(), "sajt");
  }

  function onDragEnd(event: React.DragEvent<HTMLElement>) {
    console.log("onDragEnd");
    setIsDragging(false);
  }

  function getIcon() {
    let visible = nodeType == PathPointType.Start;
    let icon = (
      <i
        hidden={!visible}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggable="true"
        className="grab fa fa-cloud"
      ></i>
    );
    return icon;
  }

  function getVisitedModifier() {
    if (toAnimate == true) return "visited";
    if (isTest == true) return "testcolor";
    else return "";
  }

  function getClassModifierRightRoute() {
    if (!isRightRoutePath) {
      return "_" + rightRouteWidth.toString();
    } else {
      return "_" + rightRouteWidth.toString() + " routepath";
    }
  }
  function getClassModifierBottomRoute() {
    if (!isBottomRoutePath) return "_" + bottomRouteWidth.toString();
    else return "_" + bottomRouteWidth.toString() + " routepath";
  }

  function getClassModifier() {
    switch (nodeType) {
      case PathPointType.Normal:
        return "normal";
      case PathPointType.Wall:
        return "wall";
      case PathPointType.Start:
        return "start";
      case PathPointType.Finish:
        return "finish";
      case PathPointType.RouteNode:
        return "routenode";
    }
  }

  let styleRight = {
    display: node.isLastCol ? "none" : "block",
  };
  let styleBottom = {
    display: node.isLastRow ? "none" : "block",
  };

  let returnDiv = (
    <div className="tilewrapper">
      <div
        className={"tile" + " " + getClassModifier() + " " + getVisitedModifier()}
        key={node.id}
        onMouseOver={onMouseMouseOver}
        onMouseDown={handleClick}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {getIcon()}
      </div>
      <div
        style={styleRight}
        onClick={() => handleClickOnRoute("right")}
        className={"route_right" + " " + getClassModifierRightRoute()}
      ></div>
      <div
        style={styleBottom}
        onClick={() => handleClickOnRoute("bottom")}
        className={"route_bottom" + " " + getClassModifierBottomRoute()}
      ></div>
    </div>
  );

  return <>{returnDiv}</>;
}

export const MemoizedNode = React.memo(Node);
