//UserService
//CRUD methods for documents in the issues database
//
import { Injectable } from '@angular/core';
import { Query, AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private db: AngularFirestore) {
  }

  //Create new issue
  //
  addIssue(username, data): Promise<any> {
    console.log(username, data);
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues')
          .add(
            {
              title: data.get('issueData.title').value,
              dateStart: new Date(),
              dateEnd: '-',
              lastModified: new Date(),
              desc: {
                summary: data.get('issueData.summary').value,
                reproduce: data.get('issueData.reproduce').value,
                expctRes: data.get('issueData.expctRes').value,
                actlRes: data.get('issueData.actlRes').value
              },
              priority: data.get('issueData.priority').value,
              severity: data.get('issueData.severity').value,
              difficulty: data.get('issueData.difficulty').value,
              status: 'Open',
              notes: null,
              submittedBy: username,
              assignedTech: data.get('issueData.tech').value,
              escalatedBy: null
            })
        resolve(ref.id);
      }
      catch (error) {
        reject("Error: Adding issue failed");
      }
    });
  }

  //Get all issues in realtime
  //
  getIssues() {
    return this.db.collection('aggregation').snapshotChanges();
  }


  //Get issue by id
  //
  getIssuesById(id): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues', ref => ref.where(firestore.FieldPath.documentId(), "==", id))
          .get()
          .toPromise()
          .then((doc) => {
            if (doc.empty) {
              reject('No results found');
            } else {
              let promises = [];
              doc.forEach(issue => {
                promises.push({
                  id: issue.id,
                  data: issue.data()
                })
              })
              resolve(promises);
            }
          })
      }
      catch (error) {
        reject(error);
      }
    });
  }

  //Get filtered issues in realtime ordered by data field
  //Note this is just to complete the requirements set forth by the internship
  //
  getIssuesOrdered(tech: string, status: string, priority: string, severity: string, difficulty: string, orderBy: string): Promise<any> {
    //console.log(tech, status, priority, severity, difficulty, orderBy)
    return new Promise(async (resolve, reject) => {
      const ref = await this.db.collection('aggregation', ref => {
        //build dynamic query
        //
        let query: Query = ref;
        if (orderBy) query = query.orderBy(orderBy, "asc");
        if (tech) { query = query.where('assignedTech', '==', tech) };
        if (status) { query = query.where('status', '==', status) };
        if (priority) { query = query.where('priority', '==', priority) };
        if (severity) { query = query.where('severity', '==', severity) };
        if (difficulty) { query = query.where('difficulty', '==', difficulty) };
        return query;
      })
        .get()
        .toPromise()
        .then((doc) => {
          if (doc.empty) {
            reject();
          } else {
            let promises = [];
            doc.forEach(issue => {
              promises.push({
                id: issue.id,
                data: issue.data()
              })
            })
            resolve(promises);
          }
        })
        .catch(err => {
          reject(err);
        })
    });
  }

  getIssuesByTech(tech): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues', ref => ref.where('assignedTech', '==', tech))
          .get()
          .toPromise()
          .then((doc) => {
            if (doc.empty) {
              reject('No results found');
            } else {
              let promises = [];
              doc.forEach(issue => {
                promises.push({
                  id: issue.id,
                  data: issue.data()
                })
              })
              resolve(promises)
            }
          })
      }
      catch (error) {
        reject('No results found');
      }
    });
  }


  //Update issue using id and data params
  //
  updateIssue(id: string, username: string, formData: any, modifiedDate: Date): Promise<any> {
    //assign a close date if the status is closed
    //
    let status = formData.get('issueData.status').value;
    let dateEnd;
    status != 'Closed' ? dateEnd = '-' : dateEnd = new Date();
    //this is the time that the tech/user accessed the issues update page
    //
    let modifiedDateTimestamp = Math.round(modifiedDate.getTime() / 1000);
    //check if issue was escalted if true assign the user who escalated the issue also set the ticket to open
    //    
    let escalatedBy = formData.get('issueData.escalate').value != 0 ? username : null;
    status = formData.get('issueData.escalate').value != 0 ? 'Open' : status;
    //if ticket was escalated unassign the tickets previous assigned tech
    //
    let assignedTech = formData.get('issueData.escalate').value != 0 ? "Unassigned" : formData.get('issueData.tech').value;

    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues').doc(id)
          .get()
          .toPromise()
          .then((doc) => {
            if (!doc.exists) {
              reject('ERROR: No existing document was found.');
            } else {
              const docModifiedDate = doc.data().lastModified.seconds;
              if (modifiedDateTimestamp > docModifiedDate) {
                doc.ref
                  .update(
                    {
                      assignedTech: assignedTech,
                      escalatedBy: escalatedBy,
                      priority: formData.get('issueData.priority').value,
                      severity: formData.get('issueData.severity').value,
                      status: status,
                      difficulty: formData.get('issueData.difficulty').value,
                      lastModified: new Date(),
                      dateEnd: dateEnd,
                      notes: firestore.FieldValue.arrayUnion(formData.get('issueData.notes').value)
                    });                
              } else {
                reject('ERROR: Document was updated by another technician.');
              }
            }
          });
        resolve("Success: Updated Issue.");
      }
      catch (error) {
        reject(error);
      }
    });
  }

  //Delete issue using id param
  //
  deleteIssue(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues').doc(id)
          .delete();
        resolve("Success: Deleted Issue");
      }
      catch (error) {
        reject(error)
      }
    });
  }

  //get aggregated document to reduce cost of reads
  //
  getAggregation() {
    return this.db.collection('aggregation').snapshotChanges();
  }

}