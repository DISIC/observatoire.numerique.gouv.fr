const nextJest = require('next/jest');

const createJestConfig = nextJest({
	dir: './'
});

const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleDirectories: ['node_modules', '<rootDir>/'],
	testEnvironment: 'jest-environment-jsdom'
};

async function jestConfig() {
	const nextJestConfig = await createJestConfig(customJestConfig)();
	nextJestConfig.transformIgnorePatterns[0] =
		'/node_modules/(?!(@codegouvfr))/';
	return nextJestConfig;
}

module.exports = jestConfig;

// module.exports = createJestConfig(customJestConfig);
