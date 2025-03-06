const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

document.addEventListener("DOMContentLoaded", () => {
    loadAllMeals(); 

    document.getElementById("searchButton").addEventListener("click", () => {
        const searchTerm = document.getElementById("searchInput").value.trim();
        if (searchTerm) {
            fetchMeals(searchTerm);
        }
    });
});

const loadAllMeals = () => {
    fetch(`${API_URL}Chicken`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals || []);
        })
        .catch(error => console.error("Error fetching meals:", error));
};

const fetchMeals = (searchTerm) => {
    fetch(`${API_URL}${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals || []);
        })
        .catch(error => console.error("Error fetching meals:", error));
};

const displayMeals = (meals) => {
    const container = document.getElementById("mealsContainer");
    container.innerHTML = "";

    if (meals.length === 0) {
        container.innerHTML = "<p class='text-danger'>No meals found.</p>";
        return;
    }

    meals.slice(0, 8).forEach((meal) => {
        const mealCard = document.createElement("div");
        mealCard.className = "col-md-6 mb-4";
        
        // Escape quotes in meal details
        const mealName = meal.strMeal.replace(/'/g, "\\'");
        const mealCategory = meal.strCategory ? meal.strCategory.replace(/'/g, "\\'") : "Unknown";
        const mealArea = meal.strArea ? meal.strArea.replace(/'/g, "\\'") : "Unknown";
        const mealInstructions = meal.strInstructions ? meal.strInstructions.replace(/'/g, "\\'").slice(0, 150) : "No instructions available.";

        mealCard.innerHTML = `
            <div class="card">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p><strong>Category:</strong> ${meal.strCategory || "Unknown"}</p>
                    <p>${meal.strInstructions.slice(0, 15)}...</p>
                    <button class="btn btn-success" onclick="addToGroup('${mealName}', '${meal.strMealThumb}')">Add to Group</button>
                    <button class="btn btn-info details-btn" data-name="${mealName}" data-category="${mealCategory}" data-area="${mealArea}" data-instructions="${mealInstructions}">Details</button>
                </div>
            </div>
        `;

        container.appendChild(mealCard);
    });

    // Attach event listeners to all "Details" buttons
    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", function () {
            showDetails(
                this.getAttribute("data-name"),
                this.getAttribute("data-category"),
                this.getAttribute("data-area"),
                this.getAttribute("data-instructions")
            );
        });
    });
};



let selectedMeals = [];
const addToGroup = (mealName, mealImage) => {
    if (selectedMeals.length >= 7) {
        alert("You can't add more than 7 meals.");
        return;
    }

    selectedMeals.push({ name: mealName, image: mealImage });
    updateSelectedMeals();
};

const updateSelectedMeals = () => {
    const list = document.getElementById("selectedMeals");
    list.innerHTML = "";
    selectedMeals.forEach((meal, index) => {
        const listItem = document.createElement("div");
        listItem.className = "cart-item";
        listItem.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}">
            <span>${meal.name}</span>
            <button class="btn btn-danger btn-sm" onclick="removeMeal(${index})">X</button>
        `;
        list.appendChild(listItem);
    });
    document.getElementById("mealCount").innerText = selectedMeals.length;
};

const removeMeal = (index) => {
    selectedMeals.splice(index, 1);
    updateSelectedMeals();
};


const showDetails = (name, category, area, instructions) => {
    document.getElementById("modalTitle").innerText = name;
    document.getElementById("modalBody").innerHTML = `
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Area:</strong> ${area}</p>
        <p><strong>Instructions:</strong> ${instructions}</p>
    `;

    // Initialize and show Bootstrap modal
    const modalElement = document.getElementById("mealModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};
