$(".delete-localstorage").on("click", deleteLocalStorage)
$(".edit-json").bind("input propertychange", () => {
  // when we edit json, attempt to load it in node

});

const localStorage = window.localStorage;

function deleteLocalStorage() {
  window.localStorage.clear();
  console.log('Localstorage deleted');
}

function onJsonChange(e) {

}