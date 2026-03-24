import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { COLLECTIONS, validateFirestoreDocument } from '../config/firebaseSchema';

export function useAlerts(role = 'asha', id = null) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id && role !== 'admin' && role !== 'doctor') return;

    let q = query(
      collection(db, COLLECTIONS.alerts),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    // Filter by ASHA for worker dashboard
    if (role === 'asha' && id) {
      q = query(
        collection(db, COLLECTIONS.alerts),
        where('ashaWorkerId', '==', id),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
    }

    // Filter by Doctor for PHC dashboard
    if (role === 'doctor' && id) {
      q = query(
        collection(db, COLLECTIONS.alerts),
        where('doctorId', '==', id),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Alerts collection error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [id, role]);

  const resolveAlert = async (alertId) => {
    const alertRef = doc(db, COLLECTIONS.alerts, alertId);
    const alertSnap = await getDoc(alertRef);
    if (alertSnap.exists()) {
      const updateDocPayload = {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        id: alertId
      };
      validateFirestoreDocument('alerts', updateDocPayload, { partial: true });
      await setDoc(alertRef, updateDocPayload, { merge: true });
    }
    return alertId;
  };

  const createSOSAlert = async (data) => {
    const alertRef = doc(collection(db, COLLECTIONS.alerts));
    const alertDoc = {
      id: alertRef.id,
      ...data,
      type: 'sos',
      status: 'active',
      createdAt: serverTimestamp()
    };
    validateFirestoreDocument('alerts', alertDoc);
    await setDoc(alertRef, alertDoc);
    return alertRef.id;
  };

  return { alerts, loading, resolveAlert, createSOSAlert };
}
