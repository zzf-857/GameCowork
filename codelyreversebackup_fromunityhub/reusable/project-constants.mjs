import path from 'node:path';
//#region src/main/services/projectService/projectConstants.ts
var ProjectAssetsFolderPath = "Assets";
var LockFilePath = path.join("Temp", "UnityLockfile");
var ProjectDirectoryLocalStorageKey = "projectDir";
var ProjectUserSettingsFolderPath = "UserSettings";
var ProjectSettingsFolderPath = "ProjectSettings";
var ProjectSettingsFileName = "ProjectSettings.asset";
var ProjectVersionFileName = "ProjectVersion.txt";
var ProjectSettingsFilesToWatch = [ProjectSettingsFileName, ProjectVersionFileName];
var SkipRemoveConfirmationKey = "skipRemoveConfirmation";
var ProjectOrganizationKey = "projectOrganizationSetting";
var ProjectSortPreferencesKey = "projectSortPreferences";
var ProjectTablePreferencesKey = "projectTablePreferences";
var HideBuiltInRPDeprecationWarningKey = "hideBuiltInRPDeprecationWarning";
var ProjectLibraryFolderPath = "Library";
var ProjectBuildSettingsFileName = "EditorUserBuildSettings.asset";
var ProjectGraphicsSettingsFileName = "GraphicsSettings.asset";
var ProjectQualitySettingsFileName = "QualitySettings.asset";
//#endregion

export { ProjectAssetsFolderPath, LockFilePath, ProjectDirectoryLocalStorageKey, ProjectUserSettingsFolderPath, ProjectSettingsFolderPath, ProjectSettingsFileName, ProjectVersionFileName, ProjectSettingsFilesToWatch, SkipRemoveConfirmationKey, ProjectOrganizationKey, ProjectSortPreferencesKey, ProjectTablePreferencesKey, HideBuiltInRPDeprecationWarningKey, ProjectLibraryFolderPath, ProjectBuildSettingsFileName, ProjectGraphicsSettingsFileName, ProjectQualitySettingsFileName };
