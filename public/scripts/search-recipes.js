

const handleSave = async (id) => {
    await fetch('/api/saved_recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})
    })
  };



const recipeView = (recipe) => `

<div class="col-12">
    <div class="card">
        <h5 class="card-header"><strong>(search match: ${recipe.score})</strong></h5>
        <div class="card-body">
          <ul class="list-group">
               <li class="list-group-item">Name: ${recipe.Cocktail_Name}</li>
                <li class="list-group-item">Ingredients: ${recipe.Ingredients}</li>
                <li class="list-group-item">Garnish: ${recipe.Garnish}</li>
                <li class="list-group-item">Glassware: ${recipe.Glassware}</li>
                <li class="list-group-item">Preparation: ${recipe.Preparation}</li>
                <li class="list-group-item">Notes: ${recipe.Notes}</li>
                <li class="list-group-item">Bartender: ${recipe.Bartender}</li>
          </ul>
        </div>
      </div>
 </div>
`;


const handleClick = async () => {
    const searchVal = document.querySelector("#searchInput").value;
    const recipeDomRef = document.querySelector('#recipes');
    try {

        const ref = await fetch(`/api/search-recipe/?search=${searchVal}`);
        const searchResults = await ref.json();
        let recipeHtml = [];
        searchResults.forEach(recipe => {
            recipeHtml.push(recipeView(recipe));
        });
        recipeDomRef.innerHTML = recipeHtml.join("");
    } catch (e) {
        console.log(e);
        console.log('could not search api');
    }

    
}

