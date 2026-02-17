document.getElementById("addBtn")
  .addEventListener("click", async () => {

    const num1 = document.getElementById("num1").value;
    const num2 = document.getElementById("num2").value;

    // call backend API
    const response = await fetch(
      `http://localhost:8080/add?a=${num1}&b=${num2}`
    );

    const result = await response.text();

    document.getElementById("result").textContent =
      "Result: " + result;
});