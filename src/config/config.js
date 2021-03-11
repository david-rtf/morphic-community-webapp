
const href = new URL(location.href);

var ENV;
if (href.host === "communitynew.morphic.dev") {
    // Hack to force the dev site to always use the dev api server.
    ENV = "DEVELOPMENT";
} else if (href.host.match(/^pr-\d+\.morphic\.ste-test\.net$/)) {
    // A similar hack to force a test site to always use the test api server.
    ENV = "PR_TEST";
} else {
    ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : "LOCAL";
}

/**
 * @typedef {Object} CONFIG
 * @property {String} API_URL The API server.
 * @property {String} RECAPTCHA_SITEKEY Site key for recaptcha.
 * @property {Boolean} DISABLE_FAVICONS true to allow the use of favicons in buttons.
 * @property {String} ENV The environment key (eg, "LOCAL", "DEVELOPMENT", "PRODUCTION")
 * @property {Boolean} PRODUCTION true if production.
 */

/**
 * @type {Object<String,CONFIG>}
 */
const CONF = {
    // Applies to all environments, unless overridden
    BASE: {
        DISABLE_FAVICONS: false,
        ENV: ENV,
        PRODUCTION: false
    },

    // Local development (npm run dev)
    LOCAL: {
        // Local development server will redirect all API requests (/v1/*) to the local API server (see vue.config.js)
        API_URL: process.env.VUE_APP_API_URL ?? new URL(location.href).origin,
        // Valid for ste-test.net: to test locally, use localhost.ste-test.net
        RECAPTCHA_SITEKEY: href.host.match(/^[0-9.:]+$/) ? null : "6LcgxGoaAAAAACb4-Sdm1xj5UWQiuyYAieFZUhL4"
    },
    PR_TEST: {
        // Used for testing pull requests
        API_URL: process.env.VUE_APP_API_URL ?? "https://api.morphic.ste-test.net",
        RECAPTCHA_SITEKEY: "6LcgxGoaAAAAACb4-Sdm1xj5UWQiuyYAieFZUhL4"
    },

    // "live" development (https://communitynew.morphic.dev)
    DEVELOPMENT: {
        API_URL: "https://api.morphic.dev",
        RECAPTCHA_SITEKEY: "6Lc1hfsUAAAAAGFReCJUUva4LHF30XG5pIoJr2Nl"
    },

    // production
    PRODUCTION: {
        API_URL: "https://api.morphic.org",
        RECAPTCHA_SITEKEY: "6LcuEM0ZAAAAABafZkUPUBAAcj5BNw2rd3fuNMC2",
        PRODUCTION: true
    }
};

/**
 * @type {CONFIG}
 */
export const CONFIG = Object.assign({}, CONF.BASE, CONF[ENV]);
