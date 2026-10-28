function filterSkillsByCategory(skills, category) {
  if (category === 'All') {
    return skills;
  }

  return skills.filter(skill => skill.category === category);
}

function calculateTotalCosts(rate, hours) {
    return rate * hours;
}

function matchSkillsToUser(userNeeds, skills) {
    return skills.filter(skill =>
        skill.category === userNeeds.category &&
        skill.price <= userNeeds.maxPrice
    );
}

module.exports = {filterSkillsByCategory, calculateTotalCosts, matchSkillsToUser};