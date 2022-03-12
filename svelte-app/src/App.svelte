
<script>
	export let name;

	import KnowledgeGraph from './KnowledgeGraph.svelte';
</script>


<div class="localstorage container">
	<a class="btn btn-primary delete-localstorage"
		role="button"
	>Delete localstorage</a>

	<button class="btn btn-primary show-localstorage" type="button" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="lscontent" data-target="#lscontent">
		Show localstorage
	</button>

	<div class="collapse" id="lscontent">
		<div class="card cardbody">
			<label for="edit-json"> 'wizard' </label>
			<textarea class="edit-json"> dummy </textarea>
			<a class="copy-json btn btn-primary"> Copy text </a> 
		</div>
	</div>
</div>
<KnowledgeGraph width={window.innerWidth} height={window.innerHeight}></KnowledgeGraph>

