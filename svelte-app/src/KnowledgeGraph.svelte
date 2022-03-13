<script>
	export let width, height, editMode;
  import * as d3 from "d3";
  import { prevent_default } from "svelte/internal";

  const jsonUrl = 'data.json';
  const defaultSize = 30;

var nodes = [];
var links = [];

$: editModeClass = editMode ? 'edit-mode' : '';

var selectedNode;

var tooltipText = "blank tooltip";
var tooltipVisibility = "hidden";

var simulation = d3.forceSimulation();

loadLocalStorage()
  .then((obj) => {
    console.log(`Loaded json from localstorage`, obj);
    nodes = obj.nodes;
    links = obj.links;
  })
  .catch((e) => {       // load default data
    console.info(e.message);
    console.log('Loading default data');
    d3.json(jsonUrl)
      .then ((obj) => {
        nodes = obj.nodes;
        links = obj.links;
        updateSimulation();
      })
      .catch(console.error);
  })
  .finally( () => updateSimulation());

function updateSimulation() {
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
  nodes = nodes;
  links = links;
}

function handleEditNodeClick(event, d) {
  const leftClicked = event.button == 0 || 1 == event.button&1;
  const rightClicked = event.button == 2 || 1 == event.button&3;
  if (leftClicked) {
    selectedNode = d;
  }
  else if (rightClicked) {
    console.log(`Edit mode: Right button clicked "${d.word}"`);
  }
  else {
    console.log(`Edit mode: Some button clicked "${d.word}"`);
  }
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

  nodes.push({...node});
  links.push({...link});
  
  updateSimulation();
  saveToBrowser(nodes, links);
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

function saveToBrowser(nodes, links) {
  // Save to localstorage on each change
  const saveLinks = links.map((link) => {
    let {index, source, target} = link;
    return {source: source.id, target: target.id};
  });
  // const saveNodes = nodes.map(({id, word}) =>  {id, word});
  // const saveData = {nodes: saveNodes, links: saveLinks};
  const saveData = {nodes, links: saveLinks};
  console.log('saved to localStorage', saveData);
  let jsonStr = JSON.stringify(saveData);
  localStorage.setItem('wizard', jsonStr);
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
      </g>

      <g id="nodes" data-toggle="tooltip" title={tooltipText}>
        {#each nodes as n}
          <g on:click|preventDefault={(e) => handleNodeClick(e,n)}
            on:mousedown={(e) => handleMiddleButton(e, n)}

            transform="translate({n.x || 0}, {n.y || 50})" class="node">

            <circle r={n.radius || defaultSize} class="node"></circle>
            {#if editMode && selectedNode == n}
            <foreignObject x="-8" y="6" width="100" height="150">
              <form on:submit|preventDefault={ () => {
                saveToBrowser(nodes, links);
                selectedNode = null;
              }}>
                <input bind:value={n.word}/>
              </form>
            </foreignObject>
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
