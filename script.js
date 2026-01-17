const conflictRules = {
    "retinol": {
        conflicts: ["vitamin c", "aha", "bha", "benzoyl peroxide"],
        reason: "Can cause irritation and reduce effectiveness when combined"
    },
    "vitamin c": {
        conflicts: ["retinol", "niacinamide", "aha", "bha"],
        reason: "May reduce stability and effectiveness of both ingredients"
    },
    "niacinamide": {
        conflicts: ["vitamin c"],
        reason: "Can form nicotinic acid at low pH, potentially causing flushing"
    },
    "aha": {
        conflicts: ["retinol", "vitamin c", "bha"],
        reason: "Combining acids can cause excessive irritation and skin barrier damage"
    },
    "bha": {
        conflicts: ["retinol", "vitamin c", "aha"],
        reason: "Combining acids can cause excessive irritation and skin barrier damage"
    },
    "benzoyl peroxide": {
        conflicts: ["retinol", "vitamin c"],
        reason: "Can oxidize and deactivate these ingredients"
    },
    "copper peptides": {
        conflicts: ["vitamin c", "retinol", "aha"],
        reason: "Can destabilize and reduce effectiveness of both ingredients"
    }
};

function normalizeIngredient(ingredient) {
    return ingredient.trim().toLowerCase();
}

function capitalizeIngredient(ingredient) {
    return ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
}

function checkConflicts() {
    const input = document.getElementById('ingredients').value;
    const resultsDiv = document.getElementById('results');

    if (!input.trim()) {
        resultsDiv.style.display = 'block';
        resultsDiv.className = 'results warning';
        resultsDiv.innerHTML = '<h2>Please enter at least one ingredient</h2>';
        return;
    }

    const ingredients = input.split(',').map(normalizeIngredient).filter(i => i);

    if (ingredients.length === 0) {
        resultsDiv.style.display = 'block';
        resultsDiv.className = 'results warning';
        resultsDiv.innerHTML = '<h2>No valid ingredients entered</h2>';
        return;
    }

    const conflicts = [];

    for (let i = 0; i < ingredients.length; i++) {
        const ing1 = ingredients[i];
        
        if (conflictRules[ing1]) {
            for (let j = i + 1; j < ingredients.length; j++) {
                const ing2 = ingredients[j];
                
                if (conflictRules[ing1].conflicts.includes(ing2)) {
                    conflicts.push({
                        ingredient1: ing1,
                        ingredient2: ing2,
                        reason: conflictRules[ing1].reason
                    });
                }
            }
        }
    }

    displayResults(ingredients, conflicts);
}

function displayResults(ingredients, conflicts) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'block';

    const ingredientListHTML = `
        <div class="ingredient-list">
            <strong>Ingredients checked:</strong>
            ${ingredients.map(capitalizeIngredient).join(', ')}
        </div>
    `;

    if (conflicts.length === 0) {
        resultsDiv.className = 'results safe';
        resultsDiv.innerHTML = `
            <h2>✓ Safe to Use Together</h2>
            <p>No known conflicts detected among the entered ingredients.</p>
            ${ingredientListHTML}
        `;
    } else {
        resultsDiv.className = 'results warning';
        
        const conflictHTML = conflicts.map(conflict => `
            <div class="conflict-item">
                <strong>⚠ ${capitalizeIngredient(conflict.ingredient1)} + ${capitalizeIngredient(conflict.ingredient2)}</strong>
                <p>${conflict.reason}</p>
            </div>
        `).join('');

        resultsDiv.innerHTML = `
            <h2>⚠ Conflicts Detected</h2>
            <p>The following ingredient combinations may be incompatible:</p>
            ${conflictHTML}
            ${ingredientListHTML}
        `;
    }
}

document.getElementById('ingredients').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkConflicts();
    }
});

function toggleDisclaimer() {
    const disclaimer = document.getElementById('disclaimer');
    disclaimer.classList.toggle('show');
}
