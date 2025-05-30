/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    'payload-admins': PayloadAdminAuthOperations;
  };
  collections: {
    'payload-admins': PayloadAdmin;
    'payload-media': PayloadMedia;
    'payload-indicators': PayloadIndicator;
    'payload-indicator-levels': PayloadIndicatorLevel;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {
    'payload-indicators': {
      levels: 'payload-indicator-levels';
    };
  };
  collectionsSelect: {
    'payload-admins': PayloadAdminsSelect<false> | PayloadAdminsSelect<true>;
    'payload-media': PayloadMediaSelect<false> | PayloadMediaSelect<true>;
    'payload-indicators': PayloadIndicatorsSelect<false> | PayloadIndicatorsSelect<true>;
    'payload-indicator-levels': PayloadIndicatorLevelsSelect<false> | PayloadIndicatorLevelsSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    home: Home;
    help: Help;
    legals: Legal;
    footer: Footer;
  };
  globalsSelect: {
    home: HomeSelect<false> | HomeSelect<true>;
    help: HelpSelect<false> | HelpSelect<true>;
    legals: LegalsSelect<false> | LegalsSelect<true>;
    footer: FooterSelect<false> | FooterSelect<true>;
  };
  locale: null;
  user: PayloadAdmin & {
    collection: 'payload-admins';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface PayloadAdminAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-admins".
 */
export interface PayloadAdmin {
  id: string;
  totpSecret?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-media".
 */
export interface PayloadMedia {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-indicators".
 */
export interface PayloadIndicator {
  id: string;
  slug:
    | 'online'
    | 'satisfaction'
    | 'handicap'
    | 'dlnuf'
    | 'usage'
    | 'simplicity'
    | 'help_reachable'
    | 'help_efficient'
    | 'help_used'
    | 'uptime'
    | 'performance'
    | 'auth';
  label: string;
  description?: string | null;
  description_obj?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  description_html?: string | null;
  icon:
    | 'ri-emoji-sticker-line'
    | 'ri-mac-line'
    | 'ri-device-line'
    | 'ri-rest-time-line'
    | 'ri-customer-service-line'
    | 'ri-shield-user-line'
    | 'ri-timer-flash-line'
    | 'ri-timer-line'
    | 'ri-pass-valid-line'
    | 'ri-open-arm-line'
    | 'ri-speak-line'
    | 'ri-chat-smile-line'
    | 'ri-user-line'
    | 'ri-signal-tower-line'
    | 'ri-lock-unlock-line';
  position: number;
  moreInfosTitle?: string | null;
  moreInfos?: string | null;
  levels?: {
    docs?: (string | PayloadIndicatorLevel)[] | null;
    hasNextPage?: boolean | null;
  } | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-indicator-levels".
 */
export interface PayloadIndicatorLevel {
  id: string;
  label: string;
  color: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange';
  description: string;
  indicator: string | PayloadIndicator;
  position: number;
  threshold?: number | null;
  noBackground?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'payload-admins';
        value: string | PayloadAdmin;
      } | null)
    | ({
        relationTo: 'payload-media';
        value: string | PayloadMedia;
      } | null)
    | ({
        relationTo: 'payload-indicators';
        value: string | PayloadIndicator;
      } | null)
    | ({
        relationTo: 'payload-indicator-levels';
        value: string | PayloadIndicatorLevel;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'payload-admins';
    value: string | PayloadAdmin;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'payload-admins';
    value: string | PayloadAdmin;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-admins_select".
 */
export interface PayloadAdminsSelect<T extends boolean = true> {
  totpSecret?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-media_select".
 */
export interface PayloadMediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-indicators_select".
 */
export interface PayloadIndicatorsSelect<T extends boolean = true> {
  slug?: T;
  label?: T;
  description?: T;
  description_obj?: T;
  description_html?: T;
  icon?: T;
  position?: T;
  moreInfosTitle?: T;
  moreInfos?: T;
  levels?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-indicator-levels_select".
 */
export interface PayloadIndicatorLevelsSelect<T extends boolean = true> {
  label?: T;
  color?: T;
  description?: T;
  indicator?: T;
  position?: T;
  threshold?: T;
  noBackground?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "home".
 */
export interface Home {
  id: string;
  header: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  quality: {
    title: string;
    description: string;
    blocs: {
      image: string | PayloadMedia;
      title: string;
      description: string;
      buttonText: string;
      buttonLink: string;
      id?: string | null;
    }[];
  };
  indicators: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  redirections: {
    textsWithImages: {
      image: string | PayloadMedia;
      title: string;
      description: string;
      buttonText: string;
      buttonLink: string;
      id?: string | null;
    }[];
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "help".
 */
export interface Help {
  id: string;
  header: {
    title: string;
  };
  goals: {
    title: string;
    wysiwyg?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    wysiwyg_html?: string | null;
  };
  criterias: {
    title: string;
    wysiwyg?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    wysiwyg_html?: string | null;
  };
  indicators: {
    title: string;
    keyIndicators: {
      keyIndicatorsTitle: string;
      keyIndicatorsDescription?: string | null;
      keyIndicatorsList?:
        | {
            indicator: string | PayloadIndicator;
            id?: string | null;
          }[]
        | null;
    };
    additionnalIndicators: {
      additionnalIndicatorsTitle: string;
      additionnalIndicatorsDescription?: string | null;
      additionnalIndicatorsList?:
        | {
            indicator: string | PayloadIndicator;
            id?: string | null;
          }[]
        | null;
    };
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "legals".
 */
export interface Legal {
  id: string;
  'legal-a11y': {
    title: string;
    wysiwyg?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    wysiwyg_html?: string | null;
  };
  'legal-mentions': {
    title: string;
    wysiwyg?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    wysiwyg_html?: string | null;
  };
  'legal-pc': {
    title: string;
    wysiwyg?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    wysiwyg_html?: string | null;
  };
  'legal-terms': {
    title: string;
    wysiwyg?: {
      root: {
        type: string;
        children: {
          type: string;
          version: number;
          [k: string]: unknown;
        }[];
        direction: ('ltr' | 'rtl') | null;
        format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
        indent: number;
        version: number;
      };
      [k: string]: unknown;
    } | null;
    wysiwyg_html?: string | null;
  };
  'legal-contact': {
    title: string;
    description: string;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "footer".
 */
export interface Footer {
  id: string;
  description: string;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "home_select".
 */
export interface HomeSelect<T extends boolean = true> {
  header?:
    | T
    | {
        title?: T;
        description?: T;
        buttonText?: T;
        buttonLink?: T;
      };
  quality?:
    | T
    | {
        title?: T;
        description?: T;
        blocs?:
          | T
          | {
              image?: T;
              title?: T;
              description?: T;
              buttonText?: T;
              buttonLink?: T;
              id?: T;
            };
      };
  indicators?:
    | T
    | {
        title?: T;
        description?: T;
        buttonText?: T;
        buttonLink?: T;
      };
  redirections?:
    | T
    | {
        textsWithImages?:
          | T
          | {
              image?: T;
              title?: T;
              description?: T;
              buttonText?: T;
              buttonLink?: T;
              id?: T;
            };
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "help_select".
 */
export interface HelpSelect<T extends boolean = true> {
  header?:
    | T
    | {
        title?: T;
      };
  goals?:
    | T
    | {
        title?: T;
        wysiwyg?: T;
        wysiwyg_html?: T;
      };
  criterias?:
    | T
    | {
        title?: T;
        wysiwyg?: T;
        wysiwyg_html?: T;
      };
  indicators?:
    | T
    | {
        title?: T;
        keyIndicators?:
          | T
          | {
              keyIndicatorsTitle?: T;
              keyIndicatorsDescription?: T;
              keyIndicatorsList?:
                | T
                | {
                    indicator?: T;
                    id?: T;
                  };
            };
        additionnalIndicators?:
          | T
          | {
              additionnalIndicatorsTitle?: T;
              additionnalIndicatorsDescription?: T;
              additionnalIndicatorsList?:
                | T
                | {
                    indicator?: T;
                    id?: T;
                  };
            };
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "legals_select".
 */
export interface LegalsSelect<T extends boolean = true> {
  'legal-a11y'?:
    | T
    | {
        title?: T;
        wysiwyg?: T;
        wysiwyg_html?: T;
      };
  'legal-mentions'?:
    | T
    | {
        title?: T;
        wysiwyg?: T;
        wysiwyg_html?: T;
      };
  'legal-pc'?:
    | T
    | {
        title?: T;
        wysiwyg?: T;
        wysiwyg_html?: T;
      };
  'legal-terms'?:
    | T
    | {
        title?: T;
        wysiwyg?: T;
        wysiwyg_html?: T;
      };
  'legal-contact'?:
    | T
    | {
        title?: T;
        description?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "footer_select".
 */
export interface FooterSelect<T extends boolean = true> {
  description?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}