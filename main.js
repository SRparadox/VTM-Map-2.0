// Initialize the map centered on San Francisco
const sanFranciscoBounds = [
    [37.639830, -123.173825], // Southwest corner
    [37.929824, -122.281780]  // Northeast corner
];

const map = L.map('map', {
    center: [37.7749, -122.4194],
    zoom: 12,
    maxBounds: sanFranciscoBounds,
    maxBoundsViscosity: 1.0
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Optional: Prevent zooming out too far
map.setMinZoom(12);
