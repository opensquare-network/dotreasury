const projects = [
];

module.exports = [...projects].sort((p1, p2) => p2.startTime - p1.startTime);
