import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { IssuesService } from 'src/app/shared/issues.service';
import { Subscription } from 'rxjs';
import { Issue } from 'src/app/models/issue.model';

@Component({
  selector: 'app-issues-dashboard',
  templateUrl: './issues-dashboard.component.html',
  styleUrls: ['./issues-dashboard.component.scss']
})
export class IssuesDashboardComponent implements OnInit {
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

  recentActivityStats;

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
    this.getIssues();
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

  //priority pie chart
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
      } else if (e.tech === techObj.tech && e.status === 'Closed') {
        this.techs[index].closed++;
        this.ticketStats.status.closed++;
      }
      if (e.priority === 'Low') {
        this.ticketStats.priority.low++;
      } else if (e.priority === 'Normal') {
        this.ticketStats.priority.normal++;
      } else if (e.priority === 'High') {
        this.ticketStats.priority.high++;
      } else if (e.priority.urgent === 'Urgent') {
        this.ticketStats.priority.urgent++;
      }
    });
    this.setChartData();
  }

  //set chart data
  //
  setChartData() {
    for (const tech in this.techs) {
      this.techs[tech].progress = this.techs[tech].closed / (this.techs[tech].open + this.techs[tech].pending);
    }
    this.pieChartData = [this.ticketStats.status.open, this.ticketStats.status.closed, this.ticketStats.status.pending];
    this.pieChartData2 = [this.ticketStats.priority.low, this.ticketStats.priority.normal, this.ticketStats.priority.high, this.ticketStats.priority.urgent];
    this.progress = this.ticketStats.status.closed / (this.ticketStats.status.open + this.ticketStats.status.pending);
  }

  // Unsubscribe from firestore real time listener
  //
  ngOnDestroy() {
    for (let i = 0; i < this.firestoreSubscriptions.length; i++) {
      this.firestoreSubscriptions[i].unsubscribe();
    }
  }
}
