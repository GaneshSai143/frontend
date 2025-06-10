import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#">
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Reports
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Students
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Teachers
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Main content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Dashboard</h1>
          </div>

          <!-- Charts -->
          <div class="row">
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <h5 class="card-title">Attendance Overview</h5>
                  <canvas id="attendanceChart"></canvas>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <h5 class="card-title">Performance Overview</h5>
                  <canvas id="performanceChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Recent Activities</h5>
              <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">New student registration</h6>
                    <small>3 days ago</small>
                  </div>
                  <p class="mb-1">John Doe registered for Class 10A</p>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">Teacher assignment</h6>
                    <small>5 days ago</small>
                  </div>
                  <p class="mb-1">Mrs. Smith assigned to Class 8B</p>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
      padding: 48px 0 0;
      box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
    }

    .sidebar .nav-link {
      font-weight: 500;
      color: #333;
    }

    .sidebar .nav-link.active {
      color: #2470dc;
    }

    main {
      padding-top: 48px;
    }
  `]
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