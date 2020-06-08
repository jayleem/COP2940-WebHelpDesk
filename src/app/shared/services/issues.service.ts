//UserService
//CRUD methods for documents in the issues database
//
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Issue } from '../../models/issue.model';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private db: AngularFirestore) { }

  //Create new issue
  //
  addIssue(data): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues')
          .add(
            {
              title: data.get('issueData.title').value,
              tech: data.get('issueData.tech').value,
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
              status: 'Open',
              notes: null
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
    return this.db.collection('issues').snapshotChanges();
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

  //Get filtered issues in realtime
  //
  getIssuesFiltered(priority: string, status: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues', ref => ref.where('priority', '==', priority).where('status', '==', status))
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

  //Get issues by the tech parameter
  //
  getReportOnTech(tech): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues', ref => ref.where('tech', '==', tech).where('status', '==', 'Open'))
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

  getIssuesByTech(tech): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues', ref => ref.where('tech', '==', tech))
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
  updateIssue(id: string, formData, modifiedDate: Date): Promise<any> {
    const status = formData.get('issueData.status').value;
    let dateEnd;
    let modifiedDateTimestamp = Math.round(modifiedDate.getTime() / 1000);
    if (status != 'Closed') {
      dateEnd = '-';
    } else {
      dateEnd = new Date();
    }

    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('issues').doc(id)
          .update(
            {
              tech: formData.get('issueData.tech').value,
              priority: formData.get('issueData.priority').value,
              status: formData.get('issueData.status').value,
              lastModified: new Date(),
              dateEnd: dateEnd,
              notes: firestore.FieldValue.arrayUnion(formData.get('issueData.notes').value)
            });
        resolve("Success: Updated Issue");
      }
      catch (error) {
        reject(error);
      }
    })
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

}