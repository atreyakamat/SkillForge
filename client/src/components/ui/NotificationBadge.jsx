export default function NotificationBadge({ count = 0, children }) {
  return (
    <div className="relative inline-block">
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-error text-white text-[10px] leading-none rounded-full px-1.5 py-0.5 shadow">{count}</span>
      )}
    </div>
  )
}
