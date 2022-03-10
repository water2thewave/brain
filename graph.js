// TODO add a text field to new nodes
// TODO middle click create node
// TODO show depth of max 3 levels from left clicked

let width = window.innerWidth || 900, height = window.innerHeight || 900;
const jsonUrl = 'data.json';
const defaultSize = 30;

let graph, store;
let graphFilterList = [];

let svg = d3.select("#knowledge-graph-container")
  .append("svg")
  // .attr("width", width)
  // .attr("height", height)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .classed("svg-content", true);


window.addEventListener('resize', onWindowResize);

let tooltip = d3.select("#knowledge-graph")
  .append("div")
  .attr("class", "tooltip")
  .text("default text to be overridden");

// let color = d3.scaleOrdinal(d3.schemeCategory20);

let link = svg.append("g").attr("id", "links").selectAll("g");
let node = svg.append("g").attr("id", "nodes").selectAll("g");

// initialize link

let simulation = d3.forceSimulation();

d3.json(jsonUrl).then( (g) => {
  graph = g;

  store = Object.assign({}, {}, g);
  updateSimulation();


}).catch(console.error);

function updateSimulation() {

  // replace normal node with labeled node
  node = node.data(graph.nodes, (d) => (d.id));
  link = link.data(graph.links);
  node.exit().remove();

  // tooltip on mouseover
  let newNode = node.enter().append("g")
    .attr("class", "node")
    .on("mouseover", (e,d) => (tooltip.style("visibility", "visible").text(d.word)))
    .on("mousemove", (e,d) => (tooltip.style("top", (e.pageY-10)+"px").style("left",(e.pageX+10)+"px")))
    .on("mouseout", () => (tooltip.style("visibility", "hidden")))
    .on("mousedown", handleMiddleButton)
    .on("click", (e,d) => (handleNodeClick(e,d)))
    .on("contextmenu", (e, d) => (e.preventDefault()));

  let newLink = link.enter()
    .append("line")
    .attr("class", "link");

  let circles = newNode.append("circle")
    .attr("class", "node")
    .attr("r", defaultSize)
  // disable dragging for now
    // .call(d3.drag()
    //   .on("start", dragstarted)
    //   .on("drag", dragged)
    //   .on("end", dragended));


  let nodeName = newNode.append("text")
    .attr("class", "kanji")
    .attr('x', -8)
    .attr('y', 6)
    .text((d) => (d.word));

  let titles = newNode.append("title")
    .text((d) => (d.name));

  node = node.merge(newNode);
  link = link.merge(newLink);

  setupSimulation();
  simulation.alpha(0.3).alphaTarget(0).restart();
}

function filterGraph(category) {
  if (graphFilterList.includes(category)) {
    graphFilterList.splice(graphFilterList.indexOf(category), 1)
  } else {
    graphFilterList.push(category)
  }
  filterSimulation();
  updateSimulation();
}

function filterSimulation() {
  store.nodes.forEach(function(n) {
    // Add back filtered items to the graph
    if (n.isFilteredOut && !graphFilterList.includes(n.group)) {
      n.isFilteredOut = false;
      graph.nodes.push(Object.assign({}, {}, n));
    }
    // mark filtered items
    n.isFilteredOut = graphFilterList.includes(n.group);
  });

  graph.nodes = store.nodes.filter((n) => !n.isFilteredOut);
}


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function setupSimulation() {
  simulation
    .nodes(graph.nodes)
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("link", d3.forceLink() // Acts on the link of the graph
      .id((d) => (d.id))
      .links(graph.links))
    .force("charge", d3.forceManyBodyReuse() // Acts on the node of the graph (attraction of nodes)
      .strength(-800))
    .force("collide", d3.forceCollide()
      .strength(1)
      .radius(defaultSize) // Acts on the node of the graph (avoid collapsing)
      .iterations(8))
    .force("x", d3.forceX().strength(width < 700 ? .2 * height / width : 0.05)) // Acts as gravity on nodes (display in canvas)
    .force("y", d3.forceY().strength(width < 700 ? .16 * width / height : 0.05))
    .on("tick", () => ticked(node, link));
}

function ticked(node, link) {
  node
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
  link
    .attr("x1", (d) => (d.source.x))
    .attr("y1", (d) => (d.source.y))
    .attr("x2", (d) => (d.target.x))
    .attr("y2", (d) => (d.target.y));
}

function handleNodeClick(event, d) {
  event.preventDefault();

  const leftClicked = event.button == 0 || 1 == event.button&1;
  const rightClicked = event.button == 2 || 1 == event.button&3;
  if (leftClicked) {
    // console.log(`Left button clicked "${d.word}"`);
    // TODO show max depth of 2
    bfsUndirectedTraverse({root: d, maxLevel: 2}, (node, level) => {
      // set brightness to max depth
      console.log('Traversed ', {node: node.word, id: node.id, level: level, })
    });
  }
  else if (rightClicked) {
    console.log(`Right button clicked "${d.word}"`);
  }
  else {
    console.log(`Some button clicked "${d.word}"`);
  }

}

function handleClickOutside(event, d) {
  // when we click outside, we want to create a node

}

function createNewNode(clickedNode) {
  const newId = graph.nodes.length;

  let node = { 
    "id": newId,
    "word": `newNode #${newId}` 
  };
  let link = { 
    "source": clickedNode.id, 
    "target": newId 
  };
  graph.nodes.push(node);
  graph.links.push(link)
  
  updateSimulation();
}

function handleMiddleButton(event, clickedNode) {
  const middleClicked = event.button == 1 || 1 == event.button&2;
  if (!middleClicked) return;

  console.log(`Middle button clicked `);
  event.preventDefault();
  createNewNode(clickedNode);
}

function onWindowResize(e) {
  width = window.innerWidth;
  height = window.innerHeight;
  svg
    // .attr("width", width)
    // .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  updateSimulation();
};
function bfsUndirectedTraverse(options, func) {
  // Traverse the graph ignoring starting from root, ignoring link direction.
  const {root, maxLevel} = options;
  
  let level = 0;
  let node = root;

  let q = [root];
  let traversed = {};
  
  while (q.length > 0 && level <= maxLevel) {
    // process level by level
    q.map((n) => {
      func(n, level); 
      traversed[n.id] = true;
    });
    
    q.map( (n)
    
    
    let nextLevel = [];
    q.map((n) => {
      let neighbors = getNeighborsOf(n);
      console.log({neighbors});
      q.push(...neighbors);
    });
    
    q = nextLevel;
    level += 1;
  }
}

function getNeighborsOf(n) {
  return graph.links.reduce( (neighbors, link) => {
        let isNeighbor = link.source.id == n.id || link.target.id == n.id;
        if (isNeighbor) {
          let neighbor = link.source.id != n.id ? link.source : link.target;
          console.log({neighbor: neighbor.word});
          neighbors.push(neighbor);
        }
        return neighbors;
      }, []);
}