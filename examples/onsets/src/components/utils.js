const getPercentage = (containerWidth, distanceMoved) => {
	return (distanceMoved / containerWidth) * 100;
};

const limitNumberWithinRange = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
};

const nearestN = (N, number) => Math.ceil(number / N) * N;

export {getPercentage, limitNumberWithinRange, nearestN};