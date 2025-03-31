let gamesUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
let gameData;

let canvas = d3.select('#canvas');
let legend = d3.select('#legend');
let tooltip = d3.select('#tooltip');

const categories = ["Wii", "DS", "X360", "GB", "PS3", "NES", "PS2", "3DS", "PS4", "SNES", "PS", "N64", "GBA", "XB", "PC", "2600", "PSP", "XOne"];
const categoryColors = {
    'Wii': '#ee0202',//0
    'DS':'#02eeee',
    'X360':'#ee0278',
    'GB':'#ee7802',
    'PS3':'#eeee02',
    'NES':'#b702ee',//5
    'PS2':'#02ee8e',//6
    '3DS':'#ee0260',
    'PS4':'#02ee1a',
    'SNES':'#02d6ee',
    'PS':'#0260ee',
    'N64':'#B388FF',//11
    'GBA':'#c80000',//12
    'XB':'#B2FF59',
    'PC':'#A1887F',
    '2600':'#FFD600',
    'PSP':'#EF9A9A',
    'XOne':'#78909C'//17
};

const createTreeMap = () => {

    //str = "qwe/qwe qweqwe"
    //console.log(str.match(/[A-Za-z]+([/])?/g));

    let hierarchy = d3.hierarchy(gameData, (node) => {
        return node['children'];
    }).sum((node) => {
        return node['value'];
    }).sort((node1, node2) => {
        return node2['value'] - node1['value'];
    })

    let tree_map = d3.treemap().size([1000, 600]);

    tree_map(hierarchy);

    let tiles = hierarchy.leaves();
    console.log(tiles);

    let blocks = canvas.selectAll('g')
          .data(tiles)
          .enter()
          .append('g')
          .attr('transform', d => {
            return ('translate(' + (d['x0']) + ',' + (d['y0']) + ')');
          })
          .attr('index', (d, i) => i)
          .on("mouseover", function(d){
            let tip = 'Name: ' + d['data']['name'] + '<br>' + 'Category: ' + d['data']['category'] + '<br>' + 'Value: ' + d['data']['value'];
            tooltip.html(tip);
            tooltip.style("visibility", "visible");
            tooltip.attr('data-value', d['data']['value']);
          })
          .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
          })
          .on("mousemove", () => {
            tooltip.style("top", (event.pageY-30)+"px").style("left",(event.pageX+40)+"px");
          })
          

    blocks.append('rect')
          .attr('class', 'tile')
          .attr('data-name', d => d['data']['name'])
          .attr('data-category', d => d['data']['category'])
          .attr('data-value', d => d['data']['value'])
          .attr('fill', d => categoryColors[d['data']['category']])
          .attr('width', d => d['x1'] - d['x0'])
          .attr('height', d => d['y1'] - d['y0']);

    blocks.append('text')
          .selectAll('tspan')
            .data(d => {
              return (d['data']['name'].match(/[A-Za-z0-9]+([/])?/g));
          })
          .enter()
          .append('tspan')
          .text(d => d)
          .attr('fill', 'black')
          .attr('y', (d, i) => {
            return i*6 + 10;
          })
          .attr('x', 4)
          .style('font-size', 6);
    

    legend.selectAll('rect')
          .data(categories)
          .enter()
          .append('rect')
          .attr('height', 20)
          .attr('width', 20)
          .attr('x', (d, i) => {
            if (-1 < i && i < 6) { return (50); }
            else if (5 < i && i < 12) { return (550/3 + 50); }
            else if (11 < i && i < 18) { return (550/3*2 + 50); }   
          })
          .attr('y', (d, i) => {
            return (i%6 * (200/6))
          })
          .attr('fill', d => categoryColors[d])
          .attr('class', 'legend-item');

    legend.selectAll('text')
          .data(categories)
          .enter()
          .append('text')
          .attr('x', (d, i) => {
            if (-1 < i && i < 6) { return (80); }
            else if (5 < i && i < 12) { return (550/3 + 80); }
            else if (11 < i && i < 18) { return (550/3*2 + 80); }   
          })
          .attr('y', (d, i) => {
            return (i%6 * (200/6) + 15)
          })
          .text(d => d);

}

d3.json(gamesUrl).then((data, error) => {
    if (error) {
        console.log(error);
    } else {
        gameData = data;
        console.log(gameData);
        createTreeMap();
    }
})