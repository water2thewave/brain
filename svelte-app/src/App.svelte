
<script>
	export let name;

	import KnowledgeGraph from './KnowledgeGraph.svelte';
	import DebugPanel from './DebugPanel.svelte';
  import * as d3 from "d3";

	const defaultRole = 'cosmos';
	const defaultDataFile = 'cosmos.json';	// loaded for every new role


	var debugEnabled;
	var editMode = false;
	var	roles = ['cosmos', 'wizard'];

	getRoles();


	var roleData = {nodes: [], links: []};
	var selectedRole;
	console.log({roles});
	console.log({roleData});

	loadLocalStorage(defaultRole)
		.then( (loaded) => { 
			console.log(`Changing class to ${defaultRole}`);
			selectedRole = defaultRole; 
			roleData = loaded;
		})
		.catch((e) => {
		// console.error(`Invalid json in localstorage for role "${role}"`, roleData);
			console.log(`Loading default data for ${defaultRole}`);
			d3.json(`${roles[0] || 'data'}.json`)
				.then ((obj) => { 
					roleData = obj;
					console.log('default data loaded', roleData);
					selectedRole = defaultRole;
					saveRole(defaultRole, obj);
				})
				.catch(console.error);
		});


	function loadLocalStorage(role) {
		return new Promise( (resolve) => {
			let storedData = window.localStorage.getItem(role);
			console.log({storedData});
			if (storedData != null) {
				resolve(JSON.parse(storedData));
			}
			else {
				// console.log(`Did not class to ${role}`, roleData);
				throw Error('No data found');
			}
		});
	}

	function getRoles() {
		let localStorage = window.localStorage;
		for ( var i = 0, len = localStorage.length; i < len; ++i ) {
			// let name = localStorage.getItem( localStorage.key(i) ) ;
			let roleName = localStorage.key(i);
			if (!roles.includes(roleName)) {
				roles.push(roleName);
				roles = roles;
			}
		}
	}
			
	function cleanLink(link) {
		let {index, source, target} = link;
		if (typeof source === 'object' && 'index' in source) {
			let ret = {source: source.id, target: target.id};
			return ret;
		}
		return link;
	}

	function saveRole(role, data) {
	const {nodes, links} = data;
	const saveLinks = links.map(cleanLink);

	// const saveNodes = nodes.map(({id, word}) =>  {id, word});
	// const saveData = {nodes: saveNodes, links: saveLinks};
	const saveData = {nodes, links: saveLinks};
	console.log('saved to localStorage', role, saveData);
	let jsonStr = JSON.stringify(saveData);
	window.localStorage.setItem(role, jsonStr);
	getRoles();
}



</script>


<div class="localstorage container">
	<div class="mt-n1 container">

	</div>
	
	<div class="row">
		<div class="col">
		{#each roles as roleName}
			<button class="btn btn-outline-primary {roleName == selectedRole ? 'active' : ''}" type="button" aria-pressed={roleName == selectedRole}
			on:click={(e) => {
				loadLocalStorage(roleName).then((data) => { 
					roleData = data; 
					selectedRole = roleName; 
				}).catch((e) => {
						const roleFile = `${roleName}.json`;
						let save = (obj) => {
							roleData = obj;
							console.log(`Loading from file ${roleName}`, roleData);
							selectedRole = roleName;
							saveRole(roleName, obj);
						};

						// load role from file, use default if missing
						d3.json(roleFile)
							.then(save)
							.catch(e => {
								d3.json(defaultDataFile)
									.then(save);
							});
				});
				;}}>{roleName}</button>
		{/each}

			<button class="btn btn-outline-success" type="button" aria-pressed="false"
			on:click={(e) => {
				// new role
			}}>+ Role</button>
		</div>
	</div>
	
	<h1>Here be elements
			<form on:submit|preventDefault={(e) => {
				console.log('SAved  role with enter',  );
				saveRole(selectedRole, roleData);
				getRoles();
			}}>
			<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">Class</span>
					<input bind:value={selectedRole} type="text" class="form-control" placeholder="{selectedRole}" aria-label="Username" aria-describedby="basic-addon1">
			</div>
			</form>
  <button 
		on:click={() => {
			if (editMode) {
				saveRole(selectedRole, roleData);
			}
			editMode = !editMode;
		}}
		class="btn btn-outline-warning" aria-pressed={editMode} data-toggle="button" type="button" 
    role="button"> ✏️ </button>

  <button 
		on:click={() => { debugEnabled = !debugEnabled }}
		class="btn btn-outline-info" aria-pressed={editMode} data-toggle="button" type="button" 
    role="button"> ⛏️ </button>

	</h1>
	{#if debugEnabled}
		<DebugPanel bind:roleData bind:role={selectedRole}> </DebugPanel>
	{/if}

</div>
<div class="container">
	<KnowledgeGraph 
		bind:nodes={roleData.nodes} bind:links={roleData.links}
		bind:editMode width={window.innerWidth} height={window.innerHeight}></KnowledgeGraph>
</div>
	


