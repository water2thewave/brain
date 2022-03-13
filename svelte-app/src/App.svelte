
<script>
	export let name;

	import KnowledgeGraph from './KnowledgeGraph.svelte';

	let editMode = false;
	let role = 'wizard';
	let	roles = [];
	
	getRoles();

	function getRoles() {
		let localStorage = window.localStorage;
		for ( var i = 0, len = localStorage.length; i < len; ++i ) {
			// let name = localStorage.getItem( localStorage.key(i) ) ;
			roles.push(localStorage.key(i));
		}
	}
function saveRole(role, data) {
	const {nodes, links} = data;
	console.log({data});

	const saveLinks = links.map((link) => {
		let {index, source, target} = link;
		if (source.id) {
			let ret = {source: source.id, target: target.id};
			return ret;
		}
		else {
			return link;
		}
	});
	// const saveNodes = nodes.map(({id, word}) =>  {id, word});
	// const saveData = {nodes: saveNodes, links: saveLinks};
	const saveData = {nodes, links: saveLinks};
	console.log('saved to localStorage', saveData);
	let jsonStr = JSON.stringify(saveData);
	window.localStorage.setItem(role, jsonStr);
}

	let roleData = {nodes: [], links: []};
	var selectedRole;

	loadLocalStorage(role)

	if (!selectedRole) {
	// console.error(`Invalid json in localstorage for role "${role}"`, roleData);
		console.log('Loading default data');
		d3.json('data.json')
			.then ((obj) => { 
				roleData = obj;
				console.log('default data loaded', roleData);
				saveRole(role, obj);
				selectedRole = role;
			})
			.catch(console.error);
	}

	$: saveRole(role, roleData);

	function deleteLocalStorage() {
		window.localStorage.clear();
		console.log('Localstorage deleted');
	}

	function loadLocalStorage(role) {
		let storedData = window.localStorage.getItem(role);
		if (storedData != null) {
			console.log(`Changing class to ${role}`);
			roleData = JSON.parse(storedData);
			selectedRole = role;
		}
		else {
			console.log(`Did not class to ${role}`, roleData);
		}

	}



</script>


<div class="localstorage container">
	<div class="mt-n1 container">
	<button class="btn btn-primary delete-localstorage"
		role="button"
		on:click={deleteLocalStorage}>
		Delete localstorage</button>

	<button 
	class="btn btn-primary show-localstorage" type="button" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="lscontent" data-target="#lscontent">

		Show localstorage
	</button>
	</div>
	
	<div class="row">
		<div class="col">
		{#each roles as r}
			<input class="btn btn-primary" type="button" value={r}>
		{/each}
		</div>
	</div>
	
	<h1>Here be elements
			<form on:submit|preventDefault={() => {
				saveRole(role, roleData);
			}}>
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


