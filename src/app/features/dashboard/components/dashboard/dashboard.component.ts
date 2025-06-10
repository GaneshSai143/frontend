import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    // Register Chart.js components
    Chart.register(...registerables);

    // Initialize Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart') as HTMLCanvasElement;
    new Chart(attendanceCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Attendance Rate',
          data: [95, 92, 88, 94, 90, 93],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    // Initialize Performance Chart
    const performanceCtx = document.getElementById('performanceChart') as HTMLCanvasElement;
    new Chart(performanceCtx, {
      type: 'bar',
      data: {
        labels: ['Class 10A', 'Class 10B', 'Class 9A', 'Class 9B'],
        datasets: [{
          label: 'Average Score',
          data: [85, 78, 82, 75],
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
} 