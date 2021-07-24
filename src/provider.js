import { useEffect, useState, useRef } from 'react';
import { isEmpty, isFunction } from 'lodash';

import { AppContext, InitialState, InitialMutation, configAppContext, mutate } from './context';

const InitailProxyActions = () => proxyActions({});

function proxyActions(actions) {
  return new Proxy(actions, {
    get(trapTarget, key, receiver) {
      if (!(key in receiver)) Reflect.set(trapTarget, key, () => {}, receiver) // TODO: 抛出提示
      return Reflect.get(trapTarget, key, receiver)
    }
  })
}

function reduceMutation(curMutation, getMutate) {
  return Object.keys(curMutation).reduce((nextMutation, type) => Object.assign({}, nextMutation, { [type]: getMutate(type) }), {})
}

export function AppProvider(props) {
  const { config, children } = props;

  const actionsRef = useRef(null); // 让useActions不可变
  const stateRef = useRef(InitialState);  // 给actions的闭包用
  const [isInit, setIsInit] = useState(false);
  const [contextData, setContextData] = useState({ context: InitialState, mutation: InitialMutation, useActions: InitailProxyActions });

  useEffect(() => {
    if (isInit || isEmpty(config)) return;

    const context = configAppContext(config)(stateRef.current);

    stateRef.current = context;

    setContextData(({ mutation: curMutation, useActions: curUseActions }) => {

      const mutation = reduceMutation(curMutation, (type) =>
        (payload, isSetState) => isFunction(payload) && setContextData(curContextData => {
          const nextContext = mutate({ type, payload }, stateRef.current, { isSetState });
          stateRef.current = nextContext;
          return { ...curContextData, context: nextContext }
        })
      );

      const useActions = (getActions) => {
        if (actionsRef.current) return actionsRef.current
        return actionsRef.current = isFunction(getActions) ? proxyActions(getActions(mutation, stateRef)) : curUseActions
      };

      return { context, mutation, useActions }

    });

    setIsInit(true);
  }, [isInit, config, stateRef, actionsRef]);

  return <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
}