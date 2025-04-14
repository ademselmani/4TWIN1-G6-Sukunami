import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { UniversityService } from '../../services/university.service';
import { University } from '../../models/university.model';

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.css']
})
export class StatisticsDashboardComponent implements OnInit {
  @ViewChild('locationChartCanvas') locationChartCanvas!: ElementRef;
  @ViewChild('departmentsChartCanvas') departmentsChartCanvas!: ElementRef;
  
  universities: University[] = [];
  locationChart: any;
  departmentsChart: any;
  loading = false;
  error = '';
  
  // Stats
  totalUniversities = 0;
  totalDepartments = 0;
  avgDepartmentsPerUniversity = 0;
  locationStats: {[key: string]: number} = {};
  departmentStats: {name: string, departments: number}[] = [];
  
  // Make Object available to template
  Object = Object;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadUniversityData();
  }

  loadUniversityData(): void {
    this.loading = true;
    this.universityService.getAllUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.calculateStatistics();
        this.initCharts();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading university data';
        console.error(err);
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalUniversities = this.universities.length;
    this.locationStats = {};
    this.departmentStats = [];
    let totalDepts = 0;

    // Calculate stats
    this.universities.forEach(uni => {
      // Count by location
      const location = uni.location || 'Unknown';
      this.locationStats[location] = (this.locationStats[location] || 0) + 1;
      
      // Count departments
      const deptCount = uni.departements?.length || 0;
      totalDepts += deptCount;
      
      // Store for departments chart
      this.departmentStats.push({
        name: uni.nomUniv,
        departments: deptCount
      });
    });

    // Sort department stats by number of departments (descending)
    this.departmentStats.sort((a, b) => b.departments - a.departments);
    
    // Keep only top 10 for chart clarity
    if (this.departmentStats.length > 10) {
      this.departmentStats = this.departmentStats.slice(0, 10);
    }
    
    this.totalDepartments = totalDepts;
    this.avgDepartmentsPerUniversity = this.totalUniversities > 0 ? 
      totalDepts / this.totalUniversities : 0;
  }

  getLocationBreakdown(): {name: string, count: number, percentage: number}[] {
    const breakdown: {name: string, count: number, percentage: number}[] = [];
    const totalUnis = this.totalUniversities;
    
    for (const [location, count] of Object.entries(this.locationStats)) {
      breakdown.push({
        name: location,
        count: count,
        percentage: Math.round((count / totalUnis) * 100)
      });
    }
    
    // Sort by count (descending)
    return breakdown.sort((a, b) => b.count - a.count);
  }

  initCharts(): void {
    setTimeout(() => {
      this.createLocationChart();
      this.createDepartmentsChart();
    });
  }

  createLocationChart(): void {
    const canvas = this.locationChartCanvas?.nativeElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const labels = Object.keys(this.locationStats);
    const data = Object.values(this.locationStats);
    
    // Generate colors
    const backgroundColors = this.generateColors(labels.length);
    
    this.locationChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Universities by Location'
          }
        }
      }
    });
  }
  
  createDepartmentsChart(): void {
    const canvas = this.departmentsChartCanvas?.nativeElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const labels = this.departmentStats.map(stat => stat.name);
    const data = this.departmentStats.map(stat => stat.departments);
    
    this.departmentsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Departments',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Departments'
            }
          },
          x: {
            title: {
              display: true,
              text: 'University'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Departments per University'
          }
        }
      }
    });
  }
  
  generateColors(count: number): string[] {
    const baseColors = [
      'rgba(255, 99, 132, 0.8)',   // Red
      'rgba(54, 162, 235, 0.8)',   // Blue
      'rgba(255, 206, 86, 0.8)',   // Yellow
      'rgba(75, 192, 192, 0.8)',   // Green
      'rgba(153, 102, 255, 0.8)',  // Purple
      'rgba(255, 159, 64, 0.8)',   // Orange
      'rgba(199, 199, 199, 0.8)',  // Gray
      'rgba(83, 102, 255, 0.8)',   // Indigo
      'rgba(255, 99, 255, 0.8)',   // Pink
      'rgba(138, 43, 226, 0.8)'    // Violet
    ];
    
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  }
} 