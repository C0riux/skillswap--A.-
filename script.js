document.addEventListener("DOMContentLoaded", async function () {
    // Store the skills retrieved from the backend.
    let skills = [];

    const skillList = document.getElementById('skill-list');
    const filterButtons = document.querySelectorAll('.filter-button');

    // Generate an individual skill card.
    function createSkillCard(skill) {
        const card = document.createElement('article');
        card.classList.add('skill-card');

        card.dataset.category = skill.category;
        card.dataset.price = skill.price;

        const title = document.createElement('h3');
        title.textContent = skill.title;

        const description = document.createElement('p');
        description.textContent = skill.description;

        const price = document.createElement('p');
        price.innerHTML = `<strong>Price:</strong> $${Number(skill.price).toFixed(2)}/hour`;

        const provider = document.createElement('p');
        provider.innerHTML = `<strong>Provider:</strong> ${skill.provider}`;

        // Create the More Information button.
        const detailsButton = document.createElement('button');
        detailsButton.classList.add('details-button');
        detailsButton.type = 'button';
        detailsButton.setAttribute('aria-expanded', 'false');
        detailsButton.textContent = 'More Information';

        const details = document.createElement('div');
        details.classList.add('skill-details');
        details.hidden = true;

        const additionalInfo = document.createElement('p');
        additionalInfo.textContent =
            skill.details || 'No additional information available.';

        details.appendChild(additionalInfo);

        card.append(
            title,
            description,
            price,
            provider,
            detailsButton,
            details
        );

        return card;
    }

    // Display skill cards based on the selected category.
    function displaySkills(category = 'All') {
        const filteredSkills = filterSkillsByCategory(
            skills,
            category
        );

        skillList.replaceChildren();

        if (filteredSkills.length === 0) {
            skillList.textContent = 'No skills found.';
        }

        filteredSkills.forEach(skill => {
            skillList.appendChild(createSkillCard(skill));
        });

        // Update the selected filter button.
        filterButtons.forEach(button => {
            const isActive = button.dataset.category === category;

            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    // Fetch skill records from the backend.
    async function loadSkills() {
        try {
            const data = await window.apiService.fetchSkills();

            // Accept either an array or an object containing a skills array.
            skills = Array.isArray(data) ? data : data.skills;

            if (!Array.isArray(skills)) {
                throw new Error('Invalid skills response from backend.');
            }

            displaySkills('All');

        } catch (error) {
            console.error('Error loading skills:', error);
            skillList.textContent =
                'Unable to load skills. Please try again later.';
        }
    }

    // Handle More Information buttons using event delegation.
    skillList.addEventListener('click', event => {
        const button = event.target.closest('.details-button');

        if (!button) return;

        const card = button.closest('.skill-card');
        const details = card.querySelector('.skill-details');

        const isExpanded =
            button.getAttribute('aria-expanded') === 'true';

        details.hidden = isExpanded;

        button.setAttribute('aria-expanded', String(!isExpanded));
        button.textContent = isExpanded
            ? 'More Information'
            : 'Show Less';

        card.classList.toggle('expanded', !isExpanded);
    });

    // Connect category filter buttons.
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            displaySkills(button.dataset.category);
        });
    });

    // Initialize Cost Calculator.
    const form = document.getElementById('cost-calculator-form');
    const rateInput = document.getElementById('hourly-rate');
    const hoursInput = document.getElementById('hours');
    const result = document.getElementById('cost-result');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const hourlyRate = Number(rateInput.value);
        const hours = Number(hoursInput.value);

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

    // Initialize Offering Match Finder.
    const matchForm = document.getElementById('match-form');
    const categoryInput = document.getElementById('match-category');
    const priceInput = document.getElementById('max-price');
    const resultsContainer = document.getElementById('match-results');

    matchForm.addEventListener('submit', event => {
        event.preventDefault();

        const userNeeds = {
            category: categoryInput.value,
            maxPrice: Number(priceInput.value)
        };

        const matches = matchSkillsToUser(userNeeds, skills);

        resultsContainer.replaceChildren();

        if (matches.length === 0) {
            const message = document.createElement('p');
            message.textContent =
                'No matching skills found. Try another category or budget.';
            resultsContainer.appendChild(message);
            return;
        }

        const heading = document.createElement('h3');
        heading.textContent =
            `Found ${matches.length} matching skill(s):`;

        resultsContainer.appendChild(heading);

        matches.forEach(skill => {
            const card = document.createElement('article');
            card.classList.add('match-result');

            const title = document.createElement('h3');
            title.textContent = skill.title;

            const category = document.createElement('p');
            category.textContent = `Category: ${skill.category}`;

            const price = document.createElement('p');
            price.textContent =
                `Price: $${Number(skill.price).toFixed(2)}/hour`;

            card.append(title, category, price);
            resultsContainer.appendChild(card);
        });
    });

    // Load database records when the page initializes.
    await loadSkills();
});
