document.addEventListener("DOMContentLoaded", function () {
    //Initialize Details Buttons
    const detailButtons = document.querySelectorAll(".details-button");

    detailButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".skill-card");
            const details = card.querySelector(".skill-details");

            // Determine whether the details are currently hidden.
            const isExpanded = button.getAttribute("aria-expanded") === "true";

            // Toggle the details visibility.
            details.hidden = isExpanded;

            // Update the button state and its label.
            button.setAttribute("aria-expanded", String(!isExpanded));
            button.textContent = isExpanded
                ? "More Information"
                : "Show Less";

            // Highlight the card when its details are expanded.
            card.classList.toggle("expanded", !isExpanded);
        });
    });

    //Connect the filter buttons to the skill cards.
    const cards = Array.from(
        document.querySelectorAll('.skill-card')
    );

    const skills = cards.map(card => ({
        title: card.querySelector('h3').textContent,
        category: card.dataset.category,
        element: card
    }));

    const filterButtons = document.querySelectorAll('.filter-button');

    function displaySkills(category) {
        const filteredSkills = filterSkillsByCategory(
            skills,
            category
        );

        // Hide cards that do not match the selected category.
        cards.forEach(card => {
            card.hidden = true;
        });

        filteredSkills.forEach(skill => {
            skill.element.hidden = false;
        });

        // Update the selected button's appearance and accessibility state.
        filterButtons.forEach(button => {
            const isActive = button.dataset.category === category;

            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            displaySkills(button.dataset.category);
        });
    });

    //Initialize Cost Calculator
    const form = document.getElementById('cost-calculator-form');
    const rateInput = document.getElementById('hourly-rate');
    const hoursInput = document.getElementById('hours');
    const result = document.getElementById('cost-result');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const hourlyRate = Number(rateInput.value);
        const hours = Number(hoursInput.value);

        // Reject negative values and non-finite numbers.
        if (
            !Number.isFinite(hourlyRate) ||
            !Number.isFinite(hours) ||
            hourlyRate < 0 ||
            hours < 0 ||
            rateInput.value.trim() === '' ||
            hoursInput.value.trim() === ''
        ) {
            result.textContent =
                'Please enter valid, non-negative values for both fields.';
            return;
        }

        const total = calculateTotalCosts(hourlyRate, hours);

        result.textContent = `Total Cost: $${total.toFixed(2)}`;
    });

    //Initialize Offering Match Finder
    const matchForm = document.getElementById('match-form');
    const categoryInput = document.getElementById('match-category');
    const priceInput = document.getElementById('max-price');
    const resultsContainer = document.getElementById('match-results');

    const matchSkills = Array.from(
        document.querySelectorAll('.skill-card')
    ).map(card => ({
        title: card.querySelector('h3').textContent,
        category: card.dataset.category,
        price: Number(card.dataset.price),
        element: card
    }));

    matchForm.addEventListener('submit', event => {
        event.preventDefault();

        const userNeeds = {
            category: categoryInput.value,
            maxPrice: Number(priceInput.value)
        };

        const matches = matchSkillsToUser(userNeeds, matchSkills);

        resultsContainer.replaceChildren();

        if (matches.length === 0) {
            const message = document.createElement('p');
            message.textContent =
                'No matching skills found. Try another category or budget.';
            resultsContainer.appendChild(message);
            return;
        }

        const heading = document.createElement('h3');
        heading.textContent = `Found ${matches.length} matching skill(s):`;
        resultsContainer.appendChild(heading);

        matches.forEach(skill => {
            const card = document.createElement('article');
            card.classList.add('match-result');

            const title = document.createElement('h3');
            title.textContent = skill.title;

            const category = document.createElement('p');
            category.textContent = `Category: ${skill.category}`;

            const price = document.createElement('p');
            price.textContent = `Price: $${skill.price.toFixed(2)}/hour`;

            card.append(title, category, price);
            resultsContainer.appendChild(card);
        });
    });
});
