import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

require("firebase/firestore");

const admin = require('firebase-admin');
admin.initializeApp();

//add created issue to aggregation collection
//
export const onIssueCreate = functions.firestore
   .document('/issues/{issueId}')
   .onCreate(async (snap, context) => {
      const issueId = context.params.issueId;
      const data = snap.data();
      data.id = issueId;
      return admin.firestore().collection('aggregation')
         .get()
         .then((qSnap: any) => {
            if (!qSnap.exists) {
               const docRef = qSnap.docs[0];
               return docRef.ref
                  .update({
                     issues: admin.firestore.FieldValue.arrayUnion(data)
                  });
            } else {
               return null;
            }
         })
   });

//update the modified issue in the aggregation collection
//
export const onIssueUpdate = functions.firestore
   .document('/issues/{issueId}')
   .onUpdate(async (change, context) => {
      const issueId = context.params.issueId;
      const data = change.after.data();
      data.id = issueId;
      return admin.firestore().collection('aggregation')
         .get()
         .then((qSnap: any) => {
            if (!qSnap.exists) {
               const docRef = qSnap.docs[0];
               const issues = docRef.data().issues;
               const newIssues = issues.filter((issue: any) => issue.id !== issueId);
               return docRef.ref
                  .update(
                     {
                        issues: newIssues
                     }
                  ).then(() => {
                     docRef.ref
                        .update(
                           {
                              issues: admin.firestore.FieldValue.arrayUnion(data)
                           }
                        )
                  })
            } else {
               return null;
            }
         })
   });

//remove deleted issue from the aggregation collection
//
export const onIssueDelete = functions.firestore
   .document('/issues/{issueId}')
   .onDelete(async (snap, context) => {
      const issueId = context.params.issueId;
      const data = snap.data();
      data.id = issueId;
      return admin.firestore().collection('aggregation')
         .get()
         .then((qSnap: any) => {
            if (!qSnap.exists) {
               const docRef = qSnap.docs[0];
               const issues = docRef.data().issues;
               const newIssues = issues.filter((issue: any) => issue.id !== issueId);
               return docRef.ref
                  .update(
                     {
                        issues: newIssues
                     }
                  )
            } else {
               return null;
            }
         })
   });
