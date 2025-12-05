import { createFileRoute } from '@tanstack/react-router'
import FormPage from '@/features/form/FormPage'

export const Route = createFileRoute('/request')({
  component: FormPage,
})
