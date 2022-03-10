import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/multi-line-chart
export default function LissajousChart(data, {
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
  width = 400, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleLinear, // type of x-scale
  xDomain, // [xmin, xmax]
	xFormat,
	lLabel, // a label for the x-axis
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yFormat, // a format specifier string for the y-axis
  rLabel, // a label for the y-axis
  zDomain, // array of z-values
  color = "currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
	fillColor = "none",
  mixBlendMode = "multiply", // blend mode of lines
  voronoi, // show a Voronoi overlay? (for debugging)
	svgSelector
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
  if (yDomain === undefined) yDomain = d3.extent(Y);
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  const diagonalLength = Math.sqrt(width**2 + height**2);
  const lRange = [0, diagonalLength];
  const rRange = [0, diagonalLength];
  // Construct scales and axes.
  const xScale = xType(xDomain, lRange);
  const yScale = yType(yDomain, rRange);
  console.info({xScale});
  console.info({yScale});
  const lAxis = d3.axisBottom(xScale)
									.ticks(width / 80, xFormat)
									.tickSizeOuter(0);
  const rAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

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
      // .on("pointerenter", pointerentered)
      // .on("pointermove", pointermoved)
      // .on("pointerleave", pointerleft)
      // .on("touchstart", event => event.preventDefault());

  // An optional Voronoi display (for fun).
  if (voronoi) svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", d3.Delaunay
        .from(I, i => xScale(X[i]), i => yScale(Y[i]))
        .voronoi([0, 0, width, height])
        .render());

  svg.append("g")
      // .attr("transform", `translate(${width}, ${height}) rotate(-135)`)
      .call(lAxis)
			.call(g => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(lLabel));

  svg.append("g")
      // .attr("transform", `translate(${width},0) rotate(45)`)
      .call(rAxis)
      // .call(voronoi ? () => {} : g => g.selectAll(".tick line").clone()
      //     .attr("x2", width - marginLeft - marginRight)
      //     .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(rLabel));

  const path = svg.append("g")
      .attr("fill", fillColor)
      .attr("stroke", typeof color === "string" ? color : null)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      .attr("transform", `translate(${width}, ${height}) rotate(-135)`)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
			.style("mix-blend-mode", mixBlendMode)
			.attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
			.attr("d", ([,I]) => line(I));

  return Object.assign(svg.node(), {value: null});
}