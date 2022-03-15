<script>
  
export let roleData, role;

function deleteLocalStorage() {
  window.localStorage.clear();
  console.log('Localstorage deleted');
}
function copyClipboard(roleData) {
   /* Copy the text inside the text field */
  let data = JSON.stringify({
    nodes: roleData.nodes,
    links: roleData.links.map(cleanLink)
  }, null, 2) 
  navigator.clipboard.writeText(data);
}

</script>

    
<div>
	<button class="btn btn-primary show-localstorage" type="button" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="lscontent" data-target="#lscontent">
		Show localstorage
	</button>

	<button class="btn btn-danger delete-localstorage" role="button"
		on:click={deleteLocalStorage}>
		Delete localstorage
  </button>


	<div class="collapse" id="lscontent">
		<div class="card cardbody">
			<label for="edit-json"> {role} </label>
			<textarea class="edit-json"> {JSON.stringify(roleData, null, 2)} </textarea>
			<a on:click={copyClipboard(roleData)}
				class="copy-json btn btn-primary"> Copy text </a> 
		</div>
	</div>
</div>



<style>
</style>
