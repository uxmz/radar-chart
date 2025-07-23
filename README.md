# RadarChart.js

A simple, lightweight radar chart (spider chart) library built with vanilla JavaScript and HTML5 Canvas. UMD compatible and works in all browsers with interactive hover tooltips.

## Features

- **Lightweight**: Pure JavaScript, no dependencies
- **Customizable**: Colors, levels, grid options, tooltips
- **Interactive**: Hover tooltips with custom content and positioning
- **Universal**: UMD compatible (AMD, CommonJS, ES6, Browser globals)
- **ES5 Compatible**: Works in older browsers (IE9+)
- **Dynamic**: Update data and options in real-time

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
<div id="tooltip" class="tooltip"></div>

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
    },
    tooltipData: [  // Optional custom tooltip data
        { description: 'First metric', details: 'Additional info' },
        { description: 'Second metric', details: 'More details' },
        { description: 'Third metric', details: 'Extra context' }
    ]
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
    fillColor: 'rgba(54, 162, 235, 0.2)',      // Default fill color
    lineColor: 'rgba(54, 162, 235, 1)',        // Default line color
    pointColor: 'rgba(54, 162, 235, 1)',       // Default point color
    labelColor: '#333',             // Label text color
    fontSize: 14,                   // Label font size
    enableTooltips: true,           // Enable/disable hover tooltips
    tooltipSelector: '#tooltip',    // CSS selector for tooltip element
    tooltipTemplate: function(data) { // Custom tooltip content function
        return '<strong>' + data.label + '</strong><br/>Value: ' + data.value;
    }
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

## Interactive Tooltips

### Basic Setup

```html
<!-- Tooltip element (required for tooltips) -->
<div id="tooltip" class="tooltip"></div>

<style>
.tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1000;
    display: none;
}
</style>
```

### Custom Tooltip Element

```javascript
// Use any CSS selector for your tooltip
var chart = new RadarChart('canvas', data, {
    tooltipSelector: '#myCustomTooltip'  // or '.tooltip-class', etc.
});
```

### Custom Tooltip Content

```javascript
var chart = new RadarChart('canvas', data, {
    tooltipTemplate: function(data) {
        var html = '<div class="tooltip-header">' + data.label + '</div>';
        html += '<div class="tooltip-value">Score: ' + data.value + '/10</div>';
        
        // Access custom data from dataset
        if (data.customData) {
            html += '<div class="tooltip-description">' + data.customData.description + '</div>';
            html += '<div class="tooltip-details">' + data.customData.details + '</div>';
        }
        
        return html;
    }
});
```

### Tooltip Data Object

The `tooltipTemplate` function receives:

- `label` - The data point label
- `value` - The data point value  
- `index` - The data point index (0-based)
- `dataset` - The entire dataset object
- `customData` - Custom data from `tooltipData[index]` if provided

## Examples

### Custom Colors Per Dataset

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
    fontSize: 16,
    enableTooltips: true,
    tooltipSelector: '.my-tooltip'
};

var chart = new RadarChart('canvas', data, options);
```

### Rich Tooltip Data

```javascript
var data = {
    labels: ['JavaScript', 'Python', 'React'],
    values: [8, 6, 9],
    tooltipData: [
        { 
            description: 'Frontend & Backend Development',
            experience: '3 years',
            projects: 15,
            level: 'Advanced'
        },
        { 
            description: 'Data Science & Automation',
            experience: '2 years', 
            projects: 8,
            level: 'Intermediate'
        },
        { 
            description: 'Modern UI Development',
            experience: '3 years',
            projects: 12,
            level: 'Expert'
        }
    ]
};

var chart = new RadarChart('canvas', data, {
    tooltipTemplate: function(data) {
        if (!data.customData) {
            return '<strong>' + data.label + '</strong><br/>Value: ' + data.value;
        }
        
        var custom = data.customData;
        return '<div style="min-width: 200px;">' +
               '<strong>' + data.label + '</strong><br/>' +
               '<em>' + custom.description + '</em><br/>' +
               'Experience: ' + custom.experience + '<br/>' +
               'Projects: ' + custom.projects + '<br/>' +
               'Level: ' + custom.level +
               '</div>';
    }
});
```

### Dynamic Updates

```javascript
// Toggle grid circles
chart.options.showLevels = !chart.options.showLevels;
chart.draw();

// Change number of levels
chart.options.levels = 8;
chart.draw();

// Update data with new tooltips
chart.updateData({
    labels: ['New', 'Data', 'Set'],
    values: [6, 8, 7],
    tooltipData: [
        { info: 'Updated tooltip 1' },
        { info: 'Updated tooltip 2' }, 
        { info: 'Updated tooltip 3' }
    ]
});

// Disable tooltips
chart.options.enableTooltips = false;
chart.setupEventListeners(); // Re-setup to apply changes
```

## Tooltip Features

- **Smart Positioning**: Automatically positions tooltips to stay within canvas bounds
- **Quadrant-Based Logic**: Shows tooltips on the optimal side based on cursor position
- **Custom Styling**: Use any CSS selector and styling for tooltip elements
- **Rich Content**: Support for HTML content, custom data, and complex layouts
- **Smooth Transitions**: Gentle animations when tooltips move between positions
- **Touch Friendly**: Large hover areas (15px radius) for easy interaction

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
