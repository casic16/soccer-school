export default function Avatar({ url, name, size = 'md', onClick }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div
      onClick={onClick}
      className={`${sizes[size]} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${
        onClick ? 'cursor-pointer hover:opacity-80 transition' : ''
      }`}
    >
      {url ? (
        <img src={url} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-green-600 flex items-center justify-center">
          <span className="text-white font-bold">{initials}</span>
        </div>
      )}
    </div>
  )
}