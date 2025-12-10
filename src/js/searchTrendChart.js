export const searchTrendSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "The red line shows the regression trendline for search interest.",
  
  width: 800,
  height: 400,

  title: {
    text: "The search trend in the topic of Sports Betting",
    subtitle: "The blue line shows monthly search interest; the red line shows the regression trend.",
    fontSize: 20,
    subtitleFontSize: 14,
    anchor: "start"
  },

  data: {
    url: "csv_Files/googleSearchTrendInUS.csv",   // <-- Put your CSV in the same folder as index.html
    format: { type: "csv" }
  },

  layer: [
    // 1 Main smoothed search interest line
    {
      mark: { type: "line", point: true, interpolate: "monotone" },
      encoding: {
        x: { field: "Month", type: "temporal", title: "Year" },
        y: {
          field: "Sports betting: (United States)",
          type: "quantitative",
          title: "Search interest (0–100)"
        },
        tooltip: [
          { field: "Month", type: "temporal", title: "Month" },
          {
            field: "Sports betting: (United States)",
            type: "quantitative",
            title: "Search interest"
          }
        ]
      }
    },

    // 2 Regression trendline (straight line)
    {
      transform: [
        {
          regression: "Sports betting: (United States)",
          on: "Month"
        }
      ],
      mark: { type: "line", color: "red", strokeWidth: 2 },
      encoding: {
        x: { field: "Month", type: "temporal" },
        y: { field: "Sports betting: (United States)", type: "quantitative" }
      }
    }
  ]
};

// Render function
export function renderSearchTrendChart() {
  vegaEmbed("#searchTrendChart", searchTrendSpec)
    .then(() => console.log("Search trend chart loaded"))
    .catch(console.error);
}