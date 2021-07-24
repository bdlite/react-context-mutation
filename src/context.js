import React from 'react';

import { isPlainObject } from 'lodash';

export const InitialState = {
  app: {
    config: {},
  },

  header: {
    menu: [],
    subsystemMenus: {},
    config: {},
  },

  sider: {
    menu: [],
    subsystemMenus: {},
    config: {},
  }
};

export const InitialMutation = { app: () => InitialState, header: () => InitialState, sider: () => InitialState };

export const AppContext = React.createContext({ context: () => InitialState, mutation: InitialMutation, useMutation: () => InitialMutation });

export function mutate(action, state, { isSetState }) {
  const { type, payload } = action;

  switch (type) {
    case 'app':
    case 'sider':
    case 'header':
      return Object.assign({}, state, { [type]: isSetState ? setState(payload, state[type]) : mergeState(payload, state[type]) });
    default :
      return state;
  }
}


export function configAppContext({ app = {}, header = {}, sider = {} }) {
  return (state) => ({
    app: mergeAppConfig(app, state.app),
    sider: mergeSiderConfig(sider, state.sider),
    header: mergeHeaderConfig(header, state.header),
  })
}

function setState(payload, state) {
  return Object.assign({}, state, payload(state));
}

function mergeState(payload, state) {
  const nextState = payload(state);
  return Object.assign(
    {},
    state,
    Object.keys(nextState).reduce((newState, key) => {
      const subState = state[key];
      if (isPlainObject(subState)) {
        Object.assign(newState, { [key]: Object.assign({}, subState, nextState[key]) });
      } else {
        Object.assign(newState, { [key]: nextState[key] });
      }
      return newState;
    }, {})
  );
}


// custom merge function
function mergeAppConfig(config = {}, state) {
  return Object.assign({}, state, { config })
}

function mergeHeaderConfig({ menu, subsystemMenus, config = {} } = {}, state) {
  const newConfig = Object.assign({}, state.config, config)
  let configuration = { config: newConfig };

  if (Array.isArray(menu)) {
    Object.assign(configuration, { menu })
  }

  if (subsystemMenus) {
    Object.assign(configuration, { subsystemMenus })
  }

  return Object.assign({}, state, configuration)
}

function mergeSiderConfig({ menu, subsystemMenus, config = {} } = {}, state) {
  const newConfig = Object.assign({}, state.config, config)
  let configuration = { config: newConfig };

  if (Array.isArray(menu)) {
    Object.assign(configuration, { menu })
  }

  if (subsystemMenus) {
    Object.assign(configuration, { subsystemMenus })
  }

  return Object.assign({}, state, configuration)
}