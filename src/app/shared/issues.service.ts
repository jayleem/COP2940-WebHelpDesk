import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Issue } from '../models/issue.model';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(private db: AngularFirestore) { }

  //Create new issue
  //
  addIssue(data) {
    return new Promise((resolve, reject) => {
      this.db.collection('issues')
        .get()
        .toPromise()
        .then(() => {
          const docRef = this.db.collection('issues')
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
              });
          resolve("Success: Added Issue");
        })
        .catch(err => {
          reject("Error: Adding issue failed");
        });
    });
  }


  //Get all issues in realtime
  //
  getIssues() {
    return this.db.collection('issues').snapshotChanges();
  }

  //Get filtered issues in realtime
  //
  getIssuesFiltered(priority: string, status: string) {
    return this.db.collection('issues', ref => ref.where('priority', '==', priority).where('status', '==', status)).snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Issue;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }


  //Get issues by the id paramater
  //Must get the firebase firestore document id using firestore.FieldPath.documentId()
  //
  getIssuesById = (id) => {
    return new Promise((resolve, reject) => {
      this.db.collection('issues', ref => ref.where(firestore.FieldPath.documentId(), '==', id))
        .get()
        .toPromise()
        .then((doc) => {
          if (doc.empty) {
            reject('No results found');
          } else {
            let results = [];
            doc.forEach(issue => {
              results.push({
                id: issue.id,
                data: issue.data()
              })
              resolve(results);
            });
          }
        })
        .catch(err => {
          reject('No results found');
        });
    });
  }

  //Get issues by the tech parameter
  //
  getIssuesByTech = (tech) => {
    return new Promise((resolve, reject) => {
      this.db.collection('issues', ref => ref.where('tech', '==', tech).where('status', '==', 'Open'))
        .get()
        .toPromise()
        .then((doc) => {
          if (doc.empty) {
            reject('No results found');
          } else {
            let results = [];
            doc.forEach(issue => {
              results.push({
                id: issue.id,
                data: issue.data()
              })
            })
            resolve(results);
          }
        })
        .catch(err => {
          reject('No results found');
        });
    });
  }


  //Update issue using id and data params
  //
  updateIssue(id: string, formData, modifiedDate: Date) {
    const status = formData.get('issueData.status').value;
    let dateEnd;
    let modifiedDateTimestamp = Math.round(modifiedDate.getTime() / 1000);
    if (status != 'Closed') {
      dateEnd = '-';
    } else {
      dateEnd = new Date();
    }

    return new Promise((resolve, reject) => {
      this.db.collection('issues', ref => ref.where(firestore.FieldPath.documentId(), '==', id))
        .get()
        .toPromise()
        .then(doc => {
          if (doc.empty) {
            reject("Error: Update Failed");
          } else {
            doc.docs.forEach(doc => {
              const data = doc.data();
              if (modifiedDateTimestamp > data.lastModified.seconds) {
                console.log(true)
                const docRef = this.db.collection('issues').doc(doc.id)
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
              } else {
                reject({ title: "Database Error", subTitle: "Update Failed", message: "The document was modified while you were making changes." });
              }
            })
          }
        }).catch(err => {
          reject("Error: Update Failed");
        });
    });
  }

  //Delete issue using id param
  //
  deleteIssue(id: string) {
    return new Promise((resolve, reject) => {
      this.db.collection('issues', ref => ref.where(firestore.FieldPath.documentId(), '==', id))
        .get()
        .toPromise()
        .then(doc => {
          if (doc.empty) {
            reject("Error: Delete Failed");
          } else {
            doc.docs.forEach((doc) => {
              const docRef = this.db.collection('issues').doc(doc.id)
                .delete();
              resolve("Success: Deleted Issue");
            })
          }
        }).catch(err => {
          reject("Error: Delete Failed");
        });
    });
  }
}