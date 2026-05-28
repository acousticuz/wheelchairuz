export default function SpacerSection({ settings = {} }) {
  const size = settings.size || 'md'
  const h = {
    sm: 'h-6 md:h-10',
    md: 'h-12 md:h-20',
    lg: 'h-20 md:h-32',
  }[size] || 'h-12 md:h-20'
  return <div className={h} aria-hidden="true" />
}
