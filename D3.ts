import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {
  private svg;
  private projection;
  private path;
  private width = 960;
  private height = 600;

  private dataCenters = [
    { city: 'New York', coordinates: [-74.006, 40.7128] },
    { city: 'Washington', coordinates: [-77.0369, 38.9072] },
    { city: 'New Jersey', coordinates: [-74.4057, 40.0583] }
  ];

  ngOnInit(): void {
    this.createSvg();
    this.drawMap();
  }

  private createSvg(): void {
    this.svg = d3.select('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  private drawMap(): void {
    this.projection = d3.geoMercator()
      .scale(150)
      .translate([this.width / 2, this.height / 1.5]);

    this.path = d3.geoPath()
      .projection(this.projection);

    d3.json('https://d3js.org/world-50m.v1.json').then((worldData: any) => {
      const countries = topojson.feature(worldData, worldData.objects.countries).features;
      this.svg.selectAll('.country')
        .data(countries)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', this.path);

      this.drawDataCenters();
    });
  }

  private drawDataCenters(): void {
    this.dataCenters.forEach(dataCenter => {
      const [x, y] = this.projection(dataCenter.coordinates);
      this.svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .style('fill', 'red');

      this.svg.append('text')
        .attr('x', x + 5)
        .attr('y', y + 5)
        .text(dataCenter.city);
    });

    this.drawLines();
  }

  private drawLines(): void {
    const lineGenerator = d3.line()
      .x(d => this.projection(d)[0])
      .y(d => this.projection(d)[1]);

    const lineData = this.dataCenters.map(dc => dc.coordinates);

    this.svg.append('path')
      .datum(lineData)
      .attr('d', lineGenerator)
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }
}
