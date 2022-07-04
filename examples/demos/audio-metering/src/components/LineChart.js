import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/multi-line-chart
export default function LineChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveMonotoneX, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
	xFormat,
	xLabel, // a label for the x-axis
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  color = "currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  tickLabelSize = '12px',
	fillColor = "none",
  mixBlendMode = "multiply", // blend mode of lines
  showGrid = false, // show a Voronoi overlay? (for debugging)
	svgSelector,
  showLegend = false
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  const O = d3.map(data, d => d);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale)
									.ticks(16, xFormat)
									.tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, title);

  // Construct a line generator.
  const line = d3.line()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y(i => yScale(Y[i]));

  const svg = d3.select(svgSelector)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchstart", event => event.preventDefault());
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .attr("style", `font-size: ${tickLabelSize};`)
      .call(xAxis)
      .call(!showGrid ? () => {} : g => g.selectAll(".tick line").clone()
          .attr("y2", -height + marginBottom + marginTop)
          .attr("stroke-opacity", 0.1))
			.call(g => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel));

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr("style", `font-size: ${tickLabelSize};`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(!showGrid ? () => {} : g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  const path = svg.append("g")
      .attr("fill", fillColor)
      .attr("stroke", typeof color === "string" ? color : null)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
			.style("mix-blend-mode", mixBlendMode)
			.attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
			.attr("d", ([,I]) => line(I));

  if (showLegend) {
    drawLegend();
  }

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("y", -8);


  function drawLegend() {
    const circleRadius = 7;

    svg.selectAll("legend-dots")
    .data(d3.group(I, i => Z[i]))
    .enter()
    .append("circle")
      .attr("cx", (d, i) => { return width*0.25*(i+2)})
      .attr("cy", marginTop*0.5) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", circleRadius)
      .style("fill", typeof color === "function" ? ([z]) => color(z) : null)
    
    // Add one dot in the legend for each name.
    svg.selectAll("legend-labels")
      .data(d3.group(I, i => Z[i]))
      .enter()
      .append("text")
        .attr("x", (d, i) => { return circleRadius*2 + width*0.25*(i+2)})
        .attr("y", marginTop*0.5) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", 'grey')
        .text(([z]) => z)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
  }

  return Object.assign(svg.node(), {value: null});
}