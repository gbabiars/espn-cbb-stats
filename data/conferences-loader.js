var conferences = [
    {
        id: 'pac-12',
        name: 'Pac-12',
        teams: [12, 9, 25, 38, 2483, 204, 24, 26, 30, 254, 264, 265]
    },
    {
        id: 'acc',
        name: 'ACC',
        teams: [103, 228, 150, 52, 59, 120, 2390, 153, 152, 258, 259, 154]
    },
    {
        id: 'big-12',
        name: 'Big 12',
        teams: [239, 66, 2305, 2306, 201, 197, 2628, 251, 2641, 277]
    },
    {
        id: 'big-east',
        name: 'Big East',
        teams: [2132, 41, 305, 46, 97, 269, 87, 221, 2507, 164, 2550, 58, 2599, 183, 222]
    },
    {
        id: 'big-ten',
        name: 'Big Ten',
        teams: [356, 84, 2294, 130, 127, 135, 158, 77, 194, 213, 2509, 275]
    },
    {
        id: 'sec',
        name: 'SEC',
        teams: [333, 8, 2, 57, 61, 96, 99, 344, 142, 145, 2579, 2633, 245, 238]
    }
];

exports.all = function(callback) {
    callback(null, conferences);
};