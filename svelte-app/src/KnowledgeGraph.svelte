<script>
	export let width, height;
  // import * as d3 from "https://cdn.skypack.dev/d3@7";
  import * as d3 from "d3";

  const jsonUrl = 'data.json';
  const defaultSize = 30;

var data = {links: [], nodes: []}; // raw data
var graph; // graph data
var store;  // store of the svg nodes
var nodes = [];
var links = [];

  let link = d3.select("#links").selectAll("g");
  let node = d3.select("#nodes").selectAll("g");

  // let link = svg.append("g").attr("id", "links").selectAll("g");
  // let node = svg.append("g").attr("id", "nodes").selectAll("g");

let simulation = d3.forceSimulation();

loadLocalStorage()
  .then((obj) => {
    console.log(`Loaded json from localstorage`);
    updateGraph(obj);
    graph = graph;
  })
  .catch((e) => {       // load default data
    console.info(e.message);
    console.log('Loading default data');
    d3.json(jsonUrl)
      .then ((obj) => {
        updateGraph(obj);
        nodes = obj.nodes;
        links = obj.nodes;
      })
      // .then(updateGraph)
      .catch(console.error);
  });

function updateSimulation() {

  // replace normal node with labeled node
  node = node.data(graph.nodes, (d) => (d.id));
  link = link.data(graph.links);
  node.exit().remove();
  // link.exit().remove();

  // tooltip on mouseover
  let newNode = node.enter().append("g")
    .attr("class", "node")
    .on("mouseover", (e,d) => (tooltip.style("visibility", "visible").text(d.word)))
    .on("mousemove", (e,d) => (tooltip.style("top", (e.pageY-10)+"px").style("left",(e.pageX+10)+"px")))
    .on("mouseout", () => (tooltip.style("visibility", "hidden")))
    .on("mousedown", handleMiddleButton)
    .on("click", (e,d) => (handleNodeClick(e,d)))
    // .on("contextmenu", (e, d) => (e.preventDefault()));

  // let newLink = link.enter()
  //   .append("line")
  //   .attr("class", "link");

  // let circles = newNode.append("circle")
    // .attr("class", "node")
    // .attr("r", (d) => (d.radius || defaultSize));
    // .style("filter", node.filterValue);
  // TODO use dragging to make pictures (of dragons!)
    // .call(d3.drag()
    //   .on("start", dragstarted)
    //   .on("drag", dragged)
    //   .on("end", dragended));


  // let nodeName = newNode.append("text")
  //   .attr("class", "kanji")
  //   .attr('x', -8)
  //   .attr('y', 6)
  //   .text((d) => (d.word));

  // let titles = newNode.append("title")
  //   .text((d) => (d.name));

  // node = node.merge(newNode);
  // link = link.merge(newLink);

  // TODO cleanup this textarea update
  let jsonStr = JSON.stringify(data);
  // $(".edit-json").val(jsonStr);

  setupSimulation();
  simulation.alpha(0.3).alphaTarget(0).restart();
}




function setupSimulation() {
  simulation
    .nodes(graph.nodes)
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("link", d3.forceLink() // Acts on the link of the graph
      .id((d) => (d.id))
      .links(graph.links))
    .force("charge", d3.forceManyBody() // Acts on the node of the graph (attraction of nodes)
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
  nodes = nodes;
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

  // add to raw data store
  data.nodes.push({...node}); // push copy
  data.links.push({...link});

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
  console.log('saved to localStorage', data);
  let jsonStr = JSON.stringify(data);
  localStorage.setItem('wizard', JSON.stringify(data));
  
  // remove gunk before 
  // return Array.prototype.push.apply(this, arguments);
}

function updateGraph(loadedJson) {


  console.log('Updating graph', loadedJson);
  data = JSON.parse(JSON.stringify(loadedJson)); // deep copy
  graph = loadedJson
  // graph.push = saveToBrowser
  store = Object.assign({}, {}, loadedJson);
  updateSimulation();

  // update textarea
  let jsonStr = JSON.stringify(data);
  // $(".edit-json").val(jsonStr);
}

function loadLocalStorage() {
 return new Promise((resolve, reject) => {
  const key = 'wizard';
  let loadedJson = localStorage.getItem(key);
   if (!loadedJson) {
     throw Error(`Blank json in localstorage for key "${key}"`);
   }
   
   try {
     resolve(JSON.parse(loadedJson));
    //  console.log({loadedJson});
   }
   catch (e) {
     console.error({loadedJson})
     throw Error(`Invalid json in localstorage for key "${key}"`);
   }
 });
}

</script>

<div class="container">
	<h1>Here be elements</h1>
  </div>

  <div id="knowledge-graph-container" class="svg-container">
    <svg id="knowledge-graph-svg" class="svg-content" preserveAspectRatio="xMinYMin meet" viewBox="0 0 {width} {height}">
      <g id="nodes">
        {#each nodes as n}
          <g transform="translate({n.x}, {n.y})" class="node">
            <circle r={n.radius || defaultSize} class="node"></circle>
            <text x="-8" y="6">{n.word}</text>
            <title>{n.word}</title>
          </g>
        {/each}
      </g>
      <g id="links"></g>
    </svg>
    <div id="knowledge-graph"></div>
  </div>

<style>
	.node {
		stroke: #226a3c;
		/* background-color: burlywood; */
		fill: #563478;
	}

	.link {
		stroke: #226a3c;;
		/* background-color: burlywood; */
		fill: #226a3c;
	}

	body {
		background-color: rgb(8, 32, 77);
	}
	
	.svg-container {
	display: inline-block;
	position: relative;
	width: 100%;
	padding-bottom: 100%;
	vertical-align: top;
	overflow: hidden;
}
.svg-content {
	display: inline-block;
	position: absolute;
	top: 0;
	left: 0;
}
</style>
