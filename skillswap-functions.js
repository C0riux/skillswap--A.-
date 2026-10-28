function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }

  return skills.filter(skill => skill.category === category);
}

function calculateTotalCosts(rate, hours) {
    return rate * hours;
}

module.exports = {filterSkillsByCategory, calculateTotalCosts};