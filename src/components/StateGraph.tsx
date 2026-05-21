import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Transition } from '../types';

interface StateGraphProps {
  transitions: Transition[];
  currentState: string;
  initialState: string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  label: string;
}

export default function StateGraph({ transitions, currentState, initialState }: StateGraphProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const stateSet = new Set<string>();
    stateSet.add(initialState);
    transitions.forEach(t => {
      stateSet.add(t.currentState);
      stateSet.add(t.nextState);
    });

    const nodes: Node[] = Array.from(stateSet).map(id => ({ id }));
    
    // Group transitions by source/target to avoid overlapping lines
    const linkMap = new Map<string, string[]>();
    transitions.forEach(t => {
      const key = `${t.currentState}->${t.nextState}`;
      const label = `${t.readSymbol}→${t.writeSymbol},${t.move}`;
      if (!linkMap.has(key)) linkMap.set(key, []);
      linkMap.get(key)!.push(label);
    });

    const links: Link[] = Array.from(linkMap.entries()).map(([key, labels]) => {
      const [source, target] = key.split('->');
      return {
        source,
        target,
        label: labels.join(' | ')
      };
    });

    return { nodes, links };
  }, [transitions, initialState]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate "levels" for nodes to create a horizontal flow
    const levels: Record<string, number> = {};
    const queue: [string, number][] = [[initialState, 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [id, level] = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      levels[id] = level;

      transitions.filter(t => t.currentState === id).forEach(t => {
        if (!visited.has(t.nextState)) {
          queue.push([t.nextState, level + 1]);
        }
      });
    }

    // Assign level 0 to unvisited nodes just in case
    nodes.forEach(n => {
      if (levels[n.id] === undefined) levels[n.id] = 0;
    });

    const svg = d3.select(containerRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX<Node>(d => {
        const level = levels[d.id] || 0;
        return 100 + level * 150;
      }).strength(0.5))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force("collision", d3.forceCollide().radius(60))
      .alphaDecay(0.05);

    // Arrow marker definition
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    const linkContainer = svg.append("g");
    const nodeContainer = svg.append("g");

    const link = linkContainer.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", "link")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    const linkLabel = linkContainer.selectAll(".link-label-group")
      .data(links)
      .enter().append("g")
      .attr("class", "link-label-group");

    linkLabel.append("rect")
      .attr("fill", "white")
      .attr("rx", 2)
      .attr("ry", 2);

    linkLabel.append("text")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .attr("font-family", "monospace")
      .attr("text-anchor", "middle")
      .text(d => d.label);

    const node = nodeContainer.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node");

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => d.id === currentState ? "#000" : "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    // Double circle for initial state or accept/reject
    node.filter(d => d.id === initialState)
      .append("circle")
      .attr("r", 24)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2");

    node.append("text")
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", d => d.id === currentState ? "#fff" : "#000")
      .text(d => d.id);

    simulation.on("tick", () => {
      link.attr("d", d => {
        const source = d.source as unknown as Node;
        const target = d.target as unknown as Node;
        
        if (source.id === target.id) {
          // Self-loop
          const x = source.x || 0;
          const y = source.y || 0;
          const dr = 30;
          return `M ${x+10},${y-15} A ${dr},${dr} 0 1,1 ${x+20},${y}`;
        }
        
        return `M ${source.x},${source.y} L ${target.x},${target.y}`;
      });

      linkLabel
        .attr("transform", d => {
          const source = d.source as unknown as Node;
          const target = d.target as unknown as Node;
          let x, y;
          if (source.id === target.id) {
            x = (source.x || 0) + 40;
            y = (source.y || 0) - 30;
          } else {
            x = ((source.x || 0) + (target.x || 0)) / 2;
            y = ((source.y || 0) + (target.y || 0)) / 2 - 5;
          }
          return `translate(${x},${y})`;
        });

      linkLabel.selectAll("rect")
        .each(function() {
          const element = this as SVGRectElement;
          const g = d3.select(element.parentNode as SVGGElement);
          const text = g.select("text").node() as SVGTextElement;
          const bbox = text.getBBox();
          d3.select(element)
            .attr("x", bbox.x - 2)
            .attr("y", bbox.y - 2)
            .attr("width", bbox.width + 4)
            .attr("height", bbox.height + 4);
        });

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, currentState, initialState]);

  return (
    <div className="w-full h-full bg-[#fdfdfd] border border-black/5 rounded-lg overflow-hidden flex items-center justify-center">
      <svg ref={containerRef} width="800" height="600" viewBox="0 0 600 400" className="max-w-full h-auto" />
    </div>
  );
}
