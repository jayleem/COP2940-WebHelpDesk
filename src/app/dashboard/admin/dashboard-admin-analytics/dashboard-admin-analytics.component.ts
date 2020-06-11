import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService } from 'src/app/shared/services/issues.service';
import { Issue } from 'src/app/models/issue.model';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { ThrowStmt } from '@angular/compiler';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard-admin-analytics',
  templateUrl: './dashboard-admin-analytics.component.html',
  styleUrls: ['./dashboard-admin-analytics.component.scss']
})
export class DashboardAdminAnalyticsComponent implements OnInit {

  //firestore subscription
  //
  firestoreSubscriptions: Subscription[] = [];
  issues$;
  users$;
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

  recentActivityStats;

  constructor(private issuesService: IssuesService, private userService: UserService) { }

  ngOnInit() {
    this.setDates();
    this.getIssues();
    this.getUsers();
  }


  getIssues() {
    this.firestoreSubscriptions.push(this.issuesService.getIssues().subscribe(data => {
      if (data.length > 0) {
        this.issues$ = data.map(e => {
          return { id: e.payload.doc.id, ...e.payload.doc.data() as {} } as Issue;
        });
      } else {
        this.errors = 'ERROR: No documents were found';
        this.issues$ = undefined;
      }
      this.updateChartData();
    }));
  }

  getUsers() {
    this.firestoreSubscriptions.push(this.userService.getUsers().subscribe(data => {
      if (data.length > 0) {
        this.users$ = data.map(e => {
          return { id: e.payload.doc.id, ...e.payload.doc.data() as {} } as Issue;
        });
      } else {
        this.errors = 'ERROR: No documents were found';
        this.users$ = undefined;
      }
      this.updateRecentHistory();
    }));
  }

  //generate user history for admin user activity
  //this could be extremely performance intensive depending on the amount of technicans/users
  //there more likely is a better way of doing this.
  //note: the array is spliced to only display 10 of the most recent changes in the HTML template
  //
  userHistory = [];
  updateRecentHistory() {

    for (const user in this.users$) {
      for (const item in this.users$[user].recentHistory)
        this.userHistory.push(
          {
            username: this.users$[user].username,
            history: this.users$[user].recentHistory[item]
          });
    }

    //sorts the array by date values
    //
    this.userHistory.sort((a, b) => {
      let c = new Date(a.history.date.seconds);
      let d = new Date(b.history.date.seconds);
      return (c < d) ? -1 : ((c > d) ? 1 : 0);
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
    maintainAspectRatio: true,
    elements: {
      line: {
        //tension: 0 //disables bezier curve
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }],
      yAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          responsive: true,
          maintainAspectRatio: true,
          labelString: 'Issues'
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          stepSize: 1
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
      borderColor: '#29066B',
      pointBackgroundColor: '#29066B',
      pointBorderColor: '#29066B',
      pointHoverBackgroundColor: '#29066B',
      pointHoverBorderColor: '#29066B'
    },
    {
      backgroundColor: 'transparent',
      borderColor: '#DB4CB2',
      pointBackgroundColor: '#DB4CB2',
      pointBorderColor: '#DB4CB2',
      pointHoverBackgroundColor: '#DB4CB2',
      pointHoverBorderColor: '#DB4CB2'
    },
    {
      backgroundColor: 'transparent',
      borderColor: '#EA7369',
      pointBackgroundColor: '#EA7369',
      pointBorderColor: '#EA7369',
      pointHoverBackgroundColor: '#EA7369',
      pointHoverBorderColor: '#EA7369'
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
      this.thisWeek.push(new Date(curr.setDate(firstDayThisWeek.getDate() - firstDayThisWeek.getDay() + i)).toLocaleDateString('en-us'));
      this.lastWeek.push(new Date(curr.setDate(firstDayLastWeek.getDate() - firstDayLastWeek.getDay() + i)).toLocaleDateString('en-us'));
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
      let date;
      if (e.dateEnd != "-") {
        date = new Date(e.dateEnd.seconds * 1000).toLocaleDateString('en-us');
      } else {
        date = new Date(e.dateStart.seconds * 1000).toLocaleDateString('en-us');
      };
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

  //set chart data
  //
  setChartData() {
    //setting line chart data
    //
    let twoWeeksDataOpen = [];
    let twoWeeksDataPending = [];
    let twoWeeksDataClosed = [];

    // TO-DO: have multiple x-axis labels for the current week and last week
    // multi line labels must be nested arrays e.g [['1','2'],'3','4', '5','6','7']
    // combine both week arrays given the format above
    //
    let combinedLabels = [];
    this.thisWeek.map((e, i) => {
      combinedLabels.push(e);
      combinedLabels.push(this.lastWeek[i]);
    });
    combinedLabels.sort((a, b) => {
      let c = new Date(a);
      let d = new Date(b);
      return (c < d) ? -1 : ((c > d) ? 1 : 0);
    });
    this.lineChartLabels = combinedLabels;

    let combinedDates = [];
    this.thisWeek.map((e, i) => {
      combinedDates.push(e);
      combinedDates.push(this.lastWeek[i]);
    });
    combinedDates.sort((a, b) => {
      let c = new Date(a);
      let d = new Date(b);
      return (c < d) ? -1 : ((c > d) ? 1 : 0);
    });

    for (const date in combinedDates) {
      const index = this.dates.findIndex(el => el.date === combinedDates[date])
      let item = this.dates[index];

      if (item) {
        twoWeeksDataOpen.push(item.open);
        twoWeeksDataPending.push(item.pending);
        twoWeeksDataClosed.push(item.closed);
      } else {
        twoWeeksDataOpen.push(0);
        twoWeeksDataPending.push(0);
        twoWeeksDataClosed.push(0);
      }
    }

    this.lineChartData = [
      { label: "Open", data: twoWeeksDataOpen, spanGaps: true },
      { label: "Pending", data: twoWeeksDataPending, spanGaps: true },
      { label: "Closed", data: twoWeeksDataClosed, spanGaps: true }
    ]

    //setting pie chart data
    //
    this.pieChartData = [this.ticketStats.status.open, this.ticketStats.status.closed, this.ticketStats.status.pending];
    this.pieChartData2 = [this.ticketStats.priority.low, this.ticketStats.priority.normal, this.ticketStats.priority.high, this.ticketStats.priority.urgent];
    this.progress = this.ticketStats.status.closed / (this.ticketStats.status.open + this.ticketStats.status.pending + this.ticketStats.status.closed);
    //set progress for techs
    //
    for (const tech in this.techs) {
      this.techs[tech].progress = this.techs[tech].closed / (this.techs[tech].open + this.techs[tech].pending + this.techs[tech].closed);
      isFinite(this.techs[tech].progress) ? null : this.techs[tech].progress = 0;
    }
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }

}
