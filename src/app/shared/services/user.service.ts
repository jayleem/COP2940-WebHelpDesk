import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFirestore) { }

  //Create new issue
  //
  addUser(fName, lName, uid, username) {
    return new Promise((resolve, reject) => {
      this.db.collection('users')
        .get()
        .toPromise()
        .then(() => {
          const docRef = this.db.collection('users')
            .add(
              {
                fName: fName,
                lName: lName,
                userId: uid,
                username: username,
                role: "unassigned",
                createdDate: new Date(),
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
  getUsers() {
    return this.db.collection('users').snapshotChanges();
  }
}
