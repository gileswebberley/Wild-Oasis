import supabase from '../services/supabase';
const supabaseUrl = process.env.SUPABASE_URL;

const storageUrl = `${supabaseUrl}/storage/v1/object/public/`;
const cabinBucket = 'cabin-images';

export async function getCabins() {
  //This returns a Promise so could be called resolved and rejected
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('Could not load cabins data');
  }

  return data;
}

/**
 * Delete cabin row and associated image based on unique row id
 * @param {Number} id unique row id
 * @returns {CabinObject} {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
export async function deleteCabin(id) {
  //select().single() used to get reference to associated image file
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
 * @param {FileObject[] | String} imageFile - the image File to upload or the string url to an already existing image in the storage bucket
 * @returns {Promise<Union>} resolved - { data: {"path":file name,"id":image id string,"fullPath":bucket name/file name}; error: null } | rejected - {data: null; error: StorageError}
 */
// function uploadCabinImage(imageName, imageFile) {
function uploadCabinImage(imageFile) {
  //If it's a url then we have been sent the wrong thing and so it already exists in the storage bucket
  if (imageFile.startsWith?.(storageUrl)) {
    const urlArray = imageFile.split('/');
    const filename = urlArray.pop();
    const filepath = `${urlArray.pop()}/${filename}`;
    console.log(
      `Image ${filename} already exists in storage, no need to upload...`
    );
    return new Promise((resolve) =>
      resolve({
        data: { path: filename, fullPath: filepath, id: null },
        error: null,
      })
    );
  }
  //make sure the image name is formatted correctly for uploading
  const imgName = `${Math.random()}-${imageFile.name}`.replaceAll('/', '_');
  console.log(`Image ${imgName} is a new file and so will be uploaded...`);
  //upload the image to our supabase bucket called cabin-images and return the Promise
  return supabase.storage.from(cabinBucket).upload(imgName, imageFile);
}

/**
 *
 * @param {String} imageName - either the full url of the image to be deleted or simply the name of the image
 * @returns {Promise<Union>} - resolved - {
    data: FileObject[];
    error: null;
} | rejected - {
    data: null;
    error: StorageError;
}
 */
function deleteCabinImage(imageName) {
  //check if it's the image url or image name
  if (imageName.startsWith?.(storageUrl)) {
    imageName = imageName.split('/').pop();
  }
  console.log(`cabin image to delete: ${imageName}`);
  return supabase.storage.from(cabinBucket).remove([imageName]);
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
 * @param {CabinObject} data  -{name: string, maxCapacity: string, regularPrice: string, discount: string, description: string, imageUrl: string}
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
 * If id (unique row id) is included this will update a cabin row otherwise it will add a new cabin to the database.
 * if oldImage (image name or storage url) is included it will delete that image before uploading the new image
 * @param {ExtendedCabinObject} newCabin -{name: string, maxCapacity: number | string, regularPrice: number | string, discount: number | string, description: string, imageUrl: FIleObject[], [...id: number, oldImage: string]}
 * @returns {CabinObject} {name: string, maxCapacity: number, regularPrice: number, discount: number, description: string, imageUrl: string}
 */
export async function createEditCabin(newCabin) {
  //We send different data through depending on if it's being edited/created and if it's being edited then we might have changed the image
  let { id, oldImage, ...cabinData } = newCabin;
  cabinData = cleanDataTypes(cabinData);

  if (oldImage) {
    //the image has been changed during editing so delete the old one so it doesn't become an orphan
    await deleteCabinImage(oldImage)
      .then(console.log('Old image successfully removed'))
      .catch((error) => {
        console.log(error);
        throw new Error('Could not delete old image');
      });
  }

  let imageUploadData = null;
  //upload the image to our supabase bucket called cabin-images, if it's already in the bucket it will be a url to an already existing one which this function will take care of
  const { data: uploadData, error: uploadError } = await uploadCabinImage(
    cabinData.imageUrl
  );
  if (uploadError) {
    console.error(uploadError);
    throw new Error(`Could not upload cabin image`);
  } else {
    console.log('Image upload function successful');
    imageUploadData = uploadData;
  }

  //if upload has not thrown an error then create or update the cabin that has the uploaded image associated, if there is an id then it is an edit so update
  let createEditData = null;
  if (id) {
    //update cabin
    console.log(`Updating Cabin....${id}`);
    const { data: updateData, error: updateError } = await updateCabin(id, {
      ...cabinData,
      imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
    });
    if (updateError) {
      throw new Error(`Could not update cabin ${id}`);
    } else {
      console.log(`Cabin "${updateData.name}" successfully updated`);
      createEditData = updateData;
    }
  } else {
    //create cabin
    console.log(`Creating Cabin...`);
    const { data: createData, error: createError } = await createCabin({
      ...cabinData,
      imageUrl: `${storageUrl}${imageUploadData.fullPath}`,
    });
    createEditData = createData;
    if (createError) {
      //if unsuccessful then clear up our storage by removing the associated image which is now orphaned
      await deleteCabinImage(imageUploadData.path).catch((error) => {
        //we won't throw an error as it is just part of the create new cabin failing which throws an error of it's own
        console.error(
          'Could not remove image when creating a new cabin failed'
        );
      });
      throw new Error(`Could not add new cabin`);
    } else {
      console.log(`Cabin "${createData.name}" successfully created`);
    }
  }

  return createEditData;
}
