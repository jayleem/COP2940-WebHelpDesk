import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
    return this.db
      .collection('issues')
      .add(
        {
          title: data.get('issueData.title').value,
          tech: data.get('issueData.tech').value,          
          dateStart: new Date(),
          dateEnd: '-',
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
  getIssuesById = (id) => {
    return new Promise((resolve, reject) => {
      let data = this.db.collection('issues', ref => ref.where(firestore.FieldPath.documentId(), '==', id))
        .get()
        .toPromise()
        .then((doc) => {
            let results = [];
            doc.forEach( issue => {
              results.push({
                id: issue.id,
                data: issue.data()
            })
            resolve (results);
          });
        })
        .catch(err => {
          console.log(err)
          reject;
        });
    });
  }

  //Get issues by the tech parameter
  //
  getIssuesByTech = (tech) => {
    return new Promise((resolve, reject) => {
      let data = this.db.collection('issues', ref => ref.where('tech', '==', tech).where('status', '==', 'Open'))
        .get()
        .toPromise()
        .then((doc) => {
          if (doc.empty) {
            reject("ERROR: No documents were found");
          } else {
            let results = [];
            doc.forEach( issue => {
              results.push({
                id: issue.id,
                data: issue.data()
              })
            })
            resolve (results);
          }
        })
        .catch(err => {
          console.log(err)
          reject;
        });
    });
  }


  //Update issue using id and data params
  //
  updateIssue(id: string, data) {
    const status = data.get('issueData.status').value;
    let dateEnd;
    if (status != 'Closed') {
      dateEnd = '-';
    } else {
      dateEnd = new Date();
    }

    return this.db.collection('issues')
      .doc(id)
      .update(
        {
          tech: data.get('issueData.tech').value,
          priority: data.get('issueData.priority').value,
          status: data.get('issueData.status').value,
          dateEnd: dateEnd,
          notes: firestore.FieldValue.arrayUnion(data.get('issueData.notes').value)
        });
  }

  //Delete issue using id param
  //
  deleteIssue(id: string) {
    return this.db.collection("issues")
      .doc(id)
      .delete();
  }
}
