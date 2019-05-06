var margin = { left: 100, right: 10, top: 10, bottom: 100 };

var width = 800 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var barWidth = width / 275; //width divided by number of bars

var svg = d3
	.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Tooltip
var tip = d3.tip()
	.attr('class', 'd3-tip')
	.attr('id', 'tooltip')
	.offset([-10, 0])
	.html(function (d, i) {
		return `<strong>Year:</strong> <span style='color:red'>${d[0]}</span><br>
		<strong>GDP:</strong> <span style='color:red'>${d[1]}</span>`;
	});
// .attr("data-date", function (d, i) {
// 	return dataset[i][0];
// });
svg.call(tip)


// X Label
svg
	.append("text")
	.attr("class", "x-axis-label")
	.attr("x", width / 2)
	.attr("y", height + 70)
	.attr("font-size", "32px")
	.attr("text-anchor", "middle")
	.text("Year");

// Y Label
svg
	.append("text")
	.attr("class", "y-axis-label")
	.attr("x", -(height / 2))
	.attr("y", -60)
	.attr("font-size", "24px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("GDP (per billion)");

d3.json(
	"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
	.then(data => {
		var dataset = data.data;
		// console.log(dataset);

		var GDP = data.data.map(function (i) {
			return i[1];
		});
		console.log(GDP);

		var xScale = d3
			.scaleTime()
			.domain([new Date(1947, 01, 01), new Date(2015, 07, 01)])
			.range([0, width]);

		var yScale = d3
			.scaleLinear()
			.domain([0, 18064.7])
			.range([height, 0]);

		var xAxisCall = d3.axisBottom(xScale);


		svg
			.append("g")
			.attr("id", "x-axis")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxisCall)
			// Rotate Text
			.selectAll("text")
			.attr("y", "10")
			.attr("x", "-5")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-40)");

		var yAxisCall = d3.axisLeft(yScale).tickFormat(function (d) {
			return "$" + d;
		});

		svg
			.append("g")
			.attr("id", "y-axis")
			.call(yAxisCall);

		var bars = svg
			.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("data-date", function (d, i) {
				return dataset[i][0];
			})
			.attr("data-gdp", function (d, i) {
				return dataset[i][1];
			})
			.attr("x", function (d, i) {
				return i * barWidth;
			})
			.attr("y", function (d, i) {
				return yScale(dataset[i][1]);
			})
			.attr("width", barWidth)
			.attr("height", function (d, i) {
				return height - yScale(dataset[i][1]);
			})
			.attr("fill", "steelblue")
			.on("mouseover", tip.show)
			// .on("mouseover", function (d, i) {
			// 	tip.attr('data-date', dataset[i][0])
			// })
			.on("mouseout", tip.hide);
	})
	.catch(error => {
		console.log(error);
	});
