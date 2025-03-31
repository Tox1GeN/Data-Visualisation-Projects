let videosUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
let videoData;

let canvas = d3.select('#canvas');
let legend = d3.select('#legend');
let tooltip = d3.select('#tooltip');
/*
let categories1 = []; 
gameData['children'].forEach(i => {
            if (categories[categories.length-1] != i['name']) {categories1.push(i['name']);}
        })
        console.log('categories', categories1);
*/


const categories = ['Action', 'Adventure', 'Comedy', 'Drama', 'Family', 'Biography', 'Animation'];
const categoryColors = {
    'Action': '#ea02ee',//0
    'Drama':'#9575CD',
    'Adventure':'#eeea02',
    'Family':'#ee7802',
    'Animation':'#BDBDBD',
    'Comedy':'#05ee02',//5
    'Biography':'#ee0202'
};

const createTreeMap = () => {

    //str = "The Hunger Games: Catching Fire 2"
    //console.log(str.match(/[A-Za-z0-9]+([\s]|[:]|[-]|[/])?([-])?/g));

    let hierarchy = d3.hierarchy(videoData, (node) => {
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
          .attr('width', d => (d['x1'] - d['x0']))
          .attr('height', d => d['y1'] - d['y0']);

    blocks.append('text')
          .selectAll('tspan')
            .data(d => {
              return (d['data']['name'].match(/[A-Za-z0-9\.'-]+([\s]|[:]|[-]|[/])?([-])?/g));
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
            if (-1 < i && i < 2) { return (50); }
            else if ((1 < i && i < 4) || i == 6) { return (550/3 + 50); }
            else if (3 < i && i < 6) { return (550/3*2 + 50); }
          })
          .attr('y', (d, i) => {
            return (i != 6) ? (i%2 * (200/6)) : (200/3);
          })
          .attr('fill', d => categoryColors[d])
          .attr('class', 'legend-item');

    legend.selectAll('text')
          .data(categories)
          .enter()
          .append('text')
          .attr('x', (d, i) => {
            if (-1 < i && i < 2) { return (80); }
            else if ((1 < i && i < 4) || i == 6) { return (550/3 + 80); }
            else if (3 < i && i < 6) { return (550/3*2 + 80); }   
          })
          .attr('y', (d, i) => {
            return (i != 6) ?  (i%2 * (200/6) + 15) : (200/3 + 15);
          })
          .text(d => d);

}

d3.json(videosUrl).then((data, error) => {
    if (error) {
        console.log(error);
    } else {
        videoData = data;
        console.log(videoData);        
        createTreeMap();
    }
})