// Vega-Lite spec: US map with sports betting legality by state
export const sportsBettingMapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description:
    "Map of US states colored by sports betting legality. Blue indicates legal; red indicates illegal.",

  width: 900,
  height: 550,
  projection: { type: "albersUsa" },

  // Base map: US states topojson
  data: {
    url: "https://vega.github.io/vega-datasets/data/us-10m.json",
    format: { type: "topojson", feature: "states" }
  },

  transform: [
    // Join topojson `id` (numeric FIPS) with your CSV `FIPS`
    {
      lookup: "id",
      from: {
        data: {
          url: "csv_Files/legalityPerStates.csv",
          format: { type: "csv" }
        },
        key: "FIPS",                    // column in your CSV
        fields: ["States", "Legality"]  // columns to bring in
      }
    }
  ],

  mark: {
    type: "geoshape",
    stroke: "white",
    strokeWidth: 0.7
  },

  encoding: {
    color: {
        field: "Legality",
        type: "ordinal",                // <-- was nominal before
        title: "Sports betting status of each states in 2025",
        scale: {
        // Order matters: left = lowest / most restricted
        domain: ["Illegal", "Retail only", "Online only", "Legal"],
        range:  ["#d73027", "#b7d9edff", "#6ba2c4ff", "#07588eff"]
        }
    },
    tooltip: [
        { field: "States", type: "nominal", title: "State" },
        { field: "Legality", type: "nominal", title: "Status" }
    ]
  }

};

// Render function
export function renderSportsBettingMap() {
  vegaEmbed("#sportsBettingMap", sportsBettingMapSpec)
    .then(() => console.log("Sports betting map loaded"))
    .catch(console.error);
}
