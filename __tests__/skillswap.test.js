const {filterSkillsByCategory, calculateTotalCosts} = require('../skillswap-functions');

const skills = [
  { title: 'Python Tutoring', category: 'Programming', price: 20 },
  { title: 'Guitar Lessons', category: 'Music', price: 15 },
  { title: 'Resume Review', category: 'Career', price: 0 },
  { title: 'Web Development', category: 'Programming', price: 25 }
];

describe('filterSkillsByCategory', () => {
  test('filters skills by category', () => {
    expect(filterSkillsByCategory(skills, 'Programming')).toEqual([
      { title: 'Python Tutoring', category: 'Programming', price: 20 },
      { title: 'Web Development', category: 'Programming', price: 25 }
    ]);
  });

  test('returns all skills when category is All', () => {
    expect(filterSkillsByCategory(skills, 'All')).toEqual(skills);
  });

  test('returns an empty array when no skills match', () => {
    expect(filterSkillsByCategory(skills, 'Cooking')).toEqual([]);
  });
});

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