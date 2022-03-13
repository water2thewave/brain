
<script>
	export let name;

	import KnowledgeGraph from './KnowledgeGraph.svelte';

	let editMode = false;

	const role = 'wizard';
	function deleteLocalStorage() {
		window.localStorage.clear();
		console.log('Localstorage deleted');
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
  <button 
	on:click={() => (editMode = !editMode)}
  class="btn btn-outline-warning {editMode ? 'focus active' : ''}" aria-pressed={editMode} data-toggle="button" type="button" 
    role="button"> ✏️ </button>
	</h1>

	<div class="collapse" id="lscontent">
		<div class="card cardbody">
			<label for="edit-json"> {role} </label>
			<textarea class="edit-json"> {window.localStorage.getItem(role)} </textarea>
			<a class="copy-json btn btn-primary"> Copy text </a> 
		</div>
	</div>
</div>
<KnowledgeGraph bind:editMode={editMode} width={window.innerWidth} height={window.innerHeight}></KnowledgeGraph>


