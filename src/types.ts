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
  getHighEntropyValues: (hints: string[]) => Promise<UserAgentDataValues>
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

export type RecursivePartial<T> = {
  [P in keyof T]?:
  // eslint-disable-next-line putout/putout
  T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> : T[P]
}

export interface PackageJson {
  name: string
  version: string
  description: string
}
