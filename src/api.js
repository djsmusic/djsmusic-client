// @flow

/**
 * Expose all of the endpoint names
 */
export const endpoints = {
  // APP Endpoints
  APPLICATION: 'APPLICATION',
  ARCHITECTURE: 'ARCHITECTURE',
  CONNECTION: 'CONNECTION',
  CONNECTION_PROPERTY: 'CONNECTION_PROPERTY',
  REVIEW: 'REVIEW',
  REVIEW_STATUS: 'REVIEW_STATUS',
  TIER: 'TIER',
  TIER_ARTIFACT: 'TIER_ARTIFACT',
  TIER_PROPERTY: 'TIER_PROPERTY',
  // ASM Endpoints
  ASM_SCOPE: 'ASM_SCOPE',
  ASM_VERSION: 'ASM_VERSION',
  ASM_VERSION_INTERNAL: 'ASM_VERSION_INTERNAL',
  ASM_VERSION_ACTION: 'ASM_VERSION_ACTION',
  ASM_VERSION_STACKED: 'ASM_VERSION_STACKED',
  ASM_APPLICATION_TYPE: 'ASM_APPLICATION_TYPE',
  ASM_ATTRIBUTE: 'ASM_ATTRIBUTE',
  ASM_ATTRIBUTE_TO_ATTRIBUTE: 'ASM_ATTRIBUTE_TO_ATTRIBUTE',
  ASM_ATTRIBUTE_TYPE: 'ASM_ATTRIBUTE_TYPE',
  ASM_OPTION: 'ASM_OPTION',
  ASM_OPTION_TO_PROPERTY: 'ASM_OPTION_TO_PROPERTY',
  ASM_CONDITION: 'ASM_CONDITION',
  ASM_CONDITION_TRIGGER_PROP: 'ASM_CONDITION_TRIGGER_PROP',
  ASM_CONDITION_TRIGGER_OPTION: 'ASM_CONDITION_TRIGGER_OPTION',
  ASM_CONDITION_TRIGGER_GUIDANCE: 'ASM_CONDITION_TRIGGER_GUIDANCE',
  ASM_FIELD: 'ASM_FIELD',
  ASM_GUIDANCE: 'ASM_GUIDANCE',
  ASM_GUIDANCE_TYPE: 'ASM_GUIDANCE_TYPE',
  ASM_PROPERTY: 'ASM_PROPERTY',
  ASM_PROPERTY_TYPE: 'ASM_PROPERTY_TYPE',
  ASM_REPORT_TYPE: 'ASM_REPORT_TYPE',
  ASM_REVIEW_TYPE: 'ASM_REVIEW_TYPE',
  ASM_SLUG: 'ASM_SLUG',
  // ASM Stacks
  ASM_DYNAMIC_STACKED: 'ASM_DYNAMIC_STACKED',
  ASM_APP_STACKED: 'ASM_APP_STACKED',
  ASM_APP_STACK: 'ASM_APP_STACK',
  ASM_USER_STACK: 'ASM_USER_STACK',
  // Auth
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  // Evaluations
  PLAYGROUND: 'PLAYGROUND',
  PLAYGROUND_LOG: 'PLAYGROUND_LOG',
  // General endpoints
  ROOT: 'ROOT',
  USER: 'USER',
  USER_CURRENT: 'USER_CURRENT',
};

/**
 * This exposes all of the API endpoints as a self executing function.
 * It's done this way so that endpoints can self reference previously declared ones,
 * which simplifies the api definition and minimizes inconsistency errors.
 */
export default new function api() {
  // App
  this[endpoints.APPLICATION] = `${API_URL}/application/:applicationId`;
  this[endpoints.ARCHITECTURE] = `${this.APPLICATION}/architecture/:architectureId`;
  this[endpoints.CONNECTION] = `${this.ARCHITECTURE}/connection/:connectionId`;
  this[endpoints.CONNECTION_PROPERTY] = `${this.CONNECTION}/property/:propertyId`;
  this[endpoints.REVIEW] = `${this.ARCHITECTURE}/review/:reviewId`;
  this[endpoints.REVIEW_STATUS] = `${this.REVIEW}/status`;
  this[endpoints.TIER] = `${this.ARCHITECTURE}/tier/:tierId`;
  this[endpoints.TIER_ARTIFACT] = `${this.TIER}/attribute/:attributeId`;
  this[endpoints.TIER_PROPERTY] = `${this.TIER}/property/:propertyId`;
  // ASM
  this[endpoints.ASM_SLUG] = `${API_URL}/asm/slug`;
  this[endpoints.ASM_SCOPE] = `${API_URL}/asm/scope/:asmScopeId`;
  this[endpoints.ASM_VERSION] = `${this.ASM_SCOPE}/version/:versionId`;
  this[endpoints.ASM_VERSION_INTERNAL] = `${this.ASM_SCOPE}/version/internal/:internalId`;
  this[endpoints.ASM_VERSION_ACTION] = `${this.ASM_VERSION_INTERNAL}:action`;
  this[endpoints.ASM_VERSION_STACKED] = `${this.ASM_VERSION}?stacked=true`;
  this[endpoints.ASM_DYNAMIC_STACKED] = `${API_URL}/asm/stacked/:stackKeyId`;
  this[endpoints.ASM_APP_STACKED] = `${API_URL}/asm/stacked/:id`; // Duplicate of ASM_DYNAMIC_STACKED to ensure reducers dont mix them up
  this[endpoints.ASM_APP_STACK] = `${API_URL}/asm/stack/application/:id`;
  this[endpoints.ASM_USER_STACK] = `${API_URL}/asm/stack/user/:userId`;
  // ASM Versioned endpoints
  this[endpoints.ASM_APPLICATION_TYPE] = `${this.ASM_VERSION_INTERNAL}/applicationtype/:slugId`;
  this[endpoints.ASM_ATTRIBUTE] = `${this.ASM_VERSION_INTERNAL}/attribute/:slugId`;
  this[endpoints.ASM_ATTRIBUTE_TO_ATTRIBUTE] = `${this.ASM_VERSION_INTERNAL}/attributetoattribute/:slugId`;
  this[endpoints.ASM_ATTRIBUTE_TYPE] = `${this.ASM_VERSION_INTERNAL}/attributetype/:slugId`;
  this[endpoints.ASM_OPTION] = `${this.ASM_VERSION_INTERNAL}/option/:slugId`;
  this[endpoints.ASM_OPTION_TO_PROPERTY] = `${this.ASM_VERSION_INTERNAL}/optiontoproperty/:slugId`;
  this[endpoints.ASM_CONDITION] = `${this.ASM_VERSION_INTERNAL}/condition/:slugId`;
  this[endpoints.ASM_CONDITION_TRIGGER_PROP] = `${this.ASM_VERSION_INTERNAL}/conditiontriggerproperty/:slugId`;
  this[endpoints.ASM_CONDITION_TRIGGER_OPTION] = `${this.ASM_VERSION_INTERNAL}/conditiontriggeroption/:slugId`;
  this[endpoints.ASM_CONDITION_TRIGGER_GUIDANCE] = `${this.ASM_VERSION_INTERNAL}/conditiontriggerguidance/:slugId`;
  this[endpoints.ASM_FIELD] = `${this.ASM_VERSION_INTERNAL}/field/:slugId`;
  this[endpoints.ASM_GUIDANCE] = `${this.ASM_VERSION_INTERNAL}/guidance/:slugId`;
  this[endpoints.ASM_GUIDANCE_TYPE] = `${this.ASM_VERSION_INTERNAL}/guidancetype/:slugId`;
  this[endpoints.ASM_PROPERTY] = `${this.ASM_VERSION_INTERNAL}/property/:slugId`;
  this[endpoints.ASM_PROPERTY_TYPE] = `${this.ASM_VERSION_INTERNAL}/propertytype/:slugId`;
  this[endpoints.ASM_REPORT_TYPE] = `${this.ASM_VERSION_INTERNAL}/reporttype/:slugId`;
  this[endpoints.ASM_REVIEW_TYPE] = `${this.ASM_VERSION_INTERNAL}/reviewtype/:slugId`;
  // Auth
  this[endpoints.AUTH_LOGIN] = `${API_URL}/auth/login`;
  this[endpoints.AUTH_LOGOUT] = `${API_URL}/auth/logout`;
  // Playground
  this[endpoints.PLAYGROUND] = `${API_URL}/playground`;
  this[endpoints.PLAYGROUND_LOG] = `${API_URL}/playground/debug/:logId`;
  // Misc
  this[endpoints.ROOT] = `${API_URL}/`;
  this[endpoints.USER] = `${API_URL}/user/:id`;
  this[endpoints.USER_CURRENT] = `${API_URL}/user/me`;
}();
