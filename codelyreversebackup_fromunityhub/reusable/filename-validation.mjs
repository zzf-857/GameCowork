import os from 'node:os';
import path from 'node:path';
//#region src/core/src/file-system/fs-utils.ts
/**
* Check if the given filename is valid (does not contain unacceptable characters and is within
* length limits).
*
* @param filename the filename to check
* @param options options for validation
* @param options.caseInsensitive if true, ignore differences in character case when validating
* @param options.invalidRegExp `RegExp` of unacceptable characters and patterns
* @param options.minAsciiValue characters with ASCII value lower than this are considered unacceptable
* @param options.maxLength max length for a filename to be valid
* @returns true if the given filename is valid
*/
var isValidFilename$2 = (filename, { caseInsensitive, invalidRegExp, minAsciiValue, maxLength }) => {
	const workingFilename = caseInsensitive ? filename.toLocaleLowerCase() : filename;
	return !workingFilename.match(invalidRegExp) && workingFilename.split("").every((char) => char.charCodeAt(0) >= minAsciiValue) && workingFilename.length > 0 && (maxLength ? workingFilename.length <= maxLength : true) && !workingFilename.startsWith(" ");
};
/**
* Create a validator that can check if the given path is valid (formatted correctly such that each
* filename component of the path is also valid).
*
* @param path the path to check
* @param caseInsensitive if true, ignore differences in character case when validating
* @param maxLength max length for a path to be valid
* @param parsePathComponents called to parse out the filename components of the path and separate
* the volume prefix
* @returns path validator for use on the given path
*/
var pathValidator$1 = (path, caseInsensitive, maxLength, parsePathComponents) => (validatePathComponents) => {
	const workingPath = caseInsensitive ? path.toLocaleLowerCase() : path;
	const components = parsePathComponents(workingPath);
	return workingPath.length > 0 && workingPath.length <= maxLength && typeof components === "string" && validatePathComponents(components);
};
/**
* see: https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
*/
var FILENAME_INVALID_PATTERN$1 = /([<>:"/\\|?*`%]|^(con|prn|aux|nul|(com|lpt)[1-9])(?:\..*)?$|[ .]$)/;
var FILENAME_MIN_ASCII_VALUE$1 = 32;
/**
* Permits "\\server\share\*", "\device\*", "c:\*", and "*"
*
* see: https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#fully-qualified-vs-relative-paths
*/
var PATH_NAMESPACES$1 = /^((?:\\\\?.+|[a-z]:)\\|)(.*)$/;
var CASE_INSENSITIVE = true;
/**
* Check if the given filename is valid (does not contain unacceptable characters and is within
* length limits).
*
* @param filename the filename to check
* @returns true if the given filename is valid
*/
var isValidFilename$1 = (filename) => isValidFilename$2(filename, {
	caseInsensitive: CASE_INSENSITIVE,
	invalidRegExp: FILENAME_INVALID_PATTERN$1,
	minAsciiValue: FILENAME_MIN_ASCII_VALUE$1,
	maxLength: 260
});
/**
* Create a validator that can check if the given path is valid (formatted correctly such that each
* filename component of the path is also valid).
*
* @param path the path to check
* @returns path validator for use on the given path
*/
var pathValidator = (path) => pathValidator$1(path, CASE_INSENSITIVE, 260, (path2) => {
	return path2.match(PATH_NAMESPACES$1)?.[2] ?? null;
});
//#endregion
//#region src/core/src/file-system/fs.ts
/**
* see: https://github.com/torvalds/linux/blob/d19cc4bfbff1ae72c3505a00fb8ce0d3fa519e6c/include/uapi/linux/limits.h#L12-L13
*/
var MAX_FILENAME = 255;
var MAX_PATH = 4096;
/**
* Finder and others on macOS do not work with colon
* see: https://superuser.com/questions/326103/what-are-invalid-characters-for-a-file-name-under-os-x#comment1525053_326104
*/
var FILENAME_INVALID_PATTERN = /[:/`%]/;
var FILENAME_MIN_ASCII_VALUE = 1;
var PATH_NAMESPACES = /^(~?\/|)(.*)$/;
/**
* Get the max permitted filename length.
*
* @param crossPlatform if true, restrict the max length to be compatible with all supported
* platforms
* @returns the max permitted filename length
*/
var getMaxFilenameLength = (crossPlatform = true) => {
	if (crossPlatform) return Math.min(MAX_FILENAME, 260);
	return os.platform() === "win32" ? 260 : MAX_FILENAME;
};
/**
* Get the max permitted path length for the current platform.
*
* @returns the max permitted path length
*/
var getMaxPathLength = () => {
	return os.platform() === "win32" ? 260 : MAX_PATH;
};
/**
* Check if the given filename is valid (does not contain unacceptable characters and is within
* length limits).
*
* @param filename the filename to check
* @param crossPlatform if true, ensure the filename would be valid on all supported platforms
* @returns true if the given filename is valid
*/
var isValidFilename = (filename, crossPlatform = true) => {
	const platformName = os.platform();
	const isValidUnixFilename = isValidFilename$2(filename, {
		caseInsensitive: platformName !== "linux",
		invalidRegExp: FILENAME_INVALID_PATTERN,
		minAsciiValue: FILENAME_MIN_ASCII_VALUE,
		maxLength: MAX_FILENAME
	});
	return crossPlatform ? isValidFilename$1(filename) && isValidUnixFilename : platformName === "win32" ? isValidFilename$1(filename) : isValidUnixFilename;
};
/**
* Check if the given path is valid (formatted correctly so as to identify a file on the file system
* and such that each filename component of the path is also valid).
*
* @param pathToCheck the path to check
* @param crossPlatform if true, ensure the path only contains path components that would be valid
* on all supported platforms
* @returns true if the given path is valid
*/
var isValidPath = (pathToCheck, crossPlatform = true) => {
	const platformName = os.platform();
	let pathValidator$2;
	pathToCheck = path.normalize(pathToCheck);
	if (platformName === "win32") pathValidator$2 = pathValidator(pathToCheck);
	else pathValidator$2 = pathValidator$1(pathToCheck, platformName !== "linux", MAX_PATH, (path2) => {
		return path2.match(PATH_NAMESPACES)?.[2] ?? null;
	});
	return pathValidator$2((componentsStr) => {
		const components = componentsStr.split(path.sep);
		const lastComponent = components.pop();
		return components.every((component) => isValidFilename(component, crossPlatform)) && (lastComponent === "" || lastComponent !== void 0 && isValidFilename(lastComponent, crossPlatform));
	});
};
//#endregion

export { isValidFilename, isValidPath, getMaxFilenameLength, getMaxPathLength };
