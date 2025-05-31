import * as React from 'react';

import datadog from '@/lib/datadog';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(listener => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  // Log toast to Datadog
  const logToast = () => {
    const variant = props.variant || 'default';
    const toastType =
      props.variant === 'destructive' ? 'error' : props.variant || 'info';

    // Log different types of toasts
    if (toastType === 'error') {
      datadog.log({
        action: 'toast_error',
        category: 'ui',
        label: String(props.title || 'Error notification'),
        additionalData: {
          description: String(props.description || ''),
          variant,
        },
      });
    } else {
      datadog.log({
        action: 'toast_notify',
        category: 'ui',
        label: String(props.title || 'Notification'),
        additionalData: {
          description: String(props.description || ''),
          variant,
          toastType,
        },
      });
    }
  };

  const update = (props: ToasterToast) => {
    // Log toast updates
    datadog.log({
      action: 'toast_update',
      category: 'ui',
      label: String(props.title || 'Toast updated'),
      additionalData: {
        toastId: id,
      },
    });

    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  };

  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  // Log the toast creation
  logToast();

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: open => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Create specialized toast functions with Datadog logging
function info(title: string, description?: string) {
  datadog.log({
    action: 'toast_info',
    category: 'notification',
    label: String(title),
    additionalData: {
      description: String(description || ''),
      variant: 'default',
      toastType: 'info',
      timestamp: new Date().toISOString(),
    },
  });

  return toast({
    title,
    description,
    variant: 'default',
  });
}

function success(title: string, description?: string) {
  datadog.log({
    action: 'toast_success',
    category: 'notification',
    label: String(title),
    additionalData: {
      description: String(description || ''),
      variant: 'success',
      toastType: 'success',
      timestamp: new Date().toISOString(),
    },
  });

  return toast({
    title,
    description,
    variant: 'default',
    className: 'bg-green-500 border-green-600 text-white',
  });
}

function warning(title: string, description?: string) {
  datadog.log({
    action: 'toast_warning',
    category: 'notification',
    label: String(title),
    additionalData: {
      description: String(description || ''),
      variant: 'warning',
      toastType: 'warning',
      timestamp: new Date().toISOString(),
    },
  });

  return toast({
    title,
    description,
    variant: 'default',
    className: 'bg-yellow-500 border-yellow-600 text-white',
  });
}

function error(title: string, description?: string, errorObj?: Error) {
  // Log error to Datadog with enhanced error details
  if (errorObj) {
    datadog.logError('toast_error', errorObj, {
      title,
      description,
      errorName: errorObj.name,
      errorStack: errorObj.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      path: window.location.pathname,
    });
  } else {
    datadog.log({
      action: 'toast_error',
      category: 'notification',
      label: String(title),
      additionalData: {
        description: String(description || ''),
        variant: 'destructive',
        toastType: 'error',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        path: window.location.pathname,
      },
    });
  }

  return toast({
    title,
    description,
    variant: 'destructive',
  });
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
    info,
    success,
    warning,
    error,
  };
}

export { useToast, toast };
