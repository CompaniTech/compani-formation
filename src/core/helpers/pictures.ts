import mime from 'mime';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { CameraCapturedPicture } from 'expo-camera';
import { IMAGE_MAX_SIZE } from '../data/constants';
import Users from '../../api/users';

export const formatPhotoURI = uri => `file:///${uri.split('file:/').join('')}`;

export const compressPhoto = async (uri, size) => {
  const compressedPhoto = await ImageManipulator.manipulateAsync(
    uri,
    [],
    { compress: IMAGE_MAX_SIZE / size }
  );

  return formatPhotoURI(compressedPhoto.uri);
};

export const savePhoto = async (photo, loggedUser) => {
  const fileInfos = await FileSystem.getInfoAsync(photo.uri);
  const uri = (fileInfos.size && ((fileInfos.size / IMAGE_MAX_SIZE) > 1))
    ? await compressPhoto(photo.uri, fileInfos.size)
    : formatPhotoURI(photo.uri);

  const data = new FormData();
  const { firstname, lastname } = loggedUser.identity;
  const file = { uri, type: mime.getType(uri), name: `photo_${firstname}_${lastname}` };

  data.append('fileName', `photo_${firstname}_${lastname}`);
  data.append('file', file);

  if (loggedUser.picture?.link) await Users.deleteImage(loggedUser._id);
  await Users.uploadImage(loggedUser._id, data);

  return Users.getById(loggedUser._id);
};

export const formatImage = async (image: CameraCapturedPicture, fileName: string) => {
  const fileInfos = await FileSystem.getInfoAsync(image.uri);
  const uri = (fileInfos.size && ((fileInfos.size / IMAGE_MAX_SIZE) > 1))
    ? await compressPhoto(image.uri, fileInfos.size)
    : formatPhotoURI(image.uri);

  const file = { uri, type: mime.getType(uri), name: fileName };

  return file;
};

export const formatPayload = async (payload) => {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => data.append(key, value));

  return data;
};
