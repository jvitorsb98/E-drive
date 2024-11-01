import { ChangeDetectorRef, ClassProvider, DebugElement, DebugNode, ElementRef, EventEmitter, ExistingProvider, FactoryProvider, InjectionToken, Injector, NgModule, PipeTransform, Provider, StaticClassProvider, TemplateRef, ValueProvider, ViewContainerRef } from '@angular/core';
import { ComponentFixture, MetadataOverride, TestBedStatic, TestModuleMetadata } from '@angular/core/testing';

/**
 * A5 requires it to be a type, because interface doesn't work with A5.
 * It matches abstract classes.
 *
 * @internal
 */
export type AbstractType<T> = Function & {
	prototype: T;
};
/**
 * It has to be an interface.
 * It matches implemented classes.
 *
 * @internal
 */
export interface Type<T> extends Function {
	new (...args: any[]): T;
}
/**
 * It matches abstract or implemented classes.
 *
 * @internal
 */
export type AnyType<T> = Type<T> | AbstractType<T>;
/**
 * It matches any declaration in angular.
 *
 * @internal
 */
export type AnyDeclaration<T> = AnyType<T> | InjectionToken<T> | string;
/**
 * Normalized Input / Output type.
 * It should be A16 structure.
 *
 * @internal
 */
export type DirectiveIoParsed = {
	name: string;
	alias?: string;
	required?: boolean;
};
/**
 * Possible Input / Output type.
 *
 * @internal
 */
export type DirectiveIo = string | DirectiveIoParsed;
/**
 * DebugNodeSelector describes supported types of selectors
 * to search elements and instances in fixtures.
 *
 * @internal
 */
export type DebugNodeSelector = DebugNode | ComponentFixture<any> | string | [
	string
] | [
	string,
	string | number
] | null | undefined;
/**
 * NG_MOCKS token is a map from a declaration to its mock copy.
 *
 * @internal
 *
 * ```ts
 * const MockClass = TestBed.inject(NG_MOCKS).get(RealClass);
 * ```
 */
export declare const NG_MOCKS: InjectionToken<Map<any, any>>;
/**
 * NG_MOCKS_TOUCHES token is a set of all touched declarations during mock process.
 *
 * @internal
 *
 * ```ts
 * const touched = TestBed.inject(NG_MOCKS_TOUCHES).has(RealClass);
 * ```
 */
export declare const NG_MOCKS_TOUCHES: InjectionToken<Set<any>>;
/**
 * NG_MOCKS_OVERRIDES token contains overrides for:
 * - TestBed.overrideModule
 * - TestBed.overrideComponent
 * - TestBed.overrideDirective
 * - TestBed.overrideProvider
 *
 * It is used when there is no way to provide a mock copy and an override is required.
 * For example, if we want to keep a component, but to override one of its local providers.
 *
 * @internal
 */
export declare const NG_MOCKS_OVERRIDES: InjectionToken<Map<AnyType<any>, MetadataOverride<any>>>;
/**
 * NG_MOCKS_GUARDS token influences on provided guards in MockBuilder.
 * More info by the links below.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#ng_mocks_guards-token
 * @see https://ng-mocks.sudo.eu/guides/routing-guard
 */
export declare const NG_MOCKS_GUARDS: InjectionToken<void>;
/**
 * NG_MOCKS_RESOLVERS token influences on provided resolvers in MockBuilder.
 * More info by the links below.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#ng_mocks_resolvers-token
 * @see https://ng-mocks.sudo.eu/guides/routing-resolver
 */
export declare const NG_MOCKS_RESOLVERS: InjectionToken<void>;
/**
 * NG_MOCKS_INTERCEPTORS token influences on provided interceptors in MockBuilder.
 * More info by the links below.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#ng_mocks_interceptors-token
 * @see https://ng-mocks.sudo.eu/guides/http-interceptor
 */
export declare const NG_MOCKS_INTERCEPTORS: InjectionToken<void>;
/**
 * NG_MOCKS_ROOT_PROVIDERS token influences on root providers in MockBuilder,
 * which aren't provided in specified modules.
 * It helps to mock or keep them automatically.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#ng_mocks_root_providers-token
 */
export declare const NG_MOCKS_ROOT_PROVIDERS: InjectionToken<void>;
/**
 * It will be removed from public interface with the next release: A14
 * Use ngMocks.get(token) instead.
 *
 * @deprecated
 * @internal
 */
export declare const getTestBedInjection: <I>(token: AnyDeclaration<I>) => I | undefined;
/**
 * It will be removed from public interface with the next release: A14
 *
 * @deprecated
 * @internal
 */
export declare const getInjection: <I>(token: AnyDeclaration<I>) => I;
/**
 * The interface describes the type of the next value in MockBuilder().then().
 */
export interface IMockBuilderResult {
	testBed: TestBedStatic;
}
/**
 * The interface with flags which are suitable for each declaration in MockBuilder chain functions.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#config
 */
export interface IMockBuilderConfigAll {
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#dependency-flag
	 */
	dependency?: boolean;
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#export-flag
	 */
	export?: boolean;
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#shallow-flag
	 */
	shallow?: boolean;
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#onroot-flag
	 */
	onRoot?: boolean;
}
/**
 * The interface with flags which are suitable for modules in MockBuilder chain functions.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#config
 */
export interface IMockBuilderConfigModule {
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#exportall-flag
	 */
	exportAll?: boolean;
}
/**
 * The interface with flags which are suitable for components in MockBuilder chain functions.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#config
 */
export interface IMockBuilderConfigComponent {
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#render-flag
	 */
	render?: {
		[blockName: string]: boolean | {
			$implicit?: any;
			variables?: Record<keyof any, any>;
		};
	};
}
/**
 * The interface with flags which are suitable for directives in MockBuilder chain functions.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#config
 */
export interface IMockBuilderConfigDirective {
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#render-flag
	 */
	render?: boolean | {
		$implicit?: any;
		variables?: Record<keyof any, any>;
	};
}
/**
 * The interface with flags which are suitable for providers in MockBuilder chain functions.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#config
 */
export interface IMockBuilderConfigMock {
	/**
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#precise-flag
	 */
	precise?: boolean;
}
/**
 * IMockBuilderConfig is a union of all flags for all MockBuilder chain functions.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#config
 */
export type IMockBuilderConfig = IMockBuilderConfigAll | IMockBuilderConfigModule | IMockBuilderConfigComponent | IMockBuilderConfigDirective;
/**
 * IMockBuilder describes chain functions of MockBuilder.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder
 */
export interface IMockBuilder extends Promise<IMockBuilderResult> {
	/**
	 * beforeCompileComponents lets extend TestBed.
	 * For example, to add NO_ERRORS_SCHEMA, please don't do so.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#adding-schemas
	 */
	beforeCompileComponents(callback: (testBed: TestBedStatic) => void): this;
	/**
	 * .build() returns a declaration which can be used in TestBed.configureTestingModule.
	 * It is usually helpful with 3rd-party libraries when something should be excluded.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#factory-function
	 * @see https://ng-mocks.sudo.eu/extra/with-3rd-party
	 */
	build(): TestModuleMetadata;
	/**
	 * .exclude() excludes declarations.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#exclude
	 */
	exclude(def: any): this;
	/**
	 * .keep() keeps declarations as they are, and doesn't mock them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#keep
	 */
	keep(def: any, config?: IMockBuilderConfigAll & IMockBuilderConfigModule): this;
	/**
	 * .mock() with a transform function is useful to mock pipes.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#mock
	 */
	mock<T extends PipeTransform>(pipe: AnyType<T>, mock: T["transform"], config?: IMockBuilderConfig): this;
	/**
	 * .mock() for strings is useful to mock string providers.
	 * However, please considering using tokens instead of string providers.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#mock
	 */
	mock<T = any>(provider: string, mock: T, config?: IMockBuilderConfig): this;
	/**
	 * .mock() for tokens is useful to provide a mock copy of the token.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#mock
	 */
	mock<T>(token: InjectionToken<T>, mock: InjectionToken<T> | T | undefined, config?: IMockBuilderConfig): this;
	/**
	 * .mock() for declarations is useful to provide a partial mock implementation.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#mock
	 */
	mock<T>(provider: AnyType<T>, mock: AnyType<T> | Partial<T>, config?: IMockBuilderConfig & IMockBuilderConfigMock): this;
	/**
	 * .mock() for declarations which mocks all methods and properties.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#mock
	 */
	mock<T>(def: AnyType<T>, config: IMockBuilderConfig): this;
	/**
	 * .mock() for declarations which mocks all methods and properties.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#mock
	 */
	mock(def: any): this;
	/**
	 * .provide() lets add additional providers to TestBed.
	 * If you need to mock an existing provider, please use .mock().
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#provide
	 */
	provide(def: IMockBuilderProvider): this;
	/**
	 * .replace() lets substitute declarations.
	 * For example, BrowserAnimationsModule with NoopAnimationsModule.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockBuilder#replace
	 */
	replace(source: AnyType<any>, destination: AnyType<any>, config?: IMockBuilderConfigAll & IMockBuilderConfigModule): this;
}
/**
 * IMockBuilderExtended
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder#extending-mockbuilder
 */
export interface IMockBuilderExtended extends IMockBuilder {
}
/**
 * IMockBuilderProvider
 *
 * A special type to cover providers including EnvironmentProviders.
 */
export type IMockBuilderProvider = Provider | {
	ɵbrand: "EnvironmentProviders";
};
export type ngMocksMockConfig = {
	config?: IMockBuilderConfig;
	hostBindings?: string[];
	hostListeners?: string[];
	init?: (instance: any) => void;
	isControlValueAccessor?: boolean;
	isValidator?: boolean;
	outputs?: Array<DirectiveIo>;
	queryScanKeys?: string[];
	setControlValueAccessor?: boolean;
	transform?: PipeTransform["transform"];
};
/**
 * Mock class is the base class for each mock.
 * Usually, it should not be used directly.
 */
export declare class Mock {
	protected __ngMocksConfig: ngMocksMockConfig;
	constructor(injector?: Injector | null, ngControl?: any | null);
}
/**
 * LegacyControlValueAccessor was used to be a way to manipulate a mock ControlValueAccessor.
 *
 * @deprecated use isMockControlValueAccessor or isMockValidator instead (removing in A13)
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockControlValueAccessor
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockValidator
 */
export declare class LegacyControlValueAccessor extends Mock {
	/**
	 * @deprecated use isMockControlValueAccessor instead (removing in A13)
	 * @see https://ng-mocks.sudo.eu/api/helpers/isMockControlValueAccessor
	 */
	__simulateChange(value: any): void;
	/**
	 * @deprecated use isMockControlValueAccessor instead (removing in A13)
	 * @see https://ng-mocks.sudo.eu/api/helpers/isMockControlValueAccessor
	 */
	__simulateTouch(): void;
	/**
	 * @deprecated use isMockValidator instead (removing in A13)
	 * @see https://ng-mocks.sudo.eu/api/helpers/isMockValidator
	 */
	__simulateValidatorChange(): void;
}
/**
 * MockControlValueAccessor exposes access to a mock ControlValueAccessor.
 * It should be used in a combination with isMockControlValueAccessor.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockControlValueAccessor
 */
export interface MockControlValueAccessor {
	/**
	 * It simulates an external change of the value.
	 * Please consider usage of ngMocks.change().
	 *
	 * @see https://ng-mocks.sudo.eu/extra/mock-form-controls
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/change
	 */
	__simulateChange(value: any): void;
	/**
	 * It simulates an external touch.
	 * Please consider usage of ngMocks.touch().
	 *
	 * @see https://ng-mocks.sudo.eu/extra/mock-form-controls
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/touch
	 */
	__simulateTouch(): void;
}
/**
 * MockValidator exposes access to a mock Validator.
 * It should be used in a combination with isMockValidator.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockValidator
 */
export interface MockValidator {
	/**
	 * it simulates an external validation change.
	 *
	 * @see https://ng-mocks.sudo.eu/extra/mock-form-controls
	 */
	__simulateValidatorChange(): void;
}
export type MockedComponentSelector<T> = [
	keyof T
] | [
	keyof T,
	number
] | [
	keyof T,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
] | [
	keyof T,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
] | string;
/**
 * MockedComponent is a legacy representation of an interface of a mock component instance.
 * Please avoid its usage and try to rely on ngMocks.render() and ngMocks.hide().
 *
 * @see https://ng-mocks.sudo.eu/api/ngMocks/render
 * @see https://ng-mocks.sudo.eu/api/ngMocks/hide
 */
export type MockedComponent<T> = T & LegacyControlValueAccessor & {
	/**
	 * @deprecated use ngMocks.hide instead (removing in A13)
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/hide
	 */
	__hide(contentChildSelector: MockedComponentSelector<T>): void;
	/**
	 * @deprecated use ngMocks.render instead (removing in A13)
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/render
	 */
	__render(contentChildSelector: MockedComponentSelector<T>, $implicit?: any, variables?: Record<keyof any, any>): void;
};
/**
 * MockedDirective is a legacy representation of an interface of a mock directive instance.
 * Please avoid its usage and try to rely on ngMocks.render() and ngMocks.hide().
 *
 * @see https://ng-mocks.sudo.eu/api/ngMocks/render#render-structural-directives
 * @see https://ng-mocks.sudo.eu/api/ngMocks/hide
 */
export type MockedDirective<T> = T & LegacyControlValueAccessor & {
	/**
	 * Pointer to ChangeDetectorRef.
	 */
	__cdr?: ChangeDetectorRef;
	/**
	 * Pointer to current element in case of Attribute Directives.
	 */
	__element?: ElementRef;
	/**
	 * Just a flag for easy understanding what it is.
	 */
	__isStructural: boolean;
	/**
	 * Pointer to the template of Structural Directives.
	 */
	__template?: TemplateRef<any>;
	/**
	 * Pointer to ViewContainerRef.
	 */
	__vcr?: ViewContainerRef;
	/**
	 * @deprecated use this.__vcr (removing in A13)
	 */
	__viewContainer?: ViewContainerRef;
	/**
	 * @deprecated use ngMocks.render instead (removing in A13)
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/render#render-structural-directives
	 */
	__render($implicit?: any, variables?: Record<keyof any, any>): void;
};
/**
 * MockedModule is a legacy representation of an interface of a mock module instance.
 * Please avoid its usage, because, usually, you should not rely on whether it's a mock or not.
 */
export type MockedModule<T> = T & Mock;
/**
 * MockedPipe is a legacy representation of an interface of a mock pipe instance.
 * Please avoid its usage, because, usually, you should not rely on whether it's a mock or not.
 */
export type MockedPipe<T> = T & Mock;
/**
 * Returns the mock class of a mock module based on a mock module or a source module.
 * It works in runtime if the module has been mocked.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getMockedNgDefOf
 *
 * ```ts
 * getMockedNgDefOf(RealModule, 'm'); // returns MockModule
 * getMockedNgDefOf(MockModule, 'm'); // returns MockModule
 * getMockedNgDefOf(ArbitraryClass, 'm'); // throws
 * ```
 */
export declare function getMockedNgDefOf<T>(declaration: AnyType<T>, type: "m"): Type<MockedModule<T>>;
/**
 * Returns the mock class of a mock component based on a mock component or a source component.
 * It works in runtime if the component has been mocked.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getMockedNgDefOf
 *
 * ```ts
 * getMockedNgDefOf(RealComponent, 'c'); // returns MockComponent
 * getMockedNgDefOf(MockComponent, 'c'); // returns MockComponent
 * getMockedNgDefOf(ArbitraryClass, 'c'); // throws
 * ```
 */
export declare function getMockedNgDefOf<T>(declaration: AnyType<T>, type: "c"): Type<MockedComponent<T>>;
/**
 * Returns the mock class of a mock directive based on a mock directive or a source directive.
 * It works in runtime if the directive has been mocked.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getMockedNgDefOf
 *
 * ```ts
 * getMockedNgDefOf(RealDirective, 'd'); // returns MockDirective
 * getMockedNgDefOf(MockDirective, 'd'); // returns MockDirective
 * getMockedNgDefOf(ArbitraryClass, 'd'); // throws
 * ```
 */
export declare function getMockedNgDefOf<T>(declaration: AnyType<T>, type: "d"): Type<MockedDirective<T>>;
/**
 * Returns the mock class of a mock pipe based on a mock pipe or a source pipe.
 * It works in runtime if the pipe has been mocked.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getMockedNgDefOf
 *
 * ```ts
 * getMockedNgDefOf(RealPipe, 'p'); // returns MockPipe
 * getMockedNgDefOf(MockPipe, 'p'); // returns MockPipe
 * getMockedNgDefOf(ArbitraryClass, 'p'); // throws
 * ```
 */
export declare function getMockedNgDefOf<T>(declaration: AnyType<T>, type: "p"): Type<MockedPipe<T>>;
/**
 * Returns the mock class of a thing based on a mock class or a source class.
 * It works in runtime if the thing has been mocked.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getMockedNgDefOf
 *
 * ```ts
 * getMockedNgDefOf(RealComponent); // returns MockComponent
 * getMockedNgDefOf(MockPipe); // returns MockPipe
 * getMockedNgDefOf(ArbitraryClass); // throws
 * ```
 */
export declare function getMockedNgDefOf<T>(declaration: AnyType<T>): Type<T>;
/**
 * Returns the original class of a mock module class.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getSourceOfMock
 *
 * ```ts
 * getSourceOfMock(MockModule); // returns RealModule
 * getSourceOfMock(RealModule); // returns RealModule
 * ```
 */
export declare function getSourceOfMock<T>(declaration: AnyType<MockedModule<T>>): Type<T>;
/**
 * Returns the original class of a mock component class.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getSourceOfMock
 *
 * ```ts
 * getSourceOfMock(MockComponent); // returns RealComponent
 * getSourceOfMock(RealComponent); // returns RealComponent
 * ```
 */
export declare function getSourceOfMock<T>(declaration: AnyType<MockedComponent<T>>): Type<T>;
/**
 * Returns the original class of a mock directive class.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getSourceOfMock
 *
 * ```ts
 * getSourceOfMock(MockDirective); // returns RealDirective
 * getSourceOfMock(RealDirective); // returns RealDirective
 * ```
 */
export declare function getSourceOfMock<T>(declaration: AnyType<MockedDirective<T>>): Type<T>;
/**
 * Returns the original class of a mock pipe class.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getSourceOfMock
 *
 * ```ts
 * getSourceOfMock(MockPipe); // returns RealPipe
 * getSourceOfMock(RealPipe); // returns RealPipe
 * ```
 */
export declare function getSourceOfMock<T>(declaration: AnyType<MockedPipe<T>>): Type<T>;
/**
 * Returns the original class of a mock class.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/getSourceOfMock
 *
 * ```ts
 * getSourceOfMock(MockClass); // returns RealClass
 * getSourceOfMock(RealClass); // returns RealClass
 * ```
 */
export declare function getSourceOfMock<T>(declaration: AnyType<T>): Type<T>;
/**
 * isMockControlValueAccessor helps to assert that an instance is a mock ControlValueAccessor
 * to perform valueChange or touch simulations.
 * Usually, it is used in if statements.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockControlValueAccessor
 * @see https://ng-mocks.sudo.eu/api/ngMocks/change
 * @see https://ng-mocks.sudo.eu/api/ngMocks/touch
 */
export declare const isMockControlValueAccessor: <T>(value: T) => value is T & MockControlValueAccessor;
/**
 * isMockNgDef verifies whether a class is a mock component class.
 *
 * @internal
 *
 * ```ts
 * isMockNgDef(MockComponent, 'c'); // returns true
 * isMockNgDef(RealComponent, 'c'); // returns false
 * isMockNgDef(ArbitraryClass, 'c'); // returns false
 * ```
 */
export declare function isMockNgDef<T>(component: AnyType<T>, ngType: "c"): component is Type<MockedComponent<T>>;
/**
 * isMockNgDef verifies whether a class is a mock directive class.
 *
 * @internal
 *
 * ```ts
 * isMockNgDef(MockDirective, 'd'); // returns true
 * isMockNgDef(RealDirective, 'd'); // returns false
 * isMockNgDef(ArbitraryClass, 'd'); // returns false
 * ```
 */
export declare function isMockNgDef<T>(directive: AnyType<T>, ngType: "d"): directive is Type<MockedDirective<T>>;
/**
 * isMockNgDef verifies whether a class is a mock pipe class.
 *
 * @internal
 *
 * ```ts
 * isMockNgDef(MockPipe, 'p'); // returns true
 * isMockNgDef(RealPipe, 'p'); // returns false
 * isMockNgDef(ArbitraryClass, 'p'); // returns false
 * ```
 */
export declare function isMockNgDef<T>(pipe: AnyType<T>, ngType: "p"): pipe is Type<MockedPipe<T>>;
/**
 * isMockNgDef verifies whether a class is a mock module class.
 *
 * @internal
 *
 * ```ts
 * isMockNgDef(MockModule, 'm'); // returns true
 * isMockNgDef(RealModule, 'm'); // returns false
 * isMockNgDef(ArbitraryClass, 'm'); // returns false
 * ```
 */
export declare function isMockNgDef<T>(module: AnyType<T>, ngType: "m"): module is Type<MockedModule<T>>;
/**
 * isMockNgDef verifies whether a class is a mock class.
 *
 * @internal
 *
 * ```ts
 * isMockNgDef(MockComponent); // returns true
 * isMockNgDef(RealModule); // returns false
 * isMockNgDef(ArbitraryClass); // returns false
 * ```
 */
export declare function isMockNgDef<T>(module: Type<T>): module is Type<T>;
/**
 * Checks whether the instance derives from a mock module.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockOf
 *
 * ```ts
 * isMockOf(moduleInstance, RealModule, 'm'); // returns true
 * isMockOf(moduleInstance, ArbitraryClass, 'm'); // returns false
 * ```
 */
export declare function isMockOf<T>(instance: any, declaration: Type<T>, ngType: "m"): instance is MockedModule<T>;
/**
 * Checks whether the instance derives from a mock component.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockOf
 *
 * ```ts
 * isMockOf(componentInstance, RealComponent, 'c'); // returns true
 * isMockOf(componentInstance, ArbitraryClass, 'c'); // returns false
 * ```
 */
export declare function isMockOf<T>(instance: any, declaration: Type<T>, ngType: "c"): instance is MockedComponent<T>;
/**
 * Checks whether the instance derives from a mock directive.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockOf
 *
 * ```ts
 * isMockOf(directiveInstance, RealDirective, 'd'); // returns true
 * isMockOf(directiveInstance, ArbitraryClass, 'd'); // returns false
 * ```
 */
export declare function isMockOf<T>(instance: any, declaration: Type<T>, ngType: "d"): instance is MockedDirective<T>;
/**
 * Checks whether the instance derives from a mock pipe.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockOf
 *
 * ```ts
 * isMockOf(pipeInstance, RealPipe, 'p'); // returns true
 * isMockOf(pipeInstance, ArbitraryClass, 'p'); // returns false
 * ```
 */
export declare function isMockOf<T extends PipeTransform>(instance: any, declaration: Type<T>, ngType: "p"): instance is MockedPipe<T>;
/**
 * Checks whether the instance derives from a mock type.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockOf
 *
 * ```ts
 * isMockOf(componentInstance, RealComponent); // returns true
 * isMockOf(pipeInstance, RealPipe); // returns true
 * isMockOf(pipeInstance, ArbitraryClass); // returns false
 * ```
 */
export declare function isMockOf<T>(instance: any, declaration: Type<T>): instance is T;
/**
 * isMockValidator helps to assert that an instance is a mock Validator
 * to perform validationChange simulations.
 * Usually, it is used in if statements.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockValidator
 */
export declare const isMockValidator: <T>(value: T) => value is T & MockValidator;
/**
 * Checks whether a declaration is the mock class of a module.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockedNgDefOf
 *
 * ```ts
 * isMockedNgDefOf(MockModule, RealModule, 'm'); // returns true
 * isMockedNgDefOf(MockModule, ArbitraryModule, 'm'); // returns false
 * isMockedNgDefOf(MockModule, ArbitraryClass, 'm'); // returns false
 * ```
 */
export declare function isMockedNgDefOf<T>(declaration: any, type: Type<T>, ngType: "m"): declaration is Type<MockedModule<T>>;
/**
 * Checks whether a declaration is the mock class of a component.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockedNgDefOf
 *
 * ```ts
 * isMockedNgDefOf(MockComponent, RealComponent, 'c'); // returns true
 * isMockedNgDefOf(MockComponent, ArbitraryComponent, 'c'); // returns false
 * isMockedNgDefOf(MockComponent, ArbitraryClass, 'c'); // returns false
 * ```
 */
export declare function isMockedNgDefOf<T>(declaration: any, type: Type<T>, ngType: "c"): declaration is Type<MockedComponent<T>>;
/**
 * Checks whether a declaration is the mock class of a directive.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockedNgDefOf
 *
 * ```ts
 * isMockedNgDefOf(MockDirective, RealDirective, 'd'); // returns true
 * isMockedNgDefOf(MockDirective, ArbitraryDirective, 'd'); // returns false
 * isMockedNgDefOf(MockDirective, ArbitraryClass, 'd'); // returns false
 * ```
 */
export declare function isMockedNgDefOf<T>(declaration: any, type: Type<T>, ngType: "d"): declaration is Type<MockedDirective<T>>;
/**
 * Checks whether a declaration is the mock class of a pipe.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockedNgDefOf
 *
 * ```ts
 * isMockedNgDefOf(MockPipe, RealPipe, 'p'); // returns true
 * isMockedNgDefOf(MockPipe, ArbitraryPipe, 'p'); // returns false
 * isMockedNgDefOf(MockPipe, ArbitraryClass, 'p'); // returns false
 * ```
 */
export declare function isMockedNgDefOf<T extends PipeTransform>(declaration: any, type: Type<T>, ngType: "p"): declaration is Type<MockedPipe<T>>;
/**
 * Checks whether a declaration is the mock class of a thing.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isMockedNgDefOf
 *
 * ```ts
 * isMockedNgDefOf(MockPipe, RealPipe); // returns true
 * isMockedNgDefOf(MockComponent, ArbitraryComponent); // returns false
 * isMockedNgDefOf(MockPipe, ArbitraryClass); // returns false
 * ```
 */
export declare function isMockedNgDefOf<T>(declaration: any, type: Type<T>): declaration is Type<T>;
/**
 * Checks whether a class has been decorated by @NgModule.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(RealModule, 'm'); // returns true
 * isNgDef(MockModule, 'm'); // returns true
 * isNgDef(ArbitraryModule, 'm'); // returns true
 * isNgDef(ArbitraryClass, 'm'); // returns false
 * ```
 */
export declare function isNgDef(declaration: any, ngType: "m"): declaration is Type<any>;
/**
 * Checks whether a class has been decorated by @Component.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(RealComponent, 'c'); // returns true
 * isNgDef(MockComponent, 'c'); // returns true
 * isNgDef(ArbitraryComponent, 'c'); // returns true
 * isNgDef(ArbitraryClass, 'c'); // returns false
 * ```
 */
export declare function isNgDef(declaration: any, ngType: "c"): declaration is Type<any>;
/**
 * Checks whether a class has been decorated by @Directive.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(RealDirective, 'd'); // returns true
 * isNgDef(MockDirective, 'd'); // returns true
 * isNgDef(ArbitraryDirective, 'd'); // returns true
 * isNgDef(ArbitraryClass, 'd'); // returns false
 * ```
 */
export declare function isNgDef(declaration: any, ngType: "d"): declaration is Type<any>;
/**
 * Checks whether a class has been decorated by @Pipe.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(RealPipe, 'p'); // returns true
 * isNgDef(MockPipe, 'p'); // returns true
 * isNgDef(ArbitraryPipe, 'p'); // returns true
 * isNgDef(ArbitraryClass, 'p'); // returns false
 * ```
 */
export declare function isNgDef(declaration: any, ngType: "p"): declaration is Type<PipeTransform>;
/**
 * Checks whether a class has been decorated by @Injectable.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(RealService, 'i'); // returns true
 * isNgDef(MockService, 'i'); // returns true
 * isNgDef(ArbitraryService, 'i'); // returns true
 * isNgDef(ArbitraryClass, 'i'); // returns false
 * ```
 */
export declare function isNgDef(declaration: any, ngType: "i"): declaration is Type<any>;
/**
 * Checks whether a variable is a token.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(realToken, 't'); // returns true
 * isNgDef(mockToken, 't'); // returns true
 * isNgDef(arbitraryToken, 't'); // returns true
 * isNgDef(arbitraryObject, 't'); // returns false
 * ```
 */
export declare function isNgDef(declaration: any, ngType: "t"): declaration is InjectionToken<any>;
/**
 * Checks whether a class or variable has been decorated by a ng type.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgDef
 *
 * ```ts
 * isNgDef(RealModule); // returns true
 * isNgDef(MockComponent); // returns true
 * isNgDef(ArbitraryDirective); // returns true
 * isNgDef(token); // returns true
 * isNgDef(ArbitraryClass); // returns false
 * ```
 */
export declare function isNgDef(declaration: any): declaration is Type<any>;
/**
 * Checks whether a variable is an Angular token.
 *
 * @see https://ng-mocks.sudo.eu/api/helpers/isNgInjectionToken
 *
 * ```ts
 * isNgInjectionToken(APP_ID); // returns true
 * isNgInjectionToken(arbitraryVariable); // returns false
 * ```
 */
export declare const isNgInjectionToken: (token: any) => token is InjectionToken<any>;
/**
 * This signature of MockInstance lets customize the getter of a property.
 *
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * MockInstance(ArbitraryComponent, 'currentUser$', () => mockUser$, 'get');
 * MockInstance(ArbitraryService, 'enabled', () => false, 'get');
 * ```
 */
export declare function MockInstance<T extends object, K extends keyof T, S extends () => T[K]>(instance: AnyType<T>, name: K, stub: S, encapsulation: "get"): S;
/**
 * This signature of MockInstance lets customize the setters of a property.
 *
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * const currentUserSetterSpy = jasmine.createSpy();
 * MockInstance(ArbitraryComponent, 'currentUser', currentUserSetterSpy, 'set');
 *
 * let relServiceEnabled: boolean;
 * MockInstance(ArbitraryService, 'enabled', value => relServiceEnabled = value, 'set');
 * ```
 */
export declare function MockInstance<T extends object, K extends keyof T, S extends (value: T[K]) => void>(instance: AnyType<T>, name: K, stub: S, encapsulation: "set"): S;
/**
 * This signature of MockInstance lets customize the properties and methods.
 *
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * MockInstance(ArbitraryComponent, 'onInit', onInitSpy);
 * MockInstance(ArbitraryDirective, 'onDestroy', () => {});
 * MockInstance(ArbitraryService, 'currentDate', new Date());
 * MockInstance(ArbitraryModule, 'currentUser', mockUser);
 * ```
 */
export declare function MockInstance<T extends object, K extends keyof T, S extends T[K]>(instance: AnyType<T>, name: K, stub: S): S;
/**
 * This signature of MockInstance lets customize tokens with a callback.
 *
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * MockInstance(webSocketToken, () => mockWebSocket);
 * ```
 */
export declare function MockInstance<T>(declaration: InjectionToken<T>, init?: (instance: T | undefined, injector: Injector | undefined) => Partial<T> | Array<Partial<T>>): void;
/**
 * This signature of MockInstance lets customize tokens with a callback.
 *
 * @deprecated please pass the callback directly instead of config.
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * MockInstance(webSocketToken, {
 *   init: () => mockWebSocket,
 * });
 * ```
 */
export declare function MockInstance<T>(declaration: InjectionToken<T>, config?: {
	init?: (instance: T | undefined, injector: Injector | undefined) => Partial<T> | Array<Partial<T>>;
}): void;
/**
 * This signature of MockInstance lets customize the instances of mock classes with a callback.
 * You can return a shape or change the instance.
 *
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * MockInstance(ArbitraryComponent, (instance, injector) => {
 *   instance.enabled = true;
 *   instance.db = injector.get(DatabaseService);
 * });
 * MockInstance(ArbitraryDirective, () => {
 *   return {
 *     someProperty: true,
 *   };
 * });
 * ```
 */
export declare function MockInstance<T>(declaration: AnyType<T>, init?: (instance: T, injector: Injector | undefined) => void | Partial<T> | Array<Partial<T>>): void;
/**
 * This signature of MockInstance lets customize the instances of mock classes with a callback.
 * You can return a shape or change the instance.
 *
 * @deprecated please pass the callback directly instead of config.
 * @see https://ng-mocks.sudo.eu/api/MockInstance
 *
 * ```ts
 * MockInstance(ArbitraryComponent, {
 *   init: (instance, injector) => {
 *     instance.enabled = true;
 *     instance.db = injector.get(DatabaseService);
 *   },
 * });
 * MockInstance(ArbitraryDirective, {
 *   init: () => {
 *     return {
 *       someProperty: true,
 *     };
 *   },
 * });
 * ```
 */
export declare function MockInstance<T>(declaration: AnyType<T>, config?: {
	init?: (instance: T, injector: Injector | undefined) => void | Partial<T> | Array<Partial<T>>;
}): void;
/**
 * Interface describes how to configure scopes for MockInstance.
 *
 * @see https://ng-mocks.sudo.eu/api/MockInstance#customization-scopes
 */
export declare namespace MockInstance {
	/**
	 * Creates a scope which remembers all future customizations of MockInstance.
	 * It allows to reset them afterwards.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockInstance#remember
	 */
	function remember(): void;
	/**
	 * Resets all changes in the current scope.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockInstance#restore
	 */
	function restore(): void;
	/**
	 * Creates a local scope in `beforeEach` and `afterEach`.
	 * If `suite` has been passed, then `beforeAll` and `afterAll` are used.
	 *
	 * @see https://ng-mocks.sudo.eu/api/MockInstance#scope
	 */
	function scope(scope?: "all" | "suite" | "case"): void;
}
/**
 * MockReset resets everything what has been configured in MockInstance.
 * Please consider using MockInstance.scope() instead,
 * which respects customizations between tests.
 *
 * https://ng-mocks.sudo.eu/api/MockInstance#resetting-customization
 * https://ng-mocks.sudo.eu/api/MockInstance#scope
 */
export declare function MockReset(): void;
/**
 * NgModuleWithProviders helps to support ModuleWithProviders in all angular versions.
 * In A5 it was without the generic type.
 *
 * @internal remove after removal of A5 support
 */
export interface NgModuleWithProviders<T = any> {
	ngModule: Type<T>;
	providers?: NgModule["providers"];
}
export type MockBuilderParam = string | AnyDeclaration<any> | NgModuleWithProviders;
/**
 * MockBuilder provides reach and simple interfaces of chain functions
 * to build desired mock environment for tests.
 *
 * @see https://ng-mocks.sudo.eu/api/MockBuilder
 */
export declare function MockBuilder(keepDeclaration?: MockBuilderParam | MockBuilderParam[] | null | undefined, itsModuleAndDependenciesToMock?: MockBuilderParam | MockBuilderParam[] | null | undefined): IMockBuilderExtended;
export declare namespace MockBuilder {
	/**
	 * Adds a custom function to MockBuilder
	 */
	function extend<K extends keyof IMockBuilderExtended & string>(func: K, callback: (builder: IMockBuilderExtended, parameters: never) => void): void;
	/**
	 * Removes a custom function from MockBuilder
	 */
	function extend<K extends keyof IMockBuilderExtended & string>(func: K): void;
}
/**
 * MockModule creates a mock module class out of an arbitrary module.
 * All declarations, imports, exports and providers will be mocked too.
 *
 * @see https://ng-mocks.sudo.eu/api/MockModule
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   imports: [
 *     MockModule(SharedModule),
 *   ],
 * });
 * ```
 */
export declare function MockModule<T>(ngModule: Type<T>): Type<T>;
/**
 * MockModule creates a mock module class with mock provides out of an arbitrary module with providers.
 * All declarations, imports, exports and providers will be mocked too.
 *
 * @see https://ng-mocks.sudo.eu/api/MockModule
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   imports: [
 *     MockModule(StoreModule.forRoot()),
 *   ],
 * });
 * ```
 */
export declare function MockModule<T>(ngModule: NgModuleWithProviders<T>): NgModuleWithProviders<T>;
/**
 * MockComponents creates an array of mock component classes out of components passed as parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockComponent
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: MockComponents(
 *     Dep1Component,
 *     Dep2Component,
 *   ),
 * });
 * ```
 */
export declare function MockComponents(...components: Array<Type<any>>): Array<Type<MockedComponent<any>>>;
/**
 * MockComponent creates a mock component class out of an arbitrary component.
 *
 * @see https://ng-mocks.sudo.eu/api/MockComponent
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: [
 *     MockComponent(Dep1Component),
 *     MockComponent(Dep2Component),
 *   ],
 * });
 * ```
 */
export declare function MockComponent<TComponent>(component: Type<TComponent>): Type<MockedComponent<TComponent>>;
/**
 * MockDirectives creates an array of mock directive classes out of directives passed as parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockDirective
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: MockDirectives(
 *     Dep1Directive,
 *     Dep2Directive,
 *   ),
 * });
 * ```
 */
export declare function MockDirectives(...directives: Array<Type<any>>): Array<Type<MockedDirective<any>>>;
/**
 * MockDirective creates a mock directive class out of an arbitrary directive.
 *
 * @see https://ng-mocks.sudo.eu/api/MockDirective
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: [
 *     MockDirective(Dep1Directive),
 *     MockDirective(Dep2Directive),
 *   ],
 * });
 * ```
 */
export declare function MockDirective<TDirective>(directive: Type<TDirective>): Type<MockedDirective<TDirective>>;
/**
 * MockPipes creates an array of mock pipe classes out of pipes passed as parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockPipe
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: MockPipes(
 *     Dep1Pipe,
 *     Dep2Pipe,
 *   ),
 * });
 * ```
 */
export declare function MockPipes(...pipes: Array<Type<PipeTransform>>): Array<Type<PipeTransform>>;
/**
 * MockPipe creates a mock pipe class out of an arbitrary pipe.
 *
 * @see https://ng-mocks.sudo.eu/api/MockPipe
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: [
 *     MockPipe(Dep1Pipe),
 *     MockPipe(Dep2Pipe),
 *   ],
 * });
 * ```
 */
export declare function MockPipe<TPipe extends PipeTransform>(pipe: Type<TPipe>, transform?: TPipe["transform"]): Type<MockedPipe<TPipe>>;
/**
 * MockDeclarations creates an array of mock declaration classes out of declarations passed as parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockComponent
 * @see https://ng-mocks.sudo.eu/api/MockDirective
 * @see https://ng-mocks.sudo.eu/api/MockPipe
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: MockDeclarations(
 *     Dep1Component,
 *     Dep2Directive,
 *     Dep3Pipe,
 *   ),
 * });
 * ```
 */
export declare function MockDeclarations(...declarations: Array<Type<any>>): Array<Type<any>>;
/**
 * MockDeclaration creates a mock declaration class out of an arbitrary declaration.
 *
 * @see https://ng-mocks.sudo.eu/api/MockComponent
 * @see https://ng-mocks.sudo.eu/api/MockDirective
 * @see https://ng-mocks.sudo.eu/api/MockPipe
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   declarations: [
 *     MockDeclaration(Dep1Component),
 *     MockDeclaration(Dep2Directive),
 *     MockDeclaration(Dep3Pipe),
 *   ],
 * });
 * ```
 */
export declare function MockDeclaration<T>(declaration: Type<T>): Type<MockedPipe<T> | MockedDirective<T> | MockedComponent<T>>;
/**
 * MockProviders creates an array of mock providers out of passed as parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: MockProviders(
 *     Dep1Service,
 *     Dep2Service,
 *   ),
 * });
 * ```
 */
export declare function MockProviders(...providers: Array<AnyDeclaration<any>>): FactoryProvider[];
/**
 * MockProvider creates a mock provider out of passed an arbitrary service.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider(Dep1Service),
 *     MockProvider(Dep2Service, {
 *       prop: true,
 *       func: () => 'mock',
 *     }),
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I extends object>(instance: AnyType<I>, overrides?: Partial<I>): FactoryProvider;
/**
 * MockProvider creates a mock provider out of passed an arbitrary token.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider(APP_ID),
 *     MockProvider(WEB_SOCKET, {
 *       prop: true,
 *       func: () => 'mock',
 *     }),
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I>(provider: InjectionToken<I>, useValue?: Partial<I>): FactoryProvider;
/**
 * MockProvider creates a mock provider out of passed an arbitrary string token.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider('web_socket', {
 *       prop: true,
 *       func: () => 'mock',
 *     }),
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I = any>(provider: string, useValue?: Partial<I>): FactoryProvider;
/**
 * MockProvider generates useValue based on passed parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider#useValue
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider(AuthService, {isLoggedIn: true}, 'useValue'),
 *     MockProvider(APP_ROUTES, 5, 'useValue', true), // multi flag
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I>(provider: AnyDeclaration<I>, value: ValueProvider["useValue"], style: "useValue", multi?: ValueProvider["multi"]): ValueProvider;
/**
 * MockProvider generates useExisting based on passed parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider#useExisting
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider(AuthService, MockAuthService, 'useExisting', true),
 *     MockProvider(APP_ROUTES, MOCK_ROUTES, 'useExisting', true), // multi flag
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I>(provider: AnyDeclaration<I>, value: ExistingProvider["useExisting"], style: "useExisting", multi?: ExistingProvider["multi"]): ExistingProvider;
/**
 * MockProvider generates useClass based on passed parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider#useClass
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider(AuthService, MockAuthService, 'useClass', [ctorDep1, ctorDep2]),
 *     MockProvider(UserService, MockUserService, 'useClass', {
 *       multi: true, // multi flag
 *       deps: [ctorDep1, ctorDep2],
 *     }),
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I>(provider: AnyDeclaration<I>, value: StaticClassProvider["useClass"], style: "useClass", multiDeps?: StaticClassProvider["multi"] | StaticClassProvider["deps"] | {
	multi?: StaticClassProvider["multi"];
	deps?: StaticClassProvider["deps"];
}): ClassProvider;
/**
 * MockProvider generates useFactory based on passed parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockProvider#useFactory
 *
 * ```ts
 * TestBed.configureTestingModule({
 *   providers: [
 *     MockProvider(AuthService, (dep1, dep2) => {
 *       // ...
 *     }, 'useFactory', [ctorDep1, ctorDep2]),
 *     MockProvider(UserService, (dep1, dep2) => {
 *       // ...
 *     }, 'useFactory', {
 *       multi: true, // multi flag
 *       deps: [ctorDep1, ctorDep2],
 *     }),
 *   ],
 * });
 * ```
 */
export declare function MockProvider<I>(provider: AnyDeclaration<I>, value: FactoryProvider["useFactory"], style: "useFactory", multiDeps?: FactoryProvider["multi"] | FactoryProvider["deps"] | {
	multi?: FactoryProvider["multi"];
	deps?: FactoryProvider["deps"];
}): FactoryProvider;
/**
 * MockService creates a mock instance out of an object or a class.
 * Primitives are converted to undefined.
 *
 * @see https://ng-mocks.sudo.eu/api/MockService
 */
export declare function MockService(service: boolean | number | string | null | undefined): undefined;
/**
 * MockService creates a mock instance out of an object or a class.
 *
 * @see https://ng-mocks.sudo.eu/api/MockService
 *
 * ```ts
 * const service = MockService(AuthService);
 * service.login(); // does nothing, it's dummy.
 */
export declare function MockService<T>(service: AnyType<T>, spyNamePrefix?: string): T;
/**
 * MockService creates a mock instance out of an object or a class.
 *
 * @see https://ng-mocks.sudo.eu/api/MockService
 *
 * ```ts
 * const mockUser = MockService(currentUser);
 * mockUser.save(); // does nothing, it's dummy.
 */
export declare function MockService<T = any>(service: object, spyNamePrefix?: string): T;
/**
 * MockService creates a mock instance out of an object or a class.
 * The second parameter can be used as overrides.
 *
 * @see https://ng-mocks.sudo.eu/api/MockService
 *
 * ```ts
 * const service = MockService(AuthService, {
 *   loggedIn: true,
 * });
 * service.login(); // does nothing, it's dummy.
 * ```
 */
export declare function MockService<T>(service: AnyType<T>, overrides?: Partial<T>, spyNamePrefix?: string): T;
/**
 * MockedDebugNode is a way to simplify the type of DebugNode.
 * Usually, it should not be used externally.
 */
export interface MockedDebugNode<T = any> extends DebugNode {
	componentInstance: T;
}
/**
 * MockedDebugElement is a way to simplify the type of DebugElement.
 * Usually, it should not be used externally.
 */
export interface MockedDebugElement<T = any> extends DebugElement, MockedDebugNode<T> {
	componentInstance: T;
}
/**
 * IMockRenderOptions describes parameters for MockRender.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export interface IMockRenderOptions {
	/**
	 * Pass false to suppress the change detection.
	 */
	detectChanges?: boolean;
	/**
	 * Extra providers for the testing environment.
	 */
	providers?: NgModule["providers"];
	/**
	 * Pass true to reset TestBed before render.
	 * Usually, it's done automatically.
	 */
	reset?: boolean;
	/**
	 * Extra providers for the testing environment.
	 */
	viewProviders?: NgModule["providers"];
}
/**
 * IMockRenderFactoryOptions describes parameters for MockRenderFactory.
 * By default, it doesn't configure TestBed, but if you need it, you can pass
 * configureTestBed as true.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export interface IMockRenderFactoryOptions extends IMockRenderOptions {
	configureTestBed?: boolean;
}
/**
 * MockedComponentFixture replaces ComponentFixture if MockRender is used.
 * MockRender provides `fixture.point` to access the rendered component.
 * MockedComponentFixture helps to define its type correctly.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export interface MockedComponentFixture<C = any, F = DefaultRenderComponent<C>> extends ComponentFixture<F> {
	point: MockedDebugElement<C>;
}
/**
 * DefaultRenderComponent described a middleware component `fixture.componentInstance`,
 * which is used to manipulate `fixture.point.componentInstance`.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export type DefaultRenderComponent<MComponent> = {
	[K in keyof MComponent]: MComponent[K];
};
/**
 * MockedFunction describes the interface of a function which can be used as a spy.
 * For example, jasmine.createSpy() and jest.fn() are MockedFunction.
 *
 * @see https://ng-mocks.sudo.eu/extra/auto-spy
 */
export type MockedFunction = (...args: any[]) => any;
/**
 * CustomMockFunction describes the interface of a factory which should produce MockFunction.
 * It accepts a label / name and should return a spy / mock function.
 *
 * @see https://ng-mocks.sudo.eu/extra/auto-spy
 */
export type CustomMockFunction = (mockName: string) => MockedFunction;
export type FORMAT_SINGLE = string | HTMLElement | {
	nativeNode: any;
} | {
	nativeElement: any;
} | {
	debugElement: any;
};
export type FORMAT_SET = string[] | HTMLElement[] | Array<{
	nativeNode: any;
}> | Array<{
	nativeElement: any;
}> | Array<{
	debugElement: any;
}>;
/**
 * ngMocks provides a lot of tools to simply testing.
 *
 * @see https://ng-mocks.sudo.eu/api/ngMocks
 */
export declare const ngMocks: {
	/**
	 * ngMocks.autoSpy installs proper spies instead of empty functions.
	 *
	 * @see https://ng-mocks.sudo.eu/extra/auto-spy
	 */
	autoSpy(type: "jasmine" | "jest" | "default" | "reset"): void;
	/**
	 * ngMocks.autoSpy installs proper spies instead of empty functions.
	 *
	 * @see https://ng-mocks.sudo.eu/extra/auto-spy
	 */
	autoSpy(type: CustomMockFunction): void;
	/**
	 * ngMocks.defaultConfig sets the default config of declarations for MockBuilder.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/defaultConfig
	 */
	defaultConfig<T>(token: string | AnyDeclaration<T>, config?: IMockBuilderConfig): void;
	/**
	 * ngMocks.defaultMock sets default customizations of mock tokens.
	 * It helps to avoid repetitions from test to test.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/defaultMock
	 */
	defaultMock<T>(token: InjectionToken<T>, handler?: (value: undefined | T, injector: Injector) => undefined | Partial<T>, config?: IMockBuilderConfig): void;
	/**
	 * ngMocks.defaultMock sets default customizations of mock string tokens.
	 * It helps to avoid repetitions from test to test.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/defaultMock
	 */
	defaultMock<T = any>(token: string, handler?: (value: undefined | T, injector: Injector) => undefined | Partial<T>, config?: IMockBuilderConfig): void;
	/**
	 * ngMocks.defaultMock sets default customizations of mock declarations.
	 * It helps to avoid repetitions from test to test.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/defaultMock
	 */
	defaultMock<T>(def: AnyType<T>, handler?: (value: T, injector: Injector) => void | Partial<T>, config?: IMockBuilderConfig): void;
	/**
	 * ngMocks.defaultMock sets default customizations of mock declarations and tokens.
	 * It helps to avoid repetitions from test to test.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/defaultMock
	 */
	defaultMock<T = any>(defs: Array<AnyDeclaration<T>>, handler?: (value: undefined | T, injector: Injector) => undefined | Partial<T>, config?: IMockBuilderConfig): void;
	/**
	 * ngMocks.globalExclude configures which declarations, providers and tokens
	 * should be excluded from mocks.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/globalExclude
	 *
	 * ```ts
	 * ngMocks.globalExclude(TranslationModule);
	 * ```
	 */
	globalExclude(source: AnyDeclaration<any>, recursively?: boolean): void;
	/**
	 * ngMocks.globalKeep configures which declarations, providers and tokens
	 * should not be mocked and will stay as they are in mocks.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/globalKeep
	 *
	 * ```ts
	 * ngMocks.globalKeep(TranslationModule);
	 * ```
	 */
	globalKeep(source: AnyDeclaration<any>, recursively?: boolean): void;
	/**
	 * ngMocks.globalMock configures which declarations, providers and tokens
	 * should be mocked in kept declarations.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/globalMock
	 *
	 * ```ts
	 * ngMocks.globalMock(TranslationModule);
	 * ```
	 */
	globalMock(source: AnyDeclaration<any>, recursively?: boolean): void;
	/**
	 * ngMocks.globalReplace configures which declarations, providers and tokens
	 * should be substituted in mocks.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/globalReplace
	 *
	 * ```ts
	 * ngMocks.globalReplace(BrowserAnimationsModule, NoopAnimationsModule);
	 * ```
	 */
	globalReplace(source: AnyType<any>, destination: AnyType<any>): void;
	/**
	 * ngMocks.globalWipe resets all customizations of ngMocks.global* and mgMocks.default* functions.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/globalWipe
	 *
	 * ```ts
	 * ngMocks.globalWipe(TranslationModule);
	 * ngMocks.globalWipe(BrowserAnimationsModule);
	 * ```
	 */
	globalWipe(source: AnyDeclaration<any>, recursively?: boolean): void;
	/**
	 * ngMocks.change triggers ControlValueAccessor update.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/change
	 */
	change(elSelector: DebugNodeSelector, value: any, methodName?: string): void;
	/**
	 * ngMocks.touch triggers ControlValueAccessor touch.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/touch
	 */
	touch(elSelector: DebugNode | DebugNodeSelector, methodName?: string): void;
	/**
	 * ngMocks.click properly simulates a click on an element.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/click
	 */
	click(elSelector: HTMLElement | DebugNodeSelector, payload?: Partial<MouseEvent>): void;
	/**
	 * ngMocks.trigger lets trigger custom events on DebugElements.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/trigger
	 *
	 * ```ts
	 * ngMocks.trigger(el, new CustomEvent('my-event'));
	 * ```
	 */
	trigger(elSelector: DebugNodeSelector, event: Event): void;
	/**
	 * ngMocks.trigger lets trigger custom events on DebugElements.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/trigger
	 *
	 * ```ts
	 * ngMocks.trigger(el, 'click');
	 * ngMocks.trigger(el, 'keydown.control.shift.z');
	 * ```
	 */
	trigger(elSelector: HTMLElement | DebugNodeSelector, event: string, payload?: Partial<UIEvent | KeyboardEvent | MouseEvent | TouchEvent>): void;
	/**
	 * ngMocks.event builds correct event objects.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/event
	 */
	event(event: string, init?: EventInit, overrides?: Partial<UIEvent | KeyboardEvent | MouseEvent | TouchEvent | Event>): Event;
	/**
	 * ngMocks.render renders a templateRef or DebugElement.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/render
	 *
	 * ```ts
	 * ngMocks.header(component, headerEl);
	 * ```
	 */
	render(instance: object, template: TemplateRef<any> | DebugNode, $implicit?: any, variables?: Record<keyof any, any>): void;
	/**
	 * ngMocks.render renders a structural directive.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/render
	 *
	 * ```ts
	 * ngMocks.render(component, directiveInstance);
	 * ```
	 */
	render(instance: object, directive: object, $implicit?: any, variables?: Record<keyof any, any>): void;
	/**
	 * ngMocks.hide hides a rendered templateRef or DebugElement.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/hide
	 *
	 * ```ts
	 * ngMocks.hide(component, headerEl);
	 * ```
	 */
	hide(instance: object, tpl?: TemplateRef<any> | DebugNode): void;
	/**
	 * ngMocks.hide hides a rendered structural directive.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/hide
	 *
	 * ```ts
	 * ngMocks.hide(component, directiveInstance);
	 * ```
	 */
	hide(instance: object, directive: object): void;
	/**
	 * ngMocks.input allows to get an input value without knowing
	 * which component / directive it belongs to.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/input
	 *
	 * ```ts
	 * const input = ngMocks.input('app-component', 'version');
	 * ```
	 */
	input<T = any>(elSelector: DebugNodeSelector, input: string): T;
	/**
	 * ngMocks.input allows to get an input value without knowing
	 * which component / directive it belongs to, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/input
	 *
	 * ```ts
	 * const input = ngMocks.input('app-component', 'version', undefined);
	 * ```
	 */
	input<T = any, D = undefined>(elSelector: DebugNodeSelector, input: string, notFoundValue: D): D | T;
	/**
	 * ngMocks.output allows to get an output emitter without knowing
	 * which component / directive it belongs to.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/output
	 *
	 * ```ts
	 * const outputEmitter = ngMocks.output('app-component', 'update');
	 * ```
	 */
	output<T = any>(elSelector: DebugNodeSelector, output: string): EventEmitter<T>;
	/**
	 * ngMocks.output allows to get an output emitter without knowing
	 * which component / directive it belongs to, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/output
	 *
	 * ```ts
	 * const outputEmitter = ngMocks.output('app-component', 'update', undefined);
	 * ```
	 */
	output<T = any, D = undefined>(elSelector: DebugNodeSelector, output: string, notFoundValue: D): D | EventEmitter<T>;
	/**
	 * ngMocks.find searches for the DebugElement of a particular component,
	 * and returns the first found.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find(MyComponent);
	 * ```
	 */
	find<T>(component: Type<T>): MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement of a particular component
	 * starting from an element, and returns the first found.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find(fixture.debugElement, MyComponent);
	 * ```
	 */
	find<T>(debugElement: MockedDebugElement | ComponentFixture<any> | undefined | null, component: Type<T>): MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement of a particular component,
	 * and returns the first found, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find(MyComponent, undefined);
	 * ```
	 */
	find<T, D>(component: Type<T>, notFoundValue: D): D | MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement of a particular component
	 * starting from an element, and returns the first found, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find(fixture, MyComponent, undefined);
	 * ```
	 */
	find<T, D>(debugElement: MockedDebugElement | ComponentFixture<any> | undefined | null, component: Type<T>, notFoundValue: D): D | MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement based on css selector,
	 * and returns the first found.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find('.header');
	 * const el = ngMocks.find('[data-key=5]');
	 * const el = ngMocks.find(['data-key', 5]);
	 * ```
	 */
	find<T = any>(cssSelector: string | [
		string
	] | [
		string,
		string | number
	]): MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement based on css selector
	 * starting from an element, and returns the first found.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find(fixture.debugElement, '.header');
	 * const el = ngMocks.find(fixture, '[data-key=5]');
	 * const el = ngMocks.find(debugElement, ['data-key', 5]);
	 * ```
	 */
	find<T = any>(debugElement: MockedDebugElement | ComponentFixture<any> | undefined | null, cssSelector: string | [
		string
	] | [
		string,
		string | number
	]): MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement based on css selector,
	 * and returns the first found, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find('.header', undefined);
	 * const el = ngMocks.find('[data-key=5]', null);
	 * const el = ngMocks.find(['data-key', 5], null);
	 * ```
	 */
	find<T = any, D = undefined>(cssSelector: string | [
		string
	] | [
		string,
		string | number
	], notFoundValue: D): D | MockedDebugElement<T>;
	/**
	 * ngMocks.find searches for the DebugElement based on css selector
	 * starting from an element, and returns the first found, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/find
	 *
	 * ```ts
	 * const el = ngMocks.find(fixture.debugElement, '.header', undefined);
	 * const el = ngMocks.find(fixture, '[data-key=5]', null);
	 * const el = ngMocks.find(debugElement, ['data-key', 5], null);
	 * ```
	 */
	find<T = any, D = undefined>(debugElement: MockedDebugElement | ComponentFixture<any> | undefined | null, cssSelector: string | [
		string
	] | [
		string,
		string | number
	], notFoundValue: D): D | MockedDebugElement<T>;
	/**
	 * ngMocks.findAll searches for all DebugElements of a particular component,
	 * and returns an array of them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findAll
	 *
	 * ```ts
	 * const all = ngMocks.findAll(MyComponent);
	 * ```
	 */
	findAll<T>(component: Type<T>): Array<MockedDebugElement<T>>;
	/**
	 * ngMocks.findAll searches for all DebugElements of a particular component
	 * starting from an element, and returns an array of them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findAll
	 *
	 * ```ts
	 * const all = ngMocks.findAll(fixture.debugElement, MyComponent);
	 * ```
	 */
	findAll<T>(debugElement: MockedDebugElement | ComponentFixture<any> | undefined | null, component: Type<T>): Array<MockedDebugElement<T>>;
	/**
	 * ngMocks.findAll searches for all DebugElements based on css selector,
	 * and returns an array of them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findAll
	 *
	 * ```ts
	 * const all = ngMocks.findAll('.header');
	 * const all = ngMocks.findAll('[data-key=5]');
	 * const all = ngMocks.findAll(['data-key', 5]);
	 * ```
	 */
	findAll<T = any>(cssSelector: string | [
		string
	] | [
		string,
		string | number
	]): Array<MockedDebugElement<T>>;
	/**
	 * ngMocks.findAll searches for all DebugElements based on css selector
	 * starting from an element, and returns an array of them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findAll
	 *
	 * ```ts
	 * const all = ngMocks.findAll(fixture.debugElement, '.header');
	 * const all = ngMocks.findAll(fixture, '[data-key=5]');
	 * const all = ngMocks.findAll(debugElement, ['data-key', 5]);
	 * ```
	 */
	findAll<T = any>(debugElement: MockedDebugElement | ComponentFixture<any> | undefined | null, cssSelector: string | [
		string
	] | [
		string,
		string | number
	]): Array<MockedDebugElement<T>>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal(HeaderComponent);
	 * ```
	 */
	reveal<T>(selector: AnyType<T>): MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template
	 * starting from an element.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal('header', HeaderComponent);
	 * ```
	 */
	reveal<T>(elSelector: DebugNodeSelector, selector: AnyType<T>): MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal(['tpl', 'header']);
	 * ```
	 */
	reveal<T = any>(selector: string | [
		string
	] | [
		string,
		any
	]): MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template
	 * starting from an element.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal('header', ['tpl', 'header']);
	 * ```
	 */
	reveal<T = any>(elSelector: DebugNodeSelector, selector: string | [
		string
	] | [
		string,
		any
	]): MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template,
	 * otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal(HeaderComponent, undefined);
	 * ```
	 */
	reveal<T, D>(selector: AnyType<T>, notFoundValue: D): D | MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template
	 * starting from an element, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal('sidebar', HeaderComponent, undefined);
	 * ```
	 */
	reveal<T, D>(elSelector: DebugNodeSelector, selector: AnyType<T>, notFoundValue: D): D | MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template,
	 * otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal(['tpl', 'header'], undefined);
	 * ```
	 */
	reveal<T = any, D = undefined>(selector: string | [
		string
	] | [
		string,
		any
	], notFoundValue: D): D | MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.reveal allows finding DebugNodes which belong to ng-container or ng-template
	 * starting from an element, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reveal
	 *
	 * ```ts
	 * const ngContainer = ngMocks.reveal('sidebar', ['tpl', 'header'], undefined);
	 * ```
	 */
	reveal<T = any, D = undefined>(elSelector: DebugNodeSelector, selector: string | [
		string
	] | [
		string,
		any
	], notFoundValue: D): D | MockedDebugNode<T> | MockedDebugElement<T>;
	/**
	 * ngMocks.revealAll allows finding all DebugNodes which belong to ng-container or ng-template.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/revealAll
	 *
	 * ```ts
	 * const ngContainers = ngMocks.revealAll(HeaderComponent);
	 * ```
	 */
	revealAll<T>(selector: AnyType<T>): Array<MockedDebugNode<T> | MockedDebugElement<T>>;
	/**
	 * ngMocks.reveal allows finding all DebugNodes which belong to ng-container or ng-template.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/revealAll
	 *
	 * ```ts
	 * const ngContainers = ngMocks.revealAll(['tpl', 'header']);
	 * ```
	 */
	revealAll<T = any>(selector: string | [
		string
	] | [
		string,
		any
	]): Array<MockedDebugNode<T> | MockedDebugElement<T>>;
	/**
	 * ngMocks.reveal allows finding all DebugNodes which belong to ng-container or ng-template
	 * starting from an element.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/revealAll
	 *
	 * ```ts
	 * const ngContainers = ngMocks.revealAll('sidebar', HeaderComponent);
	 * ```
	 */
	revealAll<T>(elSelector: DebugNodeSelector, selector: AnyType<T>): Array<MockedDebugNode<T> | MockedDebugElement<T>>;
	/**
	 * ngMocks.reveal allows finding all DebugNodes which belong to ng-container or ng-template
	 * starting from an element.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/revealAll
	 *
	 * ```ts
	 * const ngContainers = ngMocks.revealAll('sidebar', ['tpl', 'header']);
	 * ```
	 */
	revealAll<T = any>(elSelector: DebugNodeSelector, selector: string | [
		string
	] | [
		string,
		any
	]): Array<MockedDebugNode<T> | MockedDebugElement<T>>;
	/**
	 * ngMocks.get tries to get an instance of declaration, provider or token
	 * from the element which is matching a selector.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/get
	 *
	 * ```ts
	 * const myComponent = ngMocks.get('my-component', MyComponent);
	 * const myDirective = ngMocks.get('my-component', MyDirective);
	 * ```
	 */
	get<T>(elSelector: DebugNodeSelector, provider: AnyDeclaration<T>): T;
	/**
	 * ngMocks.get tries to get an instance of declaration, provider or token
	 * from the element which is matching a selector, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/get
	 *
	 * ```ts
	 * const myComponent = ngMocks.get('my-component', MyComponent, undefined);
	 * const myDirective = ngMocks.get('my-component', MyDirective, null);
	 * ```
	 */
	get<T, D>(elSelector: DebugNodeSelector, provider: AnyDeclaration<T>, notFoundValue: D): D | T;
	/**
	 * ngMocks.get tries to get an instance of provider or token for TestBed.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/get
	 *
	 * ```ts
	 * const myComponent = ngMocks.get(MyComponent);
	 * const myDirective = ngMocks.get(MyDirective);
	 * ```
	 */
	get<T>(provider: AnyDeclaration<T>): T;
	/**
	 * ngMocks.findInstance searches for an instance of declaration, provider or token,
	 * and returns the first one.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findInstance
	 *
	 * ```ts
	 * const component = ngMocks.findInstance(SidebarComponent);
	 * const service = ngMocks.findInstance(AuthService);
	 * const config = ngMocks.findInstance(APP_CONFIG);
	 * ```
	 */
	findInstance<T>(instanceClass: AnyDeclaration<T>): T;
	/**
	 * ngMocks.findInstance searches for an instance of declaration, provider or token
	 * starting from an element, and returns the first one.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findInstance
	 *
	 * ```ts
	 * const component = ngMocks.findInstance(fixture, SidebarComponent);
	 * const service = ngMocks.findInstance('header', AuthService);
	 * const config = ngMocks.findInstance(debugElement, APP_CONFIG);
	 * ```
	 */
	findInstance<T>(elSelector: DebugNodeSelector, instanceClass: AnyDeclaration<T>): T;
	/**
	 * ngMocks.findInstance searches for an instance of declaration, provider or token,
	 * and returns the first one, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findInstance
	 *
	 * ```ts
	 * const component = ngMocks.findInstance(SidebarComponent, undefined);
	 * const service = ngMocks.findInstance(AuthService, null);
	 * const config = ngMocks.findInstance(APP_CONFIG, false);
	 */
	findInstance<T, D>(instanceClass: AnyDeclaration<T>, notFoundValue: D): D | T;
	/**
	 * ngMocks.findInstance searches for an instance of declaration, provider or token
	 * starting from an element, and returns the first one, otherwise the notFoundValue.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findInstance
	 *
	 * ```ts
	 * const component = ngMocks.findInstance(fixture, SidebarComponent, undefined);
	 * const service = ngMocks.findInstance('header', AuthService, null);
	 * const config = ngMocks.findInstance(debugElement, APP_CONFIG, false);
	 * ```
	 */
	findInstance<T, D>(elSelector: DebugNodeSelector, instanceClass: AnyDeclaration<T>, notFoundValue: D): D | T;
	/**
	 * ngMocks.findInstances searches for all instances of declaration, provider or token,
	 * and returns an array of them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findInstances
	 *
	 * ```ts
	 * const components = ngMocks.findInstances(SidebarComponent);
	 * const services = ngMocks.findInstances(AuthService);
	 * const configs = ngMocks.findInstances(APP_CONFIG);
	 * ```
	 */
	findInstances<T>(instanceClass: AnyDeclaration<T>): T[];
	/**
	 * ngMocks.findInstances searches for all instances of declaration, provider or token
	 * starting from an element, and returns an array of them.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findInstances
	 *
	 * ```ts
	 * const components = ngMocks.findInstances(fixture, SidebarComponent);
	 * const services = ngMocks.findInstances('header', AuthService);
	 * const configs = ngMocks.findInstances(debugElement, APP_CONFIG);
	 * ```
	 */
	findInstances<T>(elSelector: DebugNodeSelector, instanceClass: AnyDeclaration<T>): T[];
	/**
	 * ngMocks.findTemplateRef searches for a TemplateRef which is matching the selector,
	 * and returns the first found, otherwise the notFoundValue.
	 * The TemplateRef can be rendered later on.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findTemplateRef
	 *
	 * ```ts
	 * const templateRef = ngMocks.findTemplateRef('sidebar', StructuralDirective, undefined);
	 * ```
	 */
	findTemplateRef<T = any, D = undefined>(elSelector: DebugNodeSelector, selector: string | [
		string
	] | [
		string,
		any
	] | AnyType<any>, notFoundValue: D): D | TemplateRef<T>;
	/**
	 * ngMocks.findTemplateRef searches for a TemplateRef which is matching the selector,
	 * and returns the first found.
	 * The TemplateRef can be rendered later on.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findTemplateRef
	 *
	 * ```ts
	 * const templateRef = ngMocks.findTemplateRef('sidebar', StructuralDirective);
	 * ```
	 */
	findTemplateRef<T = any>(elSelector: DebugNodeSelector, selector: string | [
		string
	] | [
		string,
		any
	] | AnyType<any>): TemplateRef<T>;
	/**
	 * ngMocks.findTemplateRef searches for a TemplateRef which is matching the selector,
	 * and returns the first found, otherwise the notFoundValue.
	 * The TemplateRef can be rendered later on.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findTemplateRef
	 *
	 * ```ts
	 * const templateRef = ngMocks.findTemplateRef(['mat-row'], null);
	 * ```
	 */
	findTemplateRef<T = any, D = undefined>(selector: string | [
		string
	] | [
		string,
		any
	] | AnyType<any>, notFoundValue: D): D | TemplateRef<T>;
	/**
	 * ngMocks.findTemplateRef searches for a TemplateRef which is matching the selector,
	 * and returns the first found.
	 * The TemplateRef can be rendered later on.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findTemplateRef
	 *
	 * ```ts
	 * const templateRef = ngMocks.findTemplateRef(['mat-row']);
	 * ```
	 */
	findTemplateRef<T = any>(selector: string | [
		string
	] | [
		string,
		any
	] | AnyType<any>): TemplateRef<T>;
	/**
	 * ngMocks.findTemplateRefs searches for all TemplateRefs which is matching the selector
	 * starting from an element, and returns an array of them.
	 * The TemplateRef can be rendered later on.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findTemplateRefs
	 *
	 * ```ts
	 * const templateRefs = ngMocks.findTemplateRefs('header', StructuralDirective);
	 * ```
	 */
	findTemplateRefs<T = any>(elSelector: DebugNodeSelector, selector: string | [
		string
	] | [
		string,
		any
	] | AnyType<any>): Array<TemplateRef<T>>;
	/**
	 * ngMocks.findTemplateRefs searches for all TemplateRefs which is matching the selector,
	 * and returns an array of them.
	 * The TemplateRef can be rendered later on.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/findTemplateRefs
	 *
	 * ```ts
	 * const templateRefs = ngMocks.findTemplateRefs(['mat-row']);
	 * ```
	 */
	findTemplateRefs<T = any>(selector: string | [
		string
	] | [
		string,
		any
	] | AnyType<any>): Array<TemplateRef<T>>;
	/**
	 * ngMocks.crawl correctly crawls through Angular DOM with respect of TemplateRefs and ng-containers.
	 * Usually, it's used internally.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/crawl
	 */
	crawl(elSelector: DebugNodeSelector, callback: (node: MockedDebugNode | MockedDebugElement, parent?: MockedDebugNode | MockedDebugElement) => boolean | void, includeTextNodes?: boolean): void;
	/**
	 * ngMocks.stub lets replace a method, getter or setter with a dummy callback.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/stub
	 *
	 * ```ts
	 * ngMocks.stub(instance, 'save'); // save is an empty callback now.
	 * ngMocks.stub(instance, 'user', 'get'); // getter is an empty callback now.
	 * ngMocks.stub(instance, 'user', 'set'); // setter is an empty callback now.
	 * ```
	 */
	stub<T = MockedFunction, I = any>(instance: I, name: keyof I, style?: "get" | "set"): T;
	/**
	 * ngMocks.stub lets apply partial customizations to an instance.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/stub
	 *
	 * ```ts
	 * ngMocks.stub(instance, {
	 *   save: () => undefined,
	 *   user: null,
	 * });
	 * ```
	 */
	stub<I extends object>(instance: I, overrides: Partial<I>): I;
	/**
	 * ngMocks.stubMember lets inject spies it to getters of properties of an instance.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/stubMember
	 *
	 * ```ts
	 * ngMocks.stubMember(instance, 'user', jasmine.createSpy(), 'get')
	 *   .and.returnValue(null);
	 * ```
	 */
	stubMember<T extends object, K extends keyof T, S extends () => T[K]>(instance: T, name: K, stub: S, encapsulation: "get"): S;
	/**
	 * ngMocks.stubMember lets inject spies it to setters of properties of an instance.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/stubMember
	 *
	 * ```ts
	 * ngMocks.stubMember(instance, 'user', jasmine.createSpy(), 'set')
	 *   .and.throwError('setter is forbidden');
	 * ```
	 */
	stubMember<T extends object, K extends keyof T, S extends (value: T[K]) => void>(instance: T, name: K, stub: S, encapsulation: "set"): S;
	/**
	 * ngMocks.stubMember lets inject spies it to an instance.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/stubMember
	 *
	 * ```ts
	 * ngMocks.stubMember(instance, 'save', jasmine.createSpy());
	 * ngMocks.stubMember(instance, 'user', null);
	 * ```
	 */
	stubMember<T extends object, K extends keyof T, S extends T[K]>(instance: T, name: K, stub: S): S;
	/**
	 * ngMocks.guts provides a simple way to configure complex mocks.
	 * Please check documentation.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/guts
	 */
	guts(keep: AnyDeclaration<any> | Provider | Array<AnyDeclaration<any> | Provider> | null | undefined, mock?: AnyDeclaration<any> | NgModuleWithProviders | Provider | Array<AnyDeclaration<any> | NgModuleWithProviders | Provider> | null | undefined, exclude?: AnyDeclaration<any> | Array<AnyDeclaration<any>> | null | undefined): TestModuleMetadata;
	/**
	 * ngMocks.faster lets reuse the same TestBed between tests instead of resetting it.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/faster
	 */
	faster(): void;
	/**
	 * ignoreOnConsole suppresses any log calls, other methods can be suppressed too.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/ignoreOnConsole
	 */
	ignoreOnConsole(...args: Array<keyof typeof console>): void;
	/**
	 * Thanks Ivy, it does not throw an error, and we have to use injector.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/throwOnConsole
	 */
	throwOnConsole(...args: Array<keyof typeof console>): void;
	/**
	 * ngMocks.formatHtml normalizes html for a DebugElement, fixture or html string.
	 * It removes redundant spaces, comments etc.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/formatHtml
	 *
	 * ```ts
	 * const html = ngMocks.formatHTML(fixture);
	 * const html = ngMocks.formatHTML(debugElement);
	 * const html = ngMocks.formatHTML('<div>   </div>');
	 * ```
	 */
	formatHtml(html: FORMAT_SINGLE, outer?: boolean): string;
	/**
	 * ngMocks.formatHtml normalizes html for an array of DebugElements, fixtures or html strings.
	 * It removes redundant spaces, comments etc.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/formatHtml
	 *
	 * const [html1, html2] = ngMocks.formatHTML([fixture1, fixture2]);
	 * const htmlStrings = ngMocks.formatHTML(debugElements);
	 */
	formatHtml(html: FORMAT_SET, outer?: boolean): string[];
	/**
	 * ngMocks.formatText normalizes text for a DebugElement, fixture or html string.
	 * It removes tags, redundant spaces, comments etc.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/formatText
	 *
	 * ```ts
	 * const txt = ngMocks.formatText(fixture);
	 * const txt = ngMocks.formatText(debugElement);
	 * const txt = ngMocks.formatText('<div>   </div>');
	 * ```
	 */
	formatText(text: FORMAT_SINGLE, outer?: boolean): string;
	/**
	 * ngMocks.formatText normalizes text for an array of DebugElements, fixtures or html strings.
	 * It removes tags, redundant spaces, comments etc.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/formatText
	 *
	 * const [txt1, txt2] = ngMocks.formatText([fixture1, fixture2]);
	 * const txtStrings = ngMocks.formatText(debugElements);
	 */
	formatText(text: FORMAT_SET, outer?: boolean): string[];
	/**
	 * ngMocks.flushTestBed resets TestBed.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/flushTestBed
	 */
	flushTestBed(): void;
	/**
	 * ngMocks.reset resets cache of ng-mocks.
	 *
	 * @see https://ng-mocks.sudo.eu/api/ngMocks/reset
	 */
	reset(): void;
	/**
	 * ngMocks.config lets customize default behavior of error reporting.
	 */
	config(config: {
		mockRenderCacheSize?: number | null;
		onMockBuilderMissingDependency?: "throw" | "warn" | "i-know-but-disable" | null;
		onMockInstanceRestoreNeed?: "throw" | "warn" | "i-know-but-disable" | null;
		onTestBedFlushNeed?: "throw" | "warn" | "i-know-but-disable" | null;
	}): void;
};
/**
 * This signature of MockRender lets create an empty fixture.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender(): MockedComponentFixture<void, void>;
/**
 * This signature of MockRender lets create a fixture to access a token.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent>(template: InjectionToken<MComponent>, params?: undefined | null, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, void>;
/**
 * This signature of MockRender lets create a fixture to access a component without parameters.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent>(template: AnyType<MComponent>, params: undefined | null, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, MComponent>;
/**
 * This signature of MockRender lets create a fixture with parameters to access a component.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent, TComponent extends object>(template: AnyType<MComponent>, params: TComponent, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, TComponent>;
/**
 * This signature of MockRender lets create a fixture with parameters to access a component.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent, TComponent extends object = Record<keyof any, any>>(template: AnyType<MComponent>, params: TComponent, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, TComponent>;
/**
 * This signature of MockRender without params should not autocomplete any keys of any types.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent>(template: AnyType<MComponent>): MockedComponentFixture<MComponent, MComponent>;
/**
 * This signature of MockRender without params should not autocomplete any keys of any types.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent = void>(template: string): MockedComponentFixture<MComponent>;
/**
 * This signature of MockRender lets create a fixture based on string template.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent = void>(template: string, params: undefined | null, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, void>;
/**
 * This signature of MockRender lets create a fixture with parameters to access a string based template.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent = void, TComponent extends Record<keyof any, any> = Record<keyof any, any>>(template: string, params: TComponent, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, TComponent>;
/**
 * This signature of MockRender lets create a fixture with parameters to access a string based template.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender
 */
export declare function MockRender<MComponent, TComponent extends Record<keyof any, any> = Record<keyof any, any>>(template: string, params: TComponent, detectChangesOrOptions?: boolean | IMockRenderOptions): MockedComponentFixture<MComponent, TComponent>;
export interface MockRenderFactory<C = any, F extends keyof any = keyof C> {
	bindings: keyof F;
	configureTestBed: () => void;
	declaration: AnyType<never>;
	<T extends Record<F, any>>(params?: Partial<T>, detectChanges?: boolean): MockedComponentFixture<C, T>;
}
/**
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent>(template: InjectionToken<MComponent>, bindings?: undefined | null, options?: IMockRenderFactoryOptions): MockRenderFactory<MComponent, never>;
/**
 * MockRenderFactory is a delayed version of MockRender.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent>(template: AnyType<MComponent>, bindings: undefined | null, options?: IMockRenderFactoryOptions): MockRenderFactory<MComponent, keyof MComponent>;
/**
 * MockRenderFactory is a delayed version of MockRender.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent, TKeys extends keyof any>(template: AnyType<MComponent>, bindings: TKeys[], options?: IMockRenderFactoryOptions): MockRenderFactory<MComponent, TKeys>;
/**
 * MockRenderFactory is a delayed version of MockRender.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent, TKeys extends keyof any = keyof any>(template: AnyType<MComponent>, bindings: TKeys[], options?: IMockRenderFactoryOptions): MockRenderFactory<MComponent, TKeys>;
/**
 * Without params we should not autocomplete any keys of any types.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent>(template: AnyType<MComponent>): MockRenderFactory<MComponent, keyof MComponent>;
/**
 * An empty string does not have point.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory(template: ""): MockRenderFactory<void, never>;
/**
 * Without params we should not autocomplete any keys of any types.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent = void>(template: string): MockRenderFactory<MComponent>;
/**
 * MockRenderFactory is a delayed version of MockRender.
 *
 * @see https://ng-mocks.sudo.eu/api/MockRender#factory
 */
export declare function MockRenderFactory<MComponent = void, TKeys extends keyof any = keyof any>(template: string, bindings: TKeys[], options?: IMockRenderFactoryOptions): MockRenderFactory<MComponent, TKeys>;

export {};
