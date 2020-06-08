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

  //Create new issue
  //
  addUser(fName, lName, uid, username): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = this.db.collection('users')
          .add(
            {
              fName: fName,
              lName: lName,
              userId: uid,
              username: username,
              role: "unassigned", //default role
              accountStatus: "disabled" //default status
            })
        resolve("Success: Added Issue");
      }
      catch (error) {
        reject(error)
      }
    });
  }


  //Get all users in realtime
  //
  getUsers() {
    return this.db.collection('users').snapshotChanges();
  }

  //Get user by id
  //
  getUserById(id): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const ref = await this.db.collection('users', ref => ref.where('userId', "==", id))
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
        const ref = await this.db.collection('users', ref => ref.where('userId', '==', id))
        .get()
        .toPromise()
        .then(users => {
          users.forEach(user => {
            user.ref
            .update(
              {
                role: formData.get('userData.role').value,
                status: formData.get('userData.status').value,
              });
          })
        });
        resolve("Success: Updated User");
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
        const ref = await this.db.collection('users', ref => ref.where('userId', '==', id))
        .get()
        .toPromise()
        .then(users => {
          users.forEach(user => {      
            let arrRecentHistory = user.get('recentHistory');
            //Update user history 
            //
            if(arrRecentHistory.length < 10) {
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
