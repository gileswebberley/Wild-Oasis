import { v4 as createUUID } from 'uuid';

let db = null;
let version = 1;
//so we can set this up in the custom hook that uses it
export let defaultKeyPath;
export const setDefaultKeyPath = (key) => (defaultKeyPath = key);
//so we can have the uuid for each store ie {[storeName]: uuid}
let keyPathRegister = {};
//this was being exported but it's actually just for internal use
const addKeyPathRegister = (storeName, keyName) => {
  if (
    Object.hasOwn(keyPathRegister, storeName) &&
    keyPathRegister[storeName] !== keyName
  ) {
    //it's already set so we want to change it - hmm this is probably wrong to do cos if it already exists then it has been created as a store and this will not change the actual keyPath
    console.warn(
      `You have tried to change the key for '${storeName}' in the keyPathRegister to ${keyName} even though it will not affect the store itself`
    );
  } else {
    keyPathRegister = { ...keyPathRegister, [storeName]: keyName };
  }
  // console.log(`keyPathRegister is now: ${JSON.stringify(keyPathRegister)}`);
};

export function getStoreKeyPath(storeName) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);
    store.onerror = (e) => {
      reject(`Failed to get keyPath for store ${storeName}`);
    };

    //Don't ever forget again that store does not have an onsuccess handler!!
    resolve(store.keyPath);
  });
}

//helper function
function doesStoreExist(storeName) {
  return db?.objectStoreNames?.contains(storeName);
}

//let's make it so the stores are sent through as an array of objects that contain the name and key properties eg [{name:'booking', key: 'guestId'}]
export function initDB(dbName, storeArray) {
  return new Promise((resolve, reject) => {
    //check that the browser supports it first
    if (!window.indexedDB)
      reject(
        'indexedDB is not supported in your browser and we need it to make this website work'
      );
    //This is the flag to let us know if stores will have been set up according to the storeArray
    let hasUpgraded = false;

    const request = indexedDB.open(dbName, version);
    //if there's no db with this name defined yet then this will run before onsuccess - however you can only set up stores when opening a new database, you can't add stores later it seems!
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      hasUpgraded = true;
      storeArray.forEach((store) => {
        //just trying to make it look after bad calls, if the key property is missing we'll just use the deafult that we have set
        if (!Object.hasOwn(store, 'key')) {
          store.key = defaultKeyPath;
        }
        //Now check that this store doesn't already exist and create if not
        if (!doesStoreExist(store.name)) {
          //   console.log(`Creating ${store.name} DB store...`);
          addKeyPathRegister(store.name, store.key);
          db.createObjectStore(store.name, { keyPath: store.key });
        }
      });

      db.onerror = () => {
        reject(`Error when creating new DB store`);
      };
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      //we should check if someone has opened an already existing db but tried to add new stores using our flag defined at the top...
      if (!hasUpgraded) {
        //if we've been passed a store list we'll authenticate the list and reject the initialisation incase they think they've added a store but it doesn't exist
        storeArray.forEach((store) => {
          if (!doesStoreExist(store.name)) {
            //maybe this should be more graceful, perhaps I should try to change the version number and create again? Doesn't work sadly
            // version++;
            // initDB(dbName, storeArray);
            //How about deleting and then recreating?
            reject(
              `You have tried to add ${store.name} to ${db.name} when the DB already exists. Try creating a new DB or excluding your storeArray`
            );
          }
        });

        //Now go through the stores that exist and update the keyPathRegistry to reflect the current state incase it's got out of sync.
        // console.log('running store sync');
        for (let i = 0; i < db.objectStoreNames.length; i++) {
          //This is a DOMStringList hence the access through the item method
          const storeName = db.objectStoreNames.item(i);
          getStoreKeyPath(storeName)
            .then((storeKey) => {
              addKeyPathRegister(storeName, storeKey);
            })
            .catch(() => console.warn(`Failed to get store key`));
        }
      }
      //I don't think I should be passing a reference to the db itself, maybe just resolve the name
      resolve(db.name);
    };

    //Finally just deal with any errors that might have occured whilst trying to open the db connection
    request.onerror = (e) => {
      reject(`An error occured during initDB: ${e.target.error?.message}`);
    };
  });
}

//I want to be able to remove this from the user's computer when I'm finished with it
export function deleteDB(dbName) {
  return new Promise((resolve, reject) => {
    //check whether the db we're trying to delete is the currently opened one in which case we must close it so that the deletion isn't blocked
    if (db.name === dbName) {
      console.log('Trying to close the db for deletion...');
      db.close();
    }
    //it seems that the delete request does delete even if it is initially blocked, therefore I believe I should simply log the blocking rather than rejecting the promise
    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onblocked = () => {
      console.warn(`${dbName} was blocked from closing`);
    };

    deleteRequest.onerror = () => {
      reject(`There was an error whilst trying to delete ${dbName}`);
    };

    deleteRequest.onsuccess = () => {
      console.log(`The database ${dbName} was successfully deleted`);
      resolve(true);
    };
  });
}

export function deleteEntry(storeName, uid) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const deletion = store.delete(uid);
    deletion.onerror = () => {
      reject(`Could not delete entry with the ${store.keyPath}: ${uid}`);
    };
    deletion.onsuccess = () => {
      resolve(true);
    };
  });
}

export function addToDB(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to add to ${storeName} which doesn't exist`);
    }
    const transaction = db.transaction([storeName], 'readwrite');

    transaction.onerror = (e) => {
      reject(`Unable to produce a transaction whilst adding to ${storeName}`);
    };

    transaction.oncomplete = (e) => {
      console.log(
        `Adding data through this transaction to ${storeName} has completed`
      );
    };

    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = (e) => {
      //resolving here rather than in the oncomplete as this is the keyPath id for the data which we've just added and that information isn't available in the transaction oncomplete
      resolve(e.target.result);
    };
  });
}

//let's make a way to make an object to go in a store and create and return the keyPath value for that entry. This actually acts as a safe way to add objects where you don't have to give it a key but you can if it's more appropriate.
export function createNewDBObject(storeName, data = {}) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const key = keyPathRegister[storeName];
    if (key === defaultKeyPath && !Object.hasOwn(data, key)) {
      //our keyPath is the default and isn't being defined in the data object so create a uuid
      console.log(`Creating a uuid for the ${key} of the new object`);
      const keyPathValue = createUUID();
      data = { ...data, [key]: keyPathValue };
    }
    //Add the new entry to the store in a self-invoking async function (based on advice I found in a tutorial)
    (async () => {
      try {
        const success = await addToDB(storeName, data);
        //resolve with the keyPath value for this data
        return resolve(success);
      } catch (error) {
        return reject(
          `Could not add the new object to the db store ${storeName}`
        );
      }
    })();
  });
}

export function updateDBEntry(storeName, uid, data) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db
      .transaction([storeName], 'readwrite')
      .objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const request = store.get(uid);

    request.onerror = (e) => {
      reject(`Could not get ${keyPathRegister[storeName]}: ${uid}`);
    };

    request.onsuccess = (e) => {
      const currentData = e.target.result;
      data = { ...currentData, ...data };

      const update = store.put(data);

      update.onerror = (e) => {
        reject(`Failed to update ${keyPathRegister[storeName]}: ${uid}`);
      };

      update.onsuccess = (e) => {
        console.log('Update complete');
        // console.table(e.target.result);
        //the result only holds the key so there's no point returning it I don't think, but it seems wrong just to return true :/
        resolve(e.target.result);
      };
    };
  });
}

export function getEntryByNonKeyValue(storeName, valueName, searchValue) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);
    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const request = store.openCursor();
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value[valueName] === searchValue) {
          resolve(cursor.value);
        } else {
          cursor.continue();
        }
      } else {
        reject(
          `Failed to find an entry with ${valueName} set to ${searchValue}`
        );
      }
    };
  });
}

//get an array of all entries that match the criteria
//NOTE: This has not been tested yet, simply here because it was so similar to the single entry version and seemed an obvious extension that might be handy and is based on tested logic!!!
export function getAllEntriesByNonKeyValue(storeName, valueName, searchValue) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to access ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    let entries = [];
    const request = store.openCursor();
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value[valueName] === searchValue) {
          entries.push(cursor.value);
        }
        cursor.continue();
      } else {
        if (entries.length === 0) {
          reject(
            `Failed to find an entry with ${valueName} set to ${searchValue}`
          );
        } else {
          resolve(entries);
        }
      }
    };
  });
}

export function getDBEntry(storeName, uid) {
  return new Promise((resolve, reject) => {
    if (!doesStoreExist(storeName)) {
      reject(`You have tried to add to ${storeName} which doesn't exist`);
    }
    const store = db.transaction([storeName]).objectStore(storeName);

    store.onerror = (e) => {
      reject(`Failed to get store ${storeName}`);
    };

    const request = store.get(uid);

    request.onerror = (e) => {
      reject(`Could not get ${keyPathRegister[storeName]}: ${uid}`);
    };

    request.onsuccess = (e) => {
      resolve(e.target.result);
    };
  });
}
