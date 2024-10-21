// Function to get query parameter
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Fetch and display categories
$(document).ready(function () {
  if (window.location.pathname.includes("index.html")) {
    $.ajax({
      url: "https://www.themealdb.com/api/json/v1/1/categories.php",
      method: "GET",
      success: function (response) {
        const categories = response.categories;
        let htmlContent = "";
        categories.forEach((category) => {
          htmlContent += `
            <div class="grid-item" onclick="window.location.href='category-detail.html?category=${category.strCategory}'">
              <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
              <h3>${category.strCategory}</h3>
            </div>
          `;
        });
        $("#category-list").html(htmlContent);
      },
    });
  }

  // Fetch and display meals for selected category
  if (window.location.pathname.includes("category-detail.html")) {
    const category = getQueryParam("category");
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
      method: "GET",
      success: function (response) {
        const meals = response.meals;
        let htmlContent = "";
        meals.forEach((meal) => {
          htmlContent += `
            <div class="grid-item" onclick="window.location.href='meal-detail.html?mealId=${meal.idMeal}'">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          `;
        });
        $("#meal-list").html(htmlContent);
      },
    });
  }

  // Fetch and display meal details
  if (window.location.pathname.includes("meal-detail.html")) {
    const mealId = getQueryParam("mealId");
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      method: "GET",
      success: function (response) {
        const meal = response.meals[0];
        const htmlContent = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h2>${meal.strMeal}</h2>
          <p>${meal.strInstructions}</p>
          <h3>Ingredients:</h3>
          <ul>
            ${Object.keys(meal)
              .filter((key) => key.includes("strIngredient") && meal[key])
              .map((key) => `<li>${meal[key]}</li>`)
              .join("")}
          </ul>
          <h3>Watch Recipe on YouTube</h3>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${
            meal.strYoutube.split("=")[1]
          }" frameborder="0" allowfullscreen></iframe>
        `;
        $("#meal-detail").html(htmlContent);
      },
    });
  }
});
