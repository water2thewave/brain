
<script>
	export let name;

	import KnowledgeGraph from './KnowledgeGraph.svelte';

	let editMode = false;
	let role = 'wizard';
	let roleData = {nodes: [], links: []};

	loadLocalStorage(role);

	// $: saveToBrowser(roleData.nodes, roleData.links);

	if (roleData) {
	// console.error(`Invalid json in localstorage for role "${role}"`, roleData);
		console.log('Loading default data');
		d3.json('data.json')
			.then ((obj) => { 
				roleData = obj;
				console.log('default data loaded', roleData);
			})
			.catch(console.error);
	}

	function deleteLocalStorage() {
		window.localStorage.clear();
		console.log('Localstorage deleted');
	}

	function loadLocalStorage(role) {
		let storedData = window.localStorage.getItem(role);
		console.log(`Should class to ${role}`, storedData);
		if (storedData != null) {
			console.log(`Changing class to ${role}`, storedData);
			roleData = storedData;
		}
	}

	function saveToBrowser(nodes, links) {
		console.log({nodes}, {links});
		// TODO move this up to applevel
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
		localStorage.setItem(role, jsonStr);
	}



</script>


<div class="localstorage container">
	<button class="btn btn-primary delete-localstorage"
		role="button"
		on:click={deleteLocalStorage}>
		Delete localstorage</button>

	<button 
	class="btn btn-primary show-localstorage" type="button" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="lscontent" data-target="#lscontent">

		Show localstorage
	</button>
	
	<h1>Here be elements
			<form on:submit|preventDefault={() => loadLocalStorage(role)}>
			<div class="input-group mb-3">
					<span class="input-group-text" id="basic-addon1">Class</span>
					<input bind:value={role} type="text" class="form-control" placeholder="{role}" aria-label="Username" aria-describedby="basic-addon1">
			</div>
			</form>
  <button 
		on:click={() => (editMode = !editMode)}
		class="btn btn-outline-warning" aria-pressed={editMode} data-toggle="button" type="button" 
    role="button"> ✏️ </button>
	</h1>

	<div class="collapse" id="lscontent">
		<div class="card cardbody">
			<label for="edit-json"> {role} </label>
			<textarea class="edit-json"> {JSON.stringify(roleData)} </textarea>
			<a class="copy-json btn btn-primary"> Copy text </a> 
		</div>
	</div>
</div>
<KnowledgeGraph 
bind:roleData bind:editMode width={window.innerWidth} height={window.innerHeight}></KnowledgeGraph>


