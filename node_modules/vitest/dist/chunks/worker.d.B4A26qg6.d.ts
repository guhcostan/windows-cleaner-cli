import { FileSpecification, Task, CancelReason } from '@vitest/runner';
import { EvaluatedModules } from 'vite/module-runner';
import { S as SerializedConfig } from './config.d.CzIjkicf.js';
import { E as Environment } from './environment.d.CrsxCzP1.js';
import { R as RuntimeRPC, a as RunnerRPC } from './rpc.d.RH3apGEf.js';

type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never;
type ReturnType<T> = T extends (...args: any) => infer R ? R : never;
type PromisifyFn<T> = ReturnType<T> extends Promise<any> ? T : (...args: ArgumentsType<T>) => Promise<Awaited<ReturnType<T>>>;
type Thenable<T> = T | PromiseLike<T>;
type BirpcResolver = (name: string, resolved: (...args: unknown[]) => unknown) => Thenable<((...args: unknown[]) => unknown) | undefined>;
interface ChannelOptions {
    /**
     * Function to post raw message
     */
    post: (data: any, ...extras: any[]) => any | Promise<any>;
    /**
     * Listener to receive raw message
     */
    on: (fn: (data: any, ...extras: any[]) => void) => any | Promise<any>;
    /**
     * Clear the listener when `$close` is called
     */
    off?: (fn: (data: any, ...extras: any[]) => void) => any | Promise<any>;
    /**
     * Custom function to serialize data
     *
     * by default it passes the data as-is
     */
    serialize?: (data: any) => any;
    /**
     * Custom function to deserialize data
     *
     * by default it passes the data as-is
     */
    deserialize?: (data: any) => any;
    /**
     * Call the methods with the RPC context or the original functions object
     */
    bind?: 'rpc' | 'functions';
}
interface EventOptions<Remote> {
    /**
     * Names of remote functions that do not need response.
     */
    eventNames?: (keyof Remote)[];
    /**
     * Maximum timeout for waiting for response, in milliseconds.
     *
     * @default 60_000
     */
    timeout?: number;
    /**
     * Custom resolver to resolve function to be called
     *
     * For advanced use cases only
     */
    resolver?: BirpcResolver;
    /**
     * Hook triggered before an event is sent to the remote
     *
     * @param req - Request parameters
     * @param next - Function to continue the request
     * @param resolve - Function to resolve the response directly
     */
    onRequest?: (req: Request, next: (req?: Request) => Promise<any>, resolve: (res: any) => void) => void | Promise<void>;
    /**
     * Custom error handler
     *
     * @deprecated use `onFunctionError` and `onGeneralError` instead
     */
    onError?: (error: Error, functionName: string, args: any[]) => boolean | void;
    /**
     * Custom error handler for errors occurred in local functions being called
     *
     * @returns `true` to prevent the error from being thrown
     */
    onFunctionError?: (error: Error, functionName: string, args: any[]) => boolean | void;
    /**
     * Custom error handler for errors occurred during serialization or messsaging
     *
     * @returns `true` to prevent the error from being thrown
     */
    onGeneralError?: (error: Error, functionName?: string, args?: any[]) => boolean | void;
    /**
     * Custom error handler for timeouts
     *
     * @returns `true` to prevent the error from being thrown
     */
    onTimeoutError?: (functionName: string, args: any[]) => boolean | void;
}
type BirpcOptions<Remote> = EventOptions<Remote> & ChannelOptions;
type BirpcFn<T> = PromisifyFn<T> & {
    /**
     * Send event without asking for response
     */
    asEvent: (...args: ArgumentsType<T>) => Promise<void>;
};
interface BirpcReturnBuiltin<RemoteFunctions, LocalFunctions = Record<string, never>> {
    /**
     * Raw functions object
     */
    $functions: LocalFunctions;
    /**
     * Whether the RPC is closed
     */
    readonly $closed: boolean;
    /**
     * Close the RPC connection
     */
    $close: (error?: Error) => void;
    /**
     * Reject pending calls
     */
    $rejectPendingCalls: (handler?: PendingCallHandler) => Promise<void>[];
    /**
     * Call the remote function and wait for the result.
     * An alternative to directly calling the function
     */
    $call: <K extends keyof RemoteFunctions>(method: K, ...args: ArgumentsType<RemoteFunctions[K]>) => Promise<Awaited<ReturnType<RemoteFunctions[K]>>>;
    /**
     * Same as `$call`, but returns `undefined` if the function is not defined on the remote side.
     */
    $callOptional: <K extends keyof RemoteFunctions>(method: K, ...args: ArgumentsType<RemoteFunctions[K]>) => Promise<Awaited<ReturnType<RemoteFunctions[K]> | undefined>>;
    /**
     * Send event without asking for response
     */
    $callEvent: <K extends keyof RemoteFunctions>(method: K, ...args: ArgumentsType<RemoteFunctions[K]>) => Promise<void>;
    /**
     * Call the remote function with the raw options.
     */
    $callRaw: (options: {
        method: string;
        args: unknown[];
        event?: boolean;
        optional?: boolean;
    }) => Promise<Awaited<ReturnType<any>>[]>;
}
type BirpcReturn<RemoteFunctions, LocalFunctions = Record<string, never>> = {
    [K in keyof RemoteFunctions]: BirpcFn<RemoteFunctions[K]>;
} & BirpcReturnBuiltin<RemoteFunctions, LocalFunctions>;
type PendingCallHandler = (options: Pick<PromiseEntry, 'method' | 'reject'>) => void | Promise<void>;
interface PromiseEntry {
    resolve: (arg: any) => void;
    reject: (error: any) => void;
    method: string;
    timeoutId?: ReturnType<typeof setTimeout>;
}
declare const TYPE_REQUEST: "q";
interface Request {
    /**
     * Type
     */
    t: typeof TYPE_REQUEST;
    /**
     * ID
     */
    i?: string;
    /**
     * Method
     */
    m: string;
    /**
     * Arguments
     */
    a: any[];
    /**
     * Optional
     */
    o?: boolean;
}
declare const setTimeout: typeof globalThis.setTimeout;

type WorkerRPC = BirpcReturn<RuntimeRPC, RunnerRPC>;
interface ContextTestEnvironment {
	name: string;
	options: Record<string, any> | null;
}
interface WorkerTestEnvironment {
	name: string;
	options: Record<string, any> | null;
}
type TestExecutionMethod = "run" | "collect";
interface WorkerExecuteContext {
	files: FileSpecification[];
	providedContext: Record<string, any>;
	invalidates?: string[];
	/** Exposed to test runner as `VITEST_WORKER_ID`. Value is unique per each isolated worker. */
	workerId: number;
}
interface ContextRPC {
	pool: string;
	config: SerializedConfig;
	projectName: string;
	environment: WorkerTestEnvironment;
	rpc: WorkerRPC;
	files: FileSpecification[];
	providedContext: Record<string, any>;
	invalidates?: string[];
	/** Exposed to test runner as `VITEST_WORKER_ID`. Value is unique per each isolated worker. */
	workerId: number;
}
interface WorkerSetupContext {
	environment: WorkerTestEnvironment;
	pool: string;
	config: SerializedConfig;
	projectName: string;
	rpc: WorkerRPC;
}
interface WorkerGlobalState {
	ctx: ContextRPC;
	config: SerializedConfig;
	rpc: WorkerRPC;
	current?: Task;
	filepath?: string;
	metaEnv: {
		[key: string]: any;
		BASE_URL: string;
		MODE: string;
		DEV: boolean;
		PROD: boolean;
		SSR: boolean;
	};
	environment: Environment;
	evaluatedModules: EvaluatedModules;
	resolvingModules: Set<string>;
	moduleExecutionInfo: Map<string, any>;
	onCancel: (listener: (reason: CancelReason) => unknown) => void;
	onCleanup: (listener: () => unknown) => void;
	providedContext: Record<string, any>;
	durations: {
		environment: number;
		prepare: number;
	};
	onFilterStackTrace?: (trace: string) => string;
}

export type { BirpcOptions as B, ContextRPC as C, TestExecutionMethod as T, WorkerGlobalState as W, WorkerSetupContext as a, BirpcReturn as b, ContextTestEnvironment as c, WorkerExecuteContext as d, WorkerTestEnvironment as e };
