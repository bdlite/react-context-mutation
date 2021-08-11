import React, { useEffect, useState, useRef } from 'react';
import { isPlainObject, isFunction } from 'lodash';


const InitialProxyActions = () => proxyActions({});

function proxyActions(actions) {
  return new Proxy(actions, {
    get(trapTarget, key, receiver) {
      if (!(key in receiver)) Reflect.set(trapTarget, key, () => { }, receiver) // TODO: 抛出提示
      return Reflect.get(trapTarget, key, receiver)
    }
  })
}

function reduceMutation(curMutation, getMutate) {
  return Object.keys(curMutation).reduce((nextMutation, type) => Object.assign({}, nextMutation, { [type]: getMutate(type) }), {})
}

export default function createContext(state, reducer) {
  const InitialState = isPlainObject(state) ? { ...state } : {};
  const namespaces = Object.keys(InitialState);
  const mutate = getMutateByNamespaces(namespaces);
  const configReducer = isFunction(reducer) ? reducer : () => InitialState;
  const InitialMutation = namespaces.reduce((mutation, type) => Object.assign(mutation, { [type]: () => InitialState }), {});
  const InitialContextData = { context: InitialState, mutation: InitialMutation, useActions: InitialProxyActions };
  const AppContext = React.createContext(InitialContextData);

  function AppProvider(props) {
    const { config = {}, children } = props;

    const actionsRef = useRef({}); // 让useActions不可变
    const stateRef = useRef(InitialState);  // 给actions的闭包用
    const [isInit, setIsInit] = useState(false);
    const [contextData, setContextData] = useState(InitialContextData);

    useEffect(() => {
      if (isInit) return;

      const context = configReducer(config)(stateRef.current); // TODO: catch 异常并给出来自包的提示

      stateRef.current = context;

      setContextData(({ mutation: curMutation, useActions: curUseActions }) => {

        const mutation = reduceMutation(curMutation, (type) =>
          (payload, isSetState) => isFunction(payload) && setContextData(curContextData => {
            const nextContext = mutate({ type, payload }, stateRef.current, { isSetState });
            stateRef.current = nextContext;
            return { ...curContextData, context: nextContext }
          })
        );

        const useActions = (namespace, createActions) => {
          if (actionsRef.current[namespace]) return actionsRef.current[namespace]
          actionsRef.current = Object.assign(
            {},
            actionsRef.current,
            { [namespace]: isFunction(createActions) ? proxyActions(createActions(mutation, stateRef)) : curUseActions }
          )
          return actionsRef.current[namespace]
        };

        return { context, mutation, useActions }

      });

      setIsInit(true);
    }, [isInit, config, stateRef, actionsRef]);

    return <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
  }

  return {
    AppProvider,
    AppConsumer: AppContext.Consumer,
  }
}


function getMutateByNamespaces(namespaces) {
  return function mutate(action, state, { isSetState }) {
    const { type, payload } = action;
    const namespace = namespaces.find(name => name === type);

    if (!namespace) return state;

    return Object.assign({}, state, { [type]: isSetState ? setState(payload, state[type]) : mergeState(payload, state[type]) });
  }
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
