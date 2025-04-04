import ChartDataLabels from 'chartjs-plugin-datalabels';

const KEYS = [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const PITCH_CLASS_COLORS = {
    'C': 210, 
    'C#': 240, 
    'D': 270, 
    'D#': 300, 
    'E': 330, 
    'F': 0, 
    'F#': 30, 
    'G': 60, 
    'G#': 90, 
    'A': 120, 
    'A#': 150, 
    'B': 180
};


const CHART_CONFIG = {
    type: 'polarArea',
    data: {
        datasets: [{
            data: Array(12).fill(1),
            backgroundColor: KEYS.map(k => `hsl(${PITCH_CLASS_COLORS[k]}, 0%, 50%)`),
            borderAlign: 'inner'
        }],
        labels: KEYS
    },
    plugins: [ChartDataLabels],
    options: {
        legend: {
            display: false
        },
        responsive: true,
        onResize: function(chart, size) {
            chart.options.plugins.datalabels.offset = 0.04*size.width;
            chart.update();
        },
        title: {
            display: false
        },
        scale: {
            ticks: {
                display: false
            },
            pointLabels: {
                display: false
            }
        },
        animation: {
            animateRotate: false,
            animateScale: true
        },
        tooltips: {
            enabled: false
        },
        plugins: {
            datalabels: {
                color: "#fff",
                formatter: function(value, context) {
                    return context.chart.data.labels[context.dataIndex];
                },
                anchor: 'center',
                align: 'end',
                offset: function(context) {
                    context.chart.options.plugins.datalabels.offset = 0.04*context.chart.width;
                    context.chart.update();
                },
                font: {
                    size: 16
                }
            }
        }
    }
}

export { KEYS, PITCH_CLASS_COLORS, CHART_CONFIG };