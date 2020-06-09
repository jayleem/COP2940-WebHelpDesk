import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import { Label, SingleDataSet, MultiDataSet } from 'ng2-charts';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Subscription } from 'rxjs';
import { Issue } from 'src/app/models/issue.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-analytics',
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss']
})
export class DashboardAnalyticsComponent implements OnInit {

  //firestore subscription
  //
  firestoreSubscriptions: Subscription[] = [];
  issues$;
  errors;
  //data vars
  //
  progress = 0.0;
  ticketStats = {
    status: {
      open: 0,
      pending: 0,
      closed: 0,
    },
    priority: {
      low: 0,
      normal: 0,
      high: 0,
      urgent: 0
    }
  };
  techs = [];
  dates = [];


  //Get user and role
  //I don't think this is a very good way of doing things. I should just bind the user and role to data from the parent component.
  //
  user: any;
  role: any;
  name: any;
  recentHistory: any;
  constructor(private issuesService: IssuesService, private authService: AuthService, private userService: UserService, private router: Router) {
    this.user = this.authService.getUser();
    this.userService.getUserById(this.user.uid)
      .then(res => {
        this.role = res[0].data.role;
        this.name = res[0].data.fName + " " + res[0].data.lName;
        this.recentHistory = res[0].data.recentHistory;
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnInit() {
    this.setDates();
    this.getIssuesByTech();
  }


  getIssuesByTech() {
    const tech = this.user.email;
    this.issuesService.getIssuesByTech(tech)
      .then(data => {
        if (data.length > 0) {
          this.issues$ = data.map(e => {
            return { id: e.id, ...e.data as {} } as Issue;
          });
        } else {
          this.errors = 'ERROR: No documents were found';
          this.issues$ = undefined;
        }
        this.updateChartData();
      })
      .catch(err => {
        console.log(err)
      });
  }

  //Charts
  //Status pie chart
  //
  pieChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontColor: "#39BEC1"
      }
    }
  };
  pieChartLabels: Label[] = ['Open', 'Pending', 'Closed'];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartColors: Array<any> = [{
    backgroundColor: ['#29066B', '#7D3AC1', '#AF4BCE', '#DB4CB2', '#EB548C', '#EA7369', '#F0A58F', '#FCEAE6'],
    borderColor: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
  }];

  //Priority pie chart
  //
  pieChartOptions2 = {
    responsive: true,
    legend: {
      labels: {
        fontColor: "#39BEC1"
      }
    }
  };
  pieChartLabels2: Label[] = ['Low', 'Normal', 'High', 'Urgent'];
  pieChartData2: SingleDataSet = [];
  pieChartType2: ChartType = 'pie';
  pieChartLegend2 = true;
  pieChartPlugins2 = [];
  pieChartColors2: Array<any> = [{
    backgroundColor: ['#29066B', '#7D3AC1', '#AF4BCE', '#DB4CB2', '#EB548C', '#EA7369', '#F0A58F', '#FCEAE6'],
    borderColor: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent']
  }];

  //TODO: create two data sets
  //one represents tickets from last week
  //another will represent tickets from the current week
  //display data as line chart
  //
  lineChartOptions = {
    responsive: true,
    elements: {
      line: {
        tension: 0 //disables bezier curve
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }]
    }
  };

  //createData
  lineChartData;
  lineChartLabels;

  lineChartColors: Array<any> = [
    {
      backgroundColor: 'transparent',
      borderColor: '#7D3AC1',
      pointBackgroundColor: '#7D3AC1',
      pointBorderColor: '#AF4BCE',
      pointHoverBackgroundColor: '#7D3AC1',
      pointHoverBorderColor: '#AF4BCE'
    },
    {
      backgroundColor: 'transparent',
      borderColor: '#EB548C',
      pointBackgroundColor: '#EB548C',
      pointBorderColor: '#EA7369',
      pointHoverBackgroundColor: '#EB548C',
      pointHoverBorderColor: '#EA7369'
    },
    {
      backgroundColor: 'transparent',
      borderColor: '#F0A58F',
      pointBackgroundColor: '#F0A58F',
      pointBorderColor: '#FCEAE6',
      pointHoverBackgroundColor: '#F0A58F',
      pointHoverBorderColor: '#FCEAE6'
    }
  ];

  //vars for generating dates for the line chart
  //
  lastWeek = [];
  thisWeek = [];
  setDates() {
    let curr = new Date;

    //get the monday of this week
    //
    let firstDayThisWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1)));
    //get the previous weeks monday
    //
    let firstDayLastWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1) - 7));
    //generate days between the first and last day of the given week
    //
    for (let i = 1; i <= 7; i++) {
      this.thisWeek.push(new Date(curr.setDate(firstDayThisWeek.getDate() - firstDayThisWeek.getDay() + i)).toISOString().substring(0, 10));
      this.lastWeek.push(new Date(curr.setDate(firstDayLastWeek.getDate() - firstDayLastWeek.getDay() + i)).toISOString().substring(0, 10));
    }
  }


  updateChartData() {
    //reset the chart data vars
    //
    this.ticketStats.status.open = 0;
    this.ticketStats.status.pending = 0;
    this.ticketStats.status.closed = 0;
    this.ticketStats.priority.low = 0;
    this.ticketStats.priority.normal = 0;
    this.ticketStats.priority.high = 0;
    this.ticketStats.priority.urgent = 0;

    //map issue data
    //may lead to performance issues but theres no way to count firebase documents
    //could also write more efficient code here but i'm not getting paid for this 
    //
    this.issues$.map(e => {

      //add only unique dates
      //
      if (e.dateEnd != "-") {
        let date = new Date(e.dateEnd.seconds * 1000).toISOString().substring(0, 10);
        if (!this.dates.some(el => el.date === date)) {
          this.dates.push(
            {
              date: date,
              open: 0,
              pending: 0,
              closed: 0,
              progress: 0
            });
        }
        //get index of current date on issue
        //
        const dateIndex = this.dates.findIndex(el => el.date === date)
        let dateObj = this.dates[dateIndex];
        if (date === dateObj.date && e.status === 'Open') {
          this.dates[dateIndex].open++;
        } else if (date === dateObj.date && e.status === 'Pending') {
          this.dates[dateIndex].pending++;
        } else {
          this.dates[dateIndex].closed++;
        }
      }

      //add only unique technicans
      //
      if (!this.techs.some(el => el.tech === e.tech)) {
        this.techs.push(
          {
            tech: e.tech,
            open: 0,
            pending: 0,
            closed: 0,
            progress: 0
          });
      }

      //get index of current tech on issue
      //
      const index = this.techs.findIndex(el => el.tech === e.tech)
      let techObj = this.techs[index];
      if (e.tech === techObj.tech && e.status === 'Open') {
        this.techs[index].open++;
        this.ticketStats.status.open++;
      } else if (e.tech === techObj.tech && e.status === 'Pending') {
        this.techs[index].pending++;
        this.ticketStats.status.pending++;
      } else {
        this.techs[index].closed++;
        this.ticketStats.status.closed++;
      }
      if (e.priority === 'Low') {
        this.ticketStats.priority.low++;
      } else if (e.priority === 'Normal') {
        this.ticketStats.priority.normal++;
      } else if (e.priority === 'High') {
        this.ticketStats.priority.high++;
      } else {
        this.ticketStats.priority.urgent++;
      }
    });
    this.setChartData();
  }

  //set charts data
  //
  setChartData() {
    //setting line chart data
    //
    let thisWeeksData = [];
    let lastWeeksData = [];

    //TO-DO: have multiple x-axis labels for the current week and last week
    //
    this.lineChartLabels = this.thisWeek;

    for (const date in this.lastWeek) {
      const index = this.dates.findIndex(el => el.date === this.lastWeek[date])
      let item = this.dates[index];
      if (item) {
        lastWeeksData.push(item.closed);
      } else {
        lastWeeksData.push(0);
      }
    }

    for (const date in this.thisWeek) {
      const index = this.dates.findIndex(el => el.date === this.thisWeek[date])
      let item = this.dates[index];
      if (item) {
        thisWeeksData.push(item.closed);
      } else {
        thisWeeksData.push(0);
      }
    }
    console.log(lastWeeksData);

    this.lineChartData = [
      { label: "Last Week", data: lastWeeksData, borderDash: [10, 6] },
      { label: "This Week", data: thisWeeksData}
    ]
    //

    //setting pie chart data
    //
    for (const tech in this.techs) {
      this.techs[tech].progress = this.ticketStats.status.closed / (this.ticketStats.status.open + this.ticketStats.status.pending + this.ticketStats.status.closed);
    }
    this.pieChartData = [this.ticketStats.status.open, this.ticketStats.status.closed, this.ticketStats.status.pending];
    this.pieChartData2 = [this.ticketStats.priority.low, this.ticketStats.priority.normal, this.ticketStats.priority.high, this.ticketStats.priority.urgent];
    this.progress = this.ticketStats.status.closed / (this.ticketStats.status.open + this.ticketStats.status.pending + this.ticketStats.status.closed);
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
