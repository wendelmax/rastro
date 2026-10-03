module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/.superpowers/'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};
