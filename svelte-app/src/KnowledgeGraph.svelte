<script>
	export let width, height, editMode, roleData;
  import * as d3 from "d3";
  import { prevent_default } from "svelte/internal";

  const defaultSize = 30;


$: editModeClass = editMode ? 'edit-mode' : '';

var selectedNode;

var newLink;
var dragMode;
var dragTarget;

var renameMode;

var tooltipText = "blank tooltip";
var tooltipVisibility = "hidden";

var simulation = d3.forceSimulation();

var nodes = [];
var links = []; 
$: nodes = roleData.nodes;
$: links = roleData.links;
console.log({roleData});

$: setupSimulation(nodes, links);

var drag = d3.drag()
  .on('start', handleDragStarted)
  .on('drag', (e, d) => { handleDragged(e, d) })
  .on('end', handleDragend);

function handleDragStarted(e) {
  console.debug('Drag started');
  let n = selectedNode;
  newLink = { 
    source: n,
    target: { x: n.x, y: n.y},
  };
  
  dragMode = true;
}
function handleDragged(e, d) {
  // console.log({e});
  newLink.target.x = e.x;
  newLink.target.y = e.y;
}

function handleDragend(e) {
  
  const validLink = 'id' in newLink.target;
  console.log('newLink', newLink);
  if (validLink) {
    newLink.target = dragTarget;
    console.log('valid link');
    console.log({links});
    links.push(newLink);
    newLink = null;
    roleData = roleData;
    links = links;
    updateSimulation();
  }
  else {
    newLink = null;
  }

  dragMode = false;
  dragTarget = null;
  console.debug('Drag ended');
}

function updateSimulation(nodes, links) {
  setupSimulation();
  simulation.alpha(0.3).alphaTarget(0).restart();
}

function setupSimulation() {
  simulation
    .nodes(nodes)
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("charge", d3.forceManyBody() // Acts on the node of the graph (attraction of nodes)
      .strength((d) => -1*d.radius*20 || -1*defaultSize*20 ))
    .force("collide", d3.forceCollide()
      .strength(1)
      .radius((d) => d.radius) // Acts on the node of the graph (avoid collapsing)
      .iterations(8))
    .force("x", d3.forceX().strength(width < 700 ? .2 * height / width : 0.05)) // Acts as gravity on nodes (display in canvas)
    .force("y", d3.forceY().strength(width < 700 ? .16 * width / height : 0.05))
    .force("link", d3.forceLink() // Acts on the link of the graph
      .id((d) => (d.id))
      .links(links))
    .on("tick", () => ticked());
}

function ticked() {
  // assigning nodes back to nodes triggers svelte to re-read for bindings
  nodes = roleData.nodes;
  links = roleData.links;

  roleData.nodes = nodes;
  roleData.links = links;
}

function handleEditNodeClick(event, d) {
  const leftClicked = event.button == 0 || 1 == event.button&1;
  const rightClicked = event.button == 2 || 1 == event.button&3;
  if (leftClicked) {
    console.debug(`Edit mode: Left button clicked "${d.word}"`);
    selectedNode = d;
    
    d3.select(`#node-${d.id}`).call(drag);
  }
  else if (rightClicked) {
    console.debug(`Edit mode: Right button clicked "${d.word}"`);
    deleteNode(node);
  }
}
function handleMouseMove(e, n) {
  if (dragMode) {

  }
}

function handleDblCLick(e, n) {
  selectedNode = n;
  renameMode = true;
  dragMode = false;
}

function handleMouseOver(e, n) {
  if (dragMode) {
    console.log('MouseOver dragmode', n);
    n.radius = 20;
    newLink.target.id = n.id;
    console.log({newLink});
    roleData = roleData;
    dragTarget = n;
  }
}

function handleMouseLeft(e, n) {
  if (dragMode) {
    console.log('mouseleft while in dragmode', e);
    n.radius = defaultSize;
    delete newLink.target.id;
    delete newLink.target.index;
    roleData = roleData;
  }
}

function handleNodeContextMenu(e, node) {
  if (editMode) { 
    e.preventDefault();
    console.debug('Context menu disabled in edit mode');
    handleEditRightClick(e,node);
  } 
}

function handleEditRightClick(event, node) {
  // delete node
  console.log('Deleting node ', node);
  deleteNode(node);
}

// delete a node by id
function deleteNode(node) {
  // remove node
  let newNodes = nodes.filter((n) => ( n.id != node.id ));
  console.debug({oldNodes: nodes, newNodes});
  
  // links pointing to and from
  let newLinks = links.filter((link) => {
    let {target, source} = link;

    if (target.id) {
      // collapse d3 node. NOTE need to standardize the data and link nodes
      target = target.id;
      source = source.id;
    }
    
    return ! (source == node.id || target == node.id);
  });
  
  roleData.nodes = newNodes;
  roleData.links = newLinks;
  updateSimulation();
}

function handleNodeClick(event, d) {
  if (editMode) return handleEditNodeClick(event, d);

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
  const newId = nodes.length;

  let node = { 
    "id": newId,
    "word": `newNode #${newId}` 
  };

  let link = { 
    "source": clickedNode.id, 
    "target": newId 
  };

  roleData.nodes.push({...node});
  roleData.links.push({...link});
  
  updateSimulation();
  // saveToBrowser(nodes, links);
  // TODO fire onChange
}
function handleEditMiddleButton(event, clickedNode) {
  console.log(`Edit mode: Middle button clicked`);
  createNewNode(clickedNode);
}

function handleMiddleButton(event, clickedNode) {
  const middleClicked = event.button == 1 || 1 == event.button&2;
  if (!middleClicked) return;

  event.preventDefault();

  if (editMode) return handleEditMiddleButton(event, clickedNode);

  console.log(`Middle button clicked `);
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
  return links.reduce( (neighbors, link) => {
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




    // .on("mousemove", (e,d) => (tooltip.style("top", (e.pageY-10)+"px").style("left",(e.pageX+10)+"px")))
</script>

    
<div class="container">
  </div>

  <div id="knowledge-graph-container" class="svg-container graph-bg {editModeClass}">
    <svg id="knowledge-graph-svg" class="svg-content" preserveAspectRatio="xMinYMin meet" viewBox="0 0 {width} {height}">
      <rectangle>
      </rectangle>
      <g id="links">
        {#each links as l}
            <line x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y} class="link">
            </line>
        {/each}
        {#if editMode && newLink}
            <line class="link" 
              x1={newLink.source.x} 
              y1={newLink.source.y} 
              x2={newLink.target.x} 
              y2={newLink.target.y} >
            </line>
        {/if}
      </g>

      <g id="nodes" data-toggle="tooltip" title={tooltipText}>
        {#each nodes as n}
          <g id="node-{n.id}" 
            on:dblclick={(e) => handleDblCLick(e,n)}
            on:click={(e) => handleNodeClick(e,n)}
            on:mousedown={(e) => handleMiddleButton(e, n)}
            on:mousemove={(e) => handleMouseMove(e, n)}
            on:contextmenu={(e) => handleNodeContextMenu(e, n)}
            on:dragstart={(e) => handleNodeDragStart(e,n)}
            on:dragend={(e) => handleNodeDragEnd(e,n)}
            on:mouseover={(e) => handleMouseOver(e, n)}
            on:mouseout={(e) => handleMouseLeft(e, n)}

            transform="translate({n.x || 0}, {n.y || 50})" 
            class="node">

            <circle r={n.radius || defaultSize} 
              class="node"></circle>

            {#if editMode && renameMode && selectedNode == n}
            <!-- <div class="rename-node">  -->
            <foreignObject x="-8" y="6" width="100" height="150">
              <form on:submit|preventDefault={ () => {
                selectedNode = null;
                renameMode = false;
              }}>
                <input bind:value={n.word}/>
              </form>
            </foreignObject>
            <!-- </div> -->
            {:else}
            <text x="-8" y="6">{n.word}</text>
            {/if}
            <title>{n.word}</title>

          </g>
        {/each}
      </g>

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
  
  .edit-mode {
    background-color: rgb(3, 13, 42) !important;
  }

	.graph-bg {
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
