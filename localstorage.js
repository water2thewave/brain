$(".delete-localstorage").on("click", deleteLocalStorage)

const localStorage = window.localStorage;

function deleteLocalStorage() {
  localStorage.clear();
}