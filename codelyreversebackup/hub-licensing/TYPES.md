# LicensingClient 类型清单（T2/TYPES，自动生成自反编译 C# 公共面）

> 生成: 2026-10-01 · 来源: temp/licensing-decomp/*.decompiled.cs（ilspycmd）· 仅列 public 成员；方法省略方法体。


## Tuanjie.Licensing.Client.dll（102 个公共类型）

### class Tuanjie.Licensing.Client.MultiClientPipeServer

### class Tuanjie.Licensing.Client.MultiClientPipeServerBase
- `void Start()`
- `bool IsOnPrimaryChannel()`
- `void Dispose()`
- `prop IPipeContext PipeContext`
- `Task StartAcceptRequests(CancellationToken cancellationToken = default(CancellationToken)`
- `void SendMessage(byte[] responseBuffer, int offset = 0, int? count = null)`
- `Task SendMessageAsync(byte[] messageBytes, int offset = 0, int? count = null)`
- `void HandleRequest(byte[] messageBytes)`
- `void Dispose()`

### class Tuanjie.Licensing.Client.DependencyInjection
- `ServiceProvider BuildServiceProviderSafely(this IServiceCollection services)`
- `IServiceCollection ConfigureLicenseServer(this IServiceCollection services, Options opts)`
- `IServiceCollection ConfigureServices(this IServiceCollection services, Options opts, TextWriter consoleOut)`
- `void SetHttpClientDefaultProxyCredentials(this IServiceProvider provider)`
- `IServiceCollection AddClientConfiguration(this IServiceCollection services)`
- `IConfigurationBuilder AddClientConfiguration(this IConfigurationBuilder configurationBuilder, IFileSystem fileSystem, IRunningOptions runningOptions, ILogg)`
- `IServiceCollection AddGenesisClientWithLogging(this IServiceCollection services)`
- `IServiceCollection AddCertificateStore(this IServiceCollection services)`
- `IServiceCollection AddLicensingClientAnalytics(this IServiceCollection services)`
- `IServiceCollection AddFloatingLicensingService(this IServiceCollection services, bool addConsoleLogger = false)`
- `IServiceCollection AddPackageService(this IServiceCollection services, bool addConsoleLogger = false)`
- `IServiceCollection AddNoopPackageService(this IServiceCollection services)`
- `IServiceCollection AddReplicationService(this IServiceCollection services)`
- `IHttpClientBuilder AddReplicationServiceClient(this IServiceCollection services)`
- `IServiceCollection AddServiceConfiguration(this IServiceCollection services)`
- `IServiceCollection AddLicenseFileCleaner(this IServiceCollection services)`
- `IServiceCollection AddLicensingOrchestrator(this IServiceCollection services)`
- `IServiceCollection AddContextProvider(this IServiceCollection services)`
- `IServiceCollection AddPackageEnforcer(this IServiceCollection services)`
- `IServiceCollection AddNoopPackageEnforcer(this IServiceCollection services)`
- `IServiceCollection AddEntitlementResolverProvider(this IServiceCollection services)`
- `IServiceCollection AddGenesisLicensingService(this IServiceCollection services)`
- `IServiceCollection AddManualLicenseActivationService(this IServiceCollection services)`
- `IServiceCollection AddMultiClientPipeServer(this IServiceCollection services)`
- `IServiceCollection AddNotificationsPipeServer(this IServiceCollection services)`
- `IServiceCollection AddLogging(this IServiceCollection services, bool debugMode, IRunningOptions runningOptions)`
- `IServiceCollection AddLogging(this IServiceCollection services, bool debugMode, bool disableFileWatcher)`
- `IServiceCollection AddEntitlementAudits(this IServiceCollection services)`
- `IServiceCollection AddLicensePeriodicUpdateService(this IServiceCollection services)`
- `IServiceCollection AddOptOutConfigPeriodicUpdateService(this IServiceCollection services)`

### enum Tuanjie.Licensing.Client.ExitCode
- `Success = 0`
- `InvalidArguments = 1`
- `InvalidCredentials = 2`
- `OrgIdMissing = 3`
- `PaclDownloadFailed = 4`
- `ContextInitializationFailed = 5`
- `ReplicationServiceInitializationFailed = 6`
- `OrchestratorInitializationFailed = 7`
- `FloatingServiceInitializationFailed = 8`
- `PackageServiceInitializationFailed = 9`
- `AccessTokenInitializationFailed = 10`
- `MultiClientPipeServerStartFailed = 11`
- `GenerateLicenseActivationFailed = 12`
- `SyncEntitlementsFailed = 13`
- `NoValidEntitlementFound = 14`
- `UpdateLicenseFailed = 15`
- `GetSeatsFailed = 16`
- `SeatsUpdateFailed = 17`
- `GetEntitlementsFailed = 18`
- `AcquireLicenseFailed = 19`
- `RenewLeaseFailed = 20`
- `ReturnLeaseFailed = 21`
- `LicenseBorrowNotSupported = 22`
- `LicenseBorrowFailed = 23`
- `InvalidUserInput = 24`
- `MachineContextNotRegistered = 25`
- `UlfActivationFailed = 26`
- `UlfUpdateFailed = 27`
- `UlfReturnFailed = 28`
- `ActivateSessionFailed = 29`
- `DestroySessionFailed = 30`
- `PaclFileNotFound = 31`
- `LicenseBorrowNotAllowed = 32`
- `ParsingError = 33`
- `InstanceAlreadyRunning = 34`
- `UnknownError = 1000`
- `m_Logger = logger`
- `m_PipeName = pipeName`
- `m_AcquireMutexThread = new`

### class Tuanjie.Licensing.Client.LicensingClientConfiguration

### class Tuanjie.Licensing.Client.LicensingClientPaths
- `string BuildFloatingLicenseFilePath(string leaseToken)`

### class Tuanjie.Licensing.Client.MachineIdGenerator
- `string GetMachineId(IContextProvider ctx)`

### class Tuanjie.Licensing.Client.Options
- `prop IEnumerable<string> Args`
- `prop bool DebugMode`
- `prop bool DisableFileWatcher`
- `prop bool ShowContext`
- `prop bool ShowEntitlements`
- `prop bool ShowAllEntitlements`
- `prop IEnumerable<string> LicenseFiles`
- `prop bool SyncEntitlements`
- `prop bool GetAccessToken`
- `prop string CloudEnvironment`
- `prop int? BorrowLicense`
- `prop bool AcquireLicense`
- `prop string ProductType`
- `prop string RenewLease`
- `prop string ReturnLease`
- `prop string ReturnBorrow`
- `prop bool ShowRemoteEntitlements`
- `prop bool ActivateSession`
- `prop bool DestroySession`
- `prop string SessionId`
- `prop string Organization`
- `prop string AccessToken`
- `prop string Username`
- `prop string Password`
- `prop bool ActivateAll`
- `prop bool DeactivateAll`
- `prop bool DisableAutoShutdown`
- `prop bool PackagesDownloadACL`
- `prop bool PackagesShowACL`
- `prop bool GenerateActivationFile`
- `prop string ActivationFolderPath`
- `prop string ActivationProductName`
- `prop string ActivationProductVersion`
- `prop bool GenerateAlfFile`
- `prop string ActivationFilePath`
- `prop bool UpdateLicense`
- `prop bool ShowSeats`
- `prop bool ActivateUlf`
- `prop string Serial`
- `prop bool UpdateUlf`
- `prop bool ReturnUlf`
- `Task<ExitCode> RunAsync()`
- `void ExitProgram()`
- `bool TryStartExitTimer()`
- `void StopExitTimer()`
- `ExitCode Run()`
- `Task<ExitCode> RunAsync()`

### class Tuanjie.Licensing.Client.Services.HttpExtensions

### class Tuanjie.Licensing.Client.Services.AsyncTimer

### enum Tuanjie.Licensing.Client.Services.TimerState
- `m_State = TimerState`
- `m_Handler = handler`
- `m_State = TimerState`
- `m_CancellationTokenSource = new`
- `m_State = TimerState`
- `m_State = TimerState`
- `m_State = TimerState`
- `m_State = TimerState`
- `m_State = TimerState`
- `m_State = TimerState`

### class Tuanjie.Licensing.Client.Services.ClientContextConfiguration

### class Tuanjie.Licensing.Client.Services.ClientContextExtension
- `IDictionary<string, string> GetContextForFloatingLicense(this IContextProvider provider)`

### class Tuanjie.Licensing.Client.Services.ContextProviderFactory
- `IContextProvider CreateInstance(ILoggerFactory loggerFactory, ClientContextConfiguration clientContextConfiguration)`

### class Tuanjie.Licensing.Client.Services.CrossProcessFloating
- `void Start()`
- `bool IsTracked(string leaseToken)`
- `bool HasFile()`
- `bool QuitQueueAndCheckIfLast()`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Services.IEntitlementResolverProvider

### class Tuanjie.Licensing.Client.Services.EntitlementResolverProvider
- `prop string Identifier`
- `prop string IdentifierHash`
- `prop string Path`
- `prop DateTime LastUpdateTime`
- `prop DateTime? LastActivationDate`
- `prop IEnumerable<Tuanjie.Licensing.EntitlementResolver.License.Entitlement> Entitlements`
- `prop LicenseType? LicenseType`
- `prop IList<EntitlementGroupError> ValidationErrors`
- `prop IList<string> AllowedProjects`
- `prop IList<string> WhiteListFeatures`
- `prop IResolver Resolver`
- `Result DefaultFilter(TuanjieLicense tuanjieLicense)`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroupsDetails()`
- `void AddLicenseFilter(Func<TuanjieLicense, Result> filter)`
- `Result UpdateResolver(IEnumerable<string> licenseFiles = null, IResolver resolver = null)`
- `TuanjieLicenseResolver BuildResolver(IEnumerable<TuanjieLicense> licenses, IList<Func<TuanjieLicense, Result>> filters, List<IEntitlementGroup> fil)`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Services.ILicenseLoader

### class Tuanjie.Licensing.Client.Services.LicenseLoader
- `TuanjieLicense GetEntitlementLicense(string licenseFilePath)`

### interface Tuanjie.Licensing.Client.Services.ILicenseOfflineValidityEndingPeriodicNotifierService

### class Tuanjie.Licensing.Client.Services.LicenseOfflineValidityEndingPeriodicNotifierService
- `void Start()`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Services.ILicensePeriodicUpdateService
- `void StartLicenseWatch()`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Services.ILicensingOrchestrator
- `prop LeaseType LeaseType`
- `prop ProductType ProductType`
- `LicenseLease FromTuanjieLicense(TuanjieLicense floatingLicenseFile)`
- `prop LicenseLease Lease`
- `prop CrossProcessFloating CrossProcessFloating`
- `prop LicenseLeaseState TrackingState`
- `prop Scheduler Scheduler`
- `void Start()`
- `bool IsSameProduct(ProductType? productType)`
- `Task ReturnLease()`
- `void Dispose()`
- `prop bool IsFloatingLicensingEnabled`
- `bool TryInitialize(out string errorMessage)`
- `void OnClientConnected(object sender, IPipeHandler pipeHandler)`
- `Result OnClientHandshakeSuccess(IPipeContext pipeContext, ProductType productType)`
- `void OnClientDisconnected(object sender, IPipeHandler pipeHandler)`
- `bool TryReturnLicense(string sessionId)`
- `bool TryUpdateProductName(string productName)`
- `bool TryReturnBorrowLicense(string leaseToken, out string errorMessage)`
- `Task<Result> EnsureLicense(ProductType productType)`
- `Task<ResultWithCode<Tuanjie.Licensing.Server.Shared.Contracts.LicenseLease>> BorrowLicenseLease(int days, ProductType productType)`
- `bool TryUpdateResolver(out string errorMessage)`
- `void OnRevoke(TrackedLease trackedLease)`
- `void Dispose()`

### class Tuanjie.Licensing.Client.Services.LoggingHttpHandler

### interface Tuanjie.Licensing.Client.Services.IReturnEntitlementGroupService

### class Tuanjie.Licensing.Client.Services.ReturnEntitlementGroupService
- `Task<AggregatedResultsWithCode<string>> ReturnEntitlementGroups(IList<string> entitlementGroupIds)`
- `void Dispose()`

### class Tuanjie.Licensing.Client.Services.Replication.InactiveLicenseFileCleaner
- `void Clean(IEnumerable<string> licenseFiles)`

### interface Tuanjie.Licensing.Client.Services.Replication.IReplicationService
- `bool TryInitialize(out string errorMessage)`
- `Task<bool> Replicate(ProductType? productType)`

### class Tuanjie.Licensing.Client.Services.Replication.ReplicationServiceConfiguration
- `prop ClientContextConfiguration ClientContextConfiguration`
- `bool IsValid(out string errorMessage)`

### interface Tuanjie.Licensing.Client.Services.Package.IPackageService

### class Tuanjie.Licensing.Client.Services.Package.NoopPackageEnforcer
- `void Dispose()`
- `bool IsPackageLicensed(string packageId)`
- `void StartPeriodicUpdates()`
- `void StopPeriodicUpdates()`
- `Task<TimeSpan> UpdatePackageAccessControlList(CancellationToken cancellation)`

### class Tuanjie.Licensing.Client.Services.Package.NoopPackageService
- `void Dispose()`
- `bool TryInitialize(out string errorMessage)`
- `PackageAccessControlList GetPaclWithHighestRevision()`
- `PackageAccessControlList GetBundledPackageAccessControlList()`
- `PackageAccessControlList GetLocalPackageAccessControlList()`
- `Task<PackageAccessControlList> FindRemotePackageAccessControlList(CancellationToken cancellation, bool disableCache = false)`
- `Task<PackageAccessControlList> GetRemotePackageAccessControlList(Uri remoteUri, CancellationToken cancellation, bool disableCache = false)`

### interface Tuanjie.Licensing.Client.Services.Package.IPackageEnforcer

### class Tuanjie.Licensing.Client.Services.Package.PackageEnforcer
- `void Dispose()`
- `bool IsPackageLicensed(string packageId)`
- `void StartPeriodicUpdates()`
- `void StopPeriodicUpdates()`
- `Task<TimeSpan> UpdatePackageAccessControlList(CancellationToken cancellation)`

### class Tuanjie.Licensing.Client.Services.Package.PackageService
- `bool TryInitialize(out string errorMessage)`
- `PackageAccessControlList GetPaclWithHighestRevision()`
- `PackageAccessControlList GetBundledPackageAccessControlList()`
- `PackageAccessControlList GetLocalPackageAccessControlList()`
- `Task<PackageAccessControlList> GetRemotePackageAccessControlList(CancellationToken cancellation, bool disableCache = false)`
- `Task<PackageAccessControlList> FindRemotePackageAccessControlList(CancellationToken cancellation, bool disableCache = false)`
- `Task<PackageAccessControlList> GetRemotePackageAccessControlList(Uri remoteUri, CancellationToken cancellation, bool disableCache = false)`
- `void Dispose()`

### class Tuanjie.Licensing.Client.Services.Package.PackageServiceConfiguration
- `bool TryGetPackageAccessControlListUrl(out Uri uri)`
- `bool TryGetServerPackageAccessControlListUrl(out Uri uri)`
- `bool TryGetGlobalPackageAccessControlListUrl(out Uri uri)`
- `Queue<Uri> GetPackageAccessControlListFetchingUrls()`

### interface Tuanjie.Licensing.Client.Services.Notification.INotificationHub

### class Tuanjie.Licensing.Client.Services.Notification.NotificationHub
- `void ConnectClient(object sender, IPipeHandler pipeHandler)`
- `void DisconnectClient(object sender, IPipeHandler pipeHandler)`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Services.Licensing.IFloatingLicensingService
- `bool TryInitialize(out string errorMessage)`
- `Task<Result<LicenseLease>> AcquireFloatingLease(ProductType productType)`
- `Task<Result> IsBorrowSupported()`
- `Task<ResultWithCode<LicenseLease>> AcquireBorrowLease(int days, ProductType productType)`
- `Task<Result<LicenseLease>> RenewFloatingLease(string leaseToken)`
- `Task<Result> ReleaseFloatingLease(string leaseToken)`
- `Task<Result> ReleaseBorrowLease(string leaseToken)`
- `Task<Result<Stream>> ActivateLicenseSession(string orgId, string sessionId)`
- `Task<Result> TryUpdateProductName(string productName)`
- `Task<Result> DestroyLicenseSession(string sessionId)`
- `Task<Result<Stream>> GetEntitlements()`
- `Result SetupHttpClientAccessToken(string accessToken = null)`
- `Guid GenerateSessionId()`

### interface Tuanjie.Licensing.Client.Services.Licensing.IGenesisLicensingService

### class Tuanjie.Licensing.Client.Services.Licensing.GenesisLicensingService
- `prop string TxId`
- `prop string RxId`
- `prop LicenseCommand Command`
- `prop string SerialNumber`
- `prop string LicenseFilePath`
- `prop bool CustomizeHeader`
- `prop Stream LicenseRequestStream`
- `prop Stream LicenseResponseStream`
- `void Debug(string message)`
- `void Info(string message)`
- `void Error(string message, Exception exception = null)`
- `ValueTask DisposeAsync()`
- `Task<ResultWithCode<Tuanjie.Licensing.Genesis.Models.ActivationManagementResponse>> UpdateActivations(Tuanjie.Licensing.Genesis.Models.ActivationManagementRequest request)`
- `Task<ResultWithCode<string>> UpdateEntitlementLicenseFile(bool customizeHeader = false)`
- `Task<ResultWithCode<Tuanjie.Licensing.Genesis.Models.GetSeatsResponse>> GetSeats(Tuanjie.Licensing.Genesis.Models.GetSeatsRequest request)`
- `Result<Stream> GenerateAlf(string tuanjieVersion = "2017.2.0")`
- `Task<ResultWithCode<string>> ActivateUlfLicense(string serial = null, string tuanjieVersion = "2017.2.0", bool customizeHeader = false)`
- `Task<ResultWithCode<string>> UpdateUlfLicense(bool customizeHeader = false)`
- `Task<ResultWithCode<string>> ReturnUlfLicense()`
- `Task<ResultWithCode> ValidateSerialNumber(string serial, string tuanjieVersion = "2017.2.0")`

### class Tuanjie.Licensing.Client.Services.Licensing.LicensingServiceConfiguration
- `prop ClientContextConfiguration ClientContextConfiguration`

### interface Tuanjie.Licensing.Client.Services.LicenseActivation.IXmlLicenseActivationRequestGenerator

### interface Tuanjie.Licensing.Client.Services.LicenseActivation.IManualLicenseActivationService
- `Result<string> ProcessAlfGenerationRequest(string filePath = "", string tuanjieVersion = "")`
- `Result<string> ProcessEntitlementActivationRequest(ManualLicenseActivationRequest request)`

### class Tuanjie.Licensing.Client.Services.LicenseActivation.XmlLicenseActivationRequestGenerator
- `Result<XmlDocument> GenerateRequest(string productName, string productVersion)`

### interface Tuanjie.Licensing.Client.Services.LicenseActivation.ILicenseActivationRequestWriter

### class Tuanjie.Licensing.Client.Services.LicenseActivation.XmlLicenseActivationRequestWriter
- `Result WriteRequest(XmlDocument xmlRequest, string path)`
- `Result<string> PrepareDestinationPath(string folderPath, string activationFileName)`

### class Tuanjie.Licensing.Client.Services.Helpers.LicenseFilesMapper

### class Tuanjie.Licensing.Client.Services.Helpers.Result
- `prop UlfLicense UlfLicense`
- `prop List<TuanjieLicense> Licenses`
- `prop IDictionary<string, EntitlementGroupError> NotMappedLicenses`
- `Result MapLicenseFilesToResult(IEnumerable<string> files, bool ignoreUlfLicenseFiles = false)`

### class Tuanjie.Licensing.Client.Services.Helpers.UlfLicensingUtilities
- `UlfLicenseXml GenerateUlfLicenseRequest(IContextProvider context, string tuanjieVersion, IRuntimeInfo runtimeInfo)`
- `void InsertTimestamps(this UlfLicenseXml license, IContextProvider context, IRuntimeInfo runtimeInfo)`
- `Result ValidateLicenseData(this UlfLicense license, IContextProvider context, IContextValidator contextValidator, IRuntimeInfo runtimeInf)`
- `Result<UlfLicenseXml> ReadUlfLicenseXml(Stream ulfStream, ILicensePublicKeyCertificateStore certificateStore)`
- `Task<Result<UlfLicenseXml>> ReadUlfLicenseXml(string ulfPath, ILicensePublicKeyCertificateStore certificateStore)`
- `Result<UlfLicense> ReadUlfLicense(Stream ulfStream, ILicensePublicKeyCertificateStore certificateStore)`
- `Task<Result<UlfLicense>> ReadUlfLicense(string ulfPath, ILicensePublicKeyCertificateStore certificateStore)`

### class Tuanjie.Licensing.Client.Services.Analytics.OptOutConfigPeriodicUpdateService
- `void Start()`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Services.Analytics.IOptOutStatusProvider

### class Tuanjie.Licensing.Client.Services.Analytics.OptOutStatusProvider
- `Task<Result<bool>> GetOptOutStatus()`

### enum Tuanjie.Licensing.Client.Extensions.EntitlementGroupChangeType

### enum Tuanjie.Licensing.Client.Extensions.EntitlementGroupChangeReason

### class Tuanjie.Licensing.Client.Extensions.EntitlementGroupChangeDetails
- `prop EntitlementGroupChangeReason ChangeReason`
- `prop IEnumerable<IEntitlementGroup> EntitlementGroups`

### class Tuanjie.Licensing.Client.Extensions.EntitlementGroupExtensions
- `IEnumerable<EntitlementGroupChangeDetails> Diff(this IEnumerable<IEntitlementGroup> currentEntitlementGroups, IEnumerable<IEntitlementGroup> previousEntitleme)`

### class Tuanjie.Licensing.Client.Infrastructure.ConfigurationProviderExtensions
- `IConfigurationBuilder AddConfigurationToMappedKey(this IConfigurationBuilder builder, MappedKeyConfigurationSource mappedKeyConfigurationSource)`

### class Tuanjie.Licensing.Client.Infrastructure.MappedKeyConfigurationSource
- `MappedKeyConfigurationSource AddMapping(string keyFrom, string keyTo)`
- `IConfigurationProvider Build(IConfigurationBuilder builder)`

### class Tuanjie.Licensing.Client.Infrastructure.MappedKeyConfigurationProvider
- `bool TryGet(string key, out string value)`

### class Tuanjie.Licensing.Client.Configuration.ClientConfigurationLoader
- `Task<JObject> LoadRemoteConfigurationAsync(Uri serviceConfigUri, string currentEnvironment, CancellationToken cancellationToken)`
- `void CacheRemoteConfiguration(JObject remoteJsonConfiguration, string currentEnvironment)`

### interface Tuanjie.Licensing.Client.Configuration.IConfigFileUpdater

### class Tuanjie.Licensing.Client.Configuration.JsonConfigFileUpdater
- `IConfigFileUpdater AddOrUpdate(string key, object value)`
- `bool TrySave(out string errorMessage)`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Configuration.IConfigurationLoader

### interface Tuanjie.Licensing.Client.Configuration.IServicesConfiguration

### class Tuanjie.Licensing.Client.Configuration.ServicesConfiguration
- `void Dispose()`
- `bool TryGetUtcDateTime(string key, out DateTime value)`
- `IEnumerable<KeyValuePair<string, string>> GetConfigs()`
- `void HandleRequest(byte[] messageBytes)`
- `IController GetController(string messageType, IPipeContext pipeContext)`

### interface Tuanjie.Licensing.Client.Communication.IPipeContext

### interface Tuanjie.Licensing.Client.Communication.IMutablePipeContext

### interface Tuanjie.Licensing.Client.Communication.IPipeHandler

### interface Tuanjie.Licensing.Client.Communication.IPipeHandlerFactory

### interface Tuanjie.Licensing.Client.Communication.IMultiClientPipeServerFactory
- `MultiClientPipeServer Create(string pipeName, int maxConnections = 20)`

### class Tuanjie.Licensing.Client.Communication.PipeConnection
- `prop IPipeHandler Handler`
- `void Dispose()`
- `prop string ProtocolVersion`
- `prop string UserAgent`
- `prop string SessionId`
- `prop string ExternalCorrelationId`
- `prop string LicenseSessionId`
- `prop string OrgId`
- `prop string ProjectId`
- `prop bool EnablePacl`
- `prop EntitlementGrantCache EntitlementGrantCache`
- `prop Guid ContextId`
- `void Update(string protocolVersion, string userAgent, string externalCorrelationId = null)`
- `bool TryGetValue(string key, out string value)`
- `PipeConnection CreatePipeHandler(PipeStream serverStream)`

### class Tuanjie.Licensing.Client.Communication.Notifications.NotificationsPipeHandler
- `prop IPipeContext PipeContext`
- `Task StartAcceptRequests(CancellationToken cancellationToken = default(CancellationToken)`
- `void SendMessage(byte[] responseBuffer, int offset = 0, int? count = null)`
- `Task SendMessageAsync(byte[] messageBytes, int offset = 0, int? count = null)`
- `void Dispose()`

### class Tuanjie.Licensing.Client.Communication.Notifications.NotificationsPipeServer
- `NotificationsPipeServer Create(string pipeName, int maxConnections = 20)`
- `Response HandleRequest(AccessTokenRequest request)`
- `Response HandleRequest(Tuanjie.Licensing.Ipc.Messages.ActivationManagementRequest request)`
- `Response HandleRequest(AlfGenerationRequest request)`
- `Response HandleRequest(BorrowLicenseRequest licenseRequest)`

### class Tuanjie.Licensing.Client.Communication.Controllers.Controller
- `Response HandleRequest(Message request)`
- `Response HandleRequest(TMessage request)`
- `Response HandleRequest(EntitlementDetailsRequest request)`
- `Response HandleRequest(EntitlementGroupsDetailsRequest request)`
- `EntitlementGroupsDetailsResponse FromEntitlementGroups(EntitlementGroupsDetailsRequest request, IEnumerable<IEntitlementGroup> entitlementGroups)`
- `EntitlementGroupsDetailsResponse.EntitlementGroupDetailIpcDto FromEntitlementGroup(IEntitlementGroup group)`
- `EntitlementGroupsDetailsResponse.EntitlementGroupDetailIpcDto.ValidationErrorIpcDto FromValidationErrorEnum(EntitlementGroupError error)`
- `Response HandleRequest(EntitlementsRequest request)`
- `Response HandleRequest(FeatureStatusRequest request)`
- `Response HandleRequest(Tuanjie.Licensing.Ipc.Messages.GetSeatsRequest request)`
- `Response HandleRequest(HandshakeRequest request)`

### class Tuanjie.Licensing.Client.Communication.Controllers.LicenseImportController
- `Response HandleRequest(LicenseImportRequest request)`
- `Response HandleRequest(ManualLicenseActivationRequest request)`
- `Response HandleRequest(ProductNameRequest request)`
- `Response HandleRequest(ReturnBorrowRequest request)`
- `Response HandleRequest(ReturnEntitlementGroupRequest request)`
- `Response HandleRequest(ReturnEntitlementGroupRequestV2 request)`
- `Response HandleRequest(ReturnLicenseRequest request)`
- `Response HandleRequest(SerialNumberValidationRequest request)`
- `Response HandleRequest(ULFActivationRequest request)`
- `Response HandleRequest(Tuanjie.Licensing.Ipc.Messages.UpdateLicenseRequest request)`
- `UpdateLicenseResponseV2 HandleRequest(UpdateLicenseRequestV2 request)`
- `Task<ExitCode> RunAsync()`
- `Task<ExitCode> RunAsync()`
- `Task<ExitCode> RunAsync()`
- `Task<ExitCode> RunAsync()`
- `void Dispose()`
- `Task<ExitCode> RunAsync()`
- `Task<ExitCode> RunAsync()`
- `string DisplayEntitlements(IList<IEntitlementGroup> allLicenseInformation, bool showAllEntitlements = false)`
- `Task<ExitCode> RunAsync()`

### class Tuanjie.Licensing.Client.Audit.AuditItem
- `prop string EntitlementIdentifier`
- `prop string EntitlementGroupIdentifier`
- `prop bool Result`
- `prop bool IsLicensedPackage`

### class Tuanjie.Licensing.Client.Audit.BatchedRemoteAuditService

### class Tuanjie.Licensing.Client.Audit.BatchAuditPublisher
- `int EnqueueEntitlement((string userIdentifier, string machineIdentifier)`
- `Task PostQueue()`
- `ValueTask DisposeAsync()`
- `void Dispose()`
- `void AuditEntitlementRequest(IContextProvider context, IPipeContext pipeContext, string requestedEntitlement, bool isLicensedPackage, bool )`
- `void Dispose()`

### interface Tuanjie.Licensing.Client.Audit.IBatchedRemoteAuditServiceConfiguration

### class Tuanjie.Licensing.Client.Audit.BatchedRemoteAuditServiceConfiguration
- `prop bool IsValid`
- `prop Uri RemoteUri`
- `prop int MaxBatchSize`
- `prop TimeSpan PeriodicPostPeriod`

### class Tuanjie.Licensing.Client.Audit.CompositeAuditService
- `void AuditEntitlementRequest(IContextProvider context, IPipeContext pipeContext, string requestedEntitlement, bool isLicensedPackage, bool )`

### interface Tuanjie.Licensing.Client.Audit.IAuditService

### class Tuanjie.Licensing.Client.Audit.LoggerAuditService
- `void AuditEntitlementRequest(IContextProvider context, IPipeContext pipeContext, string requestedEntitlement, bool isLicensedPackage, bool )`

### class Tuanjie.Licensing.Client.Audit.NoopAuditService
- `prop NoopAuditService Instance`
- `void AuditEntitlementRequest(IContextProvider context, IPipeContext pipeContext, string requestedEntitlement, bool isLicensedPackage, bool )`

### class Tuanjie.Licensing.Client.Analytics.AnalyticHttpHandler

### class Tuanjie.Licensing.Client.Analytics.TraceData
- `prop string RequestName`
- `prop string ProductAgent`
- `prop string Session`
- `string ToString()`

### class Tuanjie.Licensing.Client.Analytics.ClientEventBase

### class Tuanjie.Licensing.Client.Analytics.ClientSpanBase

### class Tuanjie.Licensing.Client.Analytics.EntitlementGrantCache
- `IList<EntitlementGrantEvent.GrantItem> GetNewGrantSinceLastAuditAndUpdateCache(IEnumerable<AuditItem> requestAudits)`

### class Tuanjie.Licensing.Client.Analytics.LicensingClientAnalytics
- `ClientProcessSpan ClientProcessSpanStart()`
- `ClientStartEvent SendClientStartEvent(IEnumerable<string> args, IEnumerable<KeyValuePair<string, string>> configurations)`
- `void SendIpcStartListeningEvent(string ipcServerType, bool isPrimary)`
- `void SendEntitlementGroupLoadedEvent(IEntitlementGroup entitlementGroup, EntitlementGroupChangeReason reason)`
- `ClientCliCommandSpan ClientCliCommandSpan(string command)`
- `BackgroundProcessSpan BackgroundProcessSpan(string processName, string operation)`
- `IpcConnectionSpan IpcConnectionSpan(int connectionCount, string sessionId, string ipcServerType)`
- `IpcRequestSpan IpcRequestSpan()`
- `void SendNewEntitlementGrants(EntitlementGrantCache entitlementGrantCache, IEnumerable<AuditItem> auditItems)`
- `void SendError(string errorType, string errorMessage, IDictionary<string, object> additionalData)`
- `void SendBindingErrors(ContextValidation contextValidation)`
- `void SendConfigurationError(string configFileName, string exceptionMessage)`
- `void SendTopApplicationError(string errorMessage)`
- `void SendIpcError(string errorMessage, IDictionary<string, object> additionalData = null)`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.BackgroundProcessSpan
- `void SetExecutionResult(Result result)`
- `void SetExecutionResult(bool isSuccess, string reason = "", int exitCode = 1000)`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.ClientCliCommandSpan
- `void SetIsSuccess(bool isSuccess)`
- `void SetReason(string reason)`
- `void SetExitCode(int exitCode)`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.ClientErrorEvent

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.ClientProcessSpan
- `void SetExitCode(int exitCode)`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.ClientStartEvent

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.EntitlementGrantEvent

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.GrantItem
- `prop string EntitlementKey`
- `prop string EntitlementGroupId`
- `prop bool Granted`
- `prop bool IsLicensedPackage`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.EntitlementGroupLoadedEvent

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.IpcConnectionSpan
- `void UpdateIpcContext(string protocolVersion, string userAgent, string externalCorrelationId)`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.IpcRequestSpan
- `void SetRequestName(string requestName)`
- `void SetResponse(Response response)`

### class Tuanjie.Licensing.Client.Analytics.AnalyticEvents.IpcStartListeningEvent


## Tuanjie.Licensing.Ipc.dll（69 个公共类型）

### class Tuanjie.Licensing.Ipc.ApiException
- `prop Response ErrorResponse`

### class Tuanjie.Licensing.Ipc.IpcConst
- `bool IsProtocolVersionSupported(string version)`

### enum Tuanjie.Licensing.Ipc.IpcResponseCode
- `Unknown = 0`
- `OK = 200`
- `BadRequest = 400`
- `Unauthorized = 401`
- `Forbidden = 403`
- `NotFound = 404`
- `UnsupportedMediaType = 415`
- `InternalServerError = 500`
- `NotImplemented = 501`
- `BadGateway = 502`
- `GenericLicensingError = 1500`
- `IpcSerializationError = 2000`
- `IpcSendError = 2001`

### class Tuanjie.Licensing.Ipc.IpcStreamExtensions
- `prop char MessageDelimiter`
- `prop Encoding ByteEncoding`
- `IEnumerable<byte[]> GetMessages(this Stream stream, CancellationToken cancellationToken = default(CancellationToken)`
- `IAsyncEnumerable<byte[]> GetMessagesAsync(this Stream stream, [EnumeratorCancellation] CancellationToken cancellationToken = default(CancellationToken)`
- `void WriteMessage(this Stream stream, byte[] bytes, int offset = 0, int? count = null)`
- `Task WriteMessageAsync(this Stream stream, byte[] bytes, int offset = 0, int? count = null)`
- `void WriteMessage(this Stream stream, string message)`
- `Task WriteMessageAsync(this Stream stream, string message)`

### interface Tuanjie.Licensing.Ipc.ISerializer

### class Tuanjie.Licensing.Ipc.JsonSerializer
- `prop Encoding Encoding`
- `object Deserialize(byte[] bytes, int index, int length)`

### class Tuanjie.Licensing.Ipc.MultiStatusResponse
- `prop IEnumerable<T> Results`

### class Tuanjie.Licensing.Ipc.SubStatus
- `prop string Id`
- `prop int StatusCode`
- `prop string Message`

### class Tuanjie.Licensing.Ipc.Notifications.LicenseExpiredNotification

### class Tuanjie.Licensing.Ipc.Notifications.LicenseExpiredNotificationDetails
- `prop string EntitlementGroupId`
- `prop string ProductName`
- `prop string ProductType`
- `prop string Reason`
- `prop string EndDate`

### class Tuanjie.Licensing.Ipc.Notifications.LicenseOfflineValidityEndingNotification

### class Tuanjie.Licensing.Ipc.Notifications.LicenseOfflineValidityEndingNotificationDetails
- `prop string EntitlementGroupId`
- `prop string ProductName`
- `prop string ProductType`
- `prop string EndDate`

### class Tuanjie.Licensing.Ipc.Notifications.LicenseUpdateNotification

### class Tuanjie.Licensing.Ipc.Notifications.LicenseUpdateNotificationDetails
- `prop string EntitlementGroupId`
- `prop string ProductName`
- `prop string ProductType`
- `prop string UpdateType`
- `prop string Reason`

### class Tuanjie.Licensing.Ipc.Notifications.Notification
- `prop TDetails Details`

### class Tuanjie.Licensing.Ipc.Messages.AccessTokenRequest
- `prop string Value`
- `prop double Expiration`

### class Tuanjie.Licensing.Ipc.Messages.AccessTokenResponse

### class Tuanjie.Licensing.Ipc.Messages.ActivationManagementRequest
- `prop SeatSelection Activate`
- `prop SeatSelection Deactivate`
- `prop bool ForceUpdateLicense`

### class Tuanjie.Licensing.Ipc.Messages.ActivationManagementResponse

### class Tuanjie.Licensing.Ipc.Messages.AlfGenerationRequest
- `prop string TuanjieVersion`
- `prop string FilePath`

### class Tuanjie.Licensing.Ipc.Messages.AlfGenerationResponse
- `prop string FilePath`

### class Tuanjie.Licensing.Ipc.Messages.BorrowLicenseRequest
- `prop int Days`

### class Tuanjie.Licensing.Ipc.Messages.BorrowLicenseResponse

### class Tuanjie.Licensing.Ipc.Messages.EntitlementDetailsRequest
- `prop ISet<string> EntitlementIds`
- `prop ISet<string> PackageEntitlementIds`
- `prop string ProductName`
- `prop bool IncludeCustomData`

### class Tuanjie.Licensing.Ipc.Messages.EntitlementDetailsResponse
- `prop ICollection<EntitlementDetailsGroupData> EntitlementGroups`
- `prop string[] FreeEntitlementIds`
- `prop string[] AllowedProjects`
- `prop string[] WhitelistFeatures`

### class Tuanjie.Licensing.Ipc.Messages.EntitlementDetailsGroupData
- `prop string EntitlementGroupId`
- `prop string EntitlementGroupIdHash`
- `prop string ProductName`
- `prop string ProductType`
- `prop string LicenseType`
- `prop long? Expiration`
- `prop ICollection<EntitlementInfo> MatchedEntitlements`

### class Tuanjie.Licensing.Ipc.Messages.EntitlementInfo
- `prop string EntitlementId`
- `prop bool IsPackage`
- `prop int Count`
- `prop string? CustomData`

### class Tuanjie.Licensing.Ipc.Messages.EntitlementGroupsDetailsRequest

### class Tuanjie.Licensing.Ipc.Messages.EntitlementGroupsDetailsResponse

### class Tuanjie.Licensing.Ipc.Messages.EntitlementGroupDetailIpcDto

### class Tuanjie.Licensing.Ipc.Messages.ValidationErrorIpcDto
- `prop string Message`
- `prop string Code`
- `prop string ProductName`
- `prop string ProductType`
- `prop string EntitlementGroupId`
- `prop string EntitlementGroupIdHash`
- `prop string LicenseType`
- `prop string LicenseFilePath`
- `prop bool IsManual`
- `prop string StartDate`
- `prop string ExpirationDate`
- `prop string SubscriptionEndDate`
- `prop string UpdateDate`
- `prop string Status`
- `prop IList<ValidationErrorIpcDto> ValidationErrors`
- `prop IList<EntitlementGroupDetailIpcDto> EntitlementGroupsDetails`

### class Tuanjie.Licensing.Ipc.Messages.EntitlementsRequest
- `prop IEnumerable<string> Entitlements`
- `prop bool ForceUpdateLicense`

### class Tuanjie.Licensing.Ipc.Messages.EntitlementsResponse
- `prop IReadOnlyDictionary<string, string> Entitlements`

### class Tuanjie.Licensing.Ipc.Messages.FeatureStatusRequest
- `prop string Feature`

### class Tuanjie.Licensing.Ipc.Messages.FeatureStatusResponse

### enum Tuanjie.Licensing.Ipc.Messages.Feature

### class Tuanjie.Licensing.Ipc.Messages.GetSeatsRequest
- `prop string orgId`

### class Tuanjie.Licensing.Ipc.Messages.GetSeatsResponse
- `prop ICollection<Seat> Seats`

### class Tuanjie.Licensing.Ipc.Messages.HandshakeRequest
- `prop string ProtocolVersion`
- `prop string UserAgent`
- `prop string ExternalCorrelationId`

### class Tuanjie.Licensing.Ipc.Messages.HandshakeResponse
- `prop string ProtocolVersion`
- `prop string SessionId`
- `prop IReadOnlyDictionary<string, string> Context`
- `prop string AssemblyProductVersion`
- `prop string MachineId`
- `prop string CorrelationId`

### class Tuanjie.Licensing.Ipc.Messages.LicenseImportRequest
- `prop string LicensePath`

### class Tuanjie.Licensing.Ipc.Messages.LicenseImportResponse

### class Tuanjie.Licensing.Ipc.Messages.ManualLicenseActivationRequest
- `prop string ProductName`
- `prop string ProductVersion`
- `prop string FilePath`

### class Tuanjie.Licensing.Ipc.Messages.ManualLicenseActivationResponse
- `prop string FilePath`

### class Tuanjie.Licensing.Ipc.Messages.Message
- `prop string MessageType`
- `prop string? Id`
- `prop string? AuthorizationCheck`
- `prop string? ProductType`
- `prop double? LastActivationDate`

### class Tuanjie.Licensing.Ipc.Messages.ProductNameRequest
- `prop string Value`

### class Tuanjie.Licensing.Ipc.Messages.ProductNameResponse

### class Tuanjie.Licensing.Ipc.Messages.Response
- `prop int ResponseCode`
- `prop string ResponseStatus`

### class Tuanjie.Licensing.Ipc.Messages.ReturnBorrowRequest
- `prop bool IsFloatingFallbackRequired`
- `prop string LeaseToken`

### class Tuanjie.Licensing.Ipc.Messages.ReturnBorrowResponse

### class Tuanjie.Licensing.Ipc.Messages.ReturnEntitlementGroupRequest
- `prop ICollection<string> EntitlementGroupIds`

### class Tuanjie.Licensing.Ipc.Messages.ReturnEntitlementGroupRequestV2
- `prop ICollection<string> EntitlementGroupIds`

### class Tuanjie.Licensing.Ipc.Messages.ReturnEntitlementGroupResponse
- `prop List<ReturnEntitlementGroupResult> ReturnEntitlementGroupResults`

### class Tuanjie.Licensing.Ipc.Messages.ReturnEntitlementGroupResult
- `prop string EntitlementGroupId`
- `IEnumerable<ReturnEntitlementGroupResult> ToIpcResult(IEnumerable<ResultWithCode<string>> returns)`

### class Tuanjie.Licensing.Ipc.Messages.ReturnEntitlementGroupResponseV2

### class Tuanjie.Licensing.Ipc.Messages.ReturnLicenseRequest
- `prop string AccessToken`

### class Tuanjie.Licensing.Ipc.Messages.ReturnLicenseResponse

### class Tuanjie.Licensing.Ipc.Messages.Seat
- `prop string SeatId`
- `prop string SubscriptionName`
- `prop string OrganizationId`
- `prop string OrganizationName`
- `prop string StartDate`
- `prop string EndDate`
- `prop long ActivationsLeft`
- `prop bool IsActivatedOnThisMachine`

### class Tuanjie.Licensing.Ipc.Messages.SeatManagementResult
- `prop string SeatId`

### class Tuanjie.Licensing.Ipc.Messages.SeatSelection
- `prop bool All`
- `prop ICollection<string> Ids`
- `SeatSelection AllSeats()`
- `SeatSelection FromSeats(params string[] seatIds)`

### class Tuanjie.Licensing.Ipc.Messages.SerialNumberValidationRequest
- `prop string Serial`

### class Tuanjie.Licensing.Ipc.Messages.SerialNumberValidationResponse
- `prop bool IsValid`

### class Tuanjie.Licensing.Ipc.Messages.ULFActivationRequest
- `prop string Serial`
- `prop bool ForceUpdateLicense`

### class Tuanjie.Licensing.Ipc.Messages.ULFActivationResponse

### class Tuanjie.Licensing.Ipc.Messages.UpdateLicenseRequest
- `prop string AccessToken`
- `prop string OrgId`
- `prop string ProjectId`
- `prop IEnumerable<LicenseTypes> LicenseTypes`
- `prop bool ForceUpdateLicense`

### enum Tuanjie.Licensing.Ipc.Messages.LicenseTypes

### class Tuanjie.Licensing.Ipc.Messages.UpdateLicenseRequestV2
- `prop string AccessToken`
- `prop string OrgId`
- `prop string ProjectId`
- `prop IEnumerable<LicenseTypes> LicenseTypes`
- `prop bool ForceUpdateLicense`

### class Tuanjie.Licensing.Ipc.Messages.UpdateLicenseResponse

### class Tuanjie.Licensing.Ipc.Messages.UpdateLicenseResponseV2


## Tuanjie.Licensing.Infrastructure.dll（13 个公共类型）

### class Tuanjie.Licensing.Infrastructure.CommonUtils
- `byte[] ComputeSHA1Hash(string stringToHash)`

### class Tuanjie.Licensing.Infrastructure.DateTimeExtensions
- `string ToIso(this DateTime date)`
- `string ToShortIso(this DateTime date)`
- `string ToDisplayLocal(this DateTime date)`
- `string ToIsoDiplay(this DateTime date)`
- `long ToUnixTimeMilliseconds(this DateTime date)`

### class Tuanjie.Licensing.Infrastructure.ProblemDetails
- `prop string Type`
- `prop string Title`
- `prop int Status`
- `prop string Detail`
- `prop string Instance`
- `prop IDictionary<string, object> Extensions`
- `string ToString()`

### class Tuanjie.Licensing.Infrastructure.Result
- `prop T Value`

### class Tuanjie.Licensing.Infrastructure.ResultWithCode
- `prop int Code`

### class Tuanjie.Licensing.Infrastructure.AggregatedResults
- `prop ICollection<Result<T>> Results`

### class Tuanjie.Licensing.Infrastructure.AggregatedResultsWithCode
- `AggregatedResultsWithCode<T> FromAggregateResult(AggregatedResults<T> aggregatedResults)`

### class Tuanjie.Licensing.Infrastructure.ResultExtensions
- `Result OnSuccess(this Result result, Func<Result> func)`
- `Task<Result> OnSuccessAsync(this Task<Result> inputTask, Func<Task<Result>> func)`
- `Result OnFailure(this Result result, Action<Result> action)`
- `Task<Result> OnFailureAsync(this Task<Result> inputTask, Func<Result, Task<Result>> func)`
- `bool HasError(this Result result, string error)`
- `AggregatedResults AnySuccess(this IEnumerable<Result> subResults, string errorMessage = null)`
- `bool AnyNonRetryable(this IEnumerable<Result> subResults)`

### class Tuanjie.Licensing.Infrastructure.XmlUtils
- `string SerializeToXml(object input)`
- `XmlDocument ConvertToXmlDoc(object input)`

### interface Tuanjie.Licensing.Infrastructure.FileSystem.IStreamWriterFactory

### class Tuanjie.Licensing.Infrastructure.FileSystem.XmlWriter
- `System.Xml.XmlWriter CreateXmlWriter(string path)`

### class Tuanjie.Licensing.Infrastructure.Enums.EnumDescriptionAttribute
- `prop string StringValue`

### class Tuanjie.Licensing.Infrastructure.Enums.EnumExtensions
- `string GetDescription(this Enum value)`


## Tuanjie.Licensing.Platform.dll（45 个公共类型）

### struct Tuanjie.Licensing.Platform.CloudEnvironmentName

### class Tuanjie.Licensing.Platform.CloudEnvironmentInfo
- `prop string Name`
- `prop string Extension`
- `prop string FullName`

### interface Tuanjie.Licensing.Platform.ICmdService

### class Tuanjie.Licensing.Platform.CmdProcessService
- `int RunInBash(string cmd, out string output)`

### class Tuanjie.Licensing.Platform.CommonUtils
- `string GetCurrentAssemblyProductVersion()`
- `string GetUserAgentFromEntryAssembly()`
- `string GetCurrentAssemblyFileVersion()`
- `bool IsHttpProtocol(string urlSchema)`
- `bool TryGetValidServiceUrl(string strServiceUrl, out Uri serviceUri)`
- `bool IsValidJson(string filePath)`
- `int RunInBash(string cmd, out string output)`
- `int RunInPowershellAsAdmin(string cmd, out string output)`
- `IEnumerable<string> GetMacAddresses()`
- `string FormatXmlUnEscape(string encoded)`
- `string GetUniqueFileName(string filePath)`

### enum Tuanjie.Licensing.Platform.ArchiveFormat

### class Tuanjie.Licensing.Platform.CompressionUtils
- `void ExtractTGZ(string gzArchiveName, string destinitionFolder)`
- `void ExtractZip(string zipArchiveName, string destinitionFolder)`

### class Tuanjie.Licensing.Platform.Constants

### class Tuanjie.Licensing.Platform.FileWriter
- `void Write(string path, string[] lines)`

### interface Tuanjie.Licensing.Platform.IRunningOptions

### class Tuanjie.Licensing.Platform.RunningOptions
- `prop bool DisableFileWatcher`
- `prop CloudEnvironmentInfo CurrentEnvironmentInfo`

### interface Tuanjie.Licensing.Platform.IRuntimeInfo

### class Tuanjie.Licensing.Platform.RuntimeInfo
- `prop bool IsWindows`
- `prop bool IsOSX`
- `prop bool IsLinux`
- `prop bool IsWindows10OrGreater`
- `prop string OSVersion`

### interface Tuanjie.Licensing.Platform.IServiceRegistration

### interface Tuanjie.Licensing.Platform.ISystemDateTimeProvider

### interface Tuanjie.Licensing.Platform.IWriter

### class Tuanjie.Licensing.Platform.JsonConfigurationData
- `void SetValue(string path, object value)`

### class Tuanjie.Licensing.Platform.PlatformHelper

### class Tuanjie.Licensing.Platform.NativeMethods

### class Tuanjie.Licensing.Platform.Access
- `extern uint getuid()`
- `extern int access(string pathname, int mode)`
- `string GetPipeFullPath(string pipeName)`
- `string GetServerPipePath(string pipeName)`
- `bool PipeIsAlreadyOpened(string pipeName)`
- `int? DropDirectoryOwnership(string directoryToUpdate)`
- `void EnsureNonAdminUserPermission(string filePath)`

### class Tuanjie.Licensing.Platform.MutexWaitingQueue
- `prop bool IsHoldingMutex`
- `void GetInQueue()`
- `bool IsUsed(string lockName)`
- `bool IsUsed()`
- `void Dispose()`
- `bool QuitAndCheckIfLast()`

### class Tuanjie.Licensing.Platform.OsxNativeBindings
- `extern int CreateLicenseDirectory(string str)`
- `extern int ExecuteWithPrivilege(string binPath, string[] arguments, int argCount)`

### interface Tuanjie.Licensing.Platform.IPlatformPermissionService

### class Tuanjie.Licensing.Platform.PlatformPermissionService
- `int? DropDirectoryOwnership(string directoryToUpdate)`
- `int CheckPosixFileAccess(string pathname, int mode)`
- `int OsxCreateLicenseDirectoryWithAccess(string path)`
- `int OsxExecuteWithPrivilege(string binPath, string[] arguments)`

### class Tuanjie.Licensing.Platform.SystemDateTimeProvider
- `DateTime UtcNow()`

### class Tuanjie.Licensing.Platform.WindowsAdvancedApi

### enum Tuanjie.Licensing.Platform.ServiceManagerRights
- `Connect = 1`
- `CreateService = 2`
- `EnumerateService = 4`
- `Lock = 8`
- `QueryLockStatus = 0x10`
- `ModifyBootConfig = 0x20`
- `StandardRightsRequired = 0xF0000`
- `AllAccess = StandardRightsRequired`

### struct Tuanjie.Licensing.Platform.SERVICE_DESCRIPTION

### enum Tuanjie.Licensing.Platform.ServiceRights
- `QueryConfig = 1`
- `ChangeConfig = 2`
- `QueryStatus = 4`
- `EnumerateDependants = 8`
- `Start = 0x10`
- `Stop = 0x20`
- `PauseContinue = 0x40`
- `Interrogate = 0x80`
- `UserDefinedControl = 0x100`
- `Delete = 0x10000`
- `StandardRightsRequired = 0xF0000`
- `AllAccess = StandardRightsRequired`

### class Tuanjie.Licensing.Platform.Windows.WindowsDirectoryAccessHelper
- `void AddDirectorySecurity(string directoryPath, SecurityIdentifier account, FileSystemRights rights, AccessControlType controlType)`
- `bool CheckDirectorySecurity(string directoryPath, SecurityIdentifier account, FileSystemRights rights, AccessControlType controlType)`

### class Tuanjie.Licensing.Platform.Windows.WindowsServiceInstallHelper
- `void InstallService(string serviceName, string binPath, string serviceDescription, string username = null, string userPassword = n)`
- `bool IsServiceInstalled(string serviceName)`

### class Tuanjie.Licensing.Platform.Windows.WindowsServiceRegistration
- `string Register(string serviceName, string serviceDescription, string serverExecutablePath)`
- `string GetCurrentUserName()`

### class Tuanjie.Licensing.Platform.Windows.WindowsUser
- `prop string Username`
- `prop string Password`
- `bool HasValidCredentials()`

### class Tuanjie.Licensing.Platform.SystemInfo.LicenseEncryption
- `extern string Encrypt([MarshalAs(UnmanagedType.I4)`
- `extern int Decrypt([MarshalAs(UnmanagedType.LPStr)`
- `extern string VerifyLicenseFiles([MarshalAs(UnmanagedType.LPStr)`

### class Tuanjie.Licensing.Platform.SystemInfo.LinuxSystemInformation

### class Tuanjie.Licensing.Platform.SystemInfo.OSXSystemInformation

### class Tuanjie.Licensing.Platform.SystemInfo.SystemInformation

### class Tuanjie.Licensing.Platform.SystemInfo.WindowsSystemInformation
- `bool MacAddressExists(string macAddr)`

### class Tuanjie.Licensing.Platform.Linux.LinuxServiceRegistration
- `string Register(string serviceName, string serviceDescription, string serverExecutablePath)`

### class Tuanjie.Licensing.Platform.FileSystem.StringExtentions
- `string AsNormalizedFileName(this string original, char replacementChar = '_')`

### class Tuanjie.Licensing.Platform.FileSystem.DirectoryWatcher
- `void Dispose()`

### class Tuanjie.Licensing.Platform.FileSystem.DirectoryUpdateEventArgs
- `prop IEnumerable<FileInfo> AddedFiles`
- `prop IEnumerable<FileInfo> UpdateFiles`
- `prop IEnumerable<string> DeletedFiles`

### class Tuanjie.Licensing.Platform.FileSystem.FileSystem
- `bool DirectoryExists(string path)`
- `void EnsureTuanjieCommonDirectoryFolderExistAndWritable()`
- `bool HasWriteAccess(string path)`
- `bool TrySetWritePermission(string path, out string errorMsg)`
- `DirectoryInfo DirectoryCreateDirectory(string path, bool elevatedPermission = false)`
- `IEnumerable<string> DirectoryEnumerateFiles(string path, string searchPattern, SearchOption searchOption)`
- `FileInfo FileGetInfo(string path)`
- `FileAttributes FileGetAttributes(string path)`
- `bool FileExists(string path)`
- `Stream FileOpenRead(string path)`
- `Task WriteAllTextAsync(string path, string text)`
- `void WriteAllText(string path, string text)`
- `void DeleteFile(string path)`
- `void DeleteDirectory(string path, bool recursive = true)`
- `void EnsureDirectoryPathToFile(string fullPath)`
- `void EnsureFile(string filePath, string fileContent)`
- `void CreateDirectory(string fullPath)`
- `void DirectoryReplace(string sourceDirPath, string destDirPath, bool copySubDirs, bool overrideFile)`
- `void CopyFile(string sourceFileName, string destFileName, bool overrideFile = false)`
- `void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs, bool overrideFile)`
- `IFileProvider GetFileProvider(string root, ExclusionFilters filers = ExclusionFilters.Sensitive)`
- `bool TryCopyFile(string copyFrom, string copyTo, out string errorMessage)`
- `delegate DateTime GetCurrentUtcDateTime()`

### interface Tuanjie.Licensing.Platform.FileSystem.IFileSystem

### class Tuanjie.Licensing.Platform.FileSystem.TuanjiePaths
- `prop string ServicesConfigurationFile`
- `prop string UserServicesConfigurationFile`
- `prop string LinuxExtraCommonPath`
- `prop string HubUserDirectory`
- `string GetCachedRemoteServicesConfigurationFilePath(string currentEnvironment = "production")`
- `string GetMutexPath(string mutexName)`


## Tuanjie.Licensing.Genesis.dll（44 个公共类型）

### class Tuanjie.Licensing.Genesis.DependencyInjection
- `IHttpClientBuilder ConfigureGenesisHttpClient(this IServiceCollection service)`
- `IServiceCollection AddGenesisClientFromConfig(this IServiceCollection services)`
- `IServiceCollection AddGenesisClient(this IServiceCollection services, IGenesisConfiguration configuration)`

### class Tuanjie.Licensing.Genesis.DynamicGenesisConfiguration

### interface Tuanjie.Licensing.Genesis.IGenesisClient

### class Tuanjie.Licensing.Genesis.GenesisClient

### class Tuanjie.Licensing.Genesis.Routes
- `Task<Result<UserInfo>> GetUserInfo(bool customizeHeader = false)`
- `Task<Result<UserIRSOptStatus>> GetIrsOptOutStatus(string userId, bool customizeHeader = false)`
- `Task<ResultWithCode<ActivationManagementResponse>> UpdateActivations(ActivationManagementRequest request)`
- `Task<ResultWithCode<Stream>> UpdateLicenses(UpdateLicenseRequest request, bool customizeHeader = false)`
- `Task<ResultWithCode<GetSeatsResponse>> GetSeats(GetSeatsRequest request)`
- `Task<ResultWithCode<LicenseResponse>> SendLicenseData(Stream license, LicenseCommand licenseCommand, string txId)`
- `Task<ResultWithCode<UlfLicenseTransactionResponse>> BeginUlfLicenseTransaction(UlfLicenseTransactionRequest request, string txId)`
- `Task<ResultWithCode<Stream>> GetUlfLicense(Stream license, LicenseCommand licenseCommand, string txId, string rxId, bool customizeHeader = false)`

### interface Tuanjie.Licensing.Genesis.IGenesisClientFactory

### class Tuanjie.Licensing.Genesis.GenesisClientFactory
- `IGenesisClient CreateFromLogin(string username, string password)`
- `IGenesisClient CreateFromToken(string token)`
- `IGenesisClient CreateFromTokenCache()`
- `IGenesisClient CreateFromAuthProvider(IAuthenticationTokenProvider provider)`

### class Tuanjie.Licensing.Genesis.GenesisConfiguration
- `prop string AuthenticationUrl`
- `prop string ClientId`
- `prop string ClientSecret`
- `prop string CoreBaseUrl`
- `prop string LicenseBaseUrl`
- `prop string ActivationBaseUrl`
- `prop string IdentityBaseUrl`

### class Tuanjie.Licensing.Genesis.HttpExtensions
- `Task SetJsonContent(this HttpRequestMessage request, object payload)`
- `Task<HttpContent> CreateJsonContent(object payload)`
- `void SetXmlContent(this HttpRequestMessage request, Stream contentStream)`
- `HttpContent CreateXmlHttpContent(Stream contentStream)`
- `UriBuilder SetOrAppendPath(this UriBuilder builder, string path)`

### interface Tuanjie.Licensing.Genesis.IGenesisConfiguration

### enum Tuanjie.Licensing.Genesis.LicenseCommand
- `UPDATE = 2`
- `RETURN = 3`
- `NEW = 9`

### class Tuanjie.Licensing.Genesis.TokenCacheManager
- `void AddOrUpdateToken(string key, AuthenticationToken token)`
- `bool TryGetToken(string key, out AuthenticationToken token)`
- `void RemoveToken(string key)`

### class Tuanjie.Licensing.Genesis.Models.ActivationManagementRequest
- `prop SeatSelection Activate`
- `prop SeatSelection Deactivate`
- `prop IDictionary<string, string> Context`

### class Tuanjie.Licensing.Genesis.Models.ActivationManagementResponse
- `prop ICollection<SeatManagementResult> Results`

### class Tuanjie.Licensing.Genesis.Models.ErrorMessage
- `prop Dictionary<string, string[]> Errors`
- `prop string[] FullMessages`

### class Tuanjie.Licensing.Genesis.Models.GetSeatsRequest
- `prop string orgId`

### class Tuanjie.Licensing.Genesis.Models.GetSeatsResponse
- `prop ICollection<Seat> Seats`

### class Tuanjie.Licensing.Genesis.Models.Survey
- `prop bool Answered`

### class Tuanjie.Licensing.Genesis.Models.LicenseResponse
- `prop Survey Survey`
- `prop string Rx`

### class Tuanjie.Licensing.Genesis.Models.LoginRequest
- `prop string GrantType`
- `prop string ClientId`
- `prop string ClientSecret`
- `prop string Username`
- `prop string Password`

### class Tuanjie.Licensing.Genesis.Models.Seat
- `prop string SeatId`
- `prop string SubscriptionName`
- `prop string OrganizationId`
- `prop string OrganizationName`
- `prop string StartDate`
- `prop string EndDate`
- `prop long ActivationsLeft`
- `prop string Namespace`
- `prop bool HasEditor`

### class Tuanjie.Licensing.Genesis.Models.SeatManagementResult
- `prop string SeatId`
- `prop int StatusCode`
- `prop string Message`

### class Tuanjie.Licensing.Genesis.Models.SeatManagementStatusCode

### class Tuanjie.Licensing.Genesis.Models.SeatSelection
- `prop bool All`
- `prop ICollection<string> Ids`
- `SeatSelection AllSeats()`
- `SeatSelection FromSeats(params string[] seatIds)`

### class Tuanjie.Licensing.Genesis.Models.UlfLicenseTransactionRequest

### class Tuanjie.Licensing.Genesis.Models.TransactionData
- `prop SurveyAnswer SurveyAnswer`
- `prop LicenseInfo LicenseInfo`

### class Tuanjie.Licensing.Genesis.Models.SurveyAnswer
- `prop bool Skipped`

### class Tuanjie.Licensing.Genesis.Models.LicenseInfo
- `prop string Type`

### class Tuanjie.Licensing.Genesis.Models.PersonalLicense

### class Tuanjie.Licensing.Genesis.Models.ProLicense
- `prop string SerialNumber`
- `prop TransactionData Transaction`
- `UlfLicenseTransactionRequest ForPersonalLicense()`
- `UlfLicenseTransactionRequest ForProLicense(string serialNumber)`

### class Tuanjie.Licensing.Genesis.Models.UlfLicenseTransactionResponse

### class Tuanjie.Licensing.Genesis.Models.ResponseTransaction

### class Tuanjie.Licensing.Genesis.Models.TransactionSurvey
- `prop Uri Url`
- `prop bool Required`
- `prop bool Answered`
- `prop string Rx`
- `prop Survey Survey`
- `prop ResponseTransaction Transaction`
- `prop string Id`
- `prop string MachineId`
- `prop string SerialId`
- `prop string UnityVersion`
- `prop bool SurveyAnswer`

### class Tuanjie.Licensing.Genesis.Models.UpdateLicenseRequest
- `prop Dictionary<string, string> Context`

### struct Tuanjie.Licensing.Genesis.Models.UpdateLicenseStatusCode

### class Tuanjie.Licensing.Genesis.Models.UserInfo
- `prop string ForeignKey`
- `prop string Name`
- `prop string Email`
- `prop string PrimaryOrg`
- `prop string Identifier`
- `prop string CreatedAt`

### class Tuanjie.Licensing.Genesis.Models.UserIRSOptStatus
- `prop bool OptOutStatus`

### class Tuanjie.Licensing.Genesis.Authentication.AuthenticationToken
- `prop string AccessToken`
- `prop string TokenType`
- `prop int ExpiresIn`
- `prop string RefreshToken`
- `prop string UserId`
- `prop DateTime Issued`

### interface Tuanjie.Licensing.Genesis.Authentication.IAuthProviderFactory

### class Tuanjie.Licensing.Genesis.Authentication.AuthProviderFactory
- `IAuthenticationTokenProvider CreateFromLogin(string username, string password)`
- `IAuthenticationTokenProvider CreateFromToken(string token)`
- `IAuthenticationTokenProvider CreateFromTokenCacheManager()`

### class Tuanjie.Licensing.Genesis.Authentication.CacheTokenProvider
- `Task<Result<AuthenticationToken>> GetAuthToken()`
- `void ClearAuthToken()`

### class Tuanjie.Licensing.Genesis.Authentication.ExternalTokenProvider
- `Task<Result<AuthenticationToken>> GetAuthToken()`
- `void ClearAuthToken()`

### interface Tuanjie.Licensing.Genesis.Authentication.IAuthenticationTokenProvider

### class Tuanjie.Licensing.Genesis.Authentication.PasswordUsernameAuthenticationTokenProvider
- `Task<Result<AuthenticationToken>> GetAuthToken()`
- `void ClearAuthToken()`


## Tuanjie.Licensing.EntitlementResolver.dll（157 个公共类型）

### class Tuanjie.Licensing.EntitlementResolver.ArtEngineEntitlements

### class Tuanjie.Licensing.EntitlementResolver.CompositeResolver
- `prop IList<IResolver> ChildResolvers`
- `bool HasEntitlementGroups()`
- `ISet<string> GetWhiteListFeatures()`
- `ISet<string> GetAllowedProjects()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroups()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroupsValidInContext()`
- `IEnumerable<string> GetPath()`
- `DateTime GetLatestUpdateTime()`
- `DateTime GetLastLicenseExpirationTime(ISet<string> entIds)`

### class Tuanjie.Licensing.EntitlementResolver.ContextValidation

### struct Tuanjie.Licensing.EntitlementResolver.BindingMismatch
- `prop string Key`
- `prop string ContextValue`
- `prop string LicenseValue`
- `prop IList<BindingMismatch> BindingMismatches`
- `prop bool NoKeyInLicenseContext`
- `prop bool NoLicenseContextKeySupported`
- `prop bool IsLegacyMachineBindingFailedValidation`
- `prop bool IsNonLegacyMachineBindingRelatedFailedValidation`
- `void AddError(string key, string contextValue, string licenseValue)`
- `void SetLegacyFail()`
- `void SetNonLegacyFail()`
- `void SetNoLicenseContextKeySupported(Dictionary<string, string> licenseContext)`
- `void SetNoKeyInLicenseContext(bool emptyContext)`

### interface Tuanjie.Licensing.EntitlementResolver.IContextValidator

### class Tuanjie.Licensing.EntitlementResolver.ContextValidator
- `ContextValidation GetContextValidation(IEntitlementGroup contextBoundData)`
- `bool IsValidInContext(IContextBoundData contextBoundData, ContextValidation contextValidation = null)`
- `void ComputeValidationErrors(IEntitlementGroup entitlementGroup)`
- `bool AreEqual(string a, string b)`

### class Tuanjie.Licensing.EntitlementResolver.EditorDefaultReturnEntitlements

### class Tuanjie.Licensing.EntitlementResolver.EditorEntitlements

### class Tuanjie.Licensing.EntitlementResolver.EntitlementConstants

### enum Tuanjie.Licensing.EntitlementResolver.EntitlementGroupError

### interface Tuanjie.Licensing.EntitlementResolver.IContextBoundData

### interface Tuanjie.Licensing.EntitlementResolver.IEntitlementGroup

### class Tuanjie.Licensing.EntitlementResolver.IndustryEntitlements

### interface Tuanjie.Licensing.EntitlementResolver.IResolver

### interface Tuanjie.Licensing.EntitlementResolver.ILicensePublicKeyCertificateStore

### class Tuanjie.Licensing.EntitlementResolver.LicensePublicKeyCertificateStore
- `X509Certificate2 LoadEmbeddedCertificate(string path, string password = null)`
- `void Dispose()`

### class Tuanjie.Licensing.EntitlementResolver.ManualResolver
- `void AddEntitlementGroup(IEntitlementGroup entitlementGroup)`
- `bool HasEntitlementGroups()`
- `ISet<string> GetWhiteListFeatures()`
- `ISet<string> GetAllowedProjects()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroups()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroupsValidInContext()`
- `void ClearEntitlementGroups()`
- `IEnumerable<string> GetPath()`
- `DateTime GetLatestUpdateTime()`
- `DateTime GetLastLicenseExpirationTime(ISet<string> entIds)`

### class Tuanjie.Licensing.EntitlementResolver.Xml.CollectionExtensions

### class Tuanjie.Licensing.EntitlementResolver.Xml.XmlConstants

### class Tuanjie.Licensing.EntitlementResolver.Xml.XmlExtensions
- `void SignXml(this XmlDocument xmlDoc, X509Certificate2 certificate, string refId = "Terms", bool includePublicKey = false)`
- `XmlElement GenerateXmlSignature(this XmlDocument xmlDoc, X509Certificate2 certificate, string refId, bool includePublicKey = false)`
- `void ValidateSignature(this XmlDocument xmlDoc, X509Certificate2 trustedCertificate, bool allowDelegation = false, string refId = "Te)`
- `bool HasSignatureElement(this XmlDocument xmlDoc)`
- `bool TryGetValidDelegation(this XmlDocument licenseXml, X509Certificate2 trustedCertificate, out SigningDelegationData delegation)`
- `XmlElement GetSignatureByReferenceId(this XmlDocument licenseXml, string referenceId)`
- `string GetPublicKeyBase64(this X509Certificate2 certificate)`
- `Task SaveWithoutSelfClosingTagSpaces(this XmlDocument xmlDoc, Stream destination)`
- `bool TryAppendExternalChild(this XmlElement destination, XmlDocument source, string xpath)`

### class Tuanjie.Licensing.EntitlementResolver.Xml.XmlReader
- `prop bool PreserveWhitespace`
- `T Read(Stream stream, bool requireSignature, bool validateSchema)`

### class Tuanjie.Licensing.EntitlementResolver.Xml.XmlSchemaValidator
- `prop bool AllowDelegation`
- `void AddSchema(XmlSchema schema)`
- `void ValidateSchema(XmlDocument xmlDoc)`
- `void ValidateSignature(XmlDocument xmlDoc)`

### class Tuanjie.Licensing.EntitlementResolver.Ulf.EntitlementMappingAttribute
- `prop string EntitlementName`

### class Tuanjie.Licensing.EntitlementResolver.Ulf.UlfLicense
- `prop string Ns`
- `prop string Tag`
- `prop string Type`
- `prop DateTime? ValidTo`
- `prop string SerialRaw`
- `prop string SerialMasked`
- `prop string SerialHash`
- `prop bool NoHardwareCheck`
- `prop DateTime? StartDate`
- `prop DateTime? StopDate`
- `prop DateTime? UpdateDate`
- `prop DateTime? LastActivationDate`
- `prop string Path`
- `prop string FinalizeController`
- `prop DateTime LastUpdateTime`
- `prop ISet<int> LicenseFlags`
- `prop ISet<IUlfEntitlement> UlfEntitlements`
- `prop string TimeStamp`
- `prop string TimeStamp2`
- `UlfLicense Parse(string ulfFilePath, X509Certificate2 signingCert)`

### interface Tuanjie.Licensing.EntitlementResolver.Ulf.IUlfEntitlement

### class Tuanjie.Licensing.EntitlementResolver.Ulf.UlfLicenseEntitlementGroup
- `prop string Identifier`
- `prop string IdentifierHash`
- `prop string Path`
- `prop DateTime LastUpdateTime`
- `prop IEnumerable<Tuanjie.Licensing.EntitlementResolver.License.Entitlement> Entitlements`
- `prop LicenseType? LicenseType`
- `prop string ProductName`
- `prop string ProductType`
- `prop string FinalizeController`
- `prop IList<EntitlementGroupError> ValidationErrors`
- `prop IList<string> AllowedProjects`
- `prop IList<string> WhiteListFeatures`
- `prop IEnumerable<KeyValuePair<string, string>> RequiredContext`
- `prop DateTime? ValidFrom`
- `prop DateTime? ValidTo`
- `prop DateTime? SubscriptionEndDate`
- `prop DateTime? UpdateDate`
- `prop DateTime? LastActivationDate`
- `bool IdentifierEquals(string otherIdentifier)`
- `string ToString()`
- `bool IsUpdateDateExpired()`

### class Tuanjie.Licensing.EntitlementResolver.Ulf.UlfLicenseExtensions
- `IEnumerable<UlfLicenseFeatures> GetLicenseFeatures(this UlfLicense license)`
- `IEnumerable<Tuanjie.Licensing.EntitlementResolver.License.Entitlement> ToEntitlements(this IEnumerable<UlfLicenseFeatures> features)`
- `ISet<string> ToEntitlements(this UlfLicenseFeatures features)`
- `DateTime? ParseDate(this StringValue stringValue)`

### enum Tuanjie.Licensing.EntitlementResolver.Ulf.UlfLicenseFeatures
- `UnityPro = 0`
- `TeamLicense = 2`
- `IPhoneBasic = 3`
- `IPhonePro = 4`
- `PSP2 = 9`
- `AndroidBasic = 12`
- `AndroidPro = 13`
- `Embedded = 16`
- `WinRtBasic = 19`
- `WinRtPro = 20`
- `PS4 = 21`
- `XboxOne = 22`
- `ClusterRendering = 30`
- `Nintendo3Ds = 39`
- `Pzazz = 40`
- `HMIAndroid = 41`
- `HMIQnx = 42`
- `HMILinux = 43`
- `OpenHarmony = 44`
- `AllowMixUsage = 45`
- `BuildForArmLinux = 46`
- `CompliantUnity = 47`
- `NoWatermark = 60`
- `PrototypingWatermark = 61`
- `UnityFree = 62`
- `EduWatermark = 63`
- `Trial = 64`
- `UnityForSmallThings = 65`
- `BuildForMiniGame = 243`
- `ForceDisableWatermark = 244`
- `ForceGuidEncryption = 245`
- `BuildForArmLinuxDedicatedServer = 246`
- `DisableOpenHarmonyAnalytics = 247`
- `DisableMiniGameAnalytics = 248`
- `AllowCADToolKit = 250`
- `AllowCADStuido = 251`
- `AllowCADScenario = 252`
- `AllowCADUMT = 253`
- `AllowLiveLinkConnector = 254`
- `AllowAssetManager = 255`
- `LastActivationDate = 256`
- `SubplatformWechat = 257`
- `SubplatformMinihost = 258`
- `SubplatformTaptap = 259`
- `SubplatformDouyin = 260`
- `SubplatformKuaishou = 261`
- `SubplatformXiaomi = 262`
- `ExpirationTime2Day = 263`
- `ExpirationTime7Day = 264`
- `DisableWechatSubplatformWatermark = 265`
- `DisableMinihostSubplatformWatermark = 266`
- `DisableTaptapSubplatformWatermark = 267`
- `DisableDouyinSubplatformWatermark = 268`
- `DisableKuaishouSubplatformWatermark = 269`
- `DisableXiaomiSubplatformWatermark = 270`
- `AllowIndustrialCloudRendering = 271`
- `EnablePlayableAdsWatermark = 272`
- `BuildForSubplatformMetaapp233 = 273`
- `DisableMetaapp233SubplatformWatermark = 274`
- `EnableAndroidAnalytics = 275`
- …另有 4 个成员

### class Tuanjie.Licensing.EntitlementResolver.Ulf.UlfLicenseResolver
- `prop UlfLicense License`
- `bool HasEntitlementGroups()`
- `ISet<string> GetWhiteListFeatures()`
- `ISet<string> GetAllowedProjects()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroups()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroupsValidInContext()`
- `IEnumerable<string> GetPath()`
- `DateTime GetLatestUpdateTime()`
- `DateTime GetLastLicenseExpirationTime(ISet<string> entIds)`

### class Tuanjie.Licensing.EntitlementResolver.Package.PackageAccessControlListExtensions
- `Version GetVersion(this PackageAccessControlList pacl)`
- `bool IsExpired(this PackageAccessControlList pacl)`
- `PackageAccessControlList LicensedPackagesIdToLower(this PackageAccessControlList pacl)`

### interface Tuanjie.Licensing.EntitlementResolver.Package.Xml.IPackagesXmlReader

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.PackagesXmlReader
- `PackageAccessControlList Read(Stream stream, bool requireSignature = true, bool validateSchema = false)`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.PackagesXmlSchemaValidator

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.PackagesXmlWriter
- `string RemoveBOM(string xml)`
- `void WriteToStream(this PackageAccessControlList packageAccessControlList, X509Certificate2 signingCertificate, Stream stream)`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.PackagesCombiner
- `void Add(this PackageAccessControlList sourcePackage, PackageAccessControlList toAdd)`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SignatureType
- `prop SignedInfoType SignedInfo`
- `prop SignatureValueType SignatureValue`
- `prop KeyInfoType KeyInfo`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SignedInfoType
- `prop CanonicalizationMethodType CanonicalizationMethod`
- `prop SignatureMethodType SignatureMethod`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.CanonicalizationMethodType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SignatureMethodType
- `prop string HMACOutputLength`
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.ReferenceType
- `prop DigestMethodType DigestMethod`
- `prop byte[] DigestValue`
- `prop string Id`
- `prop string URI`
- `prop string Type`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.TransformsType

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.TransformType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.DigestMethodType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SignatureValueType
- `prop byte[] Value`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.KeyInfoType
- `prop string Id`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.KeyValueType
- `prop DSAKeyValueType DSAKeyValue`
- `prop RSAKeyValueType RSAKeyValue`
- `prop XmlElement Any`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.DSAKeyValueType
- `prop byte[] P`
- `prop byte[] Q`
- `prop byte[] G`
- `prop byte[] Y`
- `prop byte[] J`
- `prop byte[] Seed`
- `prop byte[] PgenCounter`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.RSAKeyValueType
- `prop byte[] Modulus`
- `prop byte[] Exponent`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.RetrievalMethodType
- `prop string URI`
- `prop string Type`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.X509DataType

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.X509IssuerSerialType
- `prop string X509IssuerName`
- `prop string X509SerialNumber`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.PGPDataType
- `prop byte[] PGPKeyID`
- `prop byte[] PGPKeyPacket`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SPKIDataType

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.ObjectType
- `prop string Id`
- `prop string MimeType`
- `prop string Encoding`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.ManifestType
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SignaturePropertiesType
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.SignaturePropertyType
- `prop string Target`
- `prop string Id`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.PackageAccessControlList
- `prop string Version`
- `prop DateTime Expiration`
- `prop bool ExpirationSpecified`
- `prop ulong Revision`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.PackageAccessControlListLicensedPackages

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.Package
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.Package.Xml.Schema.Root
- `prop PackageAccessControlList PackageAccessControlList`
- `prop SignatureType Signature`

### class Tuanjie.Licensing.EntitlementResolver.License.Entitlement
- `prop string Identifier`
- `prop int Count`
- `prop XmlElement CustomData`
- `bool Equals(object obj)`
- `int GetHashCode()`
- `string ToString()`

### class Tuanjie.Licensing.EntitlementResolver.License.ResolverExtensions
- `IReadOnlyCollection<Entitlement> FindActiveEntitlements(this IResolver resolver, params string[] entitlements)`
- `IReadOnlyCollection<Entitlement> FindEntitlements(this IEntitlementGroup group, params string[] entitlements)`
- `IReadOnlyCollection<Entitlement> FindEntitlements(this IEntitlementGroup group, ISet<string> entitlements = null)`
- `bool IsProductEntitlement(this IResolver resolver, string entitlement)`
- `bool IsEditorEntitlement(this IResolver resolver, string entitlement)`
- `Entitlement ToEntitlement(this Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.Entitlement xmlEntitlement)`
- `bool IsCurrentlyActive(this IResolver resolver)`
- `IEnumerable<IEntitlementGroup> GetAllActiveEntitlementGroupsValidInContext(this IResolver resolver, DateTime utcTime)`
- `IEnumerable<string> GetAllEntitlementGroupIds(this IResolver resolver)`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroupsValidInContextByType(this IResolver resolver, LicenseType licenseType)`

### class Tuanjie.Licensing.EntitlementResolver.License.Revocation
- `prop string RevocationId`
- `prop string Reason`
- `bool Equals(object obj)`
- `int GetHashCode()`

### class Tuanjie.Licensing.EntitlementResolver.License.TuanjieLicense
- `prop string Path`
- `prop IEnumerable<TuanjieLicenseEntitlementGroup> EntitlementGroups`
- `prop IEnumerable<Revocation> Revocations`
- `prop LicenseType LicenseType`
- `prop ProductType ProductType`
- `prop string LeaseToken`
- `TuanjieLicense GetServerLicense(string licenseFilePath, X509Certificate2 lsdCert)`
- `TuanjieLicense GetEntitlementLicense(string licenseFilePath, X509Certificate2 tuanjiePublicCert)`
- `TuanjieLicense GetLicense(string licenseFilePath, X509Certificate2 lsdCert)`

### class Tuanjie.Licensing.EntitlementResolver.License.TuanjieLicenseEntitlementGroup
- `prop string Path`
- `prop DateTime LastUpdateTime`
- `prop DateTime? ValidFrom`
- `prop DateTime? UpdateDate`
- `prop DateTime? ValidTo`
- `prop DateTime? SubscriptionEndDate`
- `prop DateTime? LastActivationDate`
- `prop string Identifier`
- `prop string IdentifierHash`
- `prop IEnumerable<Entitlement> Entitlements`
- `prop IEnumerable<KeyValuePair<string, string>> RequiredContext`
- `prop string LeaseToken`
- `prop LicenseType? LicenseType`
- `prop string ProductName`
- `prop string ProductType`
- `prop string? FinalizeController`
- `prop IList<EntitlementGroupError> ValidationErrors`
- `prop IList<string> AllowedProjects`
- `prop IList<string> WhiteListFeatures`
- `bool Equals(TuanjieLicenseEntitlementGroup other)`
- `bool Equals(object obj)`
- `int GetHashCode()`
- `string ToString()`
- `bool IsValidAt(DateTime utcTime)`

### class Tuanjie.Licensing.EntitlementResolver.License.TuanjieLicenseResolver
- `bool HasEntitlementGroups()`
- `ISet<string> GetWhiteListFeatures()`
- `ISet<string> GetAllowedProjects()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroups()`
- `IEnumerable<IEntitlementGroup> GetAllEntitlementGroupsValidInContext()`
- `IEnumerable<string> GetPath()`
- `DateTime GetLatestUpdateTime()`
- `DateTime GetLastLicenseExpirationTime(ISet<string> entIds)`

### class Tuanjie.Licensing.EntitlementResolver.License.Extensions.LeaseTypeExtensions
- `LicenseType? ToLicenseType(this LeaseType leaseType)`
- `LeaseType? ToLeaseType(this LicenseType licenseType)`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.UlfXmlReader
- `UlfLicenseXml Read(Stream ulfStream, bool requireSignature = true, bool validateSchema = false)`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.LicenseXmlReader
- `Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.License Read(Stream licenseStream, bool requireSignature = true, bool validateSchema = false)`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.LicenseXmlSchemaValidator

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.LicenseXmlWriter
- `void WriteToStream(this Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.License license, X509Certificate2 signingCertifi)`
- `void WriteToStreamWithDelegation(this Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.License license, X509Certificate2 signingCertifi)`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.SigningDelegationData
- `prop XmlElement SigningDelegationXmlElement`
- `prop SigningDelegation Delegation`
- `prop XmlElement Signature`
- `prop string Error`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.SigningDelegationXmlReader
- `SigningDelegation ReadSigningDelegation(Stream delegationStream, bool requireSignature = true)`
- `ServerRegistrationRequest ReadRegistrationRequest(Stream registrationRequestStream)`
- `SigningDelegationData ReadSigningDelegationData(Stream delegationStream, bool requireSignature = true)`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.SigningDelegationXmlSchemaValidator

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.SigningDelegationXmlWriter
- `void WriteToStream(this SigningDelegation delegation, X509Certificate2 signingCertificate, Stream stream)`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SchemaUtility

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SigningDelegation
- `prop DateTime? UpdateDate`
- `prop string Path`
- `prop string OrganizationId`
- `prop DateTime DelegationStart`
- `prop DateTime DelegationEnd`
- `prop DateTime? DelegationInitDate`
- `prop bool DelegationInitDateSpecified`
- `prop bool? AllowDelegationReInit`
- `prop bool AllowDelegationReInitSpecified`
- `prop int? MaxLicenseServerProjectCount`
- `prop bool MaxLicenseServerProjectCountSpecified`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SignatureType
- `prop SignedInfoType SignedInfo`
- `prop SignatureValueType SignatureValue`
- `prop KeyInfoType KeyInfo`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SignedInfoType
- `prop CanonicalizationMethodType CanonicalizationMethod`
- `prop SignatureMethodType SignatureMethod`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.CanonicalizationMethodType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SignatureMethodType
- `prop string HMACOutputLength`
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ReferenceType
- `prop DigestMethodType DigestMethod`
- `prop byte[] DigestValue`
- `prop string Id`
- `prop string URI`
- `prop string Type`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.TransformsType

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.TransformType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.DigestMethodType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SignatureValueType
- `prop byte[] Value`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.KeyInfoType
- `prop string Id`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.KeyValueType
- `prop DSAKeyValueType DSAKeyValue`
- `prop RSAKeyValueType RSAKeyValue`
- `prop XmlElement Any`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.DSAKeyValueType
- `prop byte[] P`
- `prop byte[] Q`
- `prop byte[] G`
- `prop byte[] Y`
- `prop byte[] J`
- `prop byte[] Seed`
- `prop byte[] PgenCounter`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.RSAKeyValueType
- `prop byte[] Modulus`
- `prop byte[] Exponent`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.RetrievalMethodType
- `prop string URI`
- `prop string Type`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.X509DataType

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.X509IssuerSerialType
- `prop string X509IssuerName`
- `prop string X509SerialNumber`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.PGPDataType
- `prop byte[] PGPKeyID`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SPKIDataType

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ObjectType
- `prop string Id`
- `prop string MimeType`
- `prop string Encoding`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ManifestType
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SignaturePropertiesType
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.SignaturePropertyType
- `prop string Target`
- `prop string Id`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.Context
- `prop DateTime? StartDate`
- `prop DateTime? EndDate`
- `prop DateTime? UpdateDate`
- `prop bool UpdateDateSpecified`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ContextIdentifiers

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.Identifier
- `prop string Type`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ContextWithoutDates

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ContextWithoutDatesIdentifiers

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.Entitlement
- `prop XmlElement Any`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.EntitlementGroup
- `prop DateTime? LastActivationDate`
- `prop bool LastActivationDateSpecified`
- `prop Context Context`
- `prop string Id`
- `prop string Product`
- `prop string ProductType`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.EntitlementGroupEntitlements

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.Revoke
- `prop string Id`
- `prop string Reason`

### enum Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.LicenseType

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.License
- `prop string LeaseToken`
- `prop string Id`
- `prop string Version`
- `prop DateTime IssueDate`
- `prop bool IssueDateSpecified`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.LicenseAllowedProjects

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.LicenseWhiteListFeatures

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.LicenseEntitlementGroups

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.LicenseRevocations

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.ServerRegistrationRequest
- `prop string ServerId`
- `prop ContextWithoutDates Context`
- `prop string DelegatedKey`
- `prop string ServerVersion`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.Root
- `prop License License`
- `prop SigningDelegation SigningDelegation`

### class Tuanjie.Licensing.EntitlementResolver.License.Xml.Schema.LicenseSigningDelegation
- `prop SigningDelegation SigningDelegation`
- `prop SignatureType Signature`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.UlfLicenseXml
- `void SetSystemInfo(IContextProvider contextProvider, string userName, string tuanjieVersion)`
- `XmlDocument ToXmlDocument()`
- `Task Save(Stream destination)`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.UlfLicenseXmlSchemaValidator

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SignatureType
- `prop SignedInfoType SignedInfo`
- `prop SignatureValueType SignatureValue`
- `prop KeyInfoType KeyInfo`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SignedInfoType
- `prop CanonicalizationMethodType CanonicalizationMethod`
- `prop SignatureMethodType SignatureMethod`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.CanonicalizationMethodType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SignatureMethodType
- `prop string HMACOutputLength`
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.ReferenceType
- `prop DigestMethodType DigestMethod`
- `prop byte[] DigestValue`
- `prop string Id`
- `prop string URI`
- `prop string Type`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.TransformsType

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.TransformType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.DigestMethodType
- `prop string Algorithm`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SignatureValueType
- `prop byte[] Value`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.KeyInfoType
- `prop string Id`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.KeyValueType
- `prop DSAKeyValueType DSAKeyValue`
- `prop RSAKeyValueType RSAKeyValue`
- `prop XmlElement Any`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.DSAKeyValueType
- `prop byte[] P`
- `prop byte[] Q`
- `prop byte[] G`
- `prop byte[] Y`
- `prop byte[] J`
- `prop byte[] Seed`
- `prop byte[] PgenCounter`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.RSAKeyValueType
- `prop byte[] Modulus`
- `prop byte[] Exponent`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.RetrievalMethodType
- `prop string URI`
- `prop string Type`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.X509DataType

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.X509IssuerSerialType
- `prop string X509IssuerName`
- `prop string X509SerialNumber`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.PGPDataType
- `prop byte[] PGPKeyID`
- `prop byte[] PGPKeyPacket`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SPKIDataType

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.ObjectType
- `prop string Id`
- `prop string MimeType`
- `prop string Encoding`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.ManifestType
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SignaturePropertiesType
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SignaturePropertyType
- `prop string Target`
- `prop string Id`
- `prop string[] Text`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.SystemInfo
- `prop string IsoCode`
- `prop string UserName`
- `prop string OperatingSystem`
- `prop string OperatingSystemNumeric`
- `prop string ProcessorType`
- `prop string ProcessorCount`
- `prop string PhysicalMemoryMB`
- `prop string ComputerName`
- `prop string ComputerModel`
- `prop string ProductName`
- `prop string ProductVersion`
- `prop string UnityVersion`
- `prop string SupportedLicenseVersion`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.License
- `prop StringValue MachineID`
- `prop ContextWithoutDates Context`
- `prop StringValue UnityVersion`
- `prop StringValue SerialHash`
- `prop StringValue DeveloperData`
- `prop StringValue SerialMasked`
- `prop StringValue StartDate`
- `prop StringValue StopDate`
- `prop StringValue UpdateDate`
- `prop DateTimeValue InitialActivationDate`
- `prop StringValue LicenseVersion`
- `prop StringValue ClientProvidedVersion`
- `prop StringValue AlwaysOnline`
- `prop StringValue FinalizeController`
- `prop BooleanValue NoHardwareCheck`
- `prop DateTimeValue LastActivationDate`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.MachineBindings

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.Binding
- `prop int Key`
- `prop string Value`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.StringValue
- `prop string Value`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.ContextWithoutDates

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.ContextWithoutDatesIdentifiers

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.Identifier
- `prop string Type`
- `prop string Id`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.Features

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.IntValue
- `prop int Value`
- `prop bool ValueSpecified`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.DateTimeValue
- `prop DateTime Value`
- `prop bool ValueSpecified`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.LicenseEntitlements

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.Entitlement
- `prop string Ns`
- `prop string Tag`
- `prop string Type`
- `prop DateTime ValidTo`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.BooleanValue
- `prop bool Value`
- `prop bool ValueSpecified`

### class Tuanjie.Licensing.EntitlementResolver.ActivationLicenseFile.Xml.Schema.Root
- `prop StringValue TimeStamp`
- `prop StringValue TimeStamp2`
- `prop SystemInfo SystemInfo`
- `prop License License`
- `prop SignatureType Signature`


## Tuanjie.Licensing.EntitlementContext.dll（15 个公共类型）

### class Tuanjie.Licensing.EntitlementContext.ActiveDirectoryUserIdentityContextProvider
- `prop Guid ContextId`
- `bool TryGetValue(string key, out string value)`

### class Tuanjie.Licensing.EntitlementContext.CachedContextProvider
- `bool TryGetValue(string key, out string value)`
- `void Dispose()`

### class Tuanjie.Licensing.EntitlementContext.CompositeContextProvider
- `prop Guid ContextId`
- `prop IList<IContextProvider> ChildProviders`
- `bool TryGetValue(string key, out string value)`
- `void Dispose()`

### class Tuanjie.Licensing.EntitlementContext.ContextProviderException

### class Tuanjie.Licensing.EntitlementContext.ContextProviderExtensions
- `string GetValue(this IContextProvider provider, string key)`
- `string GetValueOrNull(this IContextProvider provider, string key)`
- `IDictionary<string, string> Dump(this IContextProvider provider)`
- `IContextProvider WithCaching(this IContextProvider provider, TimeSpan? invalidationPeriodMs = null)`
- `string GetMachineId(this IContextProvider context, IRuntimeInfo runtimeInfo = null)`
- `string GetMachineId2(this IContextProvider context)`

### class Tuanjie.Licensing.EntitlementContext.EnvironmentContextProvider
- `prop Guid ContextId`
- `bool TryGetValue(string key, out string value)`

### interface Tuanjie.Licensing.EntitlementContext.IContextProvider

### interface Tuanjie.Licensing.EntitlementContext.IDisposableContextProvider

### class Tuanjie.Licensing.EntitlementContext.ManualContextProvider
- `prop IDictionary<string, string> Entries`
- `prop Guid ContextId`
- `void Add(string key, string value)`
- `bool TryGetValue(string key, out string value)`
- `IEnumerator GetEnumerator()`

### class Tuanjie.Licensing.EntitlementContext.SystemInfo.SystemInformationContextProvider
- `prop Guid ContextId`
- `bool TryGetValue(string key, out string value)`

### interface Tuanjie.Licensing.EntitlementContext.LegacyLicense.ILegacyMachineBindings

### class Tuanjie.Licensing.EntitlementContext.LegacyLicense.LegacyMachineBindingsContextProvider
- `prop Guid ContextId`
- `LegacyMachineBindingsContextProvider FromRuntimeInfo(IRuntimeInfo runtimeInfo)`
- `bool TryGetValue(string key, out string value)`

### class Tuanjie.Licensing.EntitlementContext.LegacyLicense.LinuxLegacyMachineBindings

### class Tuanjie.Licensing.EntitlementContext.LegacyLicense.OSXLegacyMachineBindings

### class Tuanjie.Licensing.EntitlementContext.LegacyLicense.WindowsLegacyMachineBindings
- `string FlipAndCodeBytes(string uncoded)`
- `string Base64Encode(string plainText)`


## Tuanjie.Licensing.Server.Shared.dll（28 个公共类型）

### struct Tuanjie.Licensing.Server.Shared.Constants
- `prop TimeSpan ServerTimeOutOfSyncLimit`

### enum Tuanjie.Licensing.Server.Shared.LeaseType

### enum Tuanjie.Licensing.Server.Shared.ProductType

### class Tuanjie.Licensing.Server.Shared.Routes

### class Tuanjie.Licensing.Server.Shared.License

### class Tuanjie.Licensing.Server.Shared.Parts
- `string ResolveRoute(string route, string routeParam, object routeValue)`

### class Tuanjie.Licensing.Server.Shared.Params

### class Tuanjie.Licensing.Server.Shared.QueryParams

### class Tuanjie.Licensing.Server.Shared.Report

### class Tuanjie.Licensing.Server.Shared.Audit

### class Tuanjie.Licensing.Server.Shared.Admin

### class Tuanjie.Licensing.Server.Shared.AuditReport

### class Tuanjie.Licensing.Server.Shared.LeaseManagement

### class Tuanjie.Licensing.Server.Shared.Toolsets

### class Tuanjie.Licensing.Server.Shared.Activation

### enum Tuanjie.Licensing.Server.Shared.Storage.Audit.AuditActionTypes

### interface Tuanjie.Licensing.Server.Shared.Storage.Audit.IReadOnlyAuditStorage

### class Tuanjie.Licensing.Server.Shared.Plugin.PluginAttribute

### class Tuanjie.Licensing.Server.Shared.Paging.PagedResult
- `prop int PageIndex`
- `prop IEnumerable<T> Items`
- `prop PagedResult<T> Empty`

### class Tuanjie.Licensing.Server.Shared.Contracts.ClientContext
- `prop IDictionary<string, string> EntitlementContext`
- `prop string UserIdentifierKey`
- `prop string MachineIdentifierKey`

### class Tuanjie.Licensing.Server.Shared.Contracts.EntitlementAudit
- `prop DateTime AuditTimestampUtc`
- `prop string UserAgent`
- `prop string SessionId`
- `prop string ContextId`
- `prop string ProtocolVersion`
- `prop string Entitlement`
- `prop bool HasBeenGranted`
- `prop string EntitlementGroupId`

### class Tuanjie.Licensing.Server.Shared.Contracts.EntitlementAuditBatch
- `prop ClientContext ContextInfo`
- `prop EntitlementAudit[] Audits`

### class Tuanjie.Licensing.Server.Shared.Contracts.FloatingLeaseAudit
- `prop string UserIdentifier`
- `prop string HashedUserIdentifier`
- `prop string MachineIdentifier`
- `prop int FloatingLeaseId`
- `prop AuditActionTypes AuditActionType`
- `prop string ClientContext`
- `prop string AdditionalInformations`
- `prop DateTime TimestampUtc`

### class Tuanjie.Licensing.Server.Shared.Contracts.LeaseAudit
- `prop string UserIdentifier`
- `prop string HashedUserIdentifier`
- `prop string MachineIdentifier`
- `prop int FloatingLeaseId`
- `prop AuditActionTypes AuditActionType`
- `prop string ClientContext`
- `prop string AdditionalInformations`
- `prop DateTime TimestampUtc`
- `prop string Token`

### class Tuanjie.Licensing.Server.Shared.Contracts.LeaseRevocationRequest
- `prop string Reason`

### class Tuanjie.Licensing.Server.Shared.Contracts.LicenseLease
- `prop LicenseLeaseState State`
- `prop string LeaseToken`
- `prop DateTime ExpirationTime`

### enum Tuanjie.Licensing.Server.Shared.Contracts.LicenseLeaseState

### class Tuanjie.Licensing.Server.Shared.Contracts.ProductNameAudit
- `prop string UserIdentifier`
- `prop string HashedUserIdentifier`
- `prop string MachineIdentifier`
- `prop string ClientContext`
- `prop DateTime AuditTimestampUtc`
- `prop string ProductName`
- `prop bool Revoked`


## Tuanjie.Licensing.Analytics.dll（10 个公共类型）

### class Tuanjie.Licensing.Analytics.AnalyticBuilder
- `prop IDictionary<string, string> HeaderData`
- `prop ISet<string> BaggagePropertyNamesToInclude`
- `prop string SourceName`
- `prop ActivityTraceId CorrelationId`
- `prop IConfiguration CustomConfiguration`
- `prop ISet<string> OptOutExemptList`
- `AnalyticBuilder WithOptOutExemptList(ISet<string> events)`
- `AnalyticBuilder WithConfiguration(IConfiguration conf)`
- `AnalyticBuilder WithCorrelationId(ActivityTraceId correlationId)`
- `AnalyticBuilder WithSourceName(string sourceName)`
- `AnalyticBuilder WithCommonHeader(IDictionary<string, string> headerData)`
- `AnalyticBuilder WithBagDataToInclude(ISet<string> propertyNamesToInclude)`
- `TracerProvider BuildTraceProvider()`

### interface Tuanjie.Licensing.Analytics.IAnalyticConfiguration

### class Tuanjie.Licensing.Analytics.AnalyticConfiguration

### class Tuanjie.Licensing.Analytics.AnalyticEventBase
- `prop Activity Activity`
- `void Send()`

### class Tuanjie.Licensing.Analytics.AnalyticService
- `void SendEventAfterInitialization(Func<AnalyticEventBase> e)`
- `Activity StartActivity(string name)`
- `void SetTraceContext(Activity activity, string key, string value)`
- `Task<bool> ForceFlush(int timeoutMilliseconds = -1)`
- `bool ShutDown(int timeoutMilliseconds = -1)`
- `void Dispose()`

### class Tuanjie.Licensing.Analytics.AnalyticSpanBase
- `prop Activity Activity`
- `void Send()`
- `void Dispose()`

### class Tuanjie.Licensing.Analytics.DependencyInjection
- `IServiceCollection AddAnalytics(this IServiceCollection services, Func<AnalyticBuilder, IServiceProvider, AnalyticBuilder> configure)`
- `AnalyticService InitAnalytics(this IServiceProvider provider)`

### class Tuanjie.Licensing.Analytics.Exporters.BigQueryExporter

### class Tuanjie.Licensing.Analytics.Exporters.AnalyticHeader
- `prop object Common`

### class Tuanjie.Licensing.Analytics.Exporters.AnalyticData
- `prop string Type`
- `prop object Msg`
- `IList<AnalyticData> From(Activity activity, ISet<string> bagPropertyNameToInclude)`
- `ExportResult Export(in Batch<Activity> batch)`


## Tuanjie.ProxyHelper.dll（3 个公共类型）

### interface Tuanjie.ProxyHelper.IProxyHelper
- `string GetProxyAuthentication(string url)`

### class Tuanjie.ProxyHelper.ProxyHelper
- `string GetProxyAuthentication(string url)`

### class Tuanjie.ProxyHelper.ProxyHelperCredentials
- `NetworkCredential? GetCredential(Uri uri, string authType)`


---
合计公共类型约 501 个（含控制器/DTO/枚举）。方法体不在此还原；如需逐行看 temp/licensing-decomp/。
