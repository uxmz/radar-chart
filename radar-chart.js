/*!
 * Version: 1.0
 * Started: 22-07-2025
 * Updated: 22-07-2025
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

        // Default options
        this.options = {
            center: { x: 200, y: 200 },
            radius: 150,
            levels: 5,
            showLevels: true,  // Set to false to hide inner circles
            strokeColor: '#999',
            fillColor: 'rgba(54, 162, 235, 0.2)',
            lineColor: 'rgba(54, 162, 235, 1)',
            pointColor: 'rgba(54, 162, 235, 1)',
            labelColor: '#333',
            fontSize: 14
        };

        // Merge options
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    this.options[key] = options[key];
                }
            }
        }

        this.draw();
    }

    RadarChart.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        var angleStep = (2 * Math.PI) / this.data.labels.length;

        this.ctx.fillStyle = labelColor;
        this.ctx.font = fontSize + 'px Arial';
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

        // Draw filled area
        this.ctx.fillStyle = fillColor;
        this.ctx.beginPath();

        for (var i = 0; i < this.data.values.length; i++) {
            var angle = angleStep * i - Math.PI / 2;
            var value = this.data.values[i];
            var distance = (value / maxValue) * radius;
            var x = center.x + Math.cos(angle) * distance;
            var y = center.y + Math.sin(angle) * distance;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
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
        for (var i = 0; i < this.data.values.length; i++) {
            var angle = angleStep * i - Math.PI / 2;
            var value = this.data.values[i];
            var distance = (value / maxValue) * radius;
            var x = center.x + Math.cos(angle) * distance;
            var y = center.y + Math.sin(angle) * distance;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
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
