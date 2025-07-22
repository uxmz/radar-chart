# RadarChart.js

A simple, lightweight radar chart (spider chart) library built with vanilla JavaScript and HTML5 Canvas. UMD compatible and works in all browsers.

## Features

- **Lightweight**: Pure JavaScript, no dependencies
- **Customizable**: Colors, levels, grid options
- **Universal**: UMD compatible (AMD, CommonJS, ES6, Browser globals)
- **ES5 Compatible**: Works in older browsers (IE9+)
- **Interactive**: Update data and options dynamically

## Installation

### Browser (Script Tag)

```html
<script src="radar-chart.js"></script>
```

### AMD (RequireJS)

```javascript
define(['radar-chart'], function(RadarChart) {
    // Use RadarChart
});
```

### CommonJS (Node.js)

```javascript
var RadarChart = require('./radar-chart');
```

### ES6 Modules

```javascript
import RadarChart from './radar-chart.js';
```

## Quick Start

```html
<canvas id="myChart" width="400" height="400"></canvas>

<script>
var data = {
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety'],
    values: [8, 6, 9, 7]
};

var chart = new RadarChart('myChart', data);
</script>
```

## API

### Constructor

```javascript
new RadarChart(canvasId, data, options)
```

**Parameters:**

- `canvasId` (string): ID of the canvas element
- `data` (object): Chart data with labels and values
- `options` (object, optional): Configuration options

### Data Format

```javascript
{
    labels: ['Label1', 'Label2', 'Label3'],
    values: [8, 6, 9],
    colors: {  // Optional
        fillColor: 'rgba(54, 162, 235, 0.2)',
        lineColor: 'rgba(54, 162, 235, 1)',
        pointColor: 'rgba(54, 162, 235, 1)'
    }
}
```

### Options

```javascript
{
    center: { x: 200, y: 200 },     // Chart center position
    radius: 150,                    // Chart radius
    levels: 5,                      // Number of concentric circles
    showLevels: true,               // Show/hide inner circles
    strokeColor: '#999',            // Grid line color
    fillColor: 'rgba(54, 162, 235, 0.2)',
    lineColor: 'rgba(54, 162, 235, 1)',
    pointColor: 'rgba(54, 162, 235, 1)',
    labelColor: '#333',             // Label text color
    fontSize: 14                    // Label font size
}
```

### Methods

#### `updateData(newData)`

Update the chart with new data.

```javascript
chart.updateData({
    labels: ['A', 'B', 'C'],
    values: [5, 8, 6]
});
```

#### `draw()`

Redraw the chart (useful after changing options).

```javascript
chart.options.levels = 3;
chart.draw();
```

## Examples

### Custom Colors

```javascript
var data = {
    labels: ['Speed', 'Power', 'Agility'],
    values: [7, 9, 6],
    colors: {
        fillColor: 'rgba(255, 99, 132, 0.2)',
        lineColor: 'rgba(255, 99, 132, 1)',
        pointColor: 'rgba(255, 99, 132, 1)'
    }
};

var chart = new RadarChart('canvas', data);
```

### Custom Options

```javascript
var options = {
    levels: 3,
    showLevels: false,
    strokeColor: '#ccc',
    fontSize: 16
};

var chart = new RadarChart('canvas', data, options);
```

### Dynamic Updates

```javascript
// Toggle grid circles
chart.options.showLevels = !chart.options.showLevels;
chart.draw();

// Change number of levels
chart.options.levels = 8;
chart.draw();

// Update data
chart.updateData(newDataset);
```

## Browser Support

- Chrome (all versions)
- Firefox (all versions)
- Safari (all versions)
- Edge (all versions)
- Internet Explorer 9+

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
