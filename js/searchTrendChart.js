export const searchTrendSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "The red line shows the regression trendline for search interest.",

  width: 800,
  height: 400,

  title: {
    text: "The search trend in the topic of Sports Betting",
    subtitle:
      "The blue line shows monthly search interest; the red line shows the regression trend.",
    fontSize: 20,
    subtitleFontSize: 14,
    anchor: "start"
  },

  data: {
    url: "csv_Files/googleSearchTrendInUS.csv",
    format: { type: "csv" }
  },

  // NEW: checkbox to toggle the trendline
  params: [
    {
      name: "showTrend",
      value: false,
      bind: { input: "checkbox", name: "" } // no label text
    }
  ],

  layer: [
    // 1) Main blue line
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

    // 2) Regression trendline (red), controlled by checkbox
    {
      transform: [
        {
          regression: "Sports betting: (United States)",
          on: "Month"
        }
      ],
      mark: { type: "line", strokeWidth: 2 },
      encoding: {
        x: { field: "Month", type: "temporal" },
        y: { field: "Sports betting: (United States)", type: "quantitative" },
        color: { value: "red" },
        opacity: {
          // when checkbox is checked → 1, else → 0 (invisible)
          condition: { test: "showTrend", value: 1 },
          value: 0
        }
      }
    }
  ]
};
