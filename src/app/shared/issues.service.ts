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

  //CREATE
  //
  addIssue(data) {
    return this.db
      .collection('issues')
      .add(
        {
          title: data.get('issueData.title').value,
          dateStart: new Date(),
          dateEnd: '-',
          desc: {
            summary: data.get('issueData.summary').value,
            reproduce: data.get('issueData.reproduce').value,
            expctRes: data.get('issueData.expctRes').value,
            actlRes: data.get('issueData.actlRes').value
          },
          tech: 'Unassigned',
          priority: data.get('issueData.priority').value,
          status: 'Open',
          notes: ''
        });
  }

  //READ
  //
  getIssues() {
    return this.db.collection('issues').snapshotChanges();
  }


  getIssuesById(id: string) {
    return this.db.collection('issues')
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(({ payload: { doc } }) => {
          const data = doc.data();
          const id = doc.id
          return { id, ...data as Issue };
        })),
        map((issues) => issues.find(doc => doc.id === id)));
  }

  getIssuesByTech(tech: string) {
    return this.db.collection('issues', ref => ref.where('tech', '==', tech).where('status', '==', 'Open'))
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(({ payload: { doc } }) => {
          if (changes) {
            const data = doc.data();
            const id = doc.id
            return { id, ...data as Issue };
          }
          else {
            return null;
          }
        })));
  }

  //UPDATE
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

  //DELETE
  //
  deleteIssue(id: string) {
    return this.db.collection("issues")
      .doc(id)
      .delete();
  }
}
