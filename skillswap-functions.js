function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }

  return skills.filter(skill => skill.category === category);
}

// Connect the filter buttons to the skill cards.
document.addEventListener('DOMContentLoaded', () => {
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

    // Show every card when the page first loads.
    displaySkills('All');
});

module.exports = {filterSkillsByCategory};