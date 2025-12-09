---
theme: dashboard
toc: false
sidebar: false
style: styleExtension.css
---
<section>
    <div id="title">
    <video src="./assets/represent2526-hero.mp4" autoplay muted loop playsinline></video>
        <div id="title-text">
            <h1>The Rise of <span>Sports Betting</span></h1>
            <h2>Analyzing Gambling's Culture Shift</h2>
            <h2>IAT 355</h2>
        </div>
    </div>
</section>

```js
    const us = await d3.json("https://vega.github.io/vega-datasets/data/us-10m.json");

    const states = topojson.feature(us, us.objects.states).features;

    const legality = await FileAttachment("./csv_Files/legalityPerStates.csv").csv();
    const transformedData = legality.map(d => ({
        FIPS: +d.FIPS,
        States: d.States,
        Legality: d.Legality
    }));

    const lookup = new Map(transformedData.map(d => [d.FIPS, d]));

    const mapData = states.map(f => {
        const row = lookup.get(f.id);
        return {
        ...f,
        States: row?.States ?? "Unknown",
        Legality: row?.Legality ?? "Unknown"
        };
    });
```

```js
function mapPlot(data, {width}) {
    return Plot.plot({
        projection: "albers-usa",
        width,
        height: 600,
        color: {
            type: "ordinal",
            domain: ["Illegal", "Retail only", "Online only", "Legal"],
            range: ["#d73027", "#b7d9edff", "#6ba2c4ff", "#07588eff"],
            legend: true,
            label: "Sports betting status (2025)",
        },
        marks: [
            Plot.geo(data, {
                fill: "Legality",
                stroke: "white",
                strokeWidth: 0.7,
                title: d => `${d.States}: ${d.Legality}`,
                tip: true
            })
        ]
    });
}
```

<section id="history">
    <h1>How Sports Betting Became Legal in the United States</h1>
    <div class="timeline">
        <div class="timeline-container left">
            <div class="content">
            <h3>January 1992</h3>
            <p>The Professional and Amateur Sports Protection Act of 1992 (PASPA) signed into law; sports betting becomes illegal in the U.S.</p>
            </div>
        </div>
        <div class="timeline-container right">
            <div class="content">
            <h3>November 2011</h3>
            <p>The Sports Betting Amendment is approved in New Jersey. The measure amends the state constitution to allow the legislature to legalize betting on the results of professional, college, and amateur sporting events. Governor Christie signs the bill on January 17, 2012.</p>
            </div>
        </div>
        <div class="timeline-container left">
            <div class="content">
            <h3>August 2012</h3>
            <p>The NCAA and four pro sports leagues (the NFL, NBA, NHL, and MLB) sue New Jersey to stop it from offering sports betting after the 2011 referendum, arguing that it violates federal law (i.e., PASPA). A string of court battles ensues.</p>
            </div>
        </div>
        <div class="timeline-container right">
            <div class="content">
            <h3>June 2017</h3>
            <p>The Supreme Court of the United States takes the case.</p>
            </div>
        </div>
        <div class="timeline-container left">
            <div class="content">
            <h3>December 2017</h3>
            <p> While New Jersey battles against PASPA, the sports leagues argue for the prohibition of gambling in the state to be upheld</p>
            </div>
        </div>
        <div class="timeline-container right">
            <div class="content">
            <h3>May 2018</h3>
            <p>The U.S. Supreme Court rules for New Jersey and strikes down PASPA; all states can now legalize sports betting.</p>
            </div>
        </div>
    </div>
    <div class="grid grid-cols-1">
        <div class="card">${
            resize((width) => mapPlot(mapData, {width}))
        }</div>
    </div>
    <div id="history-text"> 
        <p class="chart-description" style="text-wrap: none;">
        Blue indicates states where sports betting is fully legal. Red indicates 
        states where sports betting is illegal. Intermediate colors represent 
        partial legalization, such as retail-only or online-only betting.
        </p>
        <h3>Different states, different regulations</h3>
        <p>Like many industries, going online looks to be the next step in the sports betting world. It allows consumers to place bets on sports in a convenient manner via a website or app. It is ultimately a more accessible way to wager money on sports than the land-based alternatives that bettors must attend in person. But not all states that have legalized sports betting have, or will, allow online or mobile wagering. Some states, like North Carolina, require all bets to be placed inside a casino. Meanwhile, states like New Jersey have legalized both land-based and online wagering. In September 2021, over 90 percent of sports bets in New Jersey were placed online.</p>
    </div>
</section>


```js
const searchData = await FileAttachment("./csv_Files/googleSearchTrendInUS.csv").csv();
```

```js
function searchTrend(data, {width}){
    const transformedData = data.map(d => ({
        ...d,
        Interest: +d["Sports betting: (United States)"],
        Date: new Date(d.Month)
    }));
    return Plot.plot({
        width,
        title: "The search trend in the topic of Sports Betting",
        x: {
            label: "Year",
            type: "time"
        },
        y: {
            label: "Search Interest (0 - 100)"
        },
        marks: [
            Plot.lineY(transformedData, {
                x: "Date",
                y: "Interest",
                stroke: "steelblue",
                curve: "monotone-x",
                marker: true,
                tip: true,
            }),

            Plot.linearRegressionY(transformedData, {
                x: "Date",
                y: "Interest",
                stroke: "red",
                strokeWidth: 2
            })
        ]
    });
}
```

<section id="trend">
    <h1>Is It Really That Popular?</h1>
    <p> Sports betting has steadily grown in public interest over the past two decades, and this trend is clearly reflected in the Google search data visualized above. The blue line shows how often people searched for “sports betting” over time, while the red regression line highlights the long-term direction of this activity. Despite short-term spikes around major sporting events, the upward slope of the regression line suggests a gradual and consistent increase in interest. In other words, people are searching for sports betting more frequently now than in previous years, reflecting broader cultural acceptance, expanding legalization across states, and rising accessibility through online platforms. </p>
    <div class="grid grid-cols-1">
    <div class="card">${
        resize((width) => searchTrend(searchData, {width}))    
    }</div>
    </div>
</section>

<section id="platforms">
    <h1>Comparing Platforms</h1>
    <img src="./assets/Platform-Comparison.png" alt="">
    <h3>Where does the revenue go?</h3>
    <p>In the first 13 months of legalization, the largest cut of revenue was, unsurprisingly, retained by the sports betting operators. However, a few other groups also gain from legalization.</p>
    <p>There are varying state policies regarding the taxing of sports betting, meaning that some states are bringing in more tax revenue than others. With the development of these statespecific regulations and policies, the first year's sum of almost 70 million U.S. dollars looks set to grow in the future.</p>
    <p>Meanwhile, the federal government takes 0.25 percent of all sportsbook handles in the U.S., which may not sound like much, but it resulted in a payment of almost 25 million U.S. dollars between June 2018 and July 2019. This figure also stands to grow alongside the market.</p>
    <p>Lastly, the smallest cut went to the operator's tax obligations to cities, counties, horse racing purses, and other community investments.</p>
</section>

<section id="simulator">
    <div class="mb-4 text-center text-md-start">
        <h2 class="fw-bold text-white">Sports Betting Simulator</h2>
        <p class="text-secondary">Experience the volatility of sports betting. <em>(Educational Demo Only)</em></p>
    </div>
    <div class="dashboard mb-4">
        <div>
            <div class="dashboard-label">Bankroll</div>
            <div class="money-display" id="balance-display">$1000.00</div>
        </div>
        <div class="text-md-end mt-3 mt-md-0">
            <div class="dashboard-label">Net Profit/Loss</div>
            <div class="net-profit" id="profit-display">$0.00</div>
        </div>
    </div>
    <div class="controls mb-4">
        <div class="row align-items-center g-3">
            <div class="col-auto">
                <label for="wager-amount" class="text-white fw-bold">Wager Amount ($):</label>
            </div>
            <div class="col-auto">
                <input type="number" id="wager-amount" class="custom-input" value="50" min="10" max="1000">
            </div>
            <div class="col-auto">
                <span class="small text-secondary">*Click a match button below to bet</span>
            </div>
        </div>
    </div>
    <div id="matches-grid-container"></div>
</section>


```js
const dataset = await FileAttachment("./csv_Files/state_revenue7.csv").csv();
```

```js
function revenuePlot(data, {width}) {
    const transformedData = data.map(d => ({
        ...d,
        Revenue: +d.Revenue,
        Date: new Date(d.Date)
    }));
    transformedData.sort((a, b) => a.Date - b.Date);

    return Plot.plot({
        title: "Sports Betting Revenue by State",
        subtitle: "My Subtitle",
        width,
        height: 500,
        marginLeft: 80,
        x: {grid: true, label: "Year"},
        color: {legend: true, scheme: "RdYlBu"},
        marks: [
            Plot.lineY(transformedData, 
                {
                    x: "Date",
                    y: "Revenue",
                    stroke: "State",
                    opacity: 0.6,
                    tip: true,
                    curve: "monotone-x",
                    markerEnd: true
                }
            )
        ]
    });
}
```


<section id="regulations">
    <h1>Regulating the 'Sport'</h1>
    <p>When it comes to public opinion on sports betting, it seems that most Americans have sided with the courts. In 2019, the majority of the U.S. public supported the legalization of sports betting in their respective states. Although, as has been previously shown, while sports betting has been met with considerable approval, the legislation is yet to catch up.</p>
    <p>Some of the perks of legalizing sports betting include the following: ▪ Economic benefits ▪ The potential to win money ▪ An added element of excitement when watching sports However, sports betting has not yet gained the full support of the U.S. public. There is still a way to go for the industry to win over the whole of the country, particularly the more conservative states. Some of the concerns of legalizing sports betting include the following: ▪ Match-fixing ▪ Gambling addiction ▪ It shifts the focus away from the sport itself With that in mind, the upcoming pages will expand further on the perception and participation of sports betting in the United States.</p>
    <div class="grid grid-cols-1">
    <div class="card">${
        resize((width) => revenuePlot(dataset, {width}))
    }</div>
</div>
</section>

<section id="results">
    <h1>Results</h1>
    <div id="reality-check" class="reality-check mt-4">
    <strong>Note:</strong> Notice how quickly the balance fluctuates? In professional sports betting, the "House Edge" ensures that over a long enough timeline, the probability of the player losing money approaches 100%.
    </div>
    <div class="history-log mt-4">
        <h4 class="h5 text-white mb-3">Betting History</h4>
        <div id="history-list"></div>
    </div>
</section>

<script type="module" src="./js/sportsBettingSimulator.js"></script>