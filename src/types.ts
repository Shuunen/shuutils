interface NavigatorUserAgentBrandVersion {
  readonly brand: string
  readonly version: string
}

interface UserAgentDataValues {
  readonly architecture?: string
  readonly bitness?: string
  readonly brands?: NavigatorUserAgentBrandVersion[]
  readonly mobile?: boolean // eslint-disable-line @typescript-eslint/naming-convention
  readonly model?: string
  readonly platform?: string
  readonly platformVersion?: string
  readonly uaFullVersion?: string
}

interface UserAgentLowEntropyJson {
  readonly brands: NavigatorUserAgentBrandVersion[]
  readonly mobile: boolean // eslint-disable-line @typescript-eslint/naming-convention
  readonly platform: string
}

interface NavigatorUserAgentData extends UserAgentLowEntropyJson {
  getHighEntropyValues: (hints: readonly string[]) => Promise<UserAgentDataValues>
  // biome-ignore lint/style/useNamingConvention: <explanation>
  toJSON: () => UserAgentLowEntropyJson // eslint-disable-line @typescript-eslint/naming-convention
}

// below types from https://github.com/lukewarlow/user-agent-data-types/blob/master/index.d.ts
export declare interface NavigatorUserAgent {
  readonly userAgentData?: NavigatorUserAgentData
}

export interface NavigatorExtract {
  language: string
  platform: string
  userAgent: string
}

export type RecursivePartial<Type> = {
  [Key in keyof Type]?: Type[Key] extends (infer Under)[] ? RecursivePartial<Under>[] : Type[Key] extends Record<string, unknown> ? RecursivePartial<Type[Key]> : Type[Key]
}

export interface PackageJson {
  description: string
  name: string
  version: string
}

export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key]
}
