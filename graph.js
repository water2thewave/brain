// TODO Tell a story here
// TODO add a text field to new nodes
// TODO middle click create node
// Use <image> and <foreignObject/> for non-text elements
// TODO use radius as an integer with a coeff

const jsonUrl = 'data.json';
const defaultSize = 30;

var width = window.innerWidth || 900, height = window.innerHeight || 900;

var localStorage = window.localStorage;

var graph; // raw data
var store;  // store of the svg nodes

var graphFilterList = [];

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

loadLocalStorage().then((json) => {
  console.log(`Loaded json from localstorage`);
  console.log({loadedJson});
  updateGraph(loadedJson);
})
.catch((e) => {       // load default data
  d3.json(jsonUrl)
    .then(updateGraph)
    .catch(console.error);
});

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
    // .on("contextmenu", (e, d) => (e.preventDefault()));

  let newLink = link.enter()
    .append("line")
    .attr("class", "link");

  let circles = newNode.append("circle")
    .attr("class", "node")
    .attr("r", (d) => (d.radius || defaultSize));
    // .style("filter", node.filterValue);
  // TODO use dragging to make pictures (of dragons!)
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
      .strength((d) => -1*d.radius*20 || -1*defaultSize*20 ))
    .force("collide", d3.forceCollide()
      .strength(1)
      .radius((d) => d.radius) // Acts on the node of the graph (avoid collapsing)
      .iterations(8))
    .force("x", d3.forceX().strength(width < 700 ? .2 * height / width : 0.05)) // Acts as gravity on nodes (display in canvas)
    .force("y", d3.forceY().strength(width < 700 ? .16 * width / height : 0.05))
    .on("tick", () => ticked(node, link));
}

function ticked(node, link) {
  node  // move nodegroup to node's position
    .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
  link  // move links along with whole node
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
    // TODO show max depth of 2
    traverse({root: d}, (n, level) => {
      // set brightness to max depth
      const maxLevel = 3;
      let newRadius = level > maxLevel ? 0 : (1 - (level / maxLevel)) * defaultSize;
      n.radius = newRadius;
    });
    node.selectAll('circle').attr("r", (d) => (d.radius));
    updateSimulation();

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
  
  saveToBrowser();
  
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

function traverse(options, callback) {
  // Traverse the graph ignoring starting from root, ignoring link direction.
  const {root} = options;
  const level = options.level || 0;
  const visited = options.visited || {};
  
  if (visited[root.id] == true) return;

  callback(root, level);
  visited[root.id] = true;
  
  // DFS
  let q = getNeighborsOf(root);
  for (let i in q) {
    let n = q[i];
    traverse({
      root: n, 
      level: level+1,
      visited: visited 
    }, callback);
  }
}

function getNeighborsOf(n) {
  return graph.links.reduce( (neighbors, link) => {
    let isNeighbor = link.source.id == n.id || link.target.id == n.id;
    if (isNeighbor)
    {
      let neighbor = link.source.id != n.id ? link.source : link.target;
      // console.log({ neighbor: neighbor.word });
      neighbors.push(neighbor);
    }
    return neighbors;
  }, []);
}

function saveToBrowser() {
  // Save to localstorage on each change
  console.log('saved to localStorage', graph);
  localStorage.setItem('wizard', JSON.stringify(graph));
  return Array.prototype.push.apply(this, arguments);
}

function updateGraph(loadedJson) {
  graph = JSON.parse(loadedJson);
  // graph.push = saveToBrowser
  store = Object.assign({}, {}, g);
  updateSimulation();
}

function loadLocalStorage() {
 return new Promise((resolve, reject) => {
  const key = 'wizard';
  let loadedJson = localStorage.getItem(key);
   if (!loadedJson) {
     reject(`Blank json in localstorage for key "${key}"`);
   }
   
   try {
     resolve(JSON.parse(loadedJson))
   }
   catch (e) {
     console.error({loadedJson})
     reject(`Invalid json in localstorage for key "${key}"`);
   }
 });
}