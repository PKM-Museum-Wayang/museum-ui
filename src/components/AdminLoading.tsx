interface AdminLoadingProps {
  label?: string
}

export default function AdminLoading({ label = 'Memuat data...' }: AdminLoadingProps) {
  return (
    <span role="status" className="inline-flex items-center justify-center gap-2">
      <span aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" />
      <span>{label}</span>
    </span>
  )
}
