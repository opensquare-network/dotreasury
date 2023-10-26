// https://www.youtube.com/watch?v=_lTLUMFvp88
// src/pages/Overview/OutputPeriods/index.jsx

// memoize
let barPercentage = 0;
let categoryPercentage = 0;

export const backgroundBarPlugin = {
  id: "backgroundBar",
  beforeDatasetsDraw(chart, _args, pluginOptions) {
    const {
      data,
      ctx,
      chartArea: { top, width, height },
      scales: { x },
    } = chart;

    ctx.save();

    const segment = width / data.labels.length;

    barPercentage = data?.datasets[0]?.barPercentage ?? barPercentage;
    categoryPercentage =
      data?.datasets[0]?.categoryPercentage ?? categoryPercentage;

    const barWidth = segment * barPercentage * categoryPercentage;

    ctx.fillStyle = pluginOptions.backgroundColor;

    for (let i = 0; i < data.labels.length; i++) {
      ctx.fillRect(x.getPixelForValue(i) - barWidth / 2, top, barWidth, height);
    }
  },
};
