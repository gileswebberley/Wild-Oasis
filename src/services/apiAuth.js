import { v4 } from 'uuid';
import supabase from './supabase';
const supabaseUrl = process.env.SUPABASE_URL;

const avatarStorageUrl = `${supabaseUrl}/storage/v1/object/public/avatars/`;

//so we can have non-users creating bookings, view cabins, and create themselves as guests (ie guests) we're going to add anonymous sign-ins (isAuthenticated in useUser now checks for the is_anonymous property of user)
export async function signInGuest({
  fullName,
  email,
  avatar,
  country,
  nationalId,
}) {
  const { error } = await supabase.auth.signInAnonymously({
    options: {
      data: { fullName, email, avatar, country, nationalId },
    },
  });
  if (error) {
    throw new Error(`Guest sign in failed for ${fullName}
      ERROR: ${error.message}`);
  }

  //CREATE THEM AS A GUEST - I think this would make sense as they would then be linkable when they create their booking? I guess I would have to then update their anonymous uder data to include their guest id?
  const newGuest = {
    fullName,
    email,
    nationalID: nationalId,
    nationality: country,
    countryFlag: avatar,
  };
  const { data: guestData, error: guestError } = await supabase
    .from('guests')
    .insert(newGuest)
    .select()
    .single();

  if (guestError) {
    throw new Error(`Guest creation failed: 
      ERROR: ${guestError.message}`);
  }

  const { data: updateData, error: updateError } =
    await supabase.auth.updateUser({
      data: { guestId: guestData.id },
    });

  if (updateError) {
    throw new Error(`Guest user update failed: 
        ERROR: ${updateError.message}`);
  }
  //TODO - at some point maybe add the chance for them to become a fully fledged user so they can sign back in to check their booking details, although I think I would have to learn to implement user roles etc to do that....

  //Now return the user data just like with a normal sign in, but now this user holds the id to their corresponding guest row in our guests table (good for collecting emails and then confirmation could be sent to them)
  return updateData;
}

//I have realised that a context is not the place to keep this stuff as it is not state but instead it is data. It might be better to use local storage but seeing as this can be used and they need to be online to make the booking I'll stick witht this for now
export async function addDetailsToGuestUser(detailsObj) {
  const { data: updateData, error: updateError } =
    await supabase.auth.updateUser({
      data: { ...detailsObj },
    });

  if (updateError) {
    throw new Error(`Guest user update failed: 
        ERROR: ${updateError.message}`);
  }
  console.table(updateData);
  return updateData;
}

export async function signUp({ email, password, fullName }) {
  //Thanks to Hiroshi on Udemy for this solution to be able to create a user without signing in as them :)
  // Save the current session before signing up a new user - (TODO - try getUser as it's safer!!)
  const { data: savedSessionData } = await supabase.auth.getSession();
  const { data: signupee, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: `${avatarStorageUrl}default-user.jpg`,
      },
    },
  });
  // Log the entire response for debugging
  console.log(`'Sign-up response:' ${signupee?.user}, ${error} }`);
  //If there was a previously authenticated user, restore their session
  // This action should be placed right after signUp, otherwise the authError will stop the restore
  if (savedSessionData) {
    await supabase.auth.setSession(savedSessionData.session);
  }
  // Handle errors
  let authError = null;
  if (signupee?.user && !signupee?.user?.identities?.length) {
    authError = {
      name: 'AuthApiError',
      message: 'This email has already been registered',
    };
  } else if (error) {
    authError = {
      name: error.name,
      message: error.message,
    };
  }
  if (authError) throw new Error(authError.message);
  // return user;
  //this is to keep the data formatted the same as a simple call to signUp()
  return signupee;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  //console.table(data);
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Unable to log out because: ${error.message}`);
  }
}

export async function getCurrentUser() {
  //this checks whether there is a current session (ie whether there is a local token)
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) return null;

  //then we can get our user data again from supabase rather than trust the local data
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    //if a user is removed whilst logged in we were not being chucked off the site so rather than throwing an error...
    console.error(error.message);
    return null;
    // throw new Error(error.message);
  }

  return data?.user ?? null;
}

async function deleteAvatar(oldAvatar) {
  //check if it's the image url or image name
  if (oldAvatar.startsWith?.(avatarStorageUrl)) {
    oldAvatar = oldAvatar.split('/').pop();
  }
  console.log(`avatar image to delete: ${oldAvatar}`);
  const { data, error } = await supabase.storage
    .from('avatars')
    .remove([oldAvatar]);
  if (error) {
    console.log(error);
    throw new Error(`Could not delete image ${oldAvatar}`);
  } else {
    console.log(`Image ${data[0].name} removed`);
    return data[0];
  }
}

//update user name and/or avatar
export async function updateCurrentUser({ fullName, avatar, oldAvatar }) {
  //if fullName is set to null (which it would be reasobnable to expect if only the avatar has been changed then we don't want to update it)
  const { data: updatedUser, error: updateError } = fullName
    ? await supabase.auth.updateUser({ data: { fullName } })
    : await supabase.auth.getUser();
  if (updateError) {
    throw new Error(`Could not update or retrieve user name
    ERROR: ${updateError.message}`);
  }
  //return if there's no avatar or if the avatar is a string it obviously isn't meant to be changed
  if (!avatar) {
    console.log(`No avatar to update: ${updatedUser}`);
    return updatedUser;
  }
  if (typeof avatar === 'string') {
    console.log(`Avatar is not a File`);
    return updatedUser;
  }
  //so we have an avatar to upload
  //create a uuid for the filename in storage
  let avatarUuid = v4();
  const fileName = `user${updatedUser.user.id}-avatar-${avatarUuid}`;

  //upload the new avatar image
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar);
  if (uploadError) {
    throw new Error(`Could not upload new avatar
    ERROR: ${uploadError.message}`);
  }

  //update the url in the user to the new avatar image
  const { data, error } = await supabase.auth.updateUser({
    data: { avatar: `${avatarStorageUrl}${fileName}` },
  });

  if (error) {
    throw new Error(`Could not update avatar url
    ERROR: ${error.message}`);
  }

  //finally clear up the old disused avatar image
  if (oldAvatar) {
    try {
      await deleteAvatar(oldAvatar);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  console.log(data);
  return data;
}

export async function updateUserPassword(password) {
  const { data: passwordUpdate, error: passwordError } =
    await supabase.auth.updateUser(password);
  if (passwordError)
    throw new Error(`Password could not be updated
    ERROR: ${passwordError.message}`);

  return passwordUpdate;
}
