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
              role: "unassigned" //default role
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
        return ref;
      }
      catch (error) {
        reject(error);
      }
    });
  }

}
