/*!
 * Version: 1.0
 * Started: 22-07-2025
 * Updated: 23-07-2025
 *
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.RadarChart = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function RadarChart(canvasId, data, options) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = data;
        this.dataPoints = []; // Store data point positions for hover detection

        // Get actual canvas dimensions
        var canvasWidth = this.canvas.width;
        var canvasHeight = this.canvas.height;
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        var maxRadius = Math.min(canvasWidth, canvasHeight) / 2 - 60; // Leave space for labels

        // Default options that adapt to canvas size
        this.options = {
            center: { x: centerX, y: centerY },
            radius: maxRadius,
            levels: 5,
            showLevels: true,  // Set to false to hide inner circles
            strokeColor: '#999',
            fillColor: 'rgba(54, 162, 235, 0.2)',
            lineColor: 'rgba(54, 162, 235, 1)',
            pointColor: 'rgba(54, 162, 235, 1)',
            labelColor: '#333',
            fontSize: Math.max(12, Math.min(16, canvasWidth / 30)), // Responsive font size
            fontWeight: 'bold', // Font weight for labels (normal, bold, 100-900)
            enableTooltips: true,  // Enable/disable tooltips
            tooltipSelector: '#tooltip', // CSS selector for tooltip element
            tooltipTemplate: function (data) { // Custom tooltip content
                return '<strong>' + data.label + '</strong><br/>Value: ' + data.value;
            }
        };

        // Merge user options (but don't override responsive calculations unless explicitly set)
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this.options[key] = options[key];
                }
            }

            // If user didn't specify center or radius, keep our responsive calculations
            if (!options.center) {
                this.options.center = { x: centerX, y: centerY };
            }
            if (!options.radius) {
                this.options.radius = maxRadius;
            }
            if (!options.fontSize) {
                this.options.fontSize = Math.max(12, Math.min(16, canvasWidth / 30));
            }
            if (!options.fontWeight) {
                this.options.fontWeight = 'bold';
            }
        }

        // Get tooltip element using custom selector
        this.tooltip = document.querySelector(this.options.tooltipSelector);

        // Debug: Log if tooltip was found
        if (this.options.enableTooltips && !this.tooltip) {
            console.warn('RadarChart: Tooltip element not found with selector:', this.options.tooltipSelector);
        }

        this.setupEventListeners();
        this.draw();
    }

    RadarChart.prototype.setupEventListeners = function () {
        var self = this;

        if (!this.options.enableTooltips || !this.tooltip) return;

        // Ensure tooltip starts hidden
        this.tooltip.style.display = 'none';

        this.canvas.addEventListener('mousemove', function (e) {
            self.handleMouseMove(e);
        });

        this.canvas.addEventListener('mouseleave', function () {
            self.hideTooltip();
        });
    };

    RadarChart.prototype.handleMouseMove = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        var hoveredPoint = this.getHoveredPoint(mouseX, mouseY);

        if (hoveredPoint) {
            this.showTooltip(hoveredPoint, mouseX, mouseY, rect);
        } else {
            this.hideTooltip();
        }
    };

    RadarChart.prototype.getHoveredPoint = function (mouseX, mouseY) {
        var hoverRadius = 15; // Hover detection radius

        for (var i = 0; i < this.dataPoints.length; i++) {
            var point = this.dataPoints[i];
            var distance = Math.sqrt(
                Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
            );

            if (distance <= hoverRadius) {
                return {
                    label: point.label,
                    value: point.value,
                    index: i
                };
            }
        }

        return null;
    };

    RadarChart.prototype.showTooltip = function (point, mouseX, mouseY, canvasRect) {
        if (!this.tooltip) {
            console.warn('RadarChart: No tooltip element available');
            return;
        }

        // Get tooltip data including any custom data from dataset
        var tooltipData = {
            label: point.label,
            value: point.value,
            index: point.index,
            dataset: this.data,
            customData: this.data.tooltipData ? this.data.tooltipData[point.index] : null
        };

        // Use custom tooltip template or default
        var content;
        if (typeof this.options.tooltipTemplate === 'function') {
            content = this.options.tooltipTemplate(tooltipData);
        } else {
            content = '<strong>' + tooltipData.label + '</strong><br/>Value: ' + tooltipData.value;
        }

        // Set content first
        this.tooltip.innerHTML = content;

        // Force display to measure dimensions
        this.tooltip.style.display = 'block';
        this.tooltip.style.visibility = 'visible';
        this.tooltip.style.opacity = '1';
        this.tooltip.style.pointerEvents = 'none';

        // Get actual tooltip dimensions
        var tooltipRect = this.tooltip.getBoundingClientRect();
        var tooltipWidth = tooltipRect.width;
        var tooltipHeight = tooltipRect.height;

        // Get actual canvas dimensions
        var canvasWidth = this.canvas.clientWidth || this.canvas.width;
        var canvasHeight = this.canvas.clientHeight || this.canvas.height;

        // Calculate initial position with offset
        var offsetX = 12;
        var offsetY = 12;
        var tooltipX = mouseX + offsetX;
        var tooltipY = mouseY - tooltipHeight - offsetY;

        // Smart positioning - adjust based on quadrant
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;

        // Right side of canvas - show tooltip to the left of cursor
        if (mouseX > centerX) {
            tooltipX = mouseX - tooltipWidth - offsetX;
        }

        // Bottom half of canvas - show tooltip above cursor
        if (mouseY > centerY) {
            tooltipY = mouseY - tooltipHeight - offsetY;
        } else {
            // Top half - show below cursor
            tooltipY = mouseY + offsetY;
        }

        // Final boundary checks
        if (tooltipX < 0) {
            tooltipX = offsetX;
        }
        if (tooltipX + tooltipWidth > canvasWidth) {
            tooltipX = canvasWidth - tooltipWidth - offsetX;
        }
        if (tooltipY < 0) {
            tooltipY = offsetY;
        }
        if (tooltipY + tooltipHeight > canvasHeight) {
            tooltipY = canvasHeight - tooltipHeight - offsetY;
        }

        // Apply positioning
        this.tooltip.style.left = tooltipX + 'px';
        this.tooltip.style.top = tooltipY + 'px';

        // Add smooth transition
        this.tooltip.style.transition = 'left 0.1s ease, top 0.1s ease';
    };

    RadarChart.prototype.hideTooltip = function () {
        if (!this.tooltip) return;
        this.tooltip.style.display = 'none';
        this.tooltip.style.visibility = 'hidden';
        this.tooltip.style.opacity = '0';
        this.tooltip.style.left = '';
        this.tooltip.style.top = '';
    };

    RadarChart.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dataPoints = []; // Reset data points
        this.drawGrid();
        this.drawLabels();
        this.drawData();
    };

    RadarChart.prototype.drawGrid = function () {
        var center = this.options.center;
        var radius = this.options.radius;
        var levels = this.options.levels;
        var showLevels = this.options.showLevels;
        var strokeColor = this.options.strokeColor;
        var angleStep = (2 * Math.PI) / this.data.labels.length;

        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 1;

        // Draw concentric circles (only if showLevels is true)
        if (showLevels) {
            for (var level = 1; level <= levels; level++) {
                var levelRadius = (radius / levels) * level;
                this.ctx.beginPath();
                this.ctx.arc(center.x, center.y, levelRadius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }

        // Draw radial lines
        for (var i = 0; i < this.data.labels.length; i++) {
            var angle = angleStep * i - Math.PI / 2;
            var x = center.x + Math.cos(angle) * radius;
            var y = center.y + Math.sin(angle) * radius;

            this.ctx.beginPath();
            this.ctx.moveTo(center.x, center.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    };

    RadarChart.prototype.drawLabels = function () {
        var center = this.options.center;
        var radius = this.options.radius;
        var labelColor = this.options.labelColor;
        var fontSize = this.options.fontSize;
        var fontWeight = this.options.fontWeight;
        var angleStep = (2 * Math.PI) / this.data.labels.length;

        this.ctx.fillStyle = labelColor;
        this.ctx.font = fontWeight + ' ' + fontSize + 'px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (var i = 0; i < this.data.labels.length; i++) {
            var angle = angleStep * i - Math.PI / 2;
            var x = center.x + Math.cos(angle) * (radius + 20);
            var y = center.y + Math.sin(angle) * (radius + 20);

            this.ctx.fillText(this.data.labels[i], x, y);
        }
    };

    RadarChart.prototype.drawData = function () {
        var center = this.options.center;
        var radius = this.options.radius;
        var angleStep = (2 * Math.PI) / this.data.values.length;

        // Find max value
        var maxValue = 0;
        for (var i = 0; i < this.data.values.length; i++) {
            if (this.data.values[i] > maxValue) {
                maxValue = this.data.values[i];
            }
        }

        // Use colors from data if available, otherwise use default options
        var fillColor = (this.data.colors && this.data.colors.fillColor) || this.options.fillColor;
        var lineColor = (this.data.colors && this.data.colors.lineColor) || this.options.lineColor;
        var pointColor = (this.data.colors && this.data.colors.pointColor) || this.options.pointColor;

        // Store data points for hover detection
        for (var i = 0; i < this.data.values.length; i++) {
            var angle = angleStep * i - Math.PI / 2;
            var value = this.data.values[i];
            var distance = (value / maxValue) * radius;
            var x = center.x + Math.cos(angle) * distance;
            var y = center.y + Math.sin(angle) * distance;

            this.dataPoints.push({
                x: x,
                y: y,
                label: this.data.labels[i],
                value: value,
                index: i
            });
        }

        // Draw filled area
        this.ctx.fillStyle = fillColor;
        this.ctx.beginPath();

        for (var i = 0; i < this.dataPoints.length; i++) {
            if (i === 0) {
                this.ctx.moveTo(this.dataPoints[i].x, this.dataPoints[i].y);
            } else {
                this.ctx.lineTo(this.dataPoints[i].x, this.dataPoints[i].y);
            }
        }

        this.ctx.closePath();
        this.ctx.fill();

        // Draw outline
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw points
        this.ctx.fillStyle = pointColor;
        for (var i = 0; i < this.dataPoints.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(this.dataPoints[i].x, this.dataPoints[i].y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    };

    RadarChart.prototype.updateData = function (newData) {
        this.data = newData;
        this.draw();
    };

    // Return the constructor
    return RadarChart;
}));
