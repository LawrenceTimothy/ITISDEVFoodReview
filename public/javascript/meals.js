function openModal(id, name, description, price) {
    document.getElementById("mealId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("description").value = description;
    document.getElementById("price").value = price;
    document.getElementById("editModal").style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("editModal").style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == document.getElementById("editModal")) {
      document.getElementById("editModal").style.display = "none";
    }
  }
  