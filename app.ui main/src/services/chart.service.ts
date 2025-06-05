import colorLib from '@kurkle/color';
import { ChartOptions } from 'chart.js';
import { merge, cloneDeep } from 'lodash';

export interface chartDataSet {
    label?: string;
    data: Array<number | string | { x: string | number, y: string | number }>;
    borderColor?: string;
    backgroundColor?: string | string[];
    hoverBackgroundColor?: string | string[];
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointHoverBackgroundColor?: string;
    pointHoverBorderColor?: string;
    borderWidth?: number;
    fill?: boolean;
    pointRadius?: number;
    ISBN?: string | number;
    hidden?: boolean;
}

const documentStyle = getComputedStyle(document.documentElement);
const backgroundColors = [
    documentStyle.getPropertyValue('--chart-background-1'),
    documentStyle.getPropertyValue('--chart-background-2'),
    documentStyle.getPropertyValue('--chart-background-3'),
    documentStyle.getPropertyValue('--chart-background-4'),
    documentStyle.getPropertyValue('--chart-background-5'),
    documentStyle.getPropertyValue('--chart-background-6'),
];
const borderColor = [
    documentStyle.getPropertyValue('--chart-border-1'),
    documentStyle.getPropertyValue('--chart-border-2'),
    documentStyle.getPropertyValue('--chart-border-3'),
    documentStyle.getPropertyValue('--chart-border-4'),
    documentStyle.getPropertyValue('--chart-border-5'),
    documentStyle.getPropertyValue('--chart-border-6'),
];
const hoverBackgroundColors = [
    documentStyle.getPropertyValue('--chart-hover-1'),
    documentStyle.getPropertyValue('--chart-hover-2'),
    documentStyle.getPropertyValue('--chart-hover-3'),
    documentStyle.getPropertyValue('--chart-hover-4'),
    documentStyle.getPropertyValue('--chart-hover-5'),
    documentStyle.getPropertyValue('--chart-hover-6'),
];
const textColor = documentStyle.getPropertyValue('--primary-color');
const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
const surfaceCard = documentStyle.getPropertyValue('--surface-card');

const legendColors: ChartOptions = {
    plugins: {
        legend: {
            labels: {
                color: textColor,
                padding: 40,
                font: {
                    family: 'Kadaw, serif',
                    size: 16,
                    weight: 700,
                    lineHeight: 'normal',
                }
            }
        }
    },
};
const scaleColors: ChartOptions = {
    scales: {
        y: {
            ticks: {
                color: textColor,
            }
        },
        x: {
            ticks: {
                color: textColor,
            }
        }
    }
};

const defaultLineOptions: ChartOptions<'line'> = merge({
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                }
            }
        },
        elements: {
            point: {
                radius: 1,
                hoverRadius: 2,
            },
            line: {
                tension: 0.4,
                borderWidth: 2,
                fill: false,
            }
        },
    },
    scaleColors as ChartOptions<'line'>,
    legendColors as ChartOptions<'line'>
);
const defaultPieOptions: ChartOptions<'pie'> = merge({
        borderColor: surfaceCard,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true
                }
            }
        },
    },
    legendColors as ChartOptions<'pie'>,
);
const defaultDoughnutOptions: ChartOptions<'doughnut'> = merge({
        cutout: '60%',
        borderColor: surfaceCard,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true
                }
            }
        },
    },
    legendColors as ChartOptions<'doughnut'>,
);
const defaultBarOptions: ChartOptions<'bar'> = merge({
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                suggestedMax: 10,
            },
        }
    },
    scaleColors as ChartOptions<'bar'>,
    legendColors as ChartOptions<'bar'>,
);
const defaultRadarOptions: ChartOptions<'radar'> = merge({
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            }
        },
        scales: {
            r: {
                ticks: {
                    color: textColor,
                    backdropColor: 'rgba(255, 255, 255, 0)'
                },
                pointLabels: {
                    color: textColor,
                }
            }
        },
    },
    legendColors as ChartOptions<'radar'>,
);

export const ChartService = {
    backgroundColors: backgroundColors,
    borderColor: borderColor,
    hoverBackgroundColors: hoverBackgroundColors,
    textColor: textColor,
    textColorSecondary: textColorSecondary,
    surfaceBorder: surfaceBorder,
    transparentize(value: string, opacity?: number): string {
        const alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return colorLib(value).alpha(alpha).rgbString();
    },
    getBackgroundColorsWithOpacity(opacity?: number) {
        const alpha = opacity === undefined ? 0.5 : 1 - opacity;
        const colors: string[] = [];
        for (const col of this.backgroundColors) {
            colors.push(colorLib(col).alpha(alpha).rgbString());
        }
        return colors;
    },
    getBorderColorsWithOpacity(opacity?: number) {
        const alpha = opacity === undefined ? 0.5 : 1 - opacity;
        const colors: string[] = [];
        for (const col of this.borderColor) {
            colors.push(colorLib(col).alpha(alpha).rgbString());
        }
        return colors;
    },
    getDefaultLineOptions(options: ChartOptions<'line'> = {}) {
        return merge(cloneDeep(defaultLineOptions), cloneDeep(options));
    },
    getDefaultPieOptions(options: ChartOptions<'pie'> = {}) {
        return merge(cloneDeep(defaultPieOptions), cloneDeep(options));
    },
    getDefaultDoughnutOptions(options: ChartOptions<'doughnut'> = {}) {
        return merge(cloneDeep(defaultDoughnutOptions), cloneDeep(options));
    },
    getDefaultBarOptions(options: ChartOptions<'bar'> = {}) {
        return merge(cloneDeep(defaultBarOptions), cloneDeep(options));
    },
    getDefaultRadarOptions(options: ChartOptions<'radar'> = {}) {
        return merge(cloneDeep(defaultRadarOptions), cloneDeep(options));
    },
};
