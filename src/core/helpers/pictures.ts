// @ts-nocheck

import mime from 'mime';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import { IMAGE_MAX_SIZE } from '../data/constants';
import { ImageType, FormDataType } from '../../types/FileType';

export const formatPhotoURI = (uri: string) => `file:///${uri.split('file:/').join('')}`;

export const compressPhoto = async (uri: string, size: number) => {
  const compressedPhoto = await ImageManipulator.manipulateAsync(
    uri,
    [],
    { compress: IMAGE_MAX_SIZE / size }
  );

  return formatPhotoURI(compressedPhoto.uri);
};

export const formatImage = async (
  image: ImagePickerAsset,
  fileName: string
): Promise<ImageType> => {
  const fileInfos = await FileSystem.getInfoAsync(image.uri);
  const uri = (fileInfos.size && ((fileInfos.size / IMAGE_MAX_SIZE) > 1))
    ? await compressPhoto(image.uri, fileInfos.size)
    : formatPhotoURI(image.uri);

  const file = { uri, type: mime.getType(uri), name: fileName };

  return file;
};

export const formatPayload = (payload): FormDataType => {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => data.append(key, v));
    } else data.append(key, value);
  });
  return data;
};
