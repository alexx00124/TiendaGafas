const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions/v2');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

exports.lowercaseProductName = onDocumentCreated(
  'products/{documentId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.log('No document data, skipping.');
      return;
    }

    const name = snapshot.data().name;
    logger.log(
      'Lowercasing product name',
      event.params.documentId,
      name
    );

    const lowercaseName = name.toLowerCase();
    await getFirestore()
      .collection('products')
      .doc(event.params.documentId)
      .set({ name_lower: lowercaseName }, { merge: true });
  }
);