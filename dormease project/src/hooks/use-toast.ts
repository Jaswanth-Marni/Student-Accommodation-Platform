import * as React from "react"
import { toast as sonnerToast } from 'sonner';

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type State = {
  toasts: ToasterToast[]
}

const memoryState: State = { toasts: [] }

let listeners: ((state: State) => void)[] = []

function dispatch(action: Action) {
  memoryState.toasts = [...memoryState.toasts]
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface Action {
  type: "ADD_TOAST" | "UPDATE_TOAST" | "DISMISS_TOAST" | "REMOVE_TOAST"
  toast?: ToasterToast
  toastId?: string
}

function genId() {
  return Math.random().toString(36).substr(2, 9)
}

type Toast = Omit<ToasterToast, "id">

function createToast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast: createToast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast }

export const toast = ({
  title,
  description,
  variant = 'default',
}: {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}) => {
  return createToast({ title, description, variant })
}
