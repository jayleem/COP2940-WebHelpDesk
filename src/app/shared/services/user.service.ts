//IssueService
//CRUD methods for documents in the user database
//
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFirestore) { }

  //Create new issue uses set instead of add for custom id
  //
  addUser(fName, lName, uid, username): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let user =
        {
          id: uid, //custom id used in security rules
          fName: fName,
          lName: lName,
          username: username,
          role: "unassigned", //default role
          accountStatus: false, //default status
          recentHistory: []
        }
        this.db.collection('users').doc(user.id).set(user);
        resolve("Success: Added Issue");
      }
      catch (error) {
        reject(error)
      }
    });
  }


  //Get all users in realtime
  //
  getUsers(): any {
    return this.db.collection('users').snapshotChanges();
  }

  //Get user by id
  //
  getUserById(id): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('users', ref => ref.where(firestore.FieldPath.documentId(), "==", id))
          .get()
          .toPromise()
          .then((doc) => {
            if (doc.empty) {
              console.log("No results found");
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

  //update user based on userID
  //
  updateUser(id: string, formData): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('users', ref => ref.where(firestore.FieldPath.documentId(), '==', id))
          .get()
          .toPromise()
          .then(users => {
            users.forEach(user => {
              user.ref
                .update(
                  {
                    role: formData.get('userData.role').value,
                    accountStatus: formData.get('userData.status').value,
                  });
                  resolve("Success: Updated User");
            })
          });
      }
      catch (error) {
        reject(error);
      }
    })
  }

  //update user based on userID
  //
  updateUserHistory(id: string, action: string, issueId: string): Promise<any> {
    const historyItem = {
      date: new Date(),
      action: action,
      issueId: issueId
    }

    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('users', ref => ref.where(firestore.FieldPath.documentId(), "==", id))
          .get()
          .toPromise()
          .then(users => {
            users.forEach(user => {
              let arrRecentHistory = user.get('recentHistory');
              //Update user history 
              //
              if (arrRecentHistory.length < 10) {
                user.ref.update(
                  {
                    recentHistory: firestore.FieldValue.arrayUnion(historyItem)
                  });
              } else {
                //Remove oldest value then update user history
                //
                user.ref.update({ recentHistory: firestore.FieldValue.arrayRemove(arrRecentHistory[0]) });
                user.ref.update({ recentHistory: firestore.FieldValue.arrayUnion(historyItem) });
              }
              resolve("Success: Updated User History");
            })
          });
      }
      catch (error) {
        reject(error);
      }
    })
  }
}
