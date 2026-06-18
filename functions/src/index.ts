import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// 1. Assign SUPER_ADMIN role on user creation
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const superAdminEmail = 'obenmaxjr@gmail.com';
  
  if (user.email === superAdminEmail) {
    await admin.auth().setCustomUserClaims(user.uid, { role: 'SUPER_ADMIN' });
    
    // Also update/create doc in admins collection for frontend verification
    await db.collection('admins').doc(user.uid).set({
      email: user.email,
      role: 'SUPER_ADMIN',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } else {
    await admin.auth().setCustomUserClaims(user.uid, { role: 'USER' });
  }

  // Pre-populate user profile in firestore
  await db.collection('users').doc(user.uid).set({
    name: user.displayName || 'New User',
    email: user.email,
    role: user.email === superAdminEmail ? 'SUPER_ADMIN' : 'USER',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
});

// 2. Validate Reservation Logic
export const validateReservation = functions.firestore
  .document('reservations/{reservationId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    if (!data.roomId || !data.checkIn || !data.checkOut) {
      await snap.ref.update({ status: 'Cancelled', reason: 'Invalid payload' });
      return;
    }

    // Verify room and calculate correct total price
    let roomDoc = await db.collection('rooms').doc(data.roomId).get();
    if (!roomDoc.exists) {
       const roomQuery = await db.collection('rooms').where('name', '==', data.roomId).limit(1).get();
       if (!roomQuery.empty) {
          roomDoc = roomQuery.docs[0];
       }
    }

    if (!roomDoc.exists) {
      await snap.ref.update({ status: 'Cancelled', reason: 'Invalid room specified' });
      return;
    }

    const roomData = roomDoc.data();
    const priceStr = String(roomData?.price || '0').replace(/[^0-9.]/g, '');
    const pricePerNight = Number(priceStr) || 0;

    const inDate = data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn);
    const outDate = data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut);
    
    const diffTime = outDate.getTime() - inDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays > 0 ? diffDays : 0;
    
    const subtotal = pricePerNight * nights;
    const tax = subtotal * 0.15;
    const calculatedTotal = subtotal + tax;

    // Example logic to check conflicts
    const overlapping = await db.collection('reservations')
      .where('roomId', '==', data.roomId)
      .where('status', 'in', ['Confirmed', 'Pending'])
      .where('checkOut', '>', data.checkIn)
      .get();
    
    let conflict = false;
    overlapping.forEach(doc => {
      if (doc.id === context.params.reservationId) return;
      const existing = doc.data();
      if (existing.checkIn.toMillis() < data.checkOut.toMillis() && existing.checkOut.toMillis() > data.checkIn.toMillis()) {
        conflict = true;
      }
    });

    if (conflict) {
      // Void reservation if conflict exists
      await snap.ref.update({ status: 'Cancelled', reason: 'Double booking conflict detected' });
    } else {
      // Approve if no conflict, and forcefully update the totalPrice to the server-calculated value
      await snap.ref.update({ 
          status: 'Confirmed',
          totalPrice: calculatedTotal
      });
    }
  });

// 4. Atomic Reservation Creation
export const createReservation = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { roomId, checkIn, checkOut, guests, phone, specialRequests, userName, email, roomType } = data;

  if (!roomId || !checkIn || !checkOut || !guests) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields.');
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  if (inDate >= outDate) {
    throw new functions.https.HttpsError('invalid-argument', 'Check-out date must be after check-in date.');
  }

  return await db.runTransaction(async (t) => {
    // 1. Verify Room
    let roomRef = db.collection('rooms').doc(roomId);
    let roomDoc = await t.get(roomRef);
    
    if (!roomDoc.exists) {
       const roomQuery = await db.collection('rooms').where('name', '==', roomId).limit(1).get();
       if (!roomQuery.empty) {
          roomDoc = roomQuery.docs[0];
          roomRef = roomDoc.ref;
       }
    }

    if (!roomDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Room not found.');
    }

    const roomData = roomDoc.data();
    const priceStr = String(roomData?.price || '0').replace(/[^0-9.]/g, '');
    const pricePerNight = Number(priceStr) || 0;

    const diffTime = outDate.getTime() - inDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays > 0 ? diffDays : 0;

    const subtotal = pricePerNight * nights;
    const tax = subtotal * 0.15;
    const calculatedTotal = subtotal + tax;

    // 2. Check Overlaps Atomically
    // Using queries in admin SDK transaction checks for existing docs at read time
    const overlappingQuery = db.collection('reservations')
      .where('roomId', '==', roomRef.id)
      .where('status', 'in', ['Confirmed', 'Pending'])
      .where('checkOut', '>', checkIn);

    const overlappingSnap = await t.get(overlappingQuery);
    
    let conflict = false;
    overlappingSnap.forEach(doc => {
      const existing = doc.data();
      const existingIn = existing.checkIn?.toDate ? existing.checkIn.toDate() : new Date(existing.checkIn);
      const existingOut = existing.checkOut?.toDate ? existing.checkOut.toDate() : new Date(existing.checkOut);
      
      if (existingIn.getTime() < outDate.getTime() && existingOut.getTime() > inDate.getTime()) {
        conflict = true;
      }
    });

    if (conflict) {
      throw new functions.https.HttpsError('already-exists', 'The room is already booked for the selected dates.');
    }

    // 3. Create Reservation
    const newReservationRef = db.collection('reservations').doc();
    const reservationData = {
      userId: context.auth.uid,
      userName: userName || context.auth.token.name || context.auth.token.email || 'Guest',
      email: email || context.auth.token.email || '',
      phone: phone || '',
      specialRequests: specialRequests || '',
      roomType: roomType || roomData?.name || '',
      roomId: roomRef.id,
      checkIn: inDate,
      checkOut: outDate,
      guests: guests,
      totalPrice: calculatedTotal,
      status: "Confirmed", // auto-confirm since it's atomic and calculated
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    t.set(newReservationRef, reservationData);
    
    // Also log activity
    const newActivityRef = db.collection("userActivityLogs").doc(`booking_${newReservationRef.id}`);
    t.set(newActivityRef, {
        userId: context.auth.uid,
        userName: reservationData.userName,
        activityType: "Reservation Created",
        pageVisited: "/booking",
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, reservationId: newReservationRef.id, totalPrice: calculatedTotal };
  });
});

export const updateAnalytics = functions.firestore
  .document('reservations/{reservationId}')
  .onWrite(async (change, context) => {
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;
    
    const statsRef = db.collection('analytics').doc('overview');
    
    await db.runTransaction(async (t) => {
      const statsDoc = await t.get(statsRef);
      let totalRevenue = 0;
      let bookingsCount = 0;

      if (statsDoc.exists) {
         totalRevenue = statsDoc.data()?.totalRevenue || 0;
         bookingsCount = statsDoc.data()?.bookingsCount || 0;
      }

      // If new confirmed booking added
      if ((!before || before.status !== 'Confirmed') && after?.status === 'Confirmed') {
        totalRevenue += after.totalPrice;
        bookingsCount += 1;
      }
      
      // If confirmed booking cancelled/removed
      if (before?.status === 'Confirmed' && (!after || after?.status !== 'Confirmed')) {
        totalRevenue -= before.totalPrice;
        bookingsCount -= 1;
      }

      t.set(statsRef, { 
        totalRevenue, 
        bookingsCount,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });
  });
