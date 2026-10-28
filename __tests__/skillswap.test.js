const {filterSkillsByCategory, calculateTotalCosts, matchSkillsToUser} = require('../skillswap-functions');

//Test filterSkillsByCategory
const skills = [
  { title: 'Python Tutoring', category: 'Programming', price: 20 },
  { title: 'Guitar Lessons', category: 'Music', price: 15 },
  { title: 'Resume Review', category: 'Career', price: 0 },
  { title: 'Web Development', category: 'Programming', price: 25 },
  { title: 'JavaScript Help', category: 'Programming', price: 25 }
];

describe('filterSkillsByCategory', () => {
  test('filters skills by category', () => {
    expect(filterSkillsByCategory(skills, 'Programming')).toEqual([
      { title: 'Python Tutoring', category: 'Programming', price: 20 },
      { title: 'Web Development', category: 'Programming', price: 25 },
      { title: 'JavaScript Help', category: 'Programming', price: 25 }
    ]);
  });

  test('returns all skills when category is All', () => {
    expect(filterSkillsByCategory(skills, 'All')).toEqual(skills);
  });

  test('returns an empty array when no skills match', () => {
    expect(filterSkillsByCategory(skills, 'Cooking')).toEqual([]);
  });
});

//Test calculateTotalCosts
describe('calculateTotalCosts', () => {
    test('returns the correct total for different hourly rates and hours', () => {
        expect(calculateTotalCosts(20, 2)).toBe(40);
        expect(calculateTotalCosts(15, 4)).toBe(60);
        expect(calculateTotalCosts(25, 3)).toBe(75);
    });

    test('returns zero for free sessions', () => {
        expect(calculateTotalCosts(0, 3)).toBe(0);
    });

    test('returns zero when hours are zero', () => {
        expect(calculateTotalCosts(20, 0)).toBe(0);
    });

    test('calculates the correct total for decimal hours', () => {
        expect(calculateTotalCosts(25, 1.5)).toBe(37.5);
    });
});

//Test matchSkillsToUser
describe('matchSkillsToUser', () => {
    test('matches skills by category and price', () => {
        const userNeeds = {
            category: 'Programming',
            maxPrice: 30
        };

        expect(matchSkillsToUser(userNeeds, skills)).toEqual([
            { title: 'Python Tutoring', category: 'Programming', price: 20 },
            { title: 'Web Development', category: 'Programming', price: 25 },
            { title: 'JavaScript Help', category: 'Programming', price: 25 }
        ]);
    });

    test('filters out skills exceeding the maximum price', () => {
        const userNeeds = {
            category: 'Programming',
            maxPrice: 20
        };

        expect(matchSkillsToUser(userNeeds, skills)).toEqual([
            { title: 'Python Tutoring', category: 'Programming', price: 20 }
        ]);
    });

    test('returns an empty array when no skills match', () => {
        const userNeeds = {
            category: 'Cooking',
            maxPrice: 100
        };

        expect(matchSkillsToUser(userNeeds, skills)).toEqual([]);
    });

    test('includes free skills when the maximum price is zero', () => {
        const userNeeds = {
            category: 'Career',
            maxPrice: 0
        };

        expect(matchSkillsToUser(userNeeds, skills)).toEqual([
            { title: 'Resume Review', category: 'Career', price: 0 }
        ]);
    });
});