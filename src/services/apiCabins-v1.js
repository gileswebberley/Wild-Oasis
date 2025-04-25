import { v4 } from 'uuid';
import supabase from './supabase';
const supabaseUrl = process.env.SUPABASE_URL;

const storageUrl = `${supabaseUrl}/storage/v1/object/public/`;
const cabinBucket = 'cabin-images';

export async function getCabins() {
  const { data, error, count } = await supabase
    .from('cabins')
    .select('*', { count: 'exact' })
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    throw new Error('Could not load cabins data');
  }

  return { data, count };
}

export async function getCabinById(id) {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Could not load cabin data');
  }

  return { data };
}

/**
 * @typedef {Object} CabinObject An object that reflects the data required for a cabin entry in the database table 'cabins'
 * @property {String} name Cabin name
 * @property {Number} maxCapacity The maximum number of guests that fit in this cabin
 * @property {Number} regularPrice The list price per chargeable unit of time
 * @property {Number} discount Any discount applied to be removed from regularPrice per chargeable unit of time
 * @property {String} description Short description to appear on the website
 * @property {String} imageUrl The url of the image stored in the bucket called cabin-images
 */

/**
 * @typedef {Object} ExtendableCabinObject An object that reflects the data required for a cabin entry in the database table 'cabins' or an update to an already existing entry
 * @property {String} name Cabin name
 * @property {Number} maxCapacity The maximum number of guests that fit in this cabin
 * @property {Number} regularPrice The list price per chargeable unit of time
 * @property {Number} discount Any discount applied to be removed from regularPrice per chargeable unit of time
 * @property {String} description Short description to appear on the website
 * @property {File[] | String} imageUrl The url of the image stored in the bucket called cabin-images
 * @property {Number} id Optional (denotes that this is an edit call rather than a create call) The unique id of the cabin to be updated
 * @property {String} oldImage Optional (only available when id is supplied) The url string to a cabin image in storage which has been replaced by a new image via imageUrl
 */

/**
 * @typedef {Object} ImageCabinObject An object that reflects the data required for a cabin entry in the database table 'cabins' but with an image file that needs to be uploaded to storage (this must be converted to the storage url before it can be entered into the database)
 * @property {String} name Cabin name
 * @property {Number} maxCapacity The maximum number of guests that fit in this cabin
 * @property {Number} regularPrice The list price per chargeable unit of time
 * @property {Number} discount Any discount applied to be removed from regularPrice per chargeable unit of time
 * @property {String} description Short description to appear on the website
 * @property {File[]} imageUrl The image File[]
 */

/**
 * @typedef {Object} FileObject Information about a file that is stored in a supabase storage bucket
 * @property {String} name Image file name eg 'image-1.jpg
 * @property {String} bucket_id The bucket name
 * @property {String} owner registered owner
 * @property {String} owner_id registered owner's id
 * @property {String} version file version number
 * @property {String} id file's unique storage id
 * @property {String} updated_at date string for when it was last updated
 * @property {String} created_at date string of when it was first uploaded
 * @property {String} last_accessed_at date string for when the file was last accessed
 * @property {Object} metadata original file metadata including 'size' in bytes
 * @property {Object} user_metadata additional metadata
 */

/**
 * @typedef {Object} StorageObject An object that reflects the data required for a cabin entry in the database table 'cabins' but with an image file that needs to be uploaded to storage (this must be converted to the storage url before it can be entered into the database)
 * @property {String} path Image file name eg 'image-1.jpg
 * @property {String} id
 * @property {String} fullPath Path with storage bucket name and image name eg 'bucket-1/image-1.jpg'
 */

/**
 * Delete cabin row and associated image based on unique row id
 * @param {Number} id unique row id
 * @returns {CabinObject} {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
export async function deleteCabin(id) {
  const { data, error } = await supabase
    .from('cabins')
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(`Could not delete cabin with id: ${id}`);
  } else {
    console.log(
      `Cabin ${data.name} was successfully deleted, now removing associated image from storage...`
    );
    await deleteCabinImage(data.imageUrl).catch((error) => {
      throw new Error(
        `Could not delete the image associated with the cabin called ${data.name}`
      );
    });
  }
  return data;
}

/**
 * This will either attempt to upload an image file to the cabin-images storage bucket or reformat the string url of an already existing image file so that updateCabin or createCabin can function without being aware of which of the options is being dealt with
 * @param {File[] | String} imageFile - the image File to upload or the string url to an already existing image in the storage bucket
 * @returns {FileObject} {"path":file name,"id":image id string,"fullPath":bucket name/file name}
 */
async function uploadCabinImage(imageFile) {
  //If it's a url then we have been sent the wrong thing and so it already exists in the storage bucket - no need since the refactor but I don't think it hurts to leave it here in case it is used this way by someone
  if (imageFile.startsWith?.(storageUrl)) {
    const urlArray = imageFile.split('/');
    const filename = urlArray.pop();
    const filepath = `${urlArray.pop()}/${filename}`;
    console.log(
      `Image ${filename} already exists in storage, no need to upload...`
    );
    return { path: filename, fullPath: filepath, id: null };
  }
  //make sure the image name is formatted correctly for uploading
  const imgName = `${v4()}-${imageFile.name}`.replaceAll('/', '_');
  console.log(`Image ${imgName} is a new file and so will be uploaded...`);
  //upload the image to our supabase bucket called cabin-images, if it's already in the bucket it will be a url to an already existing one which this function will take care of
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(cabinBucket)
    .upload(imgName, imageFile);
  if (uploadError) {
    console.error(uploadError);
    throw new Error(`Could not upload cabin image`);
  } else {
    console.log('Image upload function successful');
    return uploadData;
  }
}

/**
 * PLEASE NOTE - the cabin must be removed from the database before attempting to delete it's image from storage as it will check if the image is referenced by any cabins
 * @param {String} imageName - either the full storage bucket url of the image to be deleted or simply the name of the image
 * @returns {StorageObject | null} information about the removed file and it's storage if this image is not shared by other cabins. If it is still used by another cabin listing then the return value will be null and the image will not be deleted from storage
 */
async function deleteCabinImage(imageName) {
  //check if it's the image url or image name
  if (imageName.startsWith?.(storageUrl)) {
    imageName = imageName.split('/').pop();
  }
  console.log(`cabin image to delete: ${imageName}`);
  //we've added the option to duplicate cabins which has caused a problem with shared images so we'll have to check that here
  const { data: imageUserList, error: imageUserListError } = await supabase
    .from('cabins')
    .select('imageUrl')
    .eq('imageUrl', `${storageUrl}${cabinBucket}/${imageName}`);

  if (imageUserListError) {
    console.error(`Error collecting list of cabins that use ${imageName}`);
  }

  //If it is used by another cabin listing then don't delete it from storage
  if (imageUserList.length > 0) {
    console.log(`Could not remove image as it is used by other cabins`);
    console.table(imageUserList);
    return null;
  } else {
    const { data, error } = await supabase.storage
      .from(cabinBucket)
      .remove([imageName]);
    if (error) {
      console.log(error);
      throw new Error(`Could not delete image ${imageName}`);
    } else {
      console.log(`Image ${data[0].name} removed`);
      return data[0];
    }
  }
}

/**
 * 
 * @param {CabinObject} cabinData - {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string} 
 * @returns {Promise<Union>} resolved - {
    data: CabinObject;
    error: null;
} | rejected - {
    data: null;
    error: StorageError;
}
 */
function createCabin(cabinData) {
  return supabase.from('cabins').insert(cabinData).select().single();
}

/**
 * 
 * @param {Number} id - unique row id of cabin to be updated
 * @param {CabinObject} cabinData -{name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string} 
 * @returns  {Promise<Union>} resolved - {
    data: CabinObject;
    error: null;
} | rejected - {
    data: null;
    error: StorageError;
}
 */
function updateCabin(id, cabinData) {
  return supabase
    .from('cabins')
    .update(cabinData)
    .eq('id', id)
    .select()
    .single();
}

/**
 * for some reason the numbers are being cast to string en-route to here so I'm going to clean it up
 * @param {StringCabinObject} data  -{name: string, maxCapacity: string, regularPrice: string, discount: string, description: string, imageUrl: string}
 * @returns {CabinObject}  -{name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
function cleanDataTypes(data) {
  let { maxCapacity, regularPrice, discount, name, description, imageUrl } =
    data;
  maxCapacity = +maxCapacity;
  regularPrice = +regularPrice;
  discount = +discount;
  return { name, maxCapacity, regularPrice, discount, description, imageUrl };
}

/**
 *
 * @param {Number} id unique id of the cabin to update
 * @param {ImageCabinObject | CabinObject} cabinData { name: string, maxCapacity: number | string, regularPrice: number | string, discount: number | string, description: string, imageUrl: FIleObject[] | string }
 * @param {String} oldImage Optional url of the image to be replaced if a new image has been selected
 * @returns {CabinObject} {name, maxCapacity, regularPrice, discount, description, imageUrl}
 */
async function cabinUpdater(id, cabinData, oldImage = null) {
  if (oldImage) {
    try {
      //upload the new image and set cabinData.imageUrl to it's path (rather than the File[] that this function has received it as)
      const imageUploadData = await uploadCabinImage(cabinData.imageUrl);
      cabinData = {
        ...cabinData,
        imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
      };
    } catch (error) {
      throw new Error(
        `There was a problem whilst trying upload a new image for cabin "${cabinData.name}"
        Error: ${error.message}`
      );
    }
  }

  const { data: updateData, error: updateError } = await updateCabin(
    id,
    cabinData
  );
  if (updateError) {
    if (oldImage) await deleteCabinImage(cabinData.imageUrl);
    throw new Error(`Could not update cabin ${cabinData.name}`);
  } else {
    if (oldImage) {
      //the image has been changed during editing delete the old one so it doesn't become an orphan
      await deleteCabinImage(oldImage);
    }
    console.log(`Cabin "${cabinData.name}" successfully updated`);
    return updateData;
  }
}

/**
 * Create a new cabin in the database including the upload of the associated image file
 * @param {ImageCabinObject | CabinObject} cabinData { name: string, maxCapacity: number | string, regularPrice: number | string, discount: number | string, description: string, imageUrl: FIleObject[] | string }
 * @returns {CabinObject} {name, maxCapacity, regularPrice, discount, description, imageUrl}
 */
async function cabinCreator(cabinData) {
  let imageUploadData = null;
  try {
    imageUploadData = await uploadCabinImage(cabinData.imageUrl);
  } catch (error) {
    throw new Error(
      `There was a problem whilst trying to upload the image for cabin "${cabinData.name}"
      Error: ${error.message}`
    );
  }

  const { data: createData, error: createError } = await createCabin({
    ...cabinData,
    imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
  });
  if (createError) {
    //if unsuccessful then clear up our storage by removing the associated image which is now orphaned
    try {
      await deleteCabinImage(imageUploadData.path);
    } catch (error) {
      //we won't throw an error as it is just part of the create new cabin failing which throws an error of it's own
      console.error('Could not remove image when creating a new cabin failed');
    }
    throw new Error(`Could not add new cabin`);
  } else {
    console.log(`Cabin "${createData.name}" successfully created`);
    return createData;
  }
}

/**
 * If id (unique row id) is included this will update a cabin row otherwise it will add a new cabin to the database.
 * if oldImage (image name or storage url) is included along with id it will delete that image before uploading the new image
 * @param {ExtendableCabinObject} newCabin -{name: string, maxCapacity: number | string, regularPrice: number | string, discount: number | string, description: string, imageUrl: FIle[], [...id: number, oldImage: string]}
 * @returns {CabinObject} {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
export async function createEditCabin(newCabin) {
  //We send different data through depending on if it's being edited/created and if it's being edited then we might have changed the image
  let { id, oldImage, ...cabinData } = newCabin;
  cabinData = cleanDataTypes(cabinData);

  // if there is an id then it is an edit so update
  let createEditData = null;
  if (id) {
    //update cabin
    console.log(`Updating Cabin....${id}`);
    console.table(cabinData);
    createEditData = await cabinUpdater(id, cabinData, oldImage);
  } else {
    //create cabin
    console.log(`Creating Cabin...`);
    createEditData = await cabinCreator(cabinData);
  }

  return createEditData;
}
