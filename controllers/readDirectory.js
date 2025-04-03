import { resolve } from 'path';
import { readdir } from 'fs/promises';

const readDirectory = async (path = '', pathsToFilter = []) => {
  const filesInPath = await readdir(path, { withFileTypes: true });

  const files = await Promise.all(filesInPath.map((fileInPath) => {
    const resolvedPath = resolve(path, fileInPath.name);
    return fileInPath.isDirectory() ? readDirectory(resolvedPath) : resolvedPath;
  }));

  return files.flat()?.filter((file = '') => {
    return !pathsToFilter.some((pathToFilter) => {
      return file.includes(pathToFilter);
    });
  });
};

export default readDirectory;